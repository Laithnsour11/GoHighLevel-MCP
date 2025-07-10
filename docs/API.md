# GoHighLevel MCP Server - API Reference

## Base URL

```
http://localhost:8000
```

## Authentication

The server supports multi-user authentication through two methods:

### Method 1: Headers (Recommended)

```http
x-ghl-api-key: your_private_integrations_api_key
x-ghl-location-id: your_location_id
```

### Method 2: Query Parameters

```
?apiKey=your_api_key&locationId=your_location_id
```

## Endpoints

### Health Check

#### GET /health

Check server health and status.

**Parameters**: None

**Response**:
```json
{
  "status": "healthy",
  "server": "ghl-mcp-server",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "tools": {
    "contact": 31,
    "conversation": 20,
    "blog": 7,
    "opportunity": 10,
    "calendar": 14,
    "email": 5,
    "location": 24,
    "emailISV": 1,
    "socialMedia": 17,
    "media": 3,
    "objects": 9,
    "associations": 10,
    "customFieldsV2": 8,
    "workflows": 1,
    "surveys": 2,
    "store": 18,
    "products": 10,
    "payments": 20,
    "invoices": 39,
    "total": 269
  },
  "multiUser": true,
  "hasUserCredentials": false
}
```

### Tools Management

#### GET /tools

List all available MCP tools.

**Parameters**:
- `apiKey` (query, optional): User's GoHighLevel API key
- `locationId` (query, optional): User's Location ID

**Headers**:
- `x-ghl-api-key` (optional): User's GoHighLevel API key
- `x-ghl-location-id` (optional): User's Location ID

**Response**:
```json
{
  "tools": [
    {
      "name": "search_contacts",
      "description": "Search for contacts with advanced filtering options",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": {
            "type": "string",
            "description": "Search query string"
          },
          "limit": {
            "type": "number",
            "description": "Maximum number of results (default: 25)"
          }
        }
      }
    }
  ],
  "count": 269,
  "userSpecific": true
}
```

### Tool Execution

#### POST /execute-tool

Execute a specific MCP tool with user credentials.

**Parameters**:
- `apiKey` (query, optional): User's GoHighLevel API key
- `locationId` (query, optional): User's Location ID

**Headers**:
- `x-ghl-api-key` (required if not in query): User's GoHighLevel API key
- `x-ghl-location-id` (required if not in query): User's Location ID
- `Content-Type`: `application/json`

**Request Body**:
```json
{
  "toolName": "search_contacts",
  "args": {
    "query": "John Doe",
    "limit": 10
  }
}
```

**Response (Success)**:
```json
{
  "success": true,
  "result": {
    "contacts": [
      {
        "id": "contact_123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "+1-555-123-4567"
      }
    ],
    "total": 1
  },
  "toolName": "search_contacts",
  "executedAt": "2024-01-01T00:00:00.000Z"
}
```

**Response (Error)**:
```json
{
  "error": "Tool execution failed",
  "message": "Invalid API key or insufficient permissions"
}
```

### MCP Protocol

#### GET /sse

Server-Sent Events endpoint for MCP protocol communication (used by Claude Desktop).

**Parameters**: None

**Headers**:
- `Accept`: `text/event-stream`

**Response**: Server-Sent Events stream with MCP protocol messages.

#### POST /sse

Handle MCP protocol JSON-RPC messages.

**Headers**:
- `Content-Type`: `application/json`

**Request Body**: JSON-RPC 2.0 message

**Response**: Server-Sent Events stream with response.

## Tool Categories

### Contact Management Tools (31 tools)

#### Basic Operations
- `create_contact` - Create a new contact
- `search_contacts` - Search contacts with filters
- `get_contact` - Get contact by ID
- `update_contact` - Update contact information
- `delete_contact` - Delete a contact
- `add_contact_tags` - Add tags to contact
- `remove_contact_tags` - Remove tags from contact

#### Task Management
- `get_contact_tasks` - Get all tasks for a contact
- `create_contact_task` - Create a new task
- `get_contact_task` - Get specific task
- `update_contact_task` - Update task details
- `delete_contact_task` - Delete a task
- `update_task_completion` - Mark task as complete/incomplete

