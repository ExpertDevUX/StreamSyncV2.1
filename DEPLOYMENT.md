# StreamSync Deployment Guide

## 1. Netlify / Vercel (Recommended)
Both platforms are similar as they automatically detect Next.js.

### Prerequisites
- A **Neon PostgreSQL** database (or any hosted Postgres).
- **VirusTotal API Key** (for secure file sharing).

### Steps
1. **Push to GitHub**: Push your project to a GitHub repository.
2. **Connect Repo**: In Netlify or Vercel, select "New Project" and connect your repo.
3. **Environment Variables**: Add these in the dashboard:
   - `DATABASE_URL`: Your Postgres connection string.
   - `VIRUSTOTAL_API_KEY`: Your VirusTotal API key.
   - `NEXT_PUBLIC_APP_URL`: Your deployment URL (e.g., `https://your-app.netlify.app`).
4. **Build Settings**:
   - Build Command: `npm run db:push && npm run build`
   - Publish Directory: `.next`
5. **Deploy**: Click Deploy. The database schema will be updated automatically during the build.

---

## 2. Linux VPS (Ubuntu/Debian)

### Prerequisites
- Node.js 20+ installed.
- PM2 (Process Manager) installed (`npm install -g pm2`).

### Steps
1. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd StreamSync
   npm install
   ```
2. **Configure Environment**: Create a `.env` file:
   ```env
   DATABASE_URL=your_postgres_url
   VIRUSTOTAL_API_KEY=your_vt_key
   PORT=5000
   ```
3. **Build & Push DB**:
   ```bash
   npm run db:push
   npm run build
   ```
4. **Start with PM2**:
   ```bash
   pm2 start npm --name "streamsync" -- start
   pm2 save
   ```
5. **Reverse Proxy (Optional but recommended)**: Use Nginx to point domain to port 5000.

---

## 3. Windows Server / PC

### Prerequisites
- Node.js 20+ installed.

### Steps
1. **Clone & Install**:
   ```powershell
   git clone <your-repo-url>
   cd StreamSync
   npm install
   ```
2. **Configure Environment**: Create a `.env` file in the root folder with `DATABASE_URL` and `VIRUSTOTAL_API_KEY`.
3. **Build**:
   ```powershell
   npm run db:push
   npm run build
   ```
4. **Start**:
   ```powershell
   npm start
   ```
   *Note: For production, use `pm2` for Windows or a Windows Service wrapper.*

---

## Chrome Extension
To use the extension with your new deployment:
1. Open `chrome-extension/manifest.json`.
2. Add your new domain to `host_permissions` and `matches`.
3. Load the folder in `chrome://extensions`.
