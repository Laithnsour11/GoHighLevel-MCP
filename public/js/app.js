// GoHighLevel MCP Server Frontend Application

// Global state
let currentSection = 'onboarding';
let serverStatus = null;
let availableTools = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    // Check server status
    await checkServerStatus();
    
    // Load available tools
    await loadAvailableTools();
    
    // Show default section
    showSection('onboarding');
    
    // Initialize documentation
    initializeDocumentation();
}

// Navigation functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Hide hero if not on main page
    const hero = document.getElementById('hero');
    if (sectionName !== 'onboarding') {
        hero.classList.add('hidden');
    } else {
        hero.classList.remove('hidden');
    }
    
    // Show selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    // Update navigation
    updateNavigation(sectionName);
    
    currentSection = sectionName;
    
    // Load section-specific content
    if (sectionName === 'tools') {
        renderToolsGrid();
    }
}

function updateNavigation(activeSection) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-indigo-600', 'bg-indigo-50');
        btn.classList.add('text-gray-700');
    });
    
    // Find and highlight active nav button
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        const btnText = btn.textContent.toLowerCase();
        if ((activeSection === 'onboarding' && btnText.includes('started')) ||
            (activeSection === 'tools' && btnText.includes('tools')) ||
            (activeSection === 'docs' && btnText.includes('documentation')) ||
            (activeSection === 'testing' && btnText.includes('test'))) {
            btn.classList.add('text-indigo-600', 'bg-indigo-50');
            btn.classList.remove('text-gray-700');
        }
    });
}

// Server status and health check
async function checkServerStatus() {
    try {
        const response = await fetch('/health');
        serverStatus = await response.json();
        
        // Update UI based on server status
        updateServerStatusUI();
    } catch (error) {
        console.error('Failed to check server status:', error);
        serverStatus = { status: 'error', message: 'Server unreachable' };
        updateServerStatusUI();
    }
}

function updateServerStatusUI() {
    // Add status indicator to navigation or hero section
    const statusIndicator = document.createElement('div');
    statusIndicator.className = 'fixed top-4 right-4 z-50 px-3 py-1 rounded-full text-sm font-medium';
    
    if (serverStatus && serverStatus.status === 'healthy') {
        statusIndicator.className += ' bg-green-100 text-green-800';
        statusIndicator.innerHTML = '<i class="fas fa-check-circle mr-1"></i>Server Online';
    } else {
        statusIndicator.className += ' bg-red-100 text-red-800';
        statusIndicator.innerHTML = '<i class="fas fa-exclamation-circle mr-1"></i>Server Offline';
    }
    
    document.body.appendChild(statusIndicator);
}

// Tools management
async function loadAvailableTools() {
    try {
        const response = await fetch('/tools');
        const data = await response.json();
        availableTools = data.tools || [];
        
        // Update tool count in UI
        updateToolCount();
    } catch (error) {
        console.error('Failed to load tools:', error);
        availableTools = [];
    }
}

function updateToolCount() {
    const toolCountElements = document.querySelectorAll('.tool-count');
    toolCountElements.forEach(element => {
        element.textContent = availableTools.length;
    });
}

function renderToolsGrid() {
    const toolsGrid = document.getElementById('tools-grid');
    if (!toolsGrid) return;
    
    // Group tools by category
    const toolsByCategory = groupToolsByCategory(availableTools);
    
    toolsGrid.innerHTML = '';
    
    Object.entries(toolsByCategory).forEach(([category, tools]) => {
        const categoryCard = createCategoryCard(category, tools);
        toolsGrid.appendChild(categoryCard);
    });
}