#### Note Management
- `get_contact_notes` - Get all notes for a contact
- `create_contact_note` - Create a new note
- `get_contact_note` - Get specific note
- `update_contact_note` - Update note content
- `delete_contact_note` - Delete a note

#### Advanced Operations
- `upsert_contact` - Smart create/update contact
- `get_duplicate_contact` - Check for duplicates
- `get_contacts_by_business` - Get contacts by business
- `get_contact_appointments` - Get contact appointments
- `bulk_update_contact_tags` - Bulk tag operations
- `bulk_update_contact_business` - Bulk business updates
- `add_contact_followers` - Add followers
- `remove_contact_followers` - Remove followers
- `add_contact_to_campaign` - Add to campaign
- `remove_contact_from_campaign` - Remove from campaign
- `remove_contact_from_all_campaigns` - Remove from all campaigns
- `add_contact_to_workflow` - Add to workflow
- `remove_contact_from_workflow` - Remove from workflow

### Messaging & Conversations Tools (20 tools)

#### Direct Communication
- `send_sms` - Send SMS message
- `send_email` - Send email message
- `search_conversations` - Search conversations
- `get_conversation` - Get conversation details
- `create_conversation` - Create new conversation
- `update_conversation` - Update conversation
- `delete_conversation` - Delete conversation
- `get_recent_messages` - Get recent messages

#### Message Management
- `get_email_message` - Get email message details
- `get_message` - Get message details
- `upload_message_attachments` - Upload attachments
- `update_message_status` - Update delivery status

#### Manual Message Creation
- `add_inbound_message` - Add inbound message
- `add_outbound_call` - Add outbound call record

#### Call Features
- `get_message_recording` - Get call recording
- `get_message_transcription` - Get call transcription
- `download_transcription` - Download transcription

#### Scheduling
- `cancel_scheduled_message` - Cancel scheduled message
- `cancel_scheduled_email` - Cancel scheduled email

#### Live Chat
- `live_chat_typing` - Send typing indicator

### Blog Management Tools (7 tools)

- `create_blog_post` - Create new blog post
- `update_blog_post` - Update existing post
- `get_blog_posts` - List blog posts
- `get_blog_sites` - Get blog sites
- `get_blog_authors` - Get blog authors
- `get_blog_categories` - Get blog categories
- `check_url_slug` - Check URL slug availability

### Opportunity Management Tools (10 tools)

- `search_opportunities` - Search opportunities
- `get_pipelines` - Get sales pipelines
- `get_opportunity` - Get opportunity details
- `create_opportunity` - Create new opportunity
- `update_opportunity_status` - Update status
- `delete_opportunity` - Delete opportunity
- `update_opportunity` - Update opportunity
- `upsert_opportunity` - Smart create/update
- `add_opportunity_followers` - Add followers
- `remove_opportunity_followers` - Remove followers

### Calendar & Appointments Tools (14 tools)

- `get_calendar_groups` - Get calendar groups
- `get_calendars` - List calendars
- `create_calendar` - Create new calendar
- `get_calendar` - Get calendar details
- `update_calendar` - Update calendar
- `delete_calendar` - Delete calendar
- `get_calendar_events` - Get events
- `get_free_slots` - Check availability
- `create_appointment` - Book appointment
- `get_appointment` - Get appointment details
- `update_appointment` - Update appointment
- `delete_appointment` - Cancel appointment
- `create_block_slot` - Block time slot
- `update_block_slot` - Update blocked slot

### Additional Tool Categories

- **Email Marketing** (5 tools)
- **Location Management** (24 tools)
- **Email Verification** (1 tool)
- **Social Media** (17 tools)
- **Media Library** (3 tools)
- **Custom Objects** (9 tools)
- **Associations** (10 tools)
- **Custom Fields V2** (8 tools)
- **Workflows** (1 tool)
- **Surveys** (2 tools)
- **Store Management** (18 tools)
- **Products** (10 tools)
- **Payments** (20 tools)
- **Invoices & Billing** (39 tools)

## Error Handling

### Error Response Format

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Common Error Codes

