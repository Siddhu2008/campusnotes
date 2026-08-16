// ============================================================
// CampusNotes — TCET Mock Data
// ============================================================

import {
  College,
  Branch,
  Semester,
  Subject,
  User,
  Resource,
  Comment,
  Notification,
  AdminStats,
  ChartDataPoint,
} from '@/types';

// ============================================================
// COLLEGE
// ============================================================
export const TCET_COLLEGE: College = {
  _id: 'col_tcet',
  name: 'Thakur College of Engineering and Technology',
  code: 'TCET',
  city: 'Mumbai',
  state: 'Maharashtra',
  logoUrl: '/tcet-logo.png',
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

// ============================================================
// BRANCHES
// ============================================================
export const BRANCHES: Branch[] = [
  { _id: 'br_it', name: 'Information Technology', code: 'IT', collegeId: 'col_tcet', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { _id: 'br_cs', name: 'Computer Science', code: 'CS', collegeId: 'col_tcet', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { _id: 'br_extc', name: 'Electronics & Telecommunication', code: 'EXTC', collegeId: 'col_tcet', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { _id: 'br_mech', name: 'Mechanical Engineering', code: 'MECH', collegeId: 'col_tcet', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { _id: 'br_civil', name: 'Civil Engineering', code: 'CIVIL', collegeId: 'col_tcet', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { _id: 'br_elex', name: 'Electronics Engineering', code: 'ELEX', collegeId: 'col_tcet', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

// ============================================================
// SEMESTERS
// ============================================================
export const SEMESTERS: Semester[] = [
  { _id: 'sem_1', number: 1, year: 1, collegeId: 'col_tcet', isActive: true },
  { _id: 'sem_2', number: 2, year: 1, collegeId: 'col_tcet', isActive: true },
  { _id: 'sem_3', number: 3, year: 2, collegeId: 'col_tcet', isActive: true },
  { _id: 'sem_4', number: 4, year: 2, collegeId: 'col_tcet', isActive: true },
  { _id: 'sem_5', number: 5, year: 3, collegeId: 'col_tcet', isActive: true },
  { _id: 'sem_6', number: 6, year: 3, collegeId: 'col_tcet', isActive: true },
  { _id: 'sem_7', number: 7, year: 4, collegeId: 'col_tcet', isActive: true },
  { _id: 'sem_8', number: 8, year: 4, collegeId: 'col_tcet', isActive: true },
];

// ============================================================
// SUBJECTS (IT Branch)
// ============================================================
export const SUBJECTS: Subject[] = [
  // Semester 3 — IT
  {
    _id: 'sub_ds', name: 'Data Structures', code: 'IT301', branchId: 'br_it', semesterId: 'sem_3',
    description: 'Arrays, linked lists, stacks, queues, trees, graphs, and algorithms.',
    units: [
      { number: 1, title: 'Linear Data Structures' },
      { number: 2, title: 'Non-Linear Data Structures' },
      { number: 3, title: 'Sorting & Searching' },
      { number: 4, title: 'Hashing & Advanced Trees' },
      { number: 5, title: 'Graph Algorithms' },
    ],
    isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    _id: 'sub_dm', name: 'Discrete Mathematics', code: 'IT302', branchId: 'br_it', semesterId: 'sem_3',
    description: 'Logic, sets, functions, graph theory, combinatorics.',
    units: [
      { number: 1, title: 'Mathematical Logic' },
      { number: 2, title: 'Set Theory & Relations' },
      { number: 3, title: 'Functions & Combinatorics' },
      { number: 4, title: 'Graph Theory' },
      { number: 5, title: 'Algebraic Structures' },
    ],
    isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    _id: 'sub_oop', name: 'Object-Oriented Programming', code: 'IT303', branchId: 'br_it', semesterId: 'sem_3',
    description: 'Java programming, OOP concepts, design patterns.',
    units: [
      { number: 1, title: 'Java Fundamentals' },
      { number: 2, title: 'OOP Concepts' },
      { number: 3, title: 'Inheritance & Polymorphism' },
      { number: 4, title: 'Collections & Generics' },
      { number: 5, title: 'Exception Handling & I/O' },
    ],
    isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  // Semester 4 — IT
  {
    _id: 'sub_dbms', name: 'Database Management Systems', code: 'IT401', branchId: 'br_it', semesterId: 'sem_4',
    description: 'Relational databases, SQL, normalization, transactions.',
    units: [
      { number: 1, title: 'Introduction to DBMS' },
      { number: 2, title: 'Relational Model & SQL' },
      { number: 3, title: 'Normalization' },
      { number: 4, title: 'Transaction Management' },
      { number: 5, title: 'NoSQL & Advanced Topics' },
    ],
    isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    _id: 'sub_os', name: 'Operating Systems', code: 'IT402', branchId: 'br_it', semesterId: 'sem_4',
    description: 'Process management, memory management, file systems.',
    units: [
      { number: 1, title: 'Introduction & Process Management' },
      { number: 2, title: 'CPU Scheduling' },
      { number: 3, title: 'Memory Management' },
      { number: 4, title: 'File Systems' },
      { number: 5, title: 'Deadlocks & Security' },
    ],
    isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    _id: 'sub_cn', name: 'Computer Networks', code: 'IT403', branchId: 'br_it', semesterId: 'sem_4',
    description: 'OSI model, TCP/IP, routing, network security.',
    units: [
      { number: 1, title: 'Introduction & OSI Model' },
      { number: 2, title: 'Data Link & Network Layer' },
      { number: 3, title: 'Transport Layer & TCP/IP' },
      { number: 4, title: 'Application Layer Protocols' },
      { number: 5, title: 'Network Security' },
    ],
    isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  // Semester 5 — IT
  {
    _id: 'sub_se', name: 'Software Engineering', code: 'IT501', branchId: 'br_it', semesterId: 'sem_5',
    description: 'SDLC, design patterns, agile, testing methodologies.',
    units: [
      { number: 1, title: 'Software Process Models' },
      { number: 2, title: 'Requirements Engineering' },
      { number: 3, title: 'Software Design' },
      { number: 4, title: 'Testing & Quality' },
      { number: 5, title: 'Project Management' },
    ],
    isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    _id: 'sub_ml', name: 'Machine Learning', code: 'IT502', branchId: 'br_it', semesterId: 'sem_5',
    description: 'Supervised/unsupervised learning, neural networks.',
    units: [
      { number: 1, title: 'Introduction to ML' },
      { number: 2, title: 'Regression & Classification' },
      { number: 3, title: 'Clustering & Association' },
      { number: 4, title: 'Neural Networks' },
      { number: 5, title: 'Model Evaluation' },
    ],
    isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
  // CS Branch — Semester 3
  {
    _id: 'sub_algo', name: 'Analysis of Algorithms', code: 'CS301', branchId: 'br_cs', semesterId: 'sem_3',
    description: 'Time complexity, divide and conquer, dynamic programming, NP-completeness.',
    units: [
      { number: 1, title: 'Algorithm Analysis' },
      { number: 2, title: 'Divide & Conquer' },
      { number: 3, title: 'Dynamic Programming' },
      { number: 4, title: 'Greedy Algorithms' },
      { number: 5, title: 'NP-Completeness' },
    ],
    isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
];

// ============================================================
// USERS
// ============================================================
export const MOCK_USERS: User[] = [
  {
    _id: 'usr_1', name: 'Siddharth Kumar', email: 'siddharth@tcet.ac.in',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Siddharth',
    collegeId: 'col_tcet', branchId: 'br_it', year: 3, semester: 5,
    bio: 'IT student passionate about full-stack development and open-source.',
    role: 'student', points: 1240, level: 'Scholar',
    isEmailVerified: true, isActive: true,
    stats: { uploads: 12, downloads: 89, bookmarks: 17, xp: 1240 },
    createdAt: '2024-08-01T00:00:00Z', updatedAt: '2024-08-01T00:00:00Z',
  },
  {
    _id: 'usr_2', name: 'Priya Sharma', email: 'priya@tcet.ac.in',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Priya',
    collegeId: 'col_tcet', branchId: 'br_cs', year: 4, semester: 7,
    bio: 'CS final year. Machine learning enthusiast.',
    role: 'student', points: 2380, level: 'Expert',
    isEmailVerified: true, isActive: true,
    stats: { uploads: 28, downloads: 412, bookmarks: 34, xp: 2380 },
    createdAt: '2024-07-15T00:00:00Z', updatedAt: '2024-07-15T00:00:00Z',
  },
  {
    _id: 'usr_3', name: 'Rahul Patil', email: 'rahul@tcet.ac.in',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Rahul',
    collegeId: 'col_tcet', branchId: 'br_it', year: 4, semester: 7,
    bio: 'Aspiring software engineer. Love DSA and competitive programming.',
    role: 'student', points: 3100, level: 'Campus Mentor',
    isEmailVerified: true, isActive: true,
    stats: { uploads: 41, downloads: 823, bookmarks: 56, xp: 3100 },
    createdAt: '2024-06-10T00:00:00Z', updatedAt: '2024-06-10T00:00:00Z',
  },
  {
    _id: 'usr_4', name: 'Ananya Desai', email: 'ananya@tcet.ac.in',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Ananya',
    collegeId: 'col_tcet', branchId: 'br_extc', year: 3, semester: 5,
    bio: 'EXTC student interested in embedded systems and IoT.',
    role: 'student', points: 890, level: 'Contributor',
    isEmailVerified: true, isActive: true,
    stats: { uploads: 8, downloads: 156, bookmarks: 22, xp: 890 },
    createdAt: '2024-08-10T00:00:00Z', updatedAt: '2024-08-10T00:00:00Z',
  },
  {
    _id: 'usr_5', name: 'Vikram Joshi', email: 'vikram@tcet.ac.in',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Vikram',
    collegeId: 'col_tcet', branchId: 'br_cs', year: 2, semester: 4,
    bio: 'Second year CS student. DBMS and web dev are my things.',
    role: 'student', points: 450, level: 'Contributor',
    isEmailVerified: true, isActive: true,
    stats: { uploads: 5, downloads: 67, bookmarks: 11, xp: 450 },
    createdAt: '2024-09-01T00:00:00Z', updatedAt: '2024-09-01T00:00:00Z',
  },
  {
    _id: 'usr_admin', name: 'Dr. Admin', email: 'admin@tcet.ac.in',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Admin',
    role: 'admin', points: 0, level: 'Expert',
    isEmailVerified: true, isActive: true,
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z',
  },
];

// ============================================================
// RESOURCES
// ============================================================
export const MOCK_RESOURCES: Resource[] = [
  {
    _id: 'res_1',
    title: 'Data Structures — Complete Unit 2 Notes',
    slug: 'data-structures-complete-unit-2-notes',
    description: 'Comprehensive notes covering non-linear data structures: Binary Trees, BST, AVL Trees, Heaps, and B-Trees with diagrams and examples.',
    category: 'NOTES',
    file: { url: '/files/ds_unit2.pdf', storageKey: 'ds_unit2', originalName: 'DS_Unit2_Notes.pdf', mimeType: 'application/pdf', extension: 'pdf', size: 2048000 },
    collegeId: 'col_tcet', branchId: 'br_it', semesterId: 'sem_3', subjectId: 'sub_ds',
    unitNumber: 2, tags: ['trees', 'BST', 'AVL', 'heap', 'data structures'],
    uploadedBy: MOCK_USERS[0],
    status: 'PUBLISHED',
    stats: { views: 1243, downloads: 328, averageRating: 4.8, ratingCount: 47 },
    branch: BRANCHES[0], semester: SEMESTERS[2], subject: SUBJECTS[0],
    createdAt: '2024-08-10T10:00:00Z', updatedAt: '2024-08-10T10:00:00Z',
  },
  {
    _id: 'res_2',
    title: 'DBMS — Normalization Cheat Sheet (1NF to BCNF)',
    slug: 'dbms-normalization-cheat-sheet',
    description: 'Quick reference cheat sheet covering all normal forms from 1NF to BCNF with examples and functional dependency rules.',
    category: 'CHEAT_SHEET',
    file: { url: '/files/dbms_normalization.pdf', storageKey: 'dbms_norm', originalName: 'DBMS_Normalization.pdf', mimeType: 'application/pdf', extension: 'pdf', size: 512000 },
    collegeId: 'col_tcet', branchId: 'br_it', semesterId: 'sem_4', subjectId: 'sub_dbms',
    unitNumber: 3, tags: ['normalization', '1NF', '2NF', '3NF', 'BCNF', 'DBMS'],
    uploadedBy: MOCK_USERS[1],
    status: 'PUBLISHED',
    stats: { views: 2891, downloads: 744, averageRating: 4.9, ratingCount: 112 },
    branch: BRANCHES[0], semester: SEMESTERS[3], subject: SUBJECTS[3],
    createdAt: '2024-07-20T10:00:00Z', updatedAt: '2024-07-20T10:00:00Z',
  },
  {
    _id: 'res_3',
    title: 'Operating Systems — Previous Year Question Papers (2020–2024)',
    slug: 'os-previous-year-question-papers',
    description: 'Collection of TCET IT semester 4 OS question papers from 2020 to 2024 with answers for key questions.',
    category: 'QUESTION_PAPER',
    file: { url: '/files/os_qp.pdf', storageKey: 'os_qp', originalName: 'OS_QP_2020_2024.pdf', mimeType: 'application/pdf', extension: 'pdf', size: 3145728 },
    collegeId: 'col_tcet', branchId: 'br_it', semesterId: 'sem_4', subjectId: 'sub_os',
    tags: ['question paper', 'OS', 'exam prep', 'previous year'],
    uploadedBy: MOCK_USERS[2],
    status: 'PUBLISHED',
    stats: { views: 5432, downloads: 1823, averageRating: 4.7, ratingCount: 198 },
    branch: BRANCHES[0], semester: SEMESTERS[3], subject: SUBJECTS[4],
    createdAt: '2024-06-15T10:00:00Z', updatedAt: '2024-06-15T10:00:00Z',
  },
  {
    _id: 'res_4',
    title: 'Computer Networks — Unit 3 TCP/IP Protocol Suite',
    slug: 'cn-unit-3-tcpip-protocol-suite',
    description: 'Detailed notes on TCP/IP model, protocols, socket programming, and comparison with OSI model.',
    category: 'NOTES',
    file: { url: '/files/cn_unit3.pdf', storageKey: 'cn_unit3', originalName: 'CN_Unit3_TCPIP.pdf', mimeType: 'application/pdf', extension: 'pdf', size: 1835008 },
    collegeId: 'col_tcet', branchId: 'br_it', semesterId: 'sem_4', subjectId: 'sub_cn',
    unitNumber: 3, tags: ['TCP/IP', 'protocols', 'OSI', 'networking'],
    uploadedBy: MOCK_USERS[0],
    status: 'PUBLISHED',
    stats: { views: 987, downloads: 234, averageRating: 4.5, ratingCount: 34 },
    branch: BRANCHES[0], semester: SEMESTERS[3], subject: SUBJECTS[5],
    createdAt: '2024-08-01T10:00:00Z', updatedAt: '2024-08-01T10:00:00Z',
  },
  {
    _id: 'res_5',
    title: 'Machine Learning — Lab Manual (Practical Programs)',
    slug: 'ml-lab-manual-practical-programs',
    description: 'Complete ML lab manual with Python implementations of KNN, Linear Regression, Decision Trees, SVM, and K-Means clustering.',
    category: 'LAB_MANUAL',
    file: { url: '/files/ml_lab.pdf', storageKey: 'ml_lab', originalName: 'ML_Lab_Manual.pdf', mimeType: 'application/pdf', extension: 'pdf', size: 4194304 },
    collegeId: 'col_tcet', branchId: 'br_it', semesterId: 'sem_5', subjectId: 'sub_ml',
    tags: ['machine learning', 'python', 'KNN', 'SVM', 'lab manual'],
    uploadedBy: MOCK_USERS[1],
    status: 'PUBLISHED',
    stats: { views: 3421, downloads: 892, averageRating: 4.9, ratingCount: 156 },
    branch: BRANCHES[0], semester: SEMESTERS[4], subject: SUBJECTS[7],
    createdAt: '2024-07-05T10:00:00Z', updatedAt: '2024-07-05T10:00:00Z',
  },
  {
    _id: 'res_6',
    title: 'Discrete Mathematics — Unit 4 Graph Theory',
    slug: 'dm-unit-4-graph-theory',
    description: 'Graph theory notes: Euler paths, Hamiltonian circuits, planar graphs, graph coloring, and spanning trees.',
    category: 'NOTES',
    file: { url: '/files/dm_unit4.pdf', storageKey: 'dm_unit4', originalName: 'DM_Unit4_Graph.pdf', mimeType: 'application/pdf', extension: 'pdf', size: 1310720 },
    collegeId: 'col_tcet', branchId: 'br_it', semesterId: 'sem_3', subjectId: 'sub_dm',
    unitNumber: 4, tags: ['graph theory', 'Euler', 'Hamiltonian', 'discrete math'],
    uploadedBy: MOCK_USERS[3],
    status: 'PUBLISHED',
    stats: { views: 678, downloads: 189, averageRating: 4.3, ratingCount: 28 },
    branch: BRANCHES[0], semester: SEMESTERS[2], subject: SUBJECTS[1],
    createdAt: '2024-08-12T10:00:00Z', updatedAt: '2024-08-12T10:00:00Z',
  },
  {
    _id: 'res_7',
    title: 'Software Engineering — Agile & Scrum Notes',
    slug: 'se-agile-scrum-notes',
    description: 'Complete notes on Agile methodology, Scrum framework, sprint planning, user stories, and DevOps practices.',
    category: 'NOTES',
    file: { url: '/files/se_agile.pdf', storageKey: 'se_agile', originalName: 'SE_Agile_Scrum.pdf', mimeType: 'application/pdf', extension: 'pdf', size: 2621440 },
    collegeId: 'col_tcet', branchId: 'br_it', semesterId: 'sem_5', subjectId: 'sub_se',
    unitNumber: 2, tags: ['agile', 'scrum', 'software engineering', 'DevOps'],
    uploadedBy: MOCK_USERS[2],
    status: 'PUBLISHED',
    stats: { views: 1456, downloads: 398, averageRating: 4.6, ratingCount: 67 },
    branch: BRANCHES[0], semester: SEMESTERS[4], subject: SUBJECTS[6],
    createdAt: '2024-07-28T10:00:00Z', updatedAt: '2024-07-28T10:00:00Z',
  },
  {
    _id: 'res_8',
    title: 'OOP with Java — Complete Unit 3 Notes (Inheritance)',
    slug: 'oop-java-unit-3-inheritance',
    description: 'Detailed notes on Java inheritance, method overriding, abstract classes, interfaces, and polymorphism with code examples.',
    category: 'NOTES',
    file: { url: '/files/oop_unit3.pdf', storageKey: 'oop_unit3', originalName: 'OOP_Unit3_Inheritance.pdf', mimeType: 'application/pdf', extension: 'pdf', size: 1572864 },
    collegeId: 'col_tcet', branchId: 'br_it', semesterId: 'sem_3', subjectId: 'sub_oop',
    unitNumber: 3, tags: ['Java', 'inheritance', 'OOP', 'polymorphism'],
    uploadedBy: MOCK_USERS[4],
    status: 'PUBLISHED',
    stats: { views: 2134, downloads: 567, averageRating: 4.7, ratingCount: 89 },
    branch: BRANCHES[0], semester: SEMESTERS[2], subject: SUBJECTS[2],
    createdAt: '2024-08-05T10:00:00Z', updatedAt: '2024-08-05T10:00:00Z',
  },
];

// ============================================================
// COMMENTS
// ============================================================
export const MOCK_COMMENTS: Comment[] = [
  {
    _id: 'cmt_1', resourceId: 'res_1', userId: MOCK_USERS[1],
    content: 'These notes are excellent! The AVL tree rotation diagrams are very clear. Really helped me understand the concept.',
    parentCommentId: null, isDeleted: false,
    createdAt: '2024-08-11T14:00:00Z', updatedAt: '2024-08-11T14:00:00Z',
  },
  {
    _id: 'cmt_2', resourceId: 'res_1', userId: MOCK_USERS[2],
    content: 'Great notes Siddharth! Could you also upload Unit 3 notes on sorting?',
    parentCommentId: null, isDeleted: false,
    createdAt: '2024-08-12T09:30:00Z', updatedAt: '2024-08-12T09:30:00Z',
  },
  {
    _id: 'cmt_3', resourceId: 'res_2', userId: MOCK_USERS[0],
    content: 'This cheat sheet saved my exam! Super concise and clear. 5 stars!',
    parentCommentId: null, isDeleted: false,
    createdAt: '2024-07-22T16:00:00Z', updatedAt: '2024-07-22T16:00:00Z',
  },
];

// ============================================================
// NOTIFICATIONS
// ============================================================
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    _id: 'notif_1', userId: 'usr_1', type: 'NEW_COMMENT',
    title: 'New comment on your resource',
    message: 'Priya Sharma commented on "Data Structures — Complete Unit 2 Notes"',
    resourceId: 'res_1', actorId: 'usr_2', isRead: false,
    createdAt: '2024-08-11T14:00:00Z',
  },
  {
    _id: 'notif_2', userId: 'usr_1', type: 'DOWNLOAD_MILESTONE',
    title: 'Download milestone reached! 🎉',
    message: 'Your resource "CN Unit 3 — TCP/IP" just hit 200 downloads!',
    resourceId: 'res_4', isRead: false,
    createdAt: '2024-08-10T10:30:00Z',
  },
  {
    _id: 'notif_3', userId: 'usr_1', type: 'RESOURCE_APPROVED',
    title: 'Resource approved ✅',
    message: 'Your resource "OOP — Unit 3 Notes" has been approved and published.',
    resourceId: 'res_8', isRead: true,
    createdAt: '2024-08-05T12:00:00Z',
  },
];

// ============================================================
// ADMIN STATS
// ============================================================
export const MOCK_ADMIN_STATS: AdminStats = {
  totalUsers: 1248,
  totalResources: 8421,
  totalDownloads: 52340,
  totalViews: 284920,
  pendingReports: 37,
  storageUsedMB: 12800,
  activeUsers: 342,
};

export const UPLOADS_OVER_TIME: ChartDataPoint[] = [
  { date: 'Mar', value: 42 }, { date: 'Apr', value: 78 }, { date: 'May', value: 95 },
  { date: 'Jun', value: 134 }, { date: 'Jul', value: 156 }, { date: 'Aug', value: 189 },
];

export const DOWNLOADS_OVER_TIME: ChartDataPoint[] = [
  { date: 'Mar', value: 1200 }, { date: 'Apr', value: 2400 }, { date: 'May', value: 3100 },
  { date: 'Jun', value: 4800 }, { date: 'Jul', value: 6200 }, { date: 'Aug', value: 8900 },
];

export const NEW_USERS_OVER_TIME: ChartDataPoint[] = [
  { date: 'Mar', value: 56 }, { date: 'Apr', value: 124 }, { date: 'May', value: 98 },
  { date: 'Jun', value: 203 }, { date: 'Jul', value: 267 }, { date: 'Aug', value: 345 },
];

// ============================================================
// LEADERBOARD
// ============================================================
export const LEADERBOARD_USERS = MOCK_USERS
  .filter(u => u.role === 'student')
  .sort((a, b) => b.points - a.points);

// ============================================================
// CATEGORY CONFIG
// ============================================================
export const CATEGORY_CONFIG: Record<string, { label: string; emoji: string; color: string }> = {
  NOTES:          { label: 'Notes',          emoji: '📄', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  QUESTION_PAPER: { label: 'Question Paper', emoji: '📝', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  ASSIGNMENT:     { label: 'Assignment',     emoji: '✏️', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  PRACTICAL:      { label: 'Practical',      emoji: '🔬', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  LAB_MANUAL:     { label: 'Lab Manual',     emoji: '📓', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
  STUDY_MATERIAL: { label: 'Study Material', emoji: '📚', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  CHEAT_SHEET:    { label: 'Cheat Sheet',    emoji: '📋', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  PROJECT:        { label: 'Project',        emoji: '🏗️', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  OTHER:          { label: 'Other',          emoji: '📦', color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
};

export const LEVEL_CONFIG: Record<string, { color: string; gradient: string }> = {
  'Beginner':      { color: 'text-gray-400',   gradient: 'from-gray-500 to-gray-600' },
  'Contributor':   { color: 'text-green-400',  gradient: 'from-green-500 to-emerald-600' },
  'Scholar':       { color: 'text-blue-400',   gradient: 'from-blue-500 to-indigo-600' },
  'Expert':        { color: 'text-purple-400', gradient: 'from-purple-500 to-violet-600' },
  'Campus Mentor': { color: 'text-yellow-400', gradient: 'from-yellow-400 to-orange-500' },
};
