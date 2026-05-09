import type { INodeProperties } from 'n8n-workflow';

const showOnlyForInboxes = {
	resource: ['inbox'],
};

export const inboxDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForInboxes,
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get an inbox',
				description: 'Get details of a specific inbox',
				routing: {
					request: {
						method: 'GET',
						url: '=/inboxes/{{$parameter.inboxId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get inboxes',
				description: 'Get many inboxes',
				routing: {
					request: {
						method: 'GET',
						url: '/inboxes',
					},
				},
			},
			{
				name: 'Get Warmup Stats',
				value: 'getWarmupStats',
				action: 'Get warmup statistics',
				description: 'Get warmup statistics for an inbox',
				routing: {
					request: {
						method: 'GET',
						url: '=/inboxes/{{$parameter.inboxId}}/warmup/stats',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an inbox',
				description: 'Update editable settings on an inbox',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/inboxes/{{$parameter.inboxId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	// Inbox ID for get, warmup, update operations
	{
		displayName: 'Inbox ID',
		name: 'inboxId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['get', 'getWarmupStats', 'update'],
			},
		},
		default: '',
		description: 'The ID of the inbox',
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
				resource: ['inbox'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Active',
				name: 'is_active',
				type: 'boolean',
				default: true,
				description: 'Whether the inbox is sending campaigns. Set to false to pause sending.',
				routing: {
					send: { type: 'body', property: 'is_active' },
				},
			},
			{
				displayName: 'Daily Campaign Limit',
				name: 'daily_campaign_limit',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 500 },
				default: 30,
				description: 'Maximum number of campaign emails per day (1-500)',
				routing: {
					send: { type: 'body', property: 'daily_campaign_limit' },
				},
			},
			{
				displayName: 'Daily Warmup Limit',
				name: 'daily_warmup_limit',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 100 },
				default: 30,
				description: 'Maximum number of warmup emails per day (1-100)',
				routing: {
					send: { type: 'body', property: 'daily_warmup_limit' },
				},
			},
			{
				displayName: 'First Name',
				name: 'first_name',
				type: 'string',
				default: '',
				description: 'First name shown on outgoing emails',
				routing: {
					send: { type: 'body', property: 'first_name' },
				},
			},
			{
				displayName: 'Last Name',
				name: 'last_name',
				type: 'string',
				default: '',
				description: 'Last name shown on outgoing emails',
				routing: {
					send: { type: 'body', property: 'last_name' },
				},
			},
			{
				displayName: 'Reply-To Address',
				name: 'reply_to',
				type: 'string',
				default: '',
				description: 'Reply-To address. Empty string clears it.',
				routing: {
					send: { type: 'body', property: 'reply_to' },
				},
			},
			{
				displayName: 'Signature',
				name: 'signature',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Signature appended to the bottom of every outgoing email',
				routing: {
					send: { type: 'body', property: 'signature' },
				},
			},
			{
				displayName: 'Warming',
				name: 'is_warming',
				type: 'boolean',
				default: true,
				description: 'Whether warmup is enabled for this inbox',
				routing: {
					send: { type: 'body', property: 'is_warming' },
				},
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
				resource: ['inbox'],
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
				resource: ['inbox'],
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
				resource: ['inbox'],
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
				description: 'Search term for inboxes',
				routing: {
					send: {
						type: 'query',
						property: 'search',
					},
				},
			},
		],
	},
];
