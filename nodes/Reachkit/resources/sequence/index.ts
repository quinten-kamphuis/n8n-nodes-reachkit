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
				name: 'Create Step',
				value: 'createStep',
				action: 'Create a sequence step',
				description: 'Add a new step to a campaign sequence',
				routing: {
					request: {
						method: 'POST',
						url: '=/campaigns/{{$parameter.campaignId}}/sequences',
					},
				},
			},
			{
				name: 'Create Variant',
				value: 'createVariant',
				action: 'Create a sequence variant',
				description: 'Add a new variant to a sequence step',
				routing: {
					request: {
						method: 'POST',
						url: '=/campaigns/{{$parameter.campaignId}}/sequences/{{$parameter.sequenceId}}/variants',
					},
				},
			},
			{
				name: 'Delete Step',
				value: 'deleteStep',
				action: 'Delete a sequence step',
				description: 'Delete a step and all of its variants',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/campaigns/{{$parameter.campaignId}}/sequences/{{$parameter.sequenceId}}',
					},
				},
			},
			{
				name: 'Delete Variant',
				value: 'deleteVariant',
				action: 'Delete a sequence variant',
				description: 'Delete a variant from a sequence',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/campaigns/{{$parameter.campaignId}}/variants/{{$parameter.variantId}}',
					},
				},
			},
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
				name: 'Update Step',
				value: 'updateStep',
				action: 'Update a sequence step',
				description: 'Update a sequence step (delay days)',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/campaigns/{{$parameter.campaignId}}/sequences/{{$parameter.sequenceId}}',
					},
				},
			},
			{
				name: 'Update Variant',
				value: 'updateVariant',
				action: 'Update a sequence variant',
				description: 'Update a sequence variant (subject, body, enabled)',
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
				operation: [
					'createStep',
					'createVariant',
					'deleteStep',
					'deleteVariant',
					'getAll',
					'updateStep',
					'updateVariant',
				],
			},
		},
		default: '',
		description: 'The ID of the campaign',
	},
	// Sequence (step) ID
	{
		displayName: 'Sequence ID',
		name: 'sequenceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sequence'],
				operation: ['createVariant', 'deleteStep', 'updateStep'],
			},
		},
		default: '',
		description: 'The ID of the sequence step',
	},
	// Variant ID
	{
		displayName: 'Variant ID',
		name: 'variantId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sequence'],
				operation: ['deleteVariant', 'updateVariant'],
			},
		},
		default: '',
		description: 'The ID of the variant',
	},
	// Create Step fields
	{
		displayName: 'Delay Days',
		name: 'createStepDelayDays',
		type: 'number',
		typeOptions: { minValue: 0 },
		displayOptions: {
			show: {
				resource: ['sequence'],
				operation: ['createStep'],
			},
		},
		default: 3,
		description:
			'Number of days to wait before sending the next step. Defaults to 3 if omitted by the API.',
		routing: {
			send: {
				type: 'body',
				property: 'delay_days',
			},
		},
	},
	// Update Step fields
	{
		displayName: 'Delay Days',
		name: 'delayDays',
		type: 'number',
		typeOptions: { minValue: 0 },
		required: true,
		displayOptions: {
			show: {
				resource: ['sequence'],
				operation: ['updateStep'],
			},
		},
		default: 3,
		description: 'Number of days to wait before sending the next step',
		routing: {
			send: {
				type: 'body',
				property: 'delay_days',
			},
		},
	},
	// Create Variant fields
	{
		displayName: 'Subject',
		name: 'createVariantSubject',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sequence'],
				operation: ['createVariant'],
			},
		},
		default: '',
		description: 'Subject line of the email variant',
		routing: {
			send: {
				type: 'body',
				property: 'subject',
			},
		},
	},
	{
		displayName: 'Body HTML',
		name: 'createVariantBodyHtml',
		type: 'string',
		typeOptions: { rows: 6 },
		displayOptions: {
			show: {
				resource: ['sequence'],
				operation: ['createVariant'],
			},
		},
		default: '',
		description: 'HTML body of the email variant (optional)',
		routing: {
			send: {
				type: 'body',
				property: 'body_html',
			},
		},
	},
	{
		displayName: 'Enabled',
		name: 'createVariantEnabled',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['sequence'],
				operation: ['createVariant'],
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
	// Update Variant fields
	{
		displayName: 'Update Fields',
		name: 'updateVariantFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['sequence'],
				operation: ['updateVariant'],
			},
		},
		options: [
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
				description: 'Subject line of the email variant',
				routing: {
					send: { type: 'body', property: 'subject' },
				},
			},
			{
				displayName: 'Body HTML',
				name: 'body_html',
				type: 'string',
				typeOptions: { rows: 6 },
				default: '',
				description: 'HTML body of the email variant',
				routing: {
					send: { type: 'body', property: 'body_html' },
				},
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description:
					'Whether the variant is enabled. The last enabled variant in a sequence cannot be disabled.',
				routing: {
					send: { type: 'body', property: 'enabled' },
				},
			},
		],
	},
];