- `MISSING_CREDENTIALS` - API key or Location ID not provided
- `INVALID_CREDENTIALS` - Invalid API key or Location ID
- `TOOL_NOT_FOUND` - Requested tool does not exist
- `INVALID_ARGUMENTS` - Tool arguments are invalid
- `API_ERROR` - GoHighLevel API error
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INTERNAL_ERROR` - Server internal error

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid credentials)
- `404` - Not Found (tool or resource not found)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Rate Limiting

The server respects GoHighLevel API rate limits and implements:

- Request queuing for burst protection
- Exponential backoff for failed requests
- Per-user rate limiting
- Graceful degradation under load

## Examples

### Search Contacts

```bash
curl -X POST http://localhost:8000/execute-tool \
  -H "x-ghl-api-key: your_api_key" \
  -H "x-ghl-location-id: your_location_id" \
  -H "Content-Type: application/json" \
  -d '{
    "toolName": "search_contacts",
    "args": {
      "query": "John Doe",
      "limit": 10
    }
  }'
```

### Send SMS

```bash
curl -X POST http://localhost:8000/execute-tool \
  -H "x-ghl-api-key: your_api_key" \
  -H "x-ghl-location-id: your_location_id" \
  -H "Content-Type: application/json" \
  -d '{
    "toolName": "send_sms",
    "args": {
      "contactId": "contact_123",
      "message": "Hello! Thanks for your interest."
    }
  }'
```

### Create Blog Post

```bash
curl -X POST http://localhost:8000/execute-tool \
  -H "x-ghl-api-key: your_api_key" \
  -H "x-ghl-location-id: your_location_id" \
  -H "Content-Type: application/json" \
  -d '{
    "toolName": "create_blog_post",
    "args": {
      "title": "How to Improve Customer Service",
      "blogId": "blog_123",
      "content": "<h1>Tips for Better Service</h1><p>Here are our recommendations...</p>",
      "description": "Learn effective customer service strategies",
      "imageUrl": "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
      "imageAltText": "Customer service representative",
      "urlSlug": "improve-customer-service",
      "author": "author_123",
      "categories": ["cat_123"],
      "status": "PUBLISHED"
    }
  }'
```

## SDK Integration

### JavaScript/TypeScript

```typescript
class GHLMCPClient {
  constructor(
    private apiKey: string,
    private locationId: string,
    private baseUrl: string = 'http://localhost:8000'
  ) {}

  async executeTool(toolName: string, args: any) {
    const response = await fetch(`${this.baseUrl}/execute-tool`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ghl-api-key': this.apiKey,
        'x-ghl-location-id': this.locationId
      },
      body: JSON.stringify({ toolName, args })
    });

    if (!response.ok) {
      throw new Error(`Tool execution failed: ${response.statusText}`);
    }

    return response.json();
  }

  async searchContacts(query: string, limit: number = 25) {
    return this.executeTool('search_contacts', { query, limit });
  }

  async sendSMS(contactId: string, message: string) {
    return this.executeTool('send_sms', { contactId, message });
  }
}

// Usage
const client = new GHLMCPClient('your_api_key', 'your_location_id');
const contacts = await client.searchContacts('John Doe');
```

### Python

```python
import requests
import json

class GHLMCPClient:
    def __init__(self, api_key: str, location_id: str, base_url: str = "http://localhost:8000"):
        self.api_key = api_key
        self.location_id = location_id
        self.base_url = base_url
        self.headers = {
            'Content-Type': 'application/json',
            'x-ghl-api-key': api_key,
            'x-ghl-location-id': location_id
        }

    def execute_tool(self, tool_name: str, args: dict):
        response = requests.post(
            f"{self.base_url}/execute-tool",
            headers=self.headers,
            json={"toolName": tool_name, "args": args}
        )
        response.raise_for_status()
        return response.json()

    def search_contacts(self, query: str, limit: int = 25):
        return self.execute_tool('search_contacts', {'query': query, 'limit': limit})

    def send_sms(self, contact_id: str, message: str):
        return self.execute_tool('send_sms', {'contactId': contact_id, 'message': message})

# Usage
client = GHLMCPClient('your_api_key', 'your_location_id')
contacts = client.search_contacts('John Doe')
```

---

*For more examples and detailed tool documentation, visit the [complete documentation](README.md).*