function groupToolsByCategory(tools) {
    const categories = {
        'Contact Management': [],
        'Messaging & Conversations': [],
        'Blog Management': [],
        'Opportunity Management': [],
        'Calendar & Appointments': [],
        'Email Marketing': [],
        'Location Management': [],
        'Social Media': [],
        'Media Library': [],
        'Custom Objects': [],
        'Payments': [],
        'Invoices': [],
        'Other': []
    };
    
    tools.forEach(tool => {
        const toolName = tool.name.toLowerCase();
        
        if (toolName.includes('contact')) {
            categories['Contact Management'].push(tool);
        } else if (toolName.includes('conversation') || toolName.includes('sms') || toolName.includes('email') && !toolName.includes('template')) {
            categories['Messaging & Conversations'].push(tool);
        } else if (toolName.includes('blog')) {
            categories['Blog Management'].push(tool);
        } else if (toolName.includes('opportunity') || toolName.includes('pipeline')) {
            categories['Opportunity Management'].push(tool);
        } else if (toolName.includes('calendar') || toolName.includes('appointment')) {
            categories['Calendar & Appointments'].push(tool);
        } else if (toolName.includes('email') && toolName.includes('template')) {
            categories['Email Marketing'].push(tool);
        } else if (toolName.includes('location')) {
            categories['Location Management'].push(tool);
        } else if (toolName.includes('social')) {
            categories['Social Media'].push(tool);
        } else if (toolName.includes('media')) {
            categories['Media Library'].push(tool);
        } else if (toolName.includes('object')) {
            categories['Custom Objects'].push(tool);
        } else if (toolName.includes('payment') || toolName.includes('order') || toolName.includes('transaction')) {
            categories['Payments'].push(tool);
        } else if (toolName.includes('invoice') || toolName.includes('estimate')) {
            categories['Invoices'].push(tool);
        } else {
            categories['Other'].push(tool);
        }
    });
    
    // Remove empty categories
    Object.keys(categories).forEach(key => {
        if (categories[key].length === 0) {
            delete categories[key];
        }
    });
    
    return categories;
}

function createCategoryCard(category, tools) {
    const card = document.createElement('div');
    card.className = 'card-hover bg-white p-6 rounded-lg shadow-lg';
    
    const iconMap = {
        'Contact Management': 'fas fa-users',
        'Messaging & Conversations': 'fas fa-comments',
        'Blog Management': 'fas fa-blog',
        'Opportunity Management': 'fas fa-chart-line',
        'Calendar & Appointments': 'fas fa-calendar',
        'Email Marketing': 'fas fa-envelope',
        'Location Management': 'fas fa-map-marker-alt',
        'Social Media': 'fas fa-share-alt',
        'Media Library': 'fas fa-photo-video',
        'Custom Objects': 'fas fa-cubes',
        'Payments': 'fas fa-credit-card',
        'Invoices': 'fas fa-file-invoice',
        'Other': 'fas fa-tools'
    };
    
    card.innerHTML = `
        <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <i class="${iconMap[category] || 'fas fa-tools'} text-indigo-600 text-xl"></i>
            </div>
            <div>
                <h3 class="text-lg font-semibold text-gray-900">${category}</h3>
                <p class="text-sm text-gray-600">${tools.length} tools available</p>
            </div>
        </div>
        <div class="space-y-2 max-h-48 overflow-y-auto">
            ${tools.map(tool => `
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span class="text-sm font-medium text-gray-700">${tool.name}</span>
                    <button onclick="showToolDetails('${tool.name}')" class="text-indigo-600 hover:text-indigo-800 text-xs">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            `).join('')}
        </div>
    `;
    
    return card;
}

