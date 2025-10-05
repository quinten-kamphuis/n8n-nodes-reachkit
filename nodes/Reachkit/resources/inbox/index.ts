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
		],
		default: 'getAll',
	},
	// Inbox ID for get and warmup operations
	{
		displayName: 'Inbox ID',
		name: 'inboxId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['get', 'getWarmupStats'],
			},
		},
		default: '',
		description: 'The ID of the inbox',
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
