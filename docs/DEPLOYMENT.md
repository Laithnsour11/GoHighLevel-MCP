# GoHighLevel MCP Server - Deployment Guide

## Overview

This guide covers all deployment options for the GoHighLevel MCP Server, from local development to enterprise production environments.

## Table of Contents

1. [Local Development](#local-development)
2. [Cloud Deployment](#cloud-deployment)
3. [Claude Desktop Integration](#claude-desktop-integration)
4. [Environment Configuration](#environment-configuration)
5. [Monitoring & Maintenance](#monitoring--maintenance)
6. [Troubleshooting](#troubleshooting)

## Local Development

### Prerequisites

- Node.js 18+ (Latest LTS recommended)
- GoHighLevel account with API access
- Valid Private Integrations API key
- Claude Desktop (for MCP integration)

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/mastanley13/GoHighLevel-MCP.git
cd GoHighLevel-MCP

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your credentials

# Build and start
npm run build
npm start
```

### Development Commands

```bash
# Development server with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Start STDIO server for Claude Desktop
npm run start:stdio

# Start HTTP server for web apps
npm run start:http

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Environment Setup

Create a `.env` file with your credentials:

```bash
GHL_API_KEY=your_private_integrations_api_key_here
GHL_BASE_URL=https://services.leadconnectorhq.com
GHL_LOCATION_ID=your_location_id_here
NODE_ENV=development
PORT=8000
```

### Testing Local Setup

```bash
# Test server health
curl http://localhost:8000/health

# List available tools
curl http://localhost:8000/tools

# Test with credentials
curl -X POST http://localhost:8000/execute-tool \
  -H "x-ghl-api-key: your_api_key" \
  -H "x-ghl-location-id: your_location_id" \
  -H "Content-Type: application/json" \
  -d '{"toolName": "search_contacts", "args": {"limit": 5}}'
```

## Cloud Deployment

### Vercel (Recommended)

Vercel provides the best experience for deploying the GoHighLevel MCP Server with automatic HTTPS, global CDN, and zero configuration.

#### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mastanley13/GoHighLevel-MCP)

#### Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add GHL_API_KEY
vercel env add GHL_BASE_URL
vercel env add GHL_LOCATION_ID
vercel env add NODE_ENV
```

#### Vercel Configuration

The project includes a `vercel.json` configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/api/index.js" }
  ]
}
```

### Railway

Railway offers simple deployment with $5 free credit and automatic scaling.

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up

# Set environment variables via dashboard or CLI
railway variables set GHL_API_KEY=your_key
railway variables set GHL_LOCATION_ID=your_location_id
railway variables set NODE_ENV=production
```

#### Railway Configuration

The project includes a `railway.json` configuration:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Render

Render provides free hosting with automatic SSL and GitHub integration.

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node.js
4. Add environment variables in the Render dashboard

### Docker Deployment

#### Build Docker Image

```bash
# Build image
docker build -t ghl-mcp-server .

# Run container
docker run -p 8000:8000 \
  -e GHL_API_KEY=your_key \
  -e GHL_BASE_URL=https://services.leadconnectorhq.com \
  -e GHL_LOCATION_ID=your_location_id \
  -e NODE_ENV=production \
  ghl-mcp-server
```

#### Docker Compose

```yaml
version: '3.8'
services:
  ghl-mcp-server:
    build: .
    ports:
      - "8000:8000"
    environment:
      - GHL_API_KEY=your_private_integrations_api_key
      - GHL_BASE_URL=https://services.leadconnectorhq.com
      - GHL_LOCATION_ID=your_location_id
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

#### Push to Container Registry

```bash
# Docker Hub
docker tag ghl-mcp-server yourusername/ghl-mcp-server:latest
docker push yourusername/ghl-mcp-server:latest

# GitHub Container Registry
docker tag ghl-mcp-server ghcr.io/yourusername/ghl-mcp-server:latest
docker push ghcr.io/yourusername/ghl-mcp-server:latest
```

### NPM Package Deployment

#### Prepare for Publishing

```bash
# Update package.json
npm version patch  # or minor/major

# Build the project
npm run build

# Add shebang to server file
echo '#!/usr/bin/env node' | cat - dist/server.js > temp && mv temp dist/server.js
chmod +x dist/server.js
```

#### Publish to NPM

```bash
# Login to NPM
npm login

# Publish package
npm publish --access public
```

#### Usage as NPM Package

```bash
# Install globally
npm install -g @yourusername/ghl-mcp-server

# Run directly
npx @yourusername/ghl-mcp-server
```

## Claude Desktop Integration

### Configuration File Locations

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### Local Server Configuration

```json
{
  "mcpServers": {
    "ghl-mcp-local": {
      "command": "node",
      "args": ["/absolute/path/to/ghl-mcp-server/dist/server.js"],
      "env": {
        "GHL_API_KEY": "your_private_integrations_api_key",
        "GHL_BASE_URL": "https://services.leadconnectorhq.com",
        "GHL_LOCATION_ID": "your_location_id"
      }
    }
  }
}
```

### NPM Package Configuration

```json
{
  "mcpServers": {
    "ghl-mcp-npm": {
      "command": "npx",
      "args": ["-y", "@yourusername/ghl-mcp-server"],
      "env": {
        "GHL_API_KEY": "your_private_integrations_api_key",
        "GHL_BASE_URL": "https://services.leadconnectorhq.com",
        "GHL_LOCATION_ID": "your_location_id"
      }
    }
  }
}
```

### Docker Configuration

```json
{
  "mcpServers": {
    "ghl-mcp-docker": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "-e", "GHL_API_KEY=your_api_key",
        "-e", "GHL_LOCATION_ID=your_location_id",
        "yourusername/ghl-mcp-server:latest",
        "node", "dist/server.js"
      ]
    }
  }
}
```

### Testing Claude Integration

1. **Restart Claude Desktop** completely after configuration changes
2. **Look for tools icon** (🔨) in the bottom-right corner
3. **Test with simple query**: *"List my GoHighLevel contacts"*
4. **Verify tool availability**: Ask Claude to list available GoHighLevel tools

## Environment Configuration

### Required Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `GHL_API_KEY` | Yes | Private Integrations API key | - |
| `GHL_LOCATION_ID` | Yes | GoHighLevel Location ID | - |
| `GHL_BASE_URL` | No | GoHighLevel API base URL | `https://services.leadconnectorhq.com` |
| `NODE_ENV` | No | Environment mode | `development` |
| `PORT` | No | Server port | `8000` |

### Platform-Specific Configuration

#### Vercel

Set environment variables in the Vercel dashboard or via CLI:

```bash
vercel env add GHL_API_KEY
vercel env add GHL_LOCATION_ID
vercel env add NODE_ENV production
```

#### Railway

Set via Railway dashboard or CLI:

```bash
railway variables set GHL_API_KEY=your_key
railway variables set GHL_LOCATION_ID=your_location_id
railway variables set NODE_ENV=production
```

#### Render

Add environment variables in the Render dashboard under "Environment".

#### Docker

Use environment variables in docker run command or docker-compose.yml:

```bash
docker run -e GHL_API_KEY=your_key -e GHL_LOCATION_ID=your_location_id ghl-mcp-server
```

## Monitoring & Maintenance

### Health Checks

All deployments should implement health checks:

```bash
# Health check endpoint
curl http://your-domain.com/health

# Expected response
{
  "status": "healthy",
  "server": "ghl-mcp-server",
  "version": "1.0.0",
  "tools": { "total": 269 },
  "multiUser": true
}
```

### Logging

The server provides comprehensive logging:

- **Request/Response logging**: All API calls
- **Error logging**: Detailed error information
- **Performance metrics**: Response times and usage stats
- **Security events**: Authentication failures and rate limiting

### Monitoring Setup

#### Basic Monitoring

```bash
# Monitor server uptime
curl -f http://your-domain.com/health || echo "Server down!"

# Check tool availability
curl http://your-domain.com/tools | jq '.count'
```

#### Advanced Monitoring

For production deployments, consider:

- **Uptime monitoring**: Pingdom, UptimeRobot, or StatusCake
- **Error tracking**: Sentry or Rollbar
- **Performance monitoring**: New Relic or DataDog
- **Log aggregation**: LogRocket or Papertrail

### Backup & Recovery

#### Configuration Backup

```bash
# Backup Claude Desktop configuration (macOS)
cp ~/Library/Application\ Support/Claude/claude_desktop_config.json \
   ~/Desktop/claude_config_backup_$(date +%Y%m%d).json

# Backup Claude Desktop configuration (Windows)
copy "%APPDATA%\Claude\claude_desktop_config.json" "%USERPROFILE%\Desktop\claude_config_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.json"

# Backup environment variables
printenv | grep GHL_ > ghl_env_backup.txt
```

#### Recovery Procedure

1. Restore environment variables from backup
2. Redeploy server with backed-up configuration
3. Verify health check endpoint
4. Test tool execution
5. Reconnect Claude Desktop

## Troubleshooting

### Common Issues

#### Server Won't Start

**Error**: "GHL_API_KEY environment variable is required"

**Solution**:
- Ensure .env file exists with valid credentials
- Use Private Integrations API key, not regular API key
- Check that Location ID is correct

#### API Authentication Fails

**Error**: "401 Unauthorized" or "Invalid API key"

**Solution**:
- Verify you're using Private Integrations API key
- Check that all required scopes are enabled
- Ensure Location ID matches your GHL account
- Test credentials with the built-in testing tool

#### Claude Desktop Not Detecting Server

**Issue**: No tools icon appears in Claude Desktop

**Solution**:
- Verify claude_desktop_config.json syntax
- Check file paths are absolute
- Restart Claude Desktop after configuration changes
- Ensure server is running and accessible

#### Tool Execution Timeouts

**Issue**: Tools start but never complete

**Solution**:
- Check network connectivity to GoHighLevel API
- Verify API rate limits aren't exceeded
- Increase timeout settings if needed
- Check server logs for detailed error messages

### Debugging Commands

```bash
# Check server logs
npm run dev

# Test server health
curl http://localhost:8000/health

# List available tools
curl http://localhost:8000/tools

# Test API connection
curl -H "Authorization: Bearer $GHL_API_KEY" \
     https://services.leadconnectorhq.com/locations/

# Check environment variables
echo $GHL_API_KEY
echo $GHL_LOCATION_ID
```

### Log Locations

- **Server Logs**: Console output when running `npm start`
- **Claude Desktop Logs (macOS)**: `~/Library/Logs/Claude/mcp*.log`
- **Claude Desktop Logs (Windows)**: `%APPDATA%\Claude\Logs\mcp*.log`

## Security Considerations

### Best Practices

1. **Use HTTPS**: Always deploy with HTTPS in production
2. **API Key Security**: Never expose API keys in client-side code
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Input Validation**: Validate all user inputs
5. **Regular Updates**: Keep dependencies updated
6. **Monitoring**: Set up alerts for suspicious activity
7. **Least Privilege**: Use minimal required API scopes

### Security Headers

For production deployments, add these security headers:

```javascript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
```

## Performance Optimization

### Caching Strategies

```javascript
// Add connection pooling
const apiClient = new GHLApiClient({
  maxConnections: 10,
  keepAlive: true,
  timeout: 15000
});

// Implement caching
const cache = new Map();
const getCachedResult = (key, fetcher, ttl = 60000) => {
  const now = Date.now();
  if (cache.has(key)) {
    const { value, expires } = cache.get(key);
    if (expires > now) return value;
  }
  const value = fetcher();
  cache.set(key, { value, expires: now + ttl });
  return value;
};
```

### Load Testing

For production deployments, perform load testing:

```bash
# Install autocannon
npm install -g autocannon

# Run load test
autocannon -c 100 -d 30 -p 10 http://localhost:8000/health
```

## Advanced Deployment

### Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ghl-mcp-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ghl-mcp-server
  template:
    metadata:
      labels:
        app: ghl-mcp-server
    spec:
      containers:
      - name: ghl-mcp-server
        image: yourusername/ghl-mcp-server:latest
        ports:
        - containerPort: 8000
        env:
        - name: GHL_API_KEY
          valueFrom:
            secretKeyRef:
              name: ghl-secrets
              key: api-key
        - name: GHL_LOCATION_ID
          valueFrom:
            secretKeyRef:
              name: ghl-secrets
              key: location-id
        - name: NODE_ENV
          value: "production"
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
          requests:
            memory: "256Mi"
            cpu: "250m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
```

### AWS Lambda Deployment

For serverless deployment on AWS Lambda:

1. Create a Lambda function with Node.js 18 runtime
2. Set environment variables for GHL credentials
3. Create API Gateway HTTP API
4. Deploy with the following handler:

```javascript
// lambda.js
const serverless = require('serverless-http');
const app = require('./dist/http-server');

module.exports.handler = serverless(app);
```

### Multi-Region Deployment

For high availability, deploy to multiple regions:

1. Deploy to multiple cloud regions
2. Set up a global load balancer
3. Configure health checks for each region
4. Implement failover routing

## Conclusion

This deployment guide covers all aspects of deploying the GoHighLevel MCP Server, from local development to enterprise production environments. Choose the deployment strategy that best fits your needs and scale as your usage grows.

For additional help, refer to the [Troubleshooting Guide](README.md#troubleshooting) or open an issue on GitHub.

---

*Made with ❤️ for the GoHighLevel community. Transform Claude Desktop into your GoHighLevel automation powerhouse!*