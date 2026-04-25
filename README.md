# OpsDesk 🚀

OpsDesk is a modern incident and task management platform built to simulate real-world operational workflows. It allows teams to create, assign, track, and resolve tickets efficiently with role-based access control and real-time updates.

🔗 Live Demo: https://ops-desk-inky.vercel.app

---

## ✨ Features

- 🔐 Authentication with credentials
- 👥 Role-based access control 
- 🎫 Ticket management 
- 💬 Comments and activity timeline per ticket
- 🔔 Real-time notifications system
- 🧑‍💼 Admin panel for user management
- 🚫 Activate / deactivate users
- 🔎 Search and filtering
- 📊 Dashboard with metrics
- 🌙 Dark / Light mode
- 📱 Fully responsive UI
- 🎨 Smooth animations

---

## 🧠 Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Auth:** NextAuth
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide

---

## 🔐 Security Features

- Input validation with Zod
- Rate limiting
- Password hashing with bcrypt
- Protected API routes
- Prevention of user enumeration attacks

---

## 🏗️ Architecture

- Full-stack app using Next.js App Router
- Server Components for data fetching
- Client Components for interactivity
- Prisma ORM for database access
- Modular component structure

---

🚀 Deployment

Deployed on Vercel with:

PostgreSQL via Neon
Prisma ORM
Environment variables configured in Vercel dashboard


| Role    | Permissions                     |
| ------- | ------------------------------- |
| USER    | View & comment own tickets      |
| MANAGER | Assign tickets, manage workflow |
| ADMIN   | Full access, manage users       |

📌 Future Improvements
📎 File attachments
📊 Advanced analytics
🔔 Real-time WebSocket updates
🔐 Two-factor authentication
🧾 Audit logs

## ⚙️ Getting Started

### 1. Clone the repo

### 2. Install dependencies

### 3.Configure environment variables
    DATABASE_URL=your_database_url
    AUTH_SECRET=your_secret
    NEXTAUTH_URL=http://localhost:3000
    
### 3.Configure environment variables

### 4. Run migrations
    npx prisma migrate deploy
    
### 5. Run the app
    npm run dev

```bash
git clone https://github.com/iespinoza421/OpsDesk.git
cd OpsDesk






