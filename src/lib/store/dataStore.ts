'use client';

import {
  Resource,
  User,
  Comment,
  Report,
  Notification,
  ResourceCategory,
  ResourceStatus,
  ReportReason,
  ReportStatus,
  UserRole,
} from '@/types';
import {
  MOCK_RESOURCES,
  MOCK_USERS,
  MOCK_COMMENTS,
  MOCK_NOTIFICATIONS,
  BRANCHES,
  SEMESTERS,
  SUBJECTS,
} from '@/lib/data/mock';
import { getLevelFromXP } from '@/lib/utils';

export interface DataState {
  resources: Resource[];
  users: User[];
  comments: Comment[];
  reports: Report[];
  notifications: Notification[];
  bookmarks: Record<string, string[]>; // userId -> resourceId[]
  ratings: Record<string, Record<string, number>>; // resourceId -> { userId: rating }
}

const STORAGE_KEY = 'campusnotes_production_state_v1';

const INITIAL_REPORTS: Report[] = [
  {
    _id: 'rep_1',
    reporterId: MOCK_USERS[4],
    resourceId: 'res_1',
    reason: 'WRONG_SUBJECT',
    description: 'Unit 2 notes contains some questions from Analysis of Algorithms.',
    status: 'OPEN',
    createdAt: '2024-08-14T10:00:00Z',
    updatedAt: '2024-08-14T10:00:00Z',
  },
  {
    _id: 'rep_2',
    reporterId: MOCK_USERS[1],
    resourceId: 'res_3',
    reason: 'DUPLICATE',
    description: 'This OS paper file is identical to the 2022 winter paper.',
    status: 'OPEN',
    createdAt: '2024-08-13T14:30:00Z',
    updatedAt: '2024-08-13T14:30:00Z',
  },
];

const INITIAL_STATE: DataState = {
  resources: MOCK_RESOURCES,
  users: MOCK_USERS,
  comments: MOCK_COMMENTS,
  reports: INITIAL_REPORTS,
  notifications: MOCK_NOTIFICATIONS,
  bookmarks: {
    usr_1: ['res_1', 'res_2', 'res_3'],
    usr_2: ['res_1', 'res_5'],
  },
  ratings: {
    res_1: { usr_2: 5, usr_3: 5, usr_4: 4 },
    res_2: { usr_1: 5, usr_3: 5 },
  },
};

