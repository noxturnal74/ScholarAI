# 🎓 ScholarAI - AI-Powered Scholarship Management

ScholarAI is a premium, Apple-inspired full-stack web application designed to help students and young professionals discover, track, and analyze scholarships, youth summits, fellowships, and global opportunities from unstructured text posts.

## 🚀 Live Application & Repository
- **GitHub Repository**: [https://github.com/noxturnal74/ScholarAI](https://github.com/noxturnal74/ScholarAI)
- **Live Local Tunnel (HTTPS)**: [https://efacce6822ef71.lhr.life](https://efacce6822ef71.lhr.life)

---

## 🌟 Key Implemented Features

### 1. Dynamic Overview Dashboard
- Displays dynamic statistics: Total Opportunities, Active Applications, Pending Review, and Accepted Applications.
- Features a **Profile Strength** completion bar calculated from the student's database profile.
- Shows a list of **Recent Applications** and **Upcoming Deadlines** sorted automatically by closest due date.

### 2. AI Opportunity Analyzer
- Paste unstructured posts (e.g. from WhatsApp, Instagram, or email).
- Automatically extracts the Opportunity Title, Country, Category (S1, S2, S3, Exchange), Funding Amount, and Deadline.
- Computes a dynamic **Eligibility Match Score (0-100%)** based on the student's GPA, Country, and Major.
- Details matching arguments and highlights missing requirements.
- Automatically saves analyzed opportunities into the main database.

### 3. Scholarships Database
- Search and filter opportunities dynamically from the PostgreSQL database.
- Calculates eligibility matches for every scholarship in real-time.
- Shows dynamic match score badges with a visual legend (80%+ green, 60-79% yellow, below 60% gray).

### 4. Interactive User Profile
- Upserts personal information (First/Last Name, Email, Phone, Bio, City, Country) and academic information (University, Major, GPA, Graduation Year).
- Incorporates specific student categories (Demonstrated financial need, First-generation student, Military affiliation).
- Updates changes in real-time to the database.

---

## 🛠️ Technology Stack
- **Frontend**: Next.js 15 App Router (running in optimized Next.js 16 build mode), TypeScript, Tailwind CSS v4, Lucide Icons, ShadCN UI.
- **Backend**: Next.js Server Actions.
- **Database**: Neon PostgreSQL cloud server via Prisma ORM (v6.4.0).

---

## 💻 Local Installation & Setup

### Prerequisites
- Node.js 20+
- Neon PostgreSQL or Docker (for local PostgreSQL)

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/noxturnal74/ScholarAI.git
   cd ScholarAI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://neondb_owner:npg_joVUwGk84ilN@ep-solitary-sunset-aono6zhl-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
   DIRECT_URL="postgresql://neondb_owner:npg_joVUwGk84ilN@ep-solitary-sunset-aono6zhl.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
   NEXT_PUBLIC_APP_NAME="ScholarAI"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   AUTH_SECRET="scholar-ai-super-secret-key-change-in-production-2026"
   ```

4. **Sync database and generate Prisma Client**:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Seed the database with mock scholarships**:
   ```bash
   node prisma/seed.js
   ```

6. **Start the production server**:
   ```bash
   npm run build
   npm run start
   ```

---

## ☁️ Production Deployment on Vercel

To host this project on Vercel:
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard) and connect your GitHub account.
2. Click **Add New** -> **Project** and import the `noxturnal74/ScholarAI` repository.
3. In **Environment Variables**, add the variables from your local `.env` (especially `DATABASE_URL` and `DIRECT_URL`).
4. Click **Deploy**. Vercel will automatically build and publish your project!
