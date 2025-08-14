# Face Off - Complete Deployment Guide

This guide covers deploying the Face Off React.js web application on your own server.

## Package Contents

This download package contains:
- Complete React.js frontend application
- Express.js backend server
- Database schema and configuration
- Deployment scripts and configuration
- Setup instructions for various hosting providers

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (or use in-memory storage for testing)
- OpenAI API key (optional, for AI features)

### Installation
```bash
# 1. Extract the package and navigate to the directory
cd face-off

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Start the application
npm run dev
```

The application will be available at `http://localhost:5000`

## Production Deployment Options

### Option 1: Cloud Platforms (Recommended)

#### Vercel (Easiest)
1. **Upload to GitHub**: Push your code to a GitHub repository
2. **Connect Vercel**: 
   - Sign up at vercel.com
   - Import your GitHub repository
   - Vercel auto-detects the React.js app
3. **Configure Environment Variables**:
   - Add DATABASE_URL, OPENAI_API_KEY, SESSION_SECRET
4. **Deploy**: Automatic deployment on code push

#### Netlify
1. **Build the frontend**:
   ```bash
   npm run build
   ```
2. **Upload**: Drag the `client/dist` folder to Netlify
3. **Backend**: Deploy separately (see VPS option below)

#### Heroku
1. **Install Heroku CLI**
2. **Create app**:
   ```bash
   heroku create your-app-name
   heroku addons:create heroku-postgresql:mini
   ```
3. **Deploy**:
   ```bash
   git push heroku main
   ```

### Option 2: VPS/Dedicated Server

#### Requirements
- Ubuntu 20.04+ or similar Linux distribution
- 1GB+ RAM
- 10GB+ storage
- Domain name (optional but recommended)

#### Server Setup
```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2 (process manager)
sudo npm install -g pm2

# 4. Install PostgreSQL (optional)
sudo apt install postgresql postgresql-contrib

# 5. Create database user
sudo -u postgres createuser --interactive
sudo -u postgres createdb faceoff
```

#### Application Deployment
```bash
# 1. Upload your code to the server
scp -r face-off/ user@your-server:/home/user/

# 2. SSH into server
ssh user@your-server

# 3. Navigate and install
cd face-off
npm install --production

# 4. Set up environment
cp .env.example .env
nano .env  # Edit with your configuration

# 5. Build the frontend
npm run build

# 6. Start with PM2
pm2 start server/index.js --name "face-off"
pm2 startup
pm2 save
```

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/face-off
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 3: Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/faceoff
      - SESSION_SECRET=your-secret-key
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=faceoff
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Deploy with:
```bash
docker-compose up -d
```

## Environment Configuration

### Required Environment Variables
```bash
# Database (use one of these)
DATABASE_URL=postgresql://user:pass@localhost:5432/faceoff
# OR for in-memory storage (development only)
# DATABASE_URL=memory

# Session security
SESSION_SECRET=your-very-secure-random-string

# AI Features (optional)
OPENAI_API_KEY=sk-your-openai-api-key

# Production settings
NODE_ENV=production
PORT=5000
```

### Database Setup

#### PostgreSQL (Recommended for Production)
```bash
# Create database
createdb faceoff

# Set DATABASE_URL
DATABASE_URL=postgresql://username:password@localhost:5432/faceoff
```

#### In-Memory Storage (Development/Testing)
No additional setup required. The app will use in-memory storage automatically.

## Domain and DNS Setup

### Domain Configuration
1. **Purchase Domain**: From providers like Namecheap, GoDaddy, or Cloudflare
2. **DNS Records**:
   - A Record: `@` → Your server IP
   - CNAME Record: `www` → `your-domain.com`

### Cloudflare Setup (Recommended)
1. **Add Site**: Add your domain to Cloudflare
2. **Change Nameservers**: Update at your domain registrar
3. **SSL/TLS**: Set to "Full (Strict)"
4. **Speed**: Enable auto minify and compression

## Monitoring and Maintenance

### Application Monitoring
```bash
# Check PM2 status
pm2 status
pm2 logs face-off

# System monitoring
htop
df -h
```

### Backup Strategy
```bash
# Database backup (if using PostgreSQL)
pg_dump faceoff > backup_$(date +%Y%m%d).sql

# Application backup
tar -czf face-off-backup-$(date +%Y%m%d).tar.gz face-off/
```

### Updates
```bash
# Pull latest code
git pull origin main

# Install new dependencies
npm install

# Rebuild frontend
npm run build

# Restart application
pm2 restart face-off
```

## Security Considerations

### Basic Security
- Use strong passwords for database and server access
- Keep system packages updated
- Configure firewall (ufw) to only allow necessary ports
- Use HTTPS with valid SSL certificates
- Regularly backup your data

### Advanced Security
- Implement rate limiting
- Use fail2ban for SSH protection
- Regular security audits
- Monitor logs for suspicious activity

## Performance Optimization

### Frontend Optimization
- Gzip compression enabled
- Static asset caching
- CDN for global distribution (Cloudflare)
- Image optimization

### Backend Optimization
- Database connection pooling
- Query optimization
- Caching strategies (Redis)
- Load balancing for high traffic

## Troubleshooting

### Common Issues
1. **Port Already in Use**: Change PORT in .env file
2. **Database Connection Failed**: Check DATABASE_URL and ensure database is running
3. **Build Failures**: Check Node.js version compatibility
4. **Permission Errors**: Ensure proper file permissions

### Logs and Debugging
```bash
# Application logs
pm2 logs face-off

# Nginx logs
sudo tail -f /var/log/nginx/error.log

# System logs
journalctl -f
```

## Support and Maintenance

### Regular Tasks
- Monitor disk space and performance
- Update dependencies monthly
- Backup database weekly
- Review and rotate logs
- Monitor for security updates

### Scaling Considerations
- Horizontal scaling with load balancers
- Database sharding for large user bases
- CDN for global content delivery
- Caching layers (Redis/Memcached)

This completes the deployment guide for hosting Face Off on your own infrastructure.