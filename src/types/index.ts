// ============================================================
// CampusNotes — Core TypeScript Types
// ============================================================

export type UserRole = 'student' | 'moderator' | 'admin';
export type UserLevel = 'Beginner' | 'Contributor' | 'Scholar' | 'Expert' | 'Campus Mentor';

export type ResourceCategory =
  | 'NOTES'
  | 'QUESTION_PAPER'
  | 'ASSIGNMENT'
  | 'PRACTICAL'
  | 'LAB_MANUAL'
  | 'STUDY_MATERIAL'
  | 'CHEAT_SHEET'
  | 'PROJECT'
  | 'OTHER';

export type ResourceStatus =
  | 'DRAFT'
  | 'PROCESSING'
  | 'PENDING_REVIEW'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'ARCHIVED'
  | 'REMOVED';

export type ReportReason =
  | 'WRONG_SUBJECT'
  | 'INCORRECT_CONTENT'
  | 'DUPLICATE'
  | 'SPAM'
  | 'INAPPROPRIATE'
  | 'COPYRIGHT'
  | 'OTHER';

export type ReportStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';

export type NotificationType =
  | 'RESOURCE_APPROVED'
  | 'RESOURCE_REJECTED'
  | 'NEW_COMMENT'
  | 'NEW_RATING'
  | 'DOWNLOAD_MILESTONE'
  | 'REPORT_RESOLVED'
  | 'NEW_RESOURCE_IN_SUBJECT';

// ============================================================
// Entities
// ============================================================

export interface College {
  _id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  _id: string;
  name: string;
  code: string;
  collegeId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Semester {
  _id: string;
  number: number;
  year: number; // 1-4
  collegeId: string;
  isActive: boolean;
}

export interface Unit {
  number: number;
  title: string;
}

export interface Subject {
  _id: string;
  name: string;
  code: string;
  branchId: string;
  semesterId: string;
  description?: string;
  units: Unit[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  uploads: number;
  downloads: number;
  bookmarks: number;
  xp: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  collegeId?: string;
  branchId?: string;
  year?: number;
  semester?: number;
  bio?: string;
  role: UserRole;
  points: number;
  level: UserLevel;
  isEmailVerified: boolean;
  isActive: boolean;
  stats?: UserStats;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceFile {
  url: string;
  storageKey: string;
  originalName: string;
  mimeType: string;
  extension: string;
  size: number; // bytes
}

export interface ResourceStats {
  views: number;
  downloads: number;
  averageRating: number;
  ratingCount: number;
}

export interface Resource {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: ResourceCategory;
  file: ResourceFile;
  thumbnailUrl?: string;
  collegeId: string;
  branchId: string;
  semesterId: string;
  subjectId: string;
  unitNumber?: number;
  tags: string[];
  uploadedBy: User;
  status: ResourceStatus;
  stats: ResourceStats;
  // Populated fields
  branch?: Branch;
  semester?: Semester;
  subject?: Subject;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  resourceId: string;
  userId: User;
  content: string;
  parentCommentId?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  _id: string;
  resourceId: string;
  userId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  _id: string;
  userId: string;
  resourceId: Resource;
  createdAt: string;
}

export interface Report {
  _id: string;
  reporterId: User;
  resourceId?: string;
  commentId?: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  resourceId?: string;
  actorId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface XPTransaction {
  _id: string;
  userId: string;
  action: string;
  points: number;
  resourceId?: string;
  createdAt: string;
}

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ============================================================
// Filter / Search Types
// ============================================================

export interface ResourceFilters {
  search?: string;
  branchId?: string;
  semesterId?: string;
  subjectId?: string;
  category?: ResourceCategory;
  minRating?: number;
  fileType?: string;
  sort?: 'newest' | 'oldest' | 'most_downloaded' | 'highest_rated' | 'most_viewed';
  page?: number;
  limit?: number;
}

// ============================================================
// Admin Dashboard
// ============================================================

export interface AdminStats {
  totalUsers: number;
  totalResources: number;
  totalDownloads: number;
  totalViews: number;
  pendingReports: number;
  storageUsedMB: number;
  activeUsers: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

// ============================================================
// Auth
// ============================================================

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  collegeId?: string;
  branchId?: string;
  year?: number;
  semester?: number;
}
