# Deployment Setup

This document explains how to set up automated deployment to your Ubuntu server using GitHub Actions.

## Prerequisites

1. An Ubuntu server with Docker and Docker Compose installed
2. SSH access to your server
3. Git installed on your server
4. Your repository cloned on the server

## GitHub Secrets Configuration

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

### SSH Configuration
- **`SSH_HOST`**: Your server's IP address or domain (e.g., `123.45.67.89` or `server.example.com`)
- **`SSH_USERNAME`**: SSH username (e.g., `ubuntu` or `root`)
- **`SSH_PRIVATE_KEY`**: Your SSH private key (entire content of `~/.ssh/id_rsa` or similar)
- **`SSH_PORT`**: (Optional) SSH port, defaults to `22`
- **`DEPLOY_PATH`**: (Optional) Path to your project on server, defaults to `~/classtask`

### Database Configuration
- **`POSTGRES_DB`**: Database name (e.g., `classtask`)
- **`POSTGRES_USER`**: Database username (e.g., `classtask_user`)
- **`POSTGRES_PASSWORD`**: Database password (generate a strong password)

### Application Configuration
- **`CLASSTASK_JWT_SECRET`**: JWT secret key (generate a secure random string)
- **`CLASSTASK_WEBHOOK_URL`**: Discord webhook URL (optional)
- **`CLASSTASK_EMAIL_ADDRESS`**: Email address for notifications
- **`CLASSTASK_APP_URL`**: Frontend URL (e.g., `https://classtask.maruf.dev`)
- **`CLASSTASK_APP_ICON`**: Application icon URL
- **`RESEND_API_KEY`**: Resend API key for email service

## Server Setup

1. **Install Docker and Docker Compose on your Ubuntu server:**
   ```bash
   # Update package index
   sudo apt update
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Add your user to docker group
   sudo usermod -aG docker $USER
   
   # Install Docker Compose
   sudo apt install docker compose-plugin
   
   # Verify installation
   docker --version
   docker compose version
   ```

2. **Clone your repository on the server:**
   ```bash
   cd ~
   git clone https://github.com/marufamd/classtask.git
   cd classtask
   ```

3. **Set up SSH key authentication:**
   
   On your local machine:
   ```bash
   # Generate SSH key pair if you don't have one
   ssh-keygen -t ed25519 -C "github-actions"
   
   # Copy public key to server
   ssh-copy-id -i ~/.ssh/id_ed25519.pub user@your-server-ip
   
   # Copy the PRIVATE key content to add as GitHub secret
   cat ~/.ssh/id_ed25519
   ```

## How It Works

The workflow automatically:

1. **Triggers** on push to `main` branch when files in `server/` directory change
2. **Connects** to your Ubuntu server via SSH
3. **Pulls** the latest code from GitHub
4. **Creates** the `.env` file from GitHub secrets
5. **Rebuilds** the Docker images
6. **Restarts** the containers with new code
7. **Verifies** the deployment was successful
8. **Cleans up** old Docker images

## Manual Deployment

You can also trigger deployment manually:
1. Go to Actions tab in your GitHub repository
2. Select "Deploy to Ubuntu Server" workflow
3. Click "Run workflow"

## Monitoring

After deployment, you can monitor your application:

```bash
# Check container status
cd ~/classtask/server
docker compose ps

# View logs
docker compose logs -f server

# View database logs
docker compose logs -f postgres

# Restart services
docker compose restart

# Stop services
docker compose down

# Start services
docker compose up -d
```

## Troubleshooting

### Deployment fails with SSH authentication error
- Verify SSH_PRIVATE_KEY secret contains the correct private key
- Ensure the corresponding public key is in `~/.ssh/authorized_keys` on the server
- Check SSH_HOST and SSH_USERNAME are correct

### Containers fail to start
- Check logs: `docker compose logs`
- Verify all required secrets are set in GitHub
- Ensure .env file is created correctly on the server

### Database connection errors
- Verify PostgreSQL container is running: `docker compose ps`
- Check database credentials in GitHub secrets match
- Review server logs: `docker compose logs server`

## Security Notes

- Never commit the `.env` file to version control
- Use strong passwords for database
- Generate a secure JWT secret (at least 32 random characters)
- Restrict SSH access with firewall rules
- Consider using a dedicated deployment user with limited permissions
- Regularly update Docker images and dependencies
