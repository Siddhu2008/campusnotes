# CampusNotes — Student Academic Resource Sharing Platform

> Complete full-stack production-ready web application built for **TCET (Thakur College of Engineering and Technology)** students to share, discover, rate, and download notes, question papers, assignments, and study materials.

---

## 🌟 Features Implemented

### 🎓 1. Academic Structure & TCET Classification
- **Pre-populated TCET Branches**: Information Technology (IT), Computer Science (CS), Electronics & Telecommunication (EXTC), Mechanical, Civil, and Electronics.
- **Curriculum Organization**: Semesters 1 through 8, course codes, and unit-by-unit syllabus breakdowns (e.g. Data Structures, DBMS, Operating Systems, Computer Networks, Machine Learning).

### 🔍 2. Discovery & Resource Hub
- **Instant Full-Text Search**: Search by title, tags, description, and subject keywords.
- **Multi-Faceted Sidebar Filters**: Filter by branch, semester, resource category (Notes, Question Papers, Cheat Sheets, Lab Manuals, Assignments), and minimum star rating.
- **Sorting Options**: Newest, most downloaded, highest rated, and most viewed.

### 📄 3. Interactive Resource Detail & PDF Viewer
- **Document Preview Container**: Browser preview frame with pagination controls (Next/Prev, zoom in/out, page counters).
- **Interactive 5-Star Rating System**: Live hover feedback and ratings breakdown.
- **Community Discussion Thread**: Nested comments, uploader reply buttons, and report actions.
- **Quick Action Bar**: High-speed download with file size tracking, one-click bookmarks, social sharing, and content flagging.

### 🚀 4. Multi-Step Upload Wizard
- **5-Step Flow**:
  1. File Drag & Drop (Supports PDF, DOCX, PPTX, Images, ZIP up to 50MB)
  2. Resource Metadata (Title, category badge, description, tags)
  3. Academic Classification (TCET branch, semester, subject, syllabus unit number)
  4. Review & Confirmation
  5. Submission Screen with Instant **+10 XP** Contributor Feedback

### 👤 5. Student Dashboard & Gamification (Reputation System)
- **XP Progression Bar**: Real-time level progression (`Beginner` → `Contributor` → `Scholar` → `Expert` → `Campus Mentor`).
- **Activity Metrics**: Upload counts, total download bandwidth, bookmarks, and XP history log.
- **Recommendation Engine**: Curated peer resources based on branch and current semester.
- **Live Activity Notifications**: Instant alerts for approvals, downloads milestones, and new comments.

### 🏆 6. Leaderboard & Contributor Profiles
- **Podium Display**: Top 3 contributors with animated gold 🥇, silver 🥈, and bronze 🥉 crowns.
- **Public Profile Showcase**: Student bio, badge tier, stats overview, and public archive of uploaded notes.

### 🛡️ 7. Full-Featured Admin & Moderation Console
- **System Metrics & Analytics**: Total users, total files, aggregate downloads, and CSS-animated monthly traffic bar charts.
- **Resource Moderation Queue**: Approve, reject, or inspect newly uploaded resources before publishing.
- **Report Resolution Desk**: Handle flagged reports (duplicate files, wrong subject, incorrect content, copyright) with one-click resolution (+3 XP reporter reward).
- **User Directory & RBAC**: Search students and faculty, assign moderator/admin roles, and toggle account activation status.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 / React 19 / TypeScript / Tailwind CSS 4
- **Backend API**: Node.js / Express.js / Mongoose / JWT / Cloudinary
- **Design System**: Dark-first glassmorphism, Google Inter typography, vibrant gradients (`#6366f1` Indigo & `#10b981` Emerald)

---

## 🚀 Getting Started

### 1. Frontend (Next.js)

```bash
cd campusnotes
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Backend (Express API)

```bash
cd server
npm install
npm run seed     # Seeds TCET branches, subjects, and sample resources into MongoDB
npm run dev      # Starts Express API server on http://localhost:5000
```

---

## 📱 Routes Overview

| Route | Page | Description |
|---|---|---|
| `/` | Landing / Home | Hero, categories, trending resources, top contributors |
| `/resources` | Resources Catalog | Search, filter sidebar, sorting, resource cards |
| `/resources/[id]` | Resource Detail | PDF viewer placeholder, rating, comments, download |
| `/upload` | Upload Wizard | 5-step interactive upload wizard |
| `/dashboard` | User Dashboard | Personal stats, level progress, recommendations |
| `/profile/[id]` | Public Profile | User bio, contributor badge, uploads list |
| `/leaderboard` | Leaderboard | Top contributors podium and XP guide |
| `/subjects` | Curriculum | TCET branches, semesters, and subject units |
| `/bookmarks` | Saved Resources | Personal saved notes and cheat sheets |
| `/notifications` | Activity Center | Milestone alerts and comment notifications |
| `/login` | Login | Student / Faculty authentication |
| `/register` | Register | Sign up with branch and semester selection |
| `/admin` | Admin Dashboard | System KPI stats, growth charts, pending queues |
| `/admin/resources`| Resource Moderation | Approve / reject uploaded materials |
| `/admin/reports` | Report Queue | Resolve flagged resources & comments |
| `/admin/users` | User Directory | Role delegation (Student / Mod / Admin) |

---

*Developed for Thakur College of Engineering & Technology (TCET), Mumbai.*
