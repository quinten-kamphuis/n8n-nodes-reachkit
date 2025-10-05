# n8n-nodes-reachkit

This is an n8n community node that lets you use [Reachkit](https://reachkit.ai) in your n8n workflows.

Reachkit is a cold email outreach platform that helps you manage campaigns, leads, inboxes, and conversations.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This node supports the following resources and operations:

### Blocklist

- **Add**: Add an email to the blocklist
- **Check**: Check if an email is in the blocklist
- **Delete**: Remove an email from the blocklist
- **Get Many**: Get all blocklist entries with pagination and search

### Campaign

- **Get**: Get details of a specific campaign
- **Get Many**: List all campaigns with pagination and search
- **Get Analytics**: Get analytics data for a campaign including daily stats and sequence performance
- **Update**: Update a campaign status (active/paused)

### Conversation

- **Get**: Get details of a specific conversation with all messages
- **Get Many**: List all conversations with pagination and filtering by folder
- **Reply**: Send a reply in a conversation

### Inbox

- **Get**: Get details of a specific inbox
- **Get Many**: List all inboxes with pagination and search
- **Get Warmup Stats**: Get warmup statistics for an inbox over the last 7 days

### Lead

- **Create**: Create a new lead in a campaign with custom variables
- **Delete**: Delete a lead from a campaign
- **Get**: Get details of a specific lead
- **Get Many**: List all leads in a campaign with pagination and search

### Sequence

- **Get Many**: List all sequences for a campaign with their variants
- **Update Variant**: Update the enabled status of a sequence variant

## Credentials

To use this node, you need a Reachkit API key.

### Getting your API key:

1. Log in to your Reachkit account
2. Navigate to **Settings → Integrations**
3. Click **Add API Key**
4. Enter a name for the key
5. Copy the API key (it will only be shown once)

### Authentication

The node uses Bearer token authentication. Simply paste your API key in the credentials configuration.

**Note**: API access is available exclusively for users on the Professional and Agency plans.

## Compatibility

Tested with n8n version 1.x.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Reachkit n8n Documentation](https://reachkit.ai/help/articles/n8n-integration)
- [Reachkit API Documentation](https://reachkit.ai/help/articles/api-documentation)
- [Reachkit Webhooks Documentation](https://reachkit.ai/help/articles/webhooks)

## Usage Examples

### Create leads from a spreadsheet

1. Use the **Spreadsheet File** node to read your leads
2. Connect to **Reachkit** node
3. Select **Lead** resource and **Create** operation
4. Map the email, first name, last name fields
5. Set custom variables for personalization

### Get campaign analytics

1. Use the **Reachkit** node
2. Select **Campaign** resource and **Get Analytics** operation
3. Enter the campaign ID
4. Process the daily stats and sequence performance data

### Reply to new conversations

1. Use the **Reachkit** node with **Conversation** → **Get Many**
2. Filter by folder (primary/others)
3. Process unread conversations
4. Use **Conversation** → **Reply** to send responses

### Manage blocklist

1. Add emails to blocklist from bounced leads
2. Check if an email is blocked before adding to campaign
3. Clean up your blocklist periodically

## Version History

### 0.1.0

- Initial release
- Support for all major Reachkit API endpoints
- Full CRUD operations for leads, campaigns, conversations
- Blocklist management
- Inbox and warmup stats
- Sequence variant management

## License

[MIT](LICENSE.md)
