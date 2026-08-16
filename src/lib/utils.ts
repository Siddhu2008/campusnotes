// ============================================================
// CampusNotes — Utility Functions
// ============================================================

import { ResourceCategory, UserLevel } from '@/types';

/**
 * Format file size from bytes to human readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Format large numbers (e.g. 1200 -> 1.2k)
 */
export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

/**
 * Format date as relative time (e.g. "2 days ago")
 */
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

/**
 * Format a date as "Aug 15, 2024"
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Generate a star rating display (0-5)
 */
export function getRatingStars(rating: number): string {
  return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

/**
 * Get category label from category code
 */
export function getCategoryLabel(category: ResourceCategory): string {
  const labels: Record<ResourceCategory, string> = {
    NOTES: 'Notes',
    QUESTION_PAPER: 'Question Paper',
    ASSIGNMENT: 'Assignment',
    PRACTICAL: 'Practical',
    LAB_MANUAL: 'Lab Manual',
    STUDY_MATERIAL: 'Study Material',
    CHEAT_SHEET: 'Cheat Sheet',
    PROJECT: 'Project',
    OTHER: 'Other',
  };
  return labels[category] || category;
}

/**
 * Get XP required for next level
 */
export function getXPForLevel(level: UserLevel): { min: number; max: number } {
  const thresholds: Record<UserLevel, { min: number; max: number }> = {
    'Beginner':      { min: 0,    max: 200 },
    'Contributor':   { min: 200,  max: 600 },
    'Scholar':       { min: 600,  max: 1500 },
    'Expert':        { min: 1500, max: 3000 },
    'Campus Mentor': { min: 3000, max: 5000 },
  };
  return thresholds[level];
}

/**
 * Get progress percentage to next level
 */
export function getLevelProgress(xp: number, level: UserLevel): number {
  const { min, max } = getXPForLevel(level);
  return Math.min(100, Math.round(((xp - min) / (max - min)) * 100));
}

/**
 * Determine user level from XP
 */
export function getLevelFromXP(xp: number): UserLevel {
  if (xp >= 3000) return 'Campus Mentor';
  if (xp >= 1500) return 'Expert';
  if (xp >= 600) return 'Scholar';
  if (xp >= 200) return 'Contributor';
  return 'Beginner';
}

/**
 * Get file type icon emoji
 */
export function getFileTypeEmoji(extension: string): string {
  const map: Record<string, string> = {
    pdf: '📄',
    doc: '📝', docx: '📝',
    ppt: '📊', pptx: '📊',
    xls: '📈', xlsx: '📈',
    zip: '🗜️', rar: '🗜️',
    jpg: '🖼️', jpeg: '🖼️', png: '🖼️',
    mp4: '🎬', mp3: '🎵',
  };
  return map[extension.toLowerCase()] || '📎';
}

/**
 * Build avatar fallback URL using dicebear
 */
export function getAvatarUrl(name: string, seed?: string): string {
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed || name)}`;
}

/**
 * Build query string from object
 */
export function buildQueryString(params: Record<string, string | number | undefined>): string {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');
  return query ? `?${query}` : '';
}
