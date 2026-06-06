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
				name: 'Add Entry',
				value: 'add',
				action: 'Add entry to blocklist',
				description: 'Add an email or domain to the blocklist',
				routing: {
					request: {
						method: 'POST',
						url: '/blocklist',
					},
				},
			},
			{
				name: 'Bulk Add Entries',
				value: 'bulkAdd',
				action: 'Bulk add entries to blocklist',
				description: 'Add multiple emails or domains to the blocklist in one request',
				routing: {
					request: {
						method: 'POST',
						url: '/blocklist',
					},
					send: {
						preSend: [
							async function (this, requestOptions) {
								const raw = this.getNodeParameter('entries', '') as string | string[];
								const entries = Array.isArray(raw)
									? raw.map((s) => String(s).trim()).filter((s) => s)
									: String(raw)
											.split(',')
											.map((s) => s.trim())
											.filter((s) => s);
								requestOptions.body = { entries };
								return requestOptions;
							},
						],
					},
				},
			},
			{
				name: 'Check',
				value: 'check',
				action: 'Check if email is blocked',
				description:
					"Check if an email is blocked. Returns true if the email matches an entry directly, or if its domain (or any parent domain) is on the blocklist.",
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
				description: 'Remove an entry from the blocklist',
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
		displayName: 'Email or Domain',
		name: 'email',
		type: 'string',
		placeholder: 'jane@acme.com or acme.com',
		required: true,
		displayOptions: {
			show: {
				resource: ['blocklist'],
				operation: ['add'],
			},
		},
		default: '',
		description:
			'Email or domain to block. A bare domain (no @) blocks every address on that domain and its subdomains.',
		routing: {
			send: {
				type: 'body',
				property: 'value',
			},
		},
	},
	// Bulk Add operation fields
	{
		displayName: 'Entries',
		name: 'entries',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['blocklist'],
				operation: ['bulkAdd'],
			},
		},
		default: '',
		placeholder: 'jane@acme.com, competitor.com, evil.io',
		description:
			'Emails and/or domains to block. Accepts a comma-separated string, or an expression that resolves to an array. Invalid entries are silently dropped by the API.',
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
