import type { INodeProperties } from 'n8n-workflow';

const showOnlyForLeads = {
	resource: ['lead'],
};

export const leadDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForLeads,
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a lead',
				description: 'Create a new lead in a campaign',
				routing: {
					request: {
						method: 'POST',
						url: '=/campaigns/{{$parameter.campaignId}}/leads',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a lead',
				description: 'Delete a lead from a campaign',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/campaigns/{{$parameter.campaignId}}/leads/{{$parameter.leadId}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a lead',
				description: 'Get details of a specific lead',
				routing: {
					request: {
						method: 'GET',
						url: '=/campaigns/{{$parameter.campaignId}}/leads/{{$parameter.leadId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get leads',
				description: 'Get many leads from a campaign',
				routing: {
					request: {
						method: 'GET',
						url: '=/campaigns/{{$parameter.campaignId}}/leads',
					},
				},
			},
		],
		default: 'create',
	},
	// Common campaign ID field
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['create', 'delete', 'get', 'getAll'],
			},
		},
		default: '',
		description: 'The ID of the campaign',
	},
	// Lead ID for get and delete operations
	{
		displayName: 'Lead ID',
		name: 'leadId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['get', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the lead',
	},
	// Create operation fields
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Email address of the lead',
		routing: {
			send: {
				type: 'body',
				property: 'email',
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
				resource: ['lead'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'First Name',
				name: 'first_name',
				type: 'string',
				default: '',
				description: 'First name of the lead',
				routing: {
					send: {
						type: 'body',
						property: 'first_name',
					},
				},
			},
			{
				displayName: 'Last Name',
				name: 'last_name',
				type: 'string',
				default: '',
				description: 'Last name of the lead',
				routing: {
					send: {
						type: 'body',
						property: 'last_name',
					},
				},
			},
			{
				displayName: 'If Exists',
				name: 'if_exists',
				type: 'options',
				options: [
					{
						name: 'Fail',
						value: 'fail',
						description: 'Fail if lead already exists',
					},
					{
						name: 'Skip',
						value: 'skip',
						description: 'Skip if lead already exists',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update if lead already exists',
					},
				],
				default: 'fail',
				description: 'What to do if the lead already exists',
				routing: {
					send: {
						type: 'body',
						property: 'if_exists',
					},
				},
			},
			{
				displayName: 'Variables',
				name: 'variables',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				description: 'Custom variables for the lead',
				placeholder: 'Add Variable',
				options: [
					{
						name: 'variable',
						displayName: 'Variable',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
								description: 'Variable name',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Variable value',
							},
						],
					},
				],
				routing: {
					send: {
						type: 'body',
						property: 'variables',
						value:
							'={{$parameter.additionalFields.variables?.variable?.reduce((acc, item) => ({...acc, [item.key]: item.value}), {})}}',
					},
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
				resource: ['lead'],
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
				resource: ['lead'],
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
				resource: ['lead'],
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
				description: 'Search term for leads',
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
