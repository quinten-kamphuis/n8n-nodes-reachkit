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
		],
		default: 'getAll',
	},
	// Conversation ID for get and reply operations
	{
		displayName: 'Conversation ID',
		name: 'conversationId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['get', 'reply'],
			},
		},
		default: '',
		description: 'The ID of the conversation',
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
