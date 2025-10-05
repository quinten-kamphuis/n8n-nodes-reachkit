import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCampaigns = {
	resource: ['campaign'],
};

export const campaignDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForCampaigns,
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a campaign',
				description: 'Get details of a specific campaign',
				routing: {
					request: {
						method: 'GET',
						url: '=/campaigns/{{$parameter.campaignId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get campaigns',
				description: 'Get many campaigns',
				routing: {
					request: {
						method: 'GET',
						url: '/campaigns',
					},
				},
			},
			{
				name: 'Get Analytics',
				value: 'getAnalytics',
				action: 'Get campaign analytics',
				description: 'Get analytics data for a campaign',
				routing: {
					request: {
						method: 'GET',
						url: '=/campaigns/{{$parameter.campaignId}}/analytics',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a campaign',
				description: 'Update a campaign status',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/campaigns/{{$parameter.campaignId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	// Get operation fields
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['get', 'getAnalytics', 'update'],
			},
		},
		default: '',
		description: 'The ID of the campaign',
	},
	// Get Many operation fields
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['campaign'],
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
				resource: ['campaign'],
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
				resource: ['campaign'],
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
				description: 'Search term for campaigns',
				routing: {
					send: {
						type: 'query',
						property: 'search',
					},
				},
			},
		],
	},
	// Update operation fields
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['update'],
			},
		},
		options: [
			{
				name: 'Active',
				value: 'active',
			},
			{
				name: 'Paused',
				value: 'paused',
			},
		],
		default: 'active',
		description: 'The status to set for the campaign',
		routing: {
			send: {
				type: 'body',
				property: 'status',
			},
		},
	},
];
