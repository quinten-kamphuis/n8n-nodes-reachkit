import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSequences = {
	resource: ['sequence'],
};

export const sequenceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForSequences,
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get sequences',
				description: 'Get many sequences for a campaign',
				routing: {
					request: {
						method: 'GET',
						url: '=/campaigns/{{$parameter.campaignId}}/sequences',
					},
				},
			},
			{
				name: 'Update Variant',
				value: 'updateVariant',
				action: 'Update a sequence variant',
				description: 'Update the enabled status of a sequence variant',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/campaigns/{{$parameter.campaignId}}/variants/{{$parameter.variantId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	// Campaign ID (required for all operations)
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sequence'],
				operation: ['getAll', 'updateVariant'],
			},
		},
		default: '',
		description: 'The ID of the campaign',
	},
	// Update Variant operation fields
	{
		displayName: 'Variant ID',
		name: 'variantId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sequence'],
				operation: ['updateVariant'],
			},
		},
		default: '',
		description: 'The ID of the variant to update',
	},
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		required: true,
		displayOptions: {
			show: {
				resource: ['sequence'],
				operation: ['updateVariant'],
			},
		},
		default: true,
		description: 'Whether the variant should be enabled',
		routing: {
			send: {
				type: 'body',
				property: 'enabled',
			},
		},
	},
];
