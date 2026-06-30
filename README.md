# YouFlex 🚀

A modern social platform built for developers. Connect with fellow coders, share ideas through community posts, and showcase your developer profiles — including your GitHub, LeetCode, Codeforces, LinkedIn, and more — all in one place.

---

## ✨ Features

- **Authentication** — Secure credential-based login and registration with bcrypt password hashing and NextAuth.js JWT sessions.
- **Developer Profiles** — Build and display a public profile with your bio, headline, domain, and all your social/coding platform links.
- **Community Feed** — Post thoughts, questions, and updates to a paginated community feed with support for rich text.
- **Upvoting & Downvoting** — Vote on posts and see community sentiment at a glance.
- **Threaded Discussions** — Nested comment threads with formal, readable styling on individual post pages.
- **Avatar Uploads** — Upload a profile picture, stored and delivered via Cloudinary CDN.
- **Profile Completeness** — A visual card that guides users to fill out all profile fields.
- **Discover Developers** — Browse all registered developers in a responsive grid layout.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, React 19) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Glassmorphism Design System |
| **Database** | [Neon Postgres](https://neon.tech/) (Serverless) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) |
| **Authentication** | [NextAuth.js v5](https://authjs.dev/) (Credentials + JWT) |
| **Image Storage** | [Cloudinary](https://cloudinary.com/) |
| **Package Manager** | [pnpm](https://pnpm.io/) |

---

## 📁 Project Structure

```
youflex/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Login & Register pages
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/   # Discover developers grid
│   │   │   ├── discuss/     # Community feed (paginated)
│   │   │   │   └── [postId] # Individual post + threaded discussions
│   │   │   ├── profile/     # Edit your own profile
│   │   │   └── share/       # Create a new post
│   │   └── api/             # API routes (avatar upload, etc.)
│   ├── components/          # Reusable UI components
│   ├── actions/             # Next.js Server Actions
│   ├── services/            # DB query services (with React cache)
│   ├── db/
│   │   ├── index.js         # Drizzle DB client
│   │   └── schema.js        # Table definitions + indexes
│   └── lib/                 # Utilities, profile helpers, Cloudinary
├── drizzle/                 # Generated migration files
├── drizzle.config.js        # Drizzle Kit config
├── next.config.mjs          # Next.js config (image domains, etc.)
└── package.json
```

---

## ⚡ Getting Started

### Prerequisites
- [Node.js 20+](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- A [Neon](https://neon.tech/) database
- A [Cloudinary](https://cloudinary.com/) account

### 1. Clone the repository
```bash
git clone https://github.com/your-username/youflex.git
cd youflex
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root of the project:
```env
# Neon Postgres
DATABASE_URL=postgresql://user:pass@ep-xxxx.neon.tech/neondb?sslmode=require

# NextAuth.js
AUTH_SECRET=your-random-secret-here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> You can generate a secure AUTH_SECRET by running: npx auth secret

### 4. Push the schema to your database
```bash
pnpm run db:push
```

### 5. Start the development server
```bash
pnpm run dev
```

Open http://localhost:3000 in your browser.

---

## 🗄️ Database Scripts

| Command | Description |
|---|---|
| `pnpm run db:push` | Push schema changes directly to the database |
| `pnpm run db:generate` | Generate SQL migration files |
| `pnpm run db:studio` | Open Drizzle Studio (visual DB browser) |

---

## 🚀 Deploying to Vercel

1. Push your code to a GitHub repository.
2. Import the repository on [Vercel](https://vercel.com/).
3. Set the following **Environment Variables** in the Vercel dashboard:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. The build command (`drizzle-kit push && next build`) will automatically push any pending schema changes and build the app on each deployment.

---.
