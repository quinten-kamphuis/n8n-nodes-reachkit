import type { INodeProperties } from 'n8n-workflow';

const showOnlyForConversations = {
	resource: ['conversation'],
};

export const conversationDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForConversations,
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a conversation',
				description: 'Create a new conversation and send the first email',
				routing: {
					request: {
						method: 'POST',
						url: '/unibox/conversations',
					},
					send: {
						preSend: [
							async function (this, requestOptions) {
								const toRecipients = this.getNodeParameter('toRecipients', '') as string;
								const toList = toRecipients
									.split(',')
									.map((s) => s.trim())
									.filter((s) => s)
									.map((email) => ({ email, name: null }));

								const body = (requestOptions.body || {}) as Record<string, unknown>;
								body.to = toList;
								requestOptions.body = body;
								return requestOptions;
							},
						],
					},
				},
			},
			{
				name: 'Download Attachment',
				value: 'downloadAttachment',
				action: 'Download a conversation attachment',
				description: 'Download an attachment from a conversation message',
				routing: {
					request: {
						method: 'GET',
						url: '=/unibox/conversations/{{$parameter.conversationId}}/attachments/{{$parameter.attachmentId}}',
						encoding: 'arraybuffer',
						returnFullResponse: true,
					},
					output: {
						postReceive: [
							{
								type: 'binaryData',
								properties: {
									destinationProperty: 'data',
								},
							},
						],
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a conversation',
				description: 'Get details of a specific conversation',
				routing: {
					request: {
						method: 'GET',
						url: '=/unibox/conversations/{{$parameter.conversationId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get conversations',
				description: 'Get many conversations',
				routing: {
					request: {
						method: 'GET',
						url: '/unibox/conversations',
					},
				},
			},
			{
				name: 'Reply',
				value: 'reply',
				action: 'Reply to a conversation',
				description: 'Send a reply in a conversation',
				routing: {
					request: {
						method: 'POST',
						url: '=/unibox/conversations/{{$parameter.conversationId}}/reply',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a conversation',
				description: 'Update label override or read state',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/unibox/conversations/{{$parameter.conversationId}}',
					},
					send: {
						preSend: [
							async function (this, requestOptions) {
								const fields = this.getNodeParameter('updateFields', {}) as {
									label_override?: string;
									is_read?: boolean;
								};

								const body: Record<string, unknown> = {};
								if (fields.label_override !== undefined) {
									body.label_override =
										fields.label_override === '__clear__' ? null : fields.label_override;
								}
								if (fields.is_read !== undefined) body.is_read = fields.is_read;

								requestOptions.body = body;
								return requestOptions;
							},
						],
					},
				},
			},
		],
		default: 'getAll',
	},
	// Conversation ID for get, reply, update, downloadAttachment
	{
		displayName: 'Conversation ID',
		name: 'conversationId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['get', 'reply', 'update', 'downloadAttachment'],
			},
		},
		default: '',
		description: 'The ID of the conversation',
	},
	// Download Attachment fields
	{
		displayName: 'Attachment ID',
		name: 'attachmentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['downloadAttachment'],
			},
		},
		default: '',
		description: 'The ID of the attachment to download',
	},
	// Create operation fields
	{
		displayName: 'To',
		name: 'toRecipients',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: 'jane@example.com, john@example.com',
		description: 'Comma-separated list of recipient email addresses',
	},
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Email subject line',
		routing: {
			send: {
				type: 'body',
				property: 'subject',
			},
		},
	},
	{
		displayName: 'Content',
		name: 'createContent',
		type: 'string',
		typeOptions: { rows: 4 },
		required: true,
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'HTML content of the email',
		routing: {
			send: {
				type: 'body',
				property: 'content',
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'createAdditionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Inbox ID',
				name: 'inbox_id',
				type: 'string',
				default: '',
				description:
					'ID of the inbox to send from. If omitted, the first active inbox in the workspace is used.',
				routing: {
					send: {
						type: 'body',
						property: 'inbox_id',
					},
				},
			},
		],
	},
	// Reply operation fields
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['reply'],
			},
		},
		default: '',
		description: 'HTML content of the reply message',
		routing: {
			send: {
				type: 'body',
				property: 'content',
			},
		},
	},
	// Update operation fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Is Read',
				name: 'is_read',
				type: 'boolean',
				default: true,
				description:
					'Whether to mark every message in the conversation as read (true) or unread (false). Setting to false surfaces the thread back into triage.',
			},
			{
				displayName: 'Label Override',
				name: 'label_override',
				type: 'options',
				options: [
					{ name: 'Clear (Revert to AI)', value: '__clear__' },
					{ name: 'Interested', value: 'interested' },
					{ name: 'Left Company', value: 'left_company' },
					{ name: 'Meeting Requested', value: 'meeting_requested' },
					{ name: 'Needs More Info', value: 'needs_more_info' },
					{ name: 'Neutral', value: 'neutral' },
					{ name: 'Not Interested', value: 'not_interested' },
					{ name: 'Out of Office', value: 'out_of_office' },
					{ name: 'Question', value: 'question' },
					{ name: 'Referral', value: 'referral' },
					{ name: 'Unsubscribe', value: 'unsubscribe' },
					{ name: 'Wrong Person', value: 'wrong_person' },
				],
				default: 'interested',
				description:
					'Manually set the conversation label. Choose "Clear" to revert to the AI-classified label.',
			},
		],
	},
	// Get Many operation fields
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		routing: {
			send: {
				type: 'query',
				property: 'return_all',
				value: '={{ $value }}',
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
		routing: {
			send: {
				type: 'query',
				property: 'page_size',
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 1,
				description: 'Page number to retrieve',
				routing: {
					send: {
						type: 'query',
						property: 'page',
					},
				},
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search term for conversations',
				routing: {
					send: {
						type: 'query',
						property: 'search',
					},
				},
			},
			{
				displayName: 'Folder',
				name: 'folder',
				type: 'options',
				options: [
					{
						name: 'Primary',
						value: 'primary',
					},
					{
						name: 'Others',
						value: 'others',
					},
				],
				default: 'primary',
				description: 'Filter conversations by folder',
				routing: {
					send: {
						type: 'query',
						property: 'folder',
					},
				},
			},
		],
	},
];