function showToolDetails(toolName) {
    const tool = availableTools.find(t => t.name === toolName);
    if (!tool) return;
    
    // Create modal for tool details
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-900">${tool.name}</h3>
                <button onclick="document.body.removeChild(this.closest('.fixed'))" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <p class="text-gray-600 mb-4">${tool.description}</p>
            <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold mb-2">Input Schema:</h4>
                <pre class="text-sm text-gray-700 overflow-x-auto">${JSON.stringify(tool.inputSchema, null, 2)}</pre>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Onboarding functions
function showCredentialsGuide() {
    const guide = document.getElementById('credentials-guide');
    guide.classList.toggle('hidden');
}

function showClaudeConfig() {
    const config = document.getElementById('claude-config');
    config.classList.toggle('hidden');
}

// Documentation functions
function initializeDocumentation() {
    showDocSection('overview');
}

function showDocSection(section) {
    // Update navigation
    document.querySelectorAll('.doc-nav-btn').forEach(btn => {
        btn.className = 'doc-nav-btn bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300';
    });
    
    event.target.className = 'doc-nav-btn bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700';
    
    // Load content
    const content = getDocumentationContent(section);
    document.getElementById('doc-content').innerHTML = content;
}

function getDocumentationContent(section) {
    const content = {
        'overview': `
            <h3 class="text-2xl font-bold mb-6">Overview</h3>
            <div class="prose max-w-none">
                <p class="text-lg text-gray-600 mb-6">
                    The GoHighLevel MCP Server is a comprehensive integration that connects Claude Desktop 
                    to your GoHighLevel CRM with 269+ powerful tools across 19+ categories.
                </p>
                
                <h4 class="text-xl font-semibold mb-4">Key Features</h4>
                <ul class="space-y-2 mb-6">
                    <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> Multi-user support with per-request credentials</li>
                    <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> 269+ tools for complete GoHighLevel automation</li>
                    <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> Real-time API integration with error handling</li>
                    <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> Production-ready with comprehensive logging</li>
                    <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> Claude Desktop MCP protocol compliance</li>
                </ul>
                
                <h4 class="text-xl font-semibold mb-4">Tool Categories</h4>
                <div class="grid md:grid-cols-2 gap-4">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h5 class="font-semibold mb-2">Contact Management (31 tools)</h5>
                        <p class="text-sm text-gray-600">Create, search, update contacts, manage tags, tasks, notes, and relationships</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h5 class="font-semibold mb-2">Messaging (20 tools)</h5>
                        <p class="text-sm text-gray-600">Send SMS/email, manage conversations, handle attachments and recordings</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h5 class="font-semibold mb-2">Blog Management (7 tools)</h5>
                        <p class="text-sm text-gray-600">Create posts, manage sites, authors, categories with SEO optimization</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h5 class="font-semibold mb-2">Opportunities (10 tools)</h5>
                        <p class="text-sm text-gray-600">Manage sales pipeline, create opportunities, track progress</p>
                    </div>
                </div>
            </div>
        `,
        'api-reference': `
            <h3 class="text-2xl font-bold mb-6">API Reference</h3>
            <div class="space-y-8">
                <div>
                    <h4 class="text-xl font-semibold mb-4">Base URL</h4>
                    <div class="code-block">
                        <code>http://localhost:8000</code>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-xl font-semibold mb-4">Authentication</h4>
                    <p class="mb-4">Provide credentials via headers (recommended) or query parameters:</p>
                    <div class="code-block mb-4">
<pre>Headers:
x-ghl-api-key: your_private_integrations_api_key
x-ghl-location-id: your_location_id

Query Parameters:
?apiKey=your_api_key&locationId=your_location_id</pre>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-xl font-semibold mb-4">Endpoints</h4>
                    
                    <div class="space-y-6">
                        <div class="border-l-4 border-blue-500 pl-4">
                            <h5 class="font-semibold text-lg">GET /health</h5>
                            <p class="text-gray-600 mb-2">Check server health and status</p>
                            <div class="code-block">
<pre>Response:
{
  "status": "healthy",
  "server": "ghl-mcp-server",
  "version": "1.0.0",
  "tools": { "total": 269 },
  "multiUser": true
}</pre>
                            </div>
                        </div>
                        
                        <div class="border-l-4 border-green-500 pl-4">
                            <h5 class="font-semibold text-lg">GET /tools</h5>
                            <p class="text-gray-600 mb-2">List all available tools</p>
                            <div class="code-block">
<pre>Response:
{
  "tools": [...],
  "count": 269,
  "userSpecific": true
}</pre>
                            </div>
                        </div>
                        
                        <div class="border-l-4 border-purple-500 pl-4">
                            <h5 class="font-semibold text-lg">POST /execute-tool</h5>
                            <p class="text-gray-600 mb-2">Execute a specific tool with user credentials</p>
                            <div class="code-block">
<pre>Request Body:
{
  "toolName": "search_contacts",
  "args": {
    "query": "John Doe",
    "limit": 10
  }
}

Response:
{
  "success": true,
  "result": {...},
  "toolName": "search_contacts",
  "executedAt": "2024-01-01T00:00:00.000Z"
}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        'authentication': `
            <h3 class="text-2xl font-bold mb-6">Authentication</h3>
            <div class="space-y-6">
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <i class="fas fa-exclamation-triangle text-yellow-400"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-yellow-700">
                                <strong>Important:</strong> You must use a <strong>Private Integrations API key</strong>, not a regular API key!
                            </p>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-xl font-semibold mb-4">Getting Your Credentials</h4>
                    <ol class="space-y-3">
                        <li class="flex items-start">
                            <span class="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3 mt-1">1</span>
                            <div>
                                <p class="font-medium">Login to GoHighLevel</p>
                                <p class="text-gray-600 text-sm">Access your GoHighLevel account dashboard</p>
                            </div>
                        </li>
                        <li class="flex items-start">
                            <span class="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3 mt-1">2</span>
                            <div>
                                <p class="font-medium">Navigate to Private Integrations</p>
                                <p class="text-gray-600 text-sm">Go to Settings → Integrations → Private Integrations</p>
                            </div>
                        </li>
                        <li class="flex items-start">
                            <span class="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3 mt-1">3</span>
                            <div>
                                <p class="font-medium">Create New Integration</p>
                                <p class="text-gray-600 text-sm">Set up a new private integration with required scopes</p>
                            </div>
                        </li>
                        <li class="flex items-start">
                            <span class="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3 mt-1">4</span>
                            <div>
                                <p class="font-medium">Copy Credentials</p>
                                <p class="text-gray-600 text-sm">Save your Private API Key and Location ID</p>
                            </div>
                        </li>
                    </ol>
                </div>
                
                <div>
                    <h4 class="text-xl font-semibold mb-4">Required Scopes</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h5 class="font-semibold mb-2">Core Scopes</h5>
                            <ul class="text-sm space-y-1">
                                <li>• contacts.readonly</li>
                                <li>• contacts.write</li>
                                <li>• conversations.readonly</li>
                                <li>• conversations.write</li>
                                <li>• opportunities.readonly</li>
                                <li>• opportunities.write</li>
                            </ul>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h5 class="font-semibold mb-2">Additional Scopes</h5>
                            <ul class="text-sm space-y-1">
                                <li>• calendars.readonly</li>
                                <li>• calendars.write</li>
                                <li>• locations.readonly</li>
                                <li>• workflows.readonly</li>
                                <li>• blogs.readonly</li>
                                <li>• blogs.write</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-xl font-semibold mb-4">Using Credentials</h4>
                    <p class="mb-4">You can provide credentials in two ways:</p>
                    
                    <div class="space-y-4">
                        <div>
                            <h5 class="font-semibold mb-2">Method 1: Headers (Recommended)</h5>
                            <div class="code-block">
<pre>curl -X POST http://localhost:8000/execute-tool \\
  -H "x-ghl-api-key: your_private_api_key" \\
  -H "x-ghl-location-id: your_location_id" \\
  -H "Content-Type: application/json" \\
  -d '{"toolName": "search_contacts", "args": {"query": "John"}}'</pre>
                            </div>
                        </div>
                        
                        <div>
                            <h5 class="font-semibold mb-2">Method 2: Query Parameters</h5>
                            <div class="code-block">
<pre>curl -X POST "http://localhost:8000/execute-tool?apiKey=your_api_key&locationId=your_location_id" \\
  -H "Content-Type: application/json" \\
  -d '{"toolName": "search_contacts", "args": {"query": "John"}}'</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        'examples': `
            <h3 class="text-2xl font-bold mb-6">Usage Examples</h3>
            <div class="space-y-8">
                <div>
                    <h4 class="text-xl font-semibold mb-4">Contact Management</h4>
                    
                    <div class="space-y-4">
                        <div>
                            <h5 class="font-semibold mb-2">Search Contacts</h5>
                            <div class="code-block">
<pre>POST /execute-tool
{
  "toolName": "search_contacts",
  "args": {
    "query": "John Doe",
    "limit": 10
  }
}</pre>
                            </div>
                        </div>
                        
                        <div>
                            <h5 class="font-semibold mb-2">Create Contact</h5>
                            <div class="code-block">
<pre>POST /execute-tool
{
  "toolName": "create_contact",
  "args": {
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phone": "+1-555-123-4567",
    "tags": ["lead", "website"]
  }
}</pre>
                            </div>
                        </div>
                        
                        <div>
                            <h5 class="font-semibold mb-2">Add Contact Tags</h5>
                            <div class="code-block">
<pre>POST /execute-tool
{
  "toolName": "add_contact_tags",
  "args": {
    "contactId": "contact_123",
    "tags": ["vip", "premium"]
  }
}</pre>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-xl font-semibold mb-4">Messaging</h4>
                    
                    <div class="space-y-4">
                        <div>
                            <h5 class="font-semibold mb-2">Send SMS</h5>
                            <div class="code-block">
<pre>POST /execute-tool
{
  "toolName": "send_sms",
  "args": {
    "contactId": "contact_123",
    "message": "Hi! Thanks for your interest. We'll call you soon."
  }
}</pre>
                            </div>
                        </div>
                        
                        <div>
                            <h5 class="font-semibold mb-2">Send Email</h5>
                            <div class="code-block">
<pre>POST /execute-tool
{
  "toolName": "send_email",
  "args": {
    "contactId": "contact_123",
    "subject": "Welcome to Our Service",
    "html": "<h1>Welcome!</h1><p>Thanks for joining us.</p>",
    "emailCc": ["manager@company.com"]
  }
}</pre>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-xl font-semibold mb-4">Blog Management</h4>
                    
                    <div class="space-y-4">
                        <div>
                            <h5 class="font-semibold mb-2">Create Blog Post</h5>
                            <div class="code-block">
<pre>POST /execute-tool
{
  "toolName": "create_blog_post",
  "args": {
    "title": "10 Tips for Better Customer Service",
    "blogId": "blog_123",
    "content": "<h1>10 Tips for Better Customer Service</h1><p>Here are our top tips...</p>",
    "description": "Learn how to improve your customer service",
    "imageUrl": "https://example.com/image.jpg",
    "imageAltText": "Customer service tips",
    "urlSlug": "customer-service-tips",
    "author": "author_123",
    "categories": ["cat_123"],
    "status": "PUBLISHED"
  }
}</pre>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-xl font-semibold mb-4">Opportunity Management</h4>
                    
                    <div class="space-y-4">
                        <div>
                            <h5 class="font-semibold mb-2">Create Opportunity</h5>
                            <div class="code-block">
<pre>POST /execute-tool
{
  "toolName": "create_opportunity",
  "args": {
    "name": "Website Redesign Project",
    "pipelineId": "pipeline_123",
    "contactId": "contact_123",
    "monetaryValue": 5000,
    "status": "open"
  }
}</pre>
                            </div>
                        </div>
                        
                        <div>
                            <h5 class="font-semibold mb-2">Search Opportunities</h5>
                            <div class="code-block">
<pre>POST /execute-tool
{
  "toolName": "search_opportunities",
  "args": {
    "pipelineId": "pipeline_123",
    "status": "open",
    "limit": 20
  }
}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        'deployment': `
            <h3 class="text-2xl font-bold mb-6">Deployment Guide</h3>
            <div class="space-y-8">
                <div>
                    <h4 class="text-xl font-semibold mb-4">Local Development</h4>
                    <div class="space-y-4">
                        <div>
                            <h5 class="font-semibold mb-2">Prerequisites</h5>
                            <ul class="space-y-1 text-gray-600">
                                <li>• Node.js 18+ (Latest LTS recommended)</li>
                                <li>• GoHighLevel account with API access</li>
                                <li>• Valid Private Integrations API key</li>
                                <li>• Claude Desktop (for MCP integration)</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h5 class="font-semibold mb-2">Installation</h5>
                            <div class="code-block">
<pre># Clone the repository
git clone https://github.com/mastanley13/GoHighLevel-MCP.git
cd GoHighLevel-MCP

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Configure your GHL credentials in .env

# Build and start
npm run build
npm start</pre>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-xl font-semibold mb-4">Cloud Deployment</h4>
                    
                    <div class="space-y-6">
                        <div>
                            <h5 class="font-semibold mb-2">Vercel (Recommended)</h5>
                            <div class="code-block mb-2">
<pre># Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add GHL_API_KEY
vercel env add GHL_LOCATION_ID
vercel env add NODE_ENV</pre>
                            </div>
                            <p class="text-sm text-gray-600">Vercel provides free hosting with automatic HTTPS and global CDN.</p>
                        </div>
                        
                        <div>
                            <h5 class="font-semibold mb-2">Railway</h5>
                            <div class="code-block mb-2">
<pre># Deploy to Railway
railway login
railway init
railway up

# Set environment variables via dashboard</pre>
                            </div>
                            <p class="text-sm text-gray-600">Railway offers $5 free credit and simple deployment.</p>
                        </div>
                        
                        <div>
                            <h5 class="font-semibold mb-2">Docker</h5>
                            <div class="code-block mb-2">
<pre># Build Docker image
docker build -t ghl-mcp-server .

# Run container
docker run -p 8000:8000 \\
  -e GHL_API_KEY=your_key \\
  -e GHL_LOCATION_ID=your_location_id \\
  ghl-mcp-server</pre>
                            </div>
                            <p class="text-sm text-gray-600">Containerized deployment for any cloud provider.</p>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-xl font-semibold mb-4">Claude Desktop Integration</h4>
                    <p class="mb-4">Add this configuration to your Claude Desktop settings:</p>
                    
                    <div class="code-block">
<pre>{
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
}</pre>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-xl font-semibold mb-4">Environment Variables</h4>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b">
                                    <th class="text-left py-2">Variable</th>
                                    <th class="text-left py-2">Required</th>
                                    <th class="text-left py-2">Description</th>
                                </tr>
                            </thead>
                            <tbody class="space-y-2">
                                <tr class="border-b">
                                    <td class="py-2 font-mono">GHL_API_KEY</td>
                                    <td class="py-2">Yes</td>
                                    <td class="py-2">Private Integrations API key</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="py-2 font-mono">GHL_LOCATION_ID</td>
                                    <td class="py-2">Yes</td>
                                    <td class="py-2">GoHighLevel Location ID</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="py-2 font-mono">GHL_BASE_URL</td>
                                    <td class="py-2">No</td>
                                    <td class="py-2">API base URL (default: services.leadconnectorhq.com)</td>
                                </tr>
                                <tr>
                                    <td class="py-2 font-mono">NODE_ENV</td>
                                    <td class="py-2">No</td>
                                    <td class="py-2">Environment mode (development/production)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `,
        'troubleshooting': `
            <h3 class="text-2xl font-bold mb-6">Troubleshooting</h3>
            <div class="space-y-8">
                <div>
                    <h4 class="text-xl font-semibold mb-4">Common Issues</h4>
                    
                    <div class="space-y-6">
                        <div class="border-l-4 border-red-500 pl-4">
                            <h5 class="font-semibold text-lg mb-2">Server Won't Start</h5>
                            <p class="text-gray-600 mb-2"><strong>Error:</strong> "GHL_API_KEY environment variable is required"</p>
                            <div class="bg-gray-50 p-3 rounded">
                                <p class="text-sm"><strong>Solution:</strong></p>
                                <ul class="text-sm space-y-1 mt-1">
                                    <li>• Ensure .env file exists with valid credentials</li>
                                    <li>• Use Private Integrations API key, not regular API key</li>
                                    <li>• Check that Location ID is correct</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="border-l-4 border-yellow-500 pl-4">
                            <h5 class="font-semibold text-lg mb-2">API Authentication Fails</h5>
                            <p class="text-gray-600 mb-2"><strong>Error:</strong> "401 Unauthorized" or "Invalid API key"</p>
                            <div class="bg-gray-50 p-3 rounded">
                                <p class="text-sm"><strong>Solution:</strong></p>
                                <ul class="text-sm space-y-1 mt-1">
                                    <li>• Verify you're using Private Integrations API key</li>
                                    <li>• Check that all required scopes are enabled</li>
                                    <li>• Ensure Location ID matches your GHL account</li>
                                    <li>• Test credentials with the built-in testing tool</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="border-l-4 border-blue-500 pl-4">
                            <h5 class="font-semibold text-lg mb-2">Claude Desktop Not Detecting Server</h5>
                            <p class="text-gray-600 mb-2"><strong>Issue:</strong> No tools icon appears in Claude Desktop</p>
                            <div class="bg-gray-50 p-3 rounded">
                                <p class="text-sm"><strong>Solution:</strong></p>
                                <ul class="text-sm space-y-1 mt-1">
                                    <li>• Verify claude_desktop_config.json syntax</li>
                                    <li>• Check file paths are absolute</li>
                                    <li>• Restart Claude Desktop after configuration changes</li>
                                    <li>• Ensure server is running and accessible</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="border-l-4 border-purple-500 pl-4">
                            <h5 class="font-semibold text-lg mb-2">Tool Execution Timeouts</h5>
                            <p class="text-gray-600 mb-2"><strong>Issue:</strong> Tools start but never complete</p>
                            <div class="bg-gray-50 p-3 rounded">
                                <p class="text-sm"><strong>Solution:</strong></p>
                                <ul class="text-sm space-y-1 mt-1">
                                    <li>• Check network connectivity to GoHighLevel API</li>
                                    <li>• Verify API rate limits aren't exceeded</li>
                                    <li>• Increase timeout settings if needed</li>
                                    <li>• Check server logs for detailed error messages</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-xl font-semibold mb-4">Debugging Commands</h4>
                    
                    <div class="space-y-4">
                        <div>
                            <h5 class="font-semibold mb-2">Test Server Health</h5>
                            <div class="code-block">
<pre>curl http://localhost:8000/health</pre>
                            </div>
                        </div>
                        
                        <div>
                            <h5 class="font-semibold mb-2">List Available Tools</h5>
                            <div class="code-block">
<pre>curl http://localhost:8000/tools</pre>
                            </div>
                        </div>
                        
                        <div>
                            <h5 class="font-semibold mb-2">Test API Connection</h5>
                            <div class="code-block">
<pre>curl -H "Authorization: Bearer $GHL_API_KEY" \\
     https://services.leadconnectorhq.com/locations/</pre>
                            </div>
                        </div>
                        
                        <div>
                            <h5 class="font-semibold mb-2">Check Environment Variables</h5>
                            <div class="code-block">
<pre>echo $GHL_API_KEY
echo $GHL_LOCATION_ID</pre>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-xl font-semibold mb-4">Log Analysis</h4>
                    <p class="mb-4">Check these log locations for detailed error information:</p>
                    
                    <div class="space-y-3">
                        <div class="bg-gray-50 p-3 rounded">
                            <h5 class="font-semibold text-sm">Server Logs</h5>
                            <code class="text-xs">Console output when running npm start</code>
                        </div>
                        
                        <div class="bg-gray-50 p-3 rounded">
                            <h5 class="font-semibold text-sm">Claude Desktop Logs (macOS)</h5>
                            <code class="text-xs">~/Library/Logs/Claude/mcp*.log</code>
                        </div>
                        
                        <div class="bg-gray-50 p-3 rounded">
                            <h5 class="font-semibold text-sm">Claude Desktop Logs (Windows)</h5>
                            <code class="text-xs">%APPDATA%\\Claude\\Logs\\mcp*.log</code>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-xl font-semibold mb-4">Getting Help</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h5 class="font-semibold mb-2">GitHub Issues</h5>
                            <p class="text-sm text-gray-600 mb-2">Report bugs and request features</p>
                            <a href="https://github.com/mastanley13/GoHighLevel-MCP/issues" class="text-indigo-600 hover:text-indigo-800 text-sm">
                                <i class="fas fa-external-link-alt mr-1"></i>Open Issue
                            </a>
                        </div>
                        
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h5 class="font-semibold mb-2">Documentation</h5>
                            <p class="text-sm text-gray-600 mb-2">Comprehensive guides and references</p>
                            <a href="https://github.com/mastanley13/GoHighLevel-MCP" class="text-indigo-600 hover:text-indigo-800 text-sm">
                                <i class="fas fa-external-link-alt mr-1"></i>View Docs
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `
    };
    
    return content[section] || content['overview'];
}

// Testing functions
async function testConnection() {
    const apiKey = document.getElementById('api-key').value;
    const locationId = document.getElementById('location-id').value;
    const resultDiv = document.getElementById('connection-result');
    
    if (!apiKey || !locationId) {
        showResult(resultDiv, 'error', 'Please enter both API Key and Location ID');
        return;
    }
    
    showResult(resultDiv, 'loading', 'Testing connection...');
    
    try {
        const response = await fetch('/health', {
            headers: {
                'x-ghl-api-key': apiKey,
                'x-ghl-location-id': locationId
            }
        });
        
        const data = await response.json();
        
        if (response.ok && data.status === 'healthy') {
            showResult(resultDiv, 'success', `✅ Connection successful! Server is healthy with ${data.tools?.total || 0} tools available.`);
        } else {
            showResult(resultDiv, 'error', `❌ Connection failed: ${data.message || 'Unknown error'}`);
        }
    } catch (error) {
        showResult(resultDiv, 'error', `❌ Connection failed: ${error.message}`);
    }
}

async function testTool() {
    const apiKey = document.getElementById('api-key').value;
    const locationId = document.getElementById('location-id').value;
    const toolName = document.getElementById('tool-select').value;
    const toolArgs = document.getElementById('tool-args').value;
    const resultDiv = document.getElementById('tool-result');
    
    if (!apiKey || !locationId) {
        showResult(resultDiv, 'error', 'Please enter your credentials first');
        return;
    }
    
    if (!toolName) {
        showResult(resultDiv, 'error', 'Please select a tool to test');
        return;
    }
    
    let args = {};
    if (toolArgs.trim()) {
        try {
            args = JSON.parse(toolArgs);
        } catch (error) {
            showResult(resultDiv, 'error', 'Invalid JSON in tool arguments');
            return;
        }
    }
    
    showResult(resultDiv, 'loading', `Executing ${toolName}...`);
    
    try {
        const response = await fetch('/execute-tool', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-ghl-api-key': apiKey,
                'x-ghl-location-id': locationId
            },
            body: JSON.stringify({
                toolName: toolName,
                args: args
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showResult(resultDiv, 'success', `✅ Tool executed successfully!`, data.result);
        } else {
            showResult(resultDiv, 'error', `❌ Tool execution failed: ${data.message || data.error || 'Unknown error'}`);
        }
    } catch (error) {
        showResult(resultDiv, 'error', `❌ Tool execution failed: ${error.message}`);
    }
}

function showResult(container, type, message, data = null) {
    container.classList.remove('hidden');
    
    let bgColor, textColor, icon;
    switch (type) {
        case 'success':
            bgColor = 'bg-green-50';
            textColor = 'text-green-800';
            icon = 'fas fa-check-circle';
            break;
        case 'error':
            bgColor = 'bg-red-50';
            textColor = 'text-red-800';
            icon = 'fas fa-exclamation-circle';
            break;
        case 'loading':
            bgColor = 'bg-blue-50';
            textColor = 'text-blue-800';
            icon = 'fas fa-spinner fa-spin';
            break;
        default:
            bgColor = 'bg-gray-50';
            textColor = 'text-gray-800';
            icon = 'fas fa-info-circle';
    }
    
    let content = `
        <div class="${bgColor} border-l-4 border-${type === 'success' ? 'green' : type === 'error' ? 'red' : 'blue'}-400 p-4">
            <div class="flex">
                <div class="flex-shrink-0">
                    <i class="${icon} ${textColor}"></i>
                </div>
                <div class="ml-3">
                    <p class="text-sm ${textColor}">${message}</p>
                </div>
            </div>
        </div>
    `;
    
    if (data && type === 'success') {
        content += `
            <div class="mt-4 bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold mb-2">Result:</h4>
                <pre class="text-sm text-gray-700 overflow-x-auto max-h-64">${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;
    }
    
    container.innerHTML = content;
}