# SinoNexus Deployment Guide (VPS)

This guide explains how to host SinoNexus on a private VPS (DigitalOcean, Linode, etc.) using Node.js and SQLite.

## 1. Server Preparation
- **OS:** Ubuntu 22.04 or 24.04
- **Software:** Node.js 20+, Git

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 2. Deployment Steps
1. **Clone Code:** `git clone <your-repo-url>`
2. **Install:** `npm install`
3. **Build:** `npm run build`
4. **Env:** Create `.env` file with:
   - `GEMINI_API_KEY`
   - `ADMIN_KEY`
   - `NODE_ENV=production`

## 3. Process Management
We use PM2 to keep the server running 24/7.
```bash
sudo npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

## 4. Nginx Configuration (SSL)
To point `sinonexus.ai` to this server, use Nginx as a reverse proxy.

```nginx
server {
    server_name sinonexus.ai;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 5. Database Backups
Since we use SQLite, your entire database is the file `sinonexus.db`. 
**To backup:** Simply copy this file to a safe location.
**To migrate:** Move this file to your new server.
