import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBlocklist = {
	resource: ['blocklist'],
};

export const blocklistDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForBlocklist,
		},
		options: [
			{
				name: 'Add',
				value: 'add',
				action: 'Add to blocklist',
				description: 'Add an email to the blocklist',
				routing: {
					request: {
						method: 'POST',
						url: '/blocklist',
					},
				},
			},
			{
				name: 'Check',
				value: 'check',
				action: 'Check if email is blocked',
				description: 'Check if an email is in the blocklist',
				routing: {
					request: {
						method: 'GET',
						url: '/blocklist/check',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Remove from blocklist',
				description: 'Remove an email from the blocklist',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/blocklist/{{$parameter.entryId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get blocklist entries',
				description: 'Get many blocklist entries',
				routing: {
					request: {
						method: 'GET',
						url: '/blocklist',
					},
				},
			},
		],
		default: 'getAll',
	},
	// Add operation fields
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		displayOptions: {
			show: {
				resource: ['blocklist'],
				operation: ['add'],
			},
		},
		default: '',
		description: 'Email address to add to blocklist',
		routing: {
			send: {
				type: 'body',
				property: 'email',
			},
		},
	},
	// Check operation fields
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		displayOptions: {
			show: {
				resource: ['blocklist'],
				operation: ['check'],
			},
		},
		default: '',
		description: 'Email address to check in blocklist',
		routing: {
			send: {
				type: 'query',
				property: 'email',
			},
		},
	},
	// Delete operation fields
	{
		displayName: 'Entry ID',
		name: 'entryId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['blocklist'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'The ID of the blocklist entry to delete',
	},
	// Get Many operation fields
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['blocklist'],
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
				resource: ['blocklist'],
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
				resource: ['blocklist'],
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
				description: 'Search term for entries',
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
