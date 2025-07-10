# GoHighLevel MCP Server - Complete Documentation

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [API Reference](#api-reference)
6. [Tool Categories](#tool-categories)
7. [Authentication](#authentication)
8. [Usage Examples](#usage-examples)
9. [Claude Desktop Integration](#claude-desktop-integration)
10. [Deployment](#deployment)
11. [Multi-User Support](#multi-user-support)
12. [Troubleshooting](#troubleshooting)
13. [Contributing](#contributing)

## Overview

The GoHighLevel MCP Server is a comprehensive Model Context Protocol (MCP) server that connects Claude Desktop to your GoHighLevel CRM with **269+ powerful tools** across **19+ categories**. This integration enables complete automation of your GoHighLevel operations through natural language interactions with Claude.

### Key Features

- ✅ **Multi-user support** with per-request credentials
- ✅ **269+ tools** for complete GoHighLevel automation
- ✅ **Real-time API integration** with comprehensive error handling
- ✅ **Production-ready** with logging and monitoring
- ✅ **Claude Desktop MCP protocol** compliance
- ✅ **Web-based frontend** for onboarding and testing
- ✅ **Comprehensive documentation** and examples

### Architecture

```
Claude Desktop ←→ MCP Protocol ←→ GHL MCP Server ←→ GoHighLevel API
```

## Quick Start

### 1. Get GoHighLevel Credentials

⚠️ **Important**: You need a **Private Integrations API key**, not a regular API key!

1. Login to your GoHighLevel account
2. Navigate to **Settings → Integrations → Private Integrations**
3. Create a new Private Integration with required scopes
4. Copy your **Private API Key** and **Location ID**

### 2. Install and Run

```bash
# Clone the repository
git clone https://github.com/mastanley13/GoHighLevel-MCP.git
cd GoHighLevel-MCP

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Build and start
npm run build
npm start
```

### 3. Access the Frontend

Open your browser to `http://localhost:8000` for the complete onboarding experience.

## Installation

### Prerequisites

- Node.js 18+ (Latest LTS recommended)
- GoHighLevel account with API access
- Valid Private Integrations API key
- Claude Desktop (for MCP integration)

### Local Development

```bash
# Install dependencies
npm install

# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Start STDIO server for Claude Desktop
npm run start:stdio
```

### NPM Package Installation

```bash
# Install globally
npm install -g @yourusername/ghl-mcp-server

# Run directly
npx @yourusername/ghl-mcp-server
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GHL_API_KEY` | Yes | Private Integrations API key |
| `GHL_LOCATION_ID` | Yes | GoHighLevel Location ID |
| `GHL_BASE_URL` | No | API base URL (default: services.leadconnectorhq.com) |
| `NODE_ENV` | No | Environment mode (development/production) |
| `PORT` | No | Server port (default: 8000) |

### Example .env File

```bash
GHL_API_KEY=your_private_integrations_api_key_here
GHL_BASE_URL=https://services.leadconnectorhq.com
GHL_LOCATION_ID=your_location_id_here
NODE_ENV=production
PORT=8000
```

## API Reference

### Base URL

```
http://localhost:8000
```

### Authentication

Provide credentials via headers (recommended) or query parameters:

**Headers (Recommended):**
```
x-ghl-api-key: your_private_integrations_api_key
x-ghl-location-id: your_location_id
```

**Query Parameters:**
```
?apiKey=your_api_key&locationId=your_location_id
```

### Endpoints

#### GET /health

Check server health and status.

**Response:**
```json
{
  "status": "healthy",
  "server": "ghl-mcp-server",
  "version": "1.0.0",
  "tools": { "total": 269 },
  "multiUser": true,
  "hasUserCredentials": false
}
```

#### GET /tools

List all available tools.

**Response:**
```json
{
  "tools": [...],
  "count": 269,
  "userSpecific": true
}
```

#### POST /execute-tool

Execute a specific tool with user credentials.

**Request Body:**
```json
{
  "toolName": "search_contacts",
  "args": {
    "query": "John Doe",
    "limit": 10
  }
}
```

**Response:**
```json
{
  "success": true,
  "result": {...},
  "toolName": "search_contacts",
  "executedAt": "2024-01-01T00:00:00.000Z"
}
```

#### GET /sse

Server-Sent Events endpoint for MCP protocol (used by Claude Desktop).

## Tool Categories

### Contact Management (31 tools)

**Basic Operations:**
- `create_contact`, `search_contacts`, `get_contact`, `update_contact`, `delete_contact`
- `add_contact_tags`, `remove_contact_tags`

**Task Management:**
- `get_contact_tasks`, `create_contact_task`, `update_contact_task`, `delete_contact_task`

**Note Management:**
- `get_contact_notes`, `create_contact_note`, `update_contact_note`, `delete_contact_note`

**Advanced Operations:**
- `upsert_contact`, `get_duplicate_contact`, `bulk_update_contact_tags`
- `add_contact_followers`, `remove_contact_followers`
- `add_contact_to_workflow`, `remove_contact_from_workflow`

### Messaging & Conversations (20 tools)

**Direct Communication:**
- `send_sms`, `send_email`
- `search_conversations`, `get_conversation`, `create_conversation`

**Message Management:**
- `get_message`, `get_email_message`, `upload_message_attachments`
- `update_message_status`, `cancel_scheduled_message`

**Call Features:**
- `get_message_recording`, `get_message_transcription`, `download_transcription`
- `add_inbound_message`, `add_outbound_call`

### Blog Management (7 tools)

- `create_blog_post`, `update_blog_post`, `get_blog_posts`
- `get_blog_sites`, `get_blog_authors`, `get_blog_categories`
- `check_url_slug`

### Opportunity Management (10 tools)

- `search_opportunities`, `get_pipelines`, `create_opportunity`
- `update_opportunity_status`, `delete_opportunity`, `update_opportunity`
- `upsert_opportunity`, `add_opportunity_followers`, `remove_opportunity_followers`

### Calendar & Appointments (14 tools)

- `get_calendar_groups`, `get_calendars`, `create_calendar`
- `get_calendar_events`, `get_free_slots`, `create_appointment`
- `update_appointment`, `delete_appointment`, `create_block_slot`

### Additional Categories

- **Email Marketing** (5 tools)
- **Location Management** (24 tools)
- **Social Media** (17 tools)
- **Media Library** (3 tools)
- **Custom Objects** (9 tools)
- **Payments** (20 tools)
- **Invoices & Billing** (39 tools)
- **And more...**

## Authentication

### Getting Your Credentials

1. **Login to GoHighLevel**
2. **Navigate to Private Integrations**: Settings → Integrations → Private Integrations
3. **Create New Integration** with these required scopes:
   - contacts.readonly & contacts.write
   - conversations.readonly & conversations.write
   - opportunities.readonly & opportunities.write
   - calendars.readonly & calendars.write
   - locations.readonly & locations.write
   - workflows.readonly
   - blogs.readonly & blogs.write
4. **Copy Credentials**: Save your Private API Key and Location ID

### Using Credentials

**Method 1: Headers (Recommended)**
```bash
curl -X POST http://localhost:8000/execute-tool \
  -H "x-ghl-api-key: your_private_api_key" \
  -H "x-ghl-location-id: your_location_id" \
  -H "Content-Type: application/json" \
  -d '{"toolName": "search_contacts", "args": {"query": "John"}}'
```

**Method 2: Query Parameters**
```bash
curl -X POST "http://localhost:8000/execute-tool?apiKey=your_api_key&locationId=your_location_id" \
  -H "Content-Type: application/json" \
  -d '{"toolName": "search_contacts", "args": {"query": "John"}}'
```

## Usage Examples

### Contact Management

**Search Contacts:**
```json
{
  "toolName": "search_contacts",
  "args": {
    "query": "John Doe",
    "limit": 10
  }
}
```

**Create Contact:**
```json
{
  "toolName": "create_contact",
  "args": {
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phone": "+1-555-123-4567",
    "tags": ["lead", "website"]
  }
}
```

### Messaging

**Send SMS:**
```json
{
  "toolName": "send_sms",
  "args": {
    "contactId": "contact_123",
    "message": "Hi! Thanks for your interest. We'll call you soon."
  }
}
```

**Send Email:**
```json
{
  "toolName": "send_email",
  "args": {
    "contactId": "contact_123",
    "subject": "Welcome to Our Service",
    "html": "<h1>Welcome!</h1><p>Thanks for joining us.</p>",
    "emailCc": ["manager@company.com"]
  }
}
```

### Blog Management

**Create Blog Post:**
```json
{
  "toolName": "create_blog_post",
  "args": {
    "title": "10 Tips for Better Customer Service",
    "blogId": "blog_123",
    "content": "<h1>10 Tips</h1><p>Here are our top tips...</p>",
    "description": "Learn how to improve your customer service",
    "imageUrl": "https://example.com/image.jpg",
    "imageAltText": "Customer service tips",
    "urlSlug": "customer-service-tips",
    "author": "author_123",
    "categories": ["cat_123"],
    "status": "PUBLISHED"
  }
}
```

## Claude Desktop Integration

### Configuration File Locations

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### Configuration Content

```json
{
  "mcpServers": {
    "ghl-mcp-server": {
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

### Testing Claude Integration

1. Restart Claude Desktop after configuration
2. Look for 🔨 tools icon in bottom-right
3. Test with: *"List my GoHighLevel contacts"*

## Deployment

### Local Development

```bash
npm run dev    # Development with hot reload
npm start      # Production server
```

### Cloud Deployment

#### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add GHL_API_KEY
vercel env add GHL_LOCATION_ID
```

#### Railway

```bash
# Deploy to Railway
railway login
railway init
railway up
```

#### Docker

```bash
# Build and run
docker build -t ghl-mcp-server .
docker run -p 8000:8000 \
  -e GHL_API_KEY=your_key \
  -e GHL_LOCATION_ID=your_location_id \
  ghl-mcp-server
```

## Multi-User Support

The server supports multiple users with different credentials:

### Per-Request Credentials

Users can provide their own GoHighLevel credentials for each request:

```bash
# Using headers (recommended)
curl -X POST http://localhost:8000/execute-tool \
  -H "x-ghl-api-key: user1_api_key" \
  -H "x-ghl-location-id: user1_location_id" \
  -d '{"toolName": "search_contacts", "args": {}}'

# Using query parameters
curl -X POST "http://localhost:8000/execute-tool?apiKey=user2_api_key&locationId=user2_location_id" \
  -d '{"toolName": "search_contacts", "args": {}}'
```

### Security Features

- ✅ No credential storage on server
- ✅ Per-request authentication
- ✅ Isolated user sessions
- ✅ Comprehensive input validation
- ✅ Rate limiting and error handling

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

### Debugging Commands

```bash
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

## Contributing

We welcome contributions from the GoHighLevel community!

### Development Workflow

```bash
# Fork and clone the repository
git clone https://github.com/your-fork/GoHighLevel-MCP.git

# Create feature branch
git checkout -b feature/amazing-new-tool

# Make your changes with tests
npm test

# Commit and push
git commit -m "Add amazing new tool for [specific functionality]"
git push origin feature/amazing-new-tool

# Open Pull Request with detailed description
```

### Contribution Guidelines

- ✅ Add comprehensive tests for new tools
- ✅ Follow TypeScript best practices
- ✅ Update documentation for new features
- ✅ Ensure all linting passes
- ✅ Include examples in PR description

## Support

- **GitHub Issues**: [Report bugs and request features](https://github.com/mastanley13/GoHighLevel-MCP/issues)
- **Documentation**: [Complete guides and references](https://github.com/mastanley13/GoHighLevel-MCP)
- **GoHighLevel API**: [Official API documentation](https://highlevel.stoplight.io/)
- **MCP Protocol**: [Model Context Protocol specification](https://modelcontextprotocol.io/)

---

*Made with ❤️ for the GoHighLevel community. Transform Claude Desktop into your GoHighLevel automation powerhouse!*