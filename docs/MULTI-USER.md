# GoHighLevel MCP Server - Multi-User Support

## Overview

The GoHighLevel MCP Server supports multiple users with different credentials, allowing each user to connect to their own GoHighLevel account. This document explains how to use and implement multi-user support.

## Table of Contents

1. [How Multi-User Support Works](#how-multi-user-support-works)
2. [Using Multi-User Mode](#using-multi-user-mode)
3. [API Reference](#api-reference)
4. [Security Considerations](#security-considerations)
5. [Implementation Details](#implementation-details)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## How Multi-User Support Works

The server accepts GoHighLevel credentials (API key and Location ID) with each request, rather than relying solely on environment variables. This allows:

1. **Per-request authentication**: Each API call includes user-specific credentials
2. **Isolated user sessions**: No cross-user data access
3. **No credential storage**: Credentials are never stored on the server
4. **Fallback to environment variables**: For backward compatibility

## Using Multi-User Mode

### Method 1: Headers (Recommended)

```bash
curl -X POST http://localhost:8000/execute-tool \
  -H "x-ghl-api-key: your_api_key" \
  -H "x-ghl-location-id: your_location_id" \
  -H "Content-Type: application/json" \
  -d '{
    "toolName": "search_contacts",
    "args": {"query": "John"}
  }'
```

### Method 2: Query Parameters

```bash
curl -X POST "http://localhost:8000/execute-tool?apiKey=your_api_key&locationId=your_location_id" \
  -H "Content-Type: application/json" \
  -d '{
    "toolName": "search_contacts",
    "args": {"query": "John"}
  }'
```

### Checking Multi-User Status

```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy",
  "server": "ghl-mcp-server",
  "version": "1.0.0",
  "multiUser": true,
  "hasUserCredentials": false
}
```

## API Reference

### POST /execute-tool

Execute a tool with user-specific credentials.

**Headers:**
- `x-ghl-api-key` (required): User's GoHighLevel Private Integrations API key
- `x-ghl-location-id` (required): User's GoHighLevel Location ID
- `Content-Type`: `application/json`

**Query Parameters:**
- `apiKey` (alternative to header): User's GoHighLevel API key
- `locationId` (alternative to header): User's GoHighLevel Location ID

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
  "result": {
    "contacts": [...],
    "total": 5
  },
  "toolName": "search_contacts",
  "executedAt": "2024-01-01T00:00:00.000Z"
}
```

### GET /tools

List available tools, optionally with user-specific credentials.

**Headers:**
- `x-ghl-api-key` (optional): User's GoHighLevel API key
- `x-ghl-location-id` (optional): User's GoHighLevel Location ID

**Query Parameters:**
- `apiKey` (optional): User's GoHighLevel API key
- `locationId` (optional): User's GoHighLevel Location ID

**Response:**
```json
{
  "tools": [...],
  "count": 269,
  "userSpecific": true
}
```

## Security Considerations

### Credential Handling

1. **No Storage**: Credentials are never stored on the server
2. **HTTPS Only**: Use HTTPS in production to protect credentials in transit
3. **Headers Preferred**: Use headers instead of query parameters for better security
4. **Minimal Logging**: Credentials are never logged

### Authentication Flow

1. User provides credentials with each request
2. Server creates a temporary client instance for that request
3. Request is executed with user's credentials
4. Client instance is discarded after request completes

### Rate Limiting

To prevent abuse, implement rate limiting:

```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

app.use('/execute-tool', apiLimiter);
```

## Implementation Details

### Client Creation

For each request with user credentials, a new GHLApiClient instance is created:

```typescript
private createUserGHLClient(apiKey: string, locationId: string): GHLApiClient {
  if (!apiKey || !locationId) {
    throw new Error('Both apiKey and locationId are required for user-specific operations');
  }

  return this.initializeGHLClient({ apiKey, locationId });
}
```

### Credential Extraction

Credentials are extracted from headers or query parameters:

```typescript
private extractUserCredentials(req: express.Request): { apiKey?: string; locationId?: string } {
  // Try headers first (preferred for security)
  const headerApiKey = req.headers['x-ghl-api-key'] as string;
  const headerLocationId = req.headers['x-ghl-location-id'] as string;

  // Fallback to query parameters
  const queryApiKey = req.query.apiKey as string;
  const queryLocationId = req.query.locationId as string;

  return {
    apiKey: headerApiKey || queryApiKey,
    locationId: headerLocationId || queryLocationId
  };
}
```

### Tool Execution

Each tool is executed with user-specific credentials:

```typescript
app.post('/execute-tool', async (req, res) => {
  try {
    const { toolName, args } = req.body;
    const credentials = extractUserCredentials(req);
    
    if (!credentials.apiKey || !credentials.locationId) {
      return res.status(400).json({ 
        error: 'Missing credentials',
        message: 'Provide x-ghl-api-key and x-ghl-location-id headers or apiKey and locationId query parameters'
      });
    }
    
    // Create user-specific client
    const userClient = createUserGHLClient(credentials.apiKey, credentials.locationId);
    
    // Create tool instance with user client
    const toolInstance = createToolInstance(toolName, userClient);
    
    // Execute tool
    const result = await toolInstance.executeTool(args);
    
    res.json({
      success: true,
      result,
      toolName,
      executedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Tool execution failed',
      message: error.message
    });
  }
});
```

## Best Practices

### Frontend Integration

When building a frontend application:

1. **Secure Credential Storage**: Store credentials securely (e.g., encrypted localStorage)
2. **HTTPS Only**: Only connect to the server over HTTPS
3. **Minimal Permissions**: Request only the permissions you need
4. **Clear Credentials**: Provide option to clear stored credentials
5. **Session Timeout**: Implement session timeouts for security

Example frontend code:

```javascript
// Secure credential storage
function storeCredentials(apiKey, locationId) {
  // Use a library like secure-ls for encrypted storage
  const secureStorage = new SecureLS({ encodingType: 'aes' });
  secureStorage.set('ghl_credentials', { apiKey, locationId });
}

// Execute tool with stored credentials
async function executeTool(toolName, args) {
  const secureStorage = new SecureLS({ encodingType: 'aes' });
  const credentials = secureStorage.get('ghl_credentials');
  
  if (!credentials) {
    throw new Error('No credentials stored');
  }
  
  const response = await fetch('/execute-tool', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-ghl-api-key': credentials.apiKey,
      'x-ghl-location-id': credentials.locationId
    },
    body: JSON.stringify({ toolName, args })
  });
  
  return response.json();
}
```

### Server-Side Implementation

When implementing multi-user support:

1. **Validate Credentials**: Always validate credentials before use
2. **Isolate User Data**: Ensure no cross-user data access
3. **Rate Limiting**: Implement per-user rate limiting
4. **Error Handling**: Provide clear error messages for credential issues
5. **Logging**: Log authentication failures (without credentials)

## Troubleshooting

### Common Issues

#### Missing Credentials

**Error**: "Missing credentials. Provide x-ghl-api-key and x-ghl-location-id headers or apiKey and locationId query parameters."

**Solution**:
- Ensure both API key and Location ID are provided
- Check header names are correct: `x-ghl-api-key` and `x-ghl-location-id`
- Verify credentials are not empty strings

#### Invalid Credentials

**Error**: "Invalid API key or Location ID"

**Solution**:
- Verify you're using a Private Integrations API key, not a regular API key
- Check that the Location ID is correct
- Ensure API key has required scopes
- Test credentials with the GoHighLevel API directly

#### Cross-Origin Issues

**Error**: "Cross-Origin Request Blocked"

**Solution**:
- Ensure CORS is properly configured on the server
- Add your domain to allowed origins
- Use proper credentials handling in fetch/XHR requests

### Debugging

#### Check Credential Extraction

```javascript
app.use((req, res, next) => {
  const credentials = extractUserCredentials(req);
  console.log('Credentials provided:', {
    hasApiKey: !!credentials.apiKey,
    hasLocationId: !!credentials.locationId
  });
  next();
});
```

#### Test Direct API Access

```bash
curl -H "Authorization: Bearer your_api_key" \
     https://services.leadconnectorhq.com/locations/your_location_id
```

#### Verify Tool Execution

```bash
# Test with explicit credentials
curl -X POST http://localhost:8000/execute-tool \
  -H "x-ghl-api-key: your_api_key" \
  -H "x-ghl-location-id: your_location_id" \
  -H "Content-Type: application/json" \
  -d '{"toolName": "search_contacts", "args": {"limit": 1}}'
```

## Conclusion

Multi-user support enables the GoHighLevel MCP Server to serve multiple users with different GoHighLevel accounts simultaneously. By providing credentials with each request, users can securely access their own data without any credential storage on the server.

For additional help, refer to the [API Reference](API.md) or [Troubleshooting Guide](README.md#troubleshooting).

---

*Made with ❤️ for the GoHighLevel community. Transform Claude Desktop into your GoHighLevel automation powerhouse!*