class DataStoreManager {
  private state: DataState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = INITIAL_STATE;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          this.state = { ...INITIAL_STATE, ...JSON.parse(saved) };
        } catch (e) {
          console.error('Failed to load CampusNotes store', e);
          this.state = INITIAL_STATE;
        }
      }
    }
  }

  private persist() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getState(): DataState {
    return this.state;
  }

  // -------------------------------------------------------------
  // RESOURCE ACTIONS
  // -------------------------------------------------------------
  public getResources(filters?: {
    search?: string;
    branchId?: string;
    semesterId?: string;
    subjectId?: string;
    category?: ResourceCategory | '';
    minRating?: number;
    status?: ResourceStatus;
  }): Resource[] {
    let list = this.state.resources;

    if (filters?.status) {
      list = list.filter((r) => r.status === filters.status);
    } else {
      list = list.filter((r) => r.status === 'PUBLISHED');
    }

    if (filters?.search?.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          r.subject?.name.toLowerCase().includes(q) ||
          r.branch?.code.toLowerCase().includes(q)
      );
    }

    if (filters?.branchId) {
      list = list.filter((r) => r.branchId === filters.branchId);
    }
    if (filters?.semesterId) {
      list = list.filter((r) => r.semesterId === filters.semesterId);
    }
    if (filters?.subjectId) {
      list = list.filter((r) => r.subjectId === filters.subjectId);
    }
    if (filters?.category) {
      list = list.filter((r) => r.category === filters.category);
    }
    if (filters?.minRating && filters.minRating > 0) {
      list = list.filter((r) => r.stats.averageRating >= filters.minRating!);
    }

    return list;
  }

  public getResourceById(id: string): Resource | undefined {
    return this.state.resources.find((r) => r._id === id);
  }

  public addResource(payload: {
    title: string;
    description: string;
    category: ResourceCategory;
    branchId: string;
    semesterId: string;
    subjectId: string;
    unitNumber?: number;
    tags: string[];
    fileName: string;
    fileSize: number;
    fileUrl?: string;
    user: User;
  }): Resource {
    const slug = payload.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const branch = BRANCHES.find((b) => b._id === payload.branchId);
    const semester = SEMESTERS.find((s) => s._id === payload.semesterId);
    const subject = SUBJECTS.find((s) => s._id === payload.subjectId);

    const newResource: Resource = {
      _id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: payload.title,
      slug: `${slug}-${Date.now()}`,
      description: payload.description,
      category: payload.category,
      file: {
        url: payload.fileUrl || '/files/sample_document.pdf',
        storageKey: `key_${Date.now()}`,
        originalName: payload.fileName,
        mimeType: 'application/pdf',
        extension: payload.fileName.split('.').pop() || 'pdf',
        size: payload.fileSize || 1024 * 1024 * 2,
      },
      collegeId: 'col_tcet',
      branchId: payload.branchId,
      semesterId: payload.semesterId,
      subjectId: payload.subjectId,
      unitNumber: payload.unitNumber,
      tags: payload.tags,
      uploadedBy: payload.user,
      status: 'PUBLISHED',
      stats: {
        views: 1,
        downloads: 0,
        averageRating: 5.0,
        ratingCount: 1,
      },
      branch,
      semester,
      subject,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.state.resources = [newResource, ...this.state.resources];

    // Award +10 XP to uploader
    this.addXP(payload.user._id, 10, 'Resource Uploaded & Published');

    // Notify user
    this.addNotification({
      userId: payload.user._id,
      type: 'RESOURCE_APPROVED',
      title: 'Resource Published! 🎉',
      message: `Your resource "${payload.title}" is now live on TCET CampusNotes (+10 XP).`,
      resourceId: newResource._id,
    });

    this.persist();
    return newResource;
  }

  public updateResourceStatus(id: string, status: ResourceStatus) {
    this.state.resources = this.state.resources.map((r) =>
      r._id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
    );
    this.persist();
  }

  public deleteResource(id: string) {
    this.state.resources = this.state.resources.filter((r) => r._id !== id);
    this.persist();
  }

  public incrementViews(id: string) {
    this.state.resources = this.state.resources.map((r) =>
      r._id === id
        ? {
            ...r,
            stats: { ...r.stats, views: r.stats.views + 1 },
          }
        : r
    );
    this.persist();
  }

  public recordDownload(resourceId: string, user?: User | null) {
    let uploaderId: string | null = null;
    let newDownloadCount = 0;
    let resTitle = '';

    this.state.resources = this.state.resources.map((r) => {
      if (r._id === resourceId) {
        newDownloadCount = r.stats.downloads + 1;
        uploaderId = r.uploadedBy._id;
        resTitle = r.title;
        return {
          ...r,
          stats: { ...r.stats, downloads: newDownloadCount },
        };
      }
      return r;
    });

    // Milestone check (e.g. at 10, 50, 100, 250, 500 downloads)
    if (uploaderId && [10, 25, 50, 100, 200, 500].includes(newDownloadCount)) {
      this.addXP(uploaderId, 5, `Milestone: ${newDownloadCount} downloads`);
      this.addNotification({
        userId: uploaderId,
        type: 'DOWNLOAD_MILESTONE',
        title: `Download Milestone: ${newDownloadCount} Downloads! 🚀`,
        message: `Your notes "${resTitle}" reached ${newDownloadCount} downloads (+5 XP).`,
        resourceId,
      });
    }

    this.persist();
  }

  // -------------------------------------------------------------
  // RATINGS
  // -------------------------------------------------------------
  public addRating(resourceId: string, userId: string, score: number) {
    if (!this.state.ratings[resourceId]) {
      this.state.ratings[resourceId] = {};
    }
    this.state.ratings[resourceId][userId] = score;

    const scores = Object.values(this.state.ratings[resourceId]);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

    this.state.resources = this.state.resources.map((r) => {
      if (r._id === resourceId) {
        return {
          ...r,
          stats: {
            ...r.stats,
            averageRating: parseFloat(avg.toFixed(1)),
            ratingCount: scores.length,
          },
        };
      }
      return r;
    });

    // Award +2 XP to rater
    this.addXP(userId, 2, 'Rated Resource');

    this.persist();
  }

  public getUserRating(resourceId: string, userId: string): number {
    return this.state.ratings[resourceId]?.[userId] || 0;
  }

  // -------------------------------------------------------------
  // COMMENTS
  // -------------------------------------------------------------
  public getComments(resourceId: string): Comment[] {
    return this.state.comments.filter(
      (c) => c.resourceId === resourceId && !c.isDeleted
    );
  }

  public addComment(resourceId: string, user: User, content: string): Comment {
    const newComment: Comment = {
      _id: `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      resourceId,
      userId: user,
      content,
      parentCommentId: null,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.state.comments = [...this.state.comments, newComment];

    const resource = this.getResourceById(resourceId);
    if (resource && resource.uploadedBy._id !== user._id) {
      this.addNotification({
        userId: resource.uploadedBy._id,
        type: 'NEW_COMMENT',
        title: 'New Comment on Your Notes 💬',
        message: `${user.name} commented: "${content.substring(0, 60)}..."`,
        resourceId,
        actorId: user._id,
      });
    }

    this.persist();
    return newComment;
  }

  public deleteComment(commentId: string) {
    this.state.comments = this.state.comments.filter((c) => c._id !== commentId);
    this.persist();
  }

  // -------------------------------------------------------------
  // BOOKMARKS
  // -------------------------------------------------------------
  public getBookmarks(userId: string): Resource[] {
    const ids = this.state.bookmarks[userId] || [];
    return this.state.resources.filter((r) => ids.includes(r._id));
  }

  public isBookmarked(userId: string, resourceId: string): boolean {
    return (this.state.bookmarks[userId] || []).includes(resourceId);
  }

  public toggleBookmark(userId: string, resourceId: string): boolean {
    const list = this.state.bookmarks[userId] || [];
    const isSaved = list.includes(resourceId);

    if (isSaved) {
      this.state.bookmarks[userId] = list.filter((id) => id !== resourceId);
    } else {
      this.state.bookmarks[userId] = [...list, resourceId];
    }

    this.persist();
    return !isSaved;
  }

  // -------------------------------------------------------------
  // REPORTS
  // -------------------------------------------------------------
  public getReports(): Report[] {
    return this.state.reports;
  }

  public addReport(payload: {
    reporter: User;
    resourceId?: string;
    commentId?: string;
    reason: ReportReason;
    description: string;
  }): Report {
    const newReport: Report = {
      _id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      reporterId: payload.reporter,
      resourceId: payload.resourceId,
      commentId: payload.commentId,
      reason: payload.reason,
      description: payload.description,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.state.reports = [newReport, ...this.state.reports];
    this.persist();
    return newReport;
  }

  public resolveReport(reportId: string, status: ReportStatus) {
    let reporterId: string | undefined;

    this.state.reports = this.state.reports.map((rep) => {
      if (rep._id === reportId) {
        reporterId = rep.reporterId._id;
        return {
          ...rep,
          status,
          reviewedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      return rep;
    });

    if (status === 'RESOLVED' && reporterId) {
      this.addXP(reporterId, 3, 'Confirmed Report Resolved');
      this.addNotification({
        userId: reporterId,
        type: 'REPORT_RESOLVED',
        title: 'Report Resolved ✅',
        message: 'Your report was verified by moderation (+3 XP awarded).',
      });
    }

    this.persist();
  }

  // -------------------------------------------------------------
  // NOTIFICATIONS
  // -------------------------------------------------------------
  public getNotifications(userId: string): Notification[] {
    return this.state.notifications.filter((n) => n.userId === userId);
  }

  public addNotification(payload: {
    userId: string;
    type: Notification['type'];
    title: string;
    message: string;
    resourceId?: string;
    actorId?: string;
  }) {
    const notif: Notification = {
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: payload.userId,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      resourceId: payload.resourceId,
      actorId: payload.actorId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    this.state.notifications = [notif, ...this.state.notifications];
    this.persist();
  }

  public markNotificationRead(id: string) {
    this.state.notifications = this.state.notifications.map((n) =>
      n._id === id ? { ...n, isRead: true } : n
    );
    this.persist();
  }

  public markAllNotificationsRead(userId: string) {
    this.state.notifications = this.state.notifications.map((n) =>
      n.userId === userId ? { ...n, isRead: true } : n
    );
    this.persist();
  }

  public deleteNotification(id: string) {
    this.state.notifications = this.state.notifications.filter((n) => n._id !== id);
    this.persist();
  }

  // -------------------------------------------------------------
  // USERS & GAMIFICATION
  // -------------------------------------------------------------
  public getUsers(): User[] {
    return this.state.users;
  }

  public getUserById(id: string): User | undefined {
    return this.state.users.find((u) => u._id === id);
  }

  public addXP(userId: string, points: number, reason?: string) {
    this.state.users = this.state.users.map((u) => {
      if (u._id === userId) {
        const newPoints = u.points + points;
        const newLevel = getLevelFromXP(newPoints);
        return {
          ...u,
          points: newPoints,
          level: newLevel,
          stats: {
            uploads: u.stats?.uploads || 0,
            downloads: u.stats?.downloads || 0,
            bookmarks: u.stats?.bookmarks || 0,
            xp: newPoints,
          },
        };
      }
      return u;
    });

    this.persist();
  }

  public toggleUserStatus(userId: string) {
    this.state.users = this.state.users.map((u) =>
      u._id === userId ? { ...u, isActive: !u.isActive } : u
    );
    this.persist();
  }

  public updateUserRole(userId: string, role: UserRole) {
    this.state.users = this.state.users.map((u) =>
      u._id === userId ? { ...u, role } : u
    );
    this.persist();
  }
}

// Global Singleton Instance
export const dataStore = new DataStoreManager();
