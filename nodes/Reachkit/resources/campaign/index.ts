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
				name: 'Attach Inboxes',
				value: 'attachInboxes',
				action: 'Attach inboxes to a campaign',
				description: 'Attach a set of inboxes to a campaign',
				routing: {
					request: {
						method: 'POST',
						url: '=/campaigns/{{$parameter.campaignId}}/inboxes/attach',
					},
					send: {
						preSend: [
							async function (this, requestOptions) {
								const raw = this.getNodeParameter('inboxIds', '') as string | string[];
								const ids = Array.isArray(raw)
									? raw.map((s) => String(s).trim()).filter((s) => s)
									: String(raw)
											.split(',')
											.map((s) => s.trim())
											.filter((s) => s);
								requestOptions.body = { inbox_ids: ids };
								return requestOptions;
							},
						],
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a campaign',
				description: 'Create a new campaign',
				routing: {
					request: {
						method: 'POST',
						url: '/campaigns',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a campaign',
				description: 'Permanently delete a campaign',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/campaigns/{{$parameter.campaignId}}',
					},
				},
			},
			{
				name: 'Detach Inboxes',
				value: 'detachInboxes',
				action: 'Detach inboxes from a campaign',
				description: 'Detach a set of inboxes from a campaign',
				routing: {
					request: {
						method: 'POST',
						url: '=/campaigns/{{$parameter.campaignId}}/inboxes/detach',
					},
					send: {
						preSend: [
							async function (this, requestOptions) {
								const raw = this.getNodeParameter('inboxIds', '') as string | string[];
								const ids = Array.isArray(raw)
									? raw.map((s) => String(s).trim()).filter((s) => s)
									: String(raw)
											.split(',')
											.map((s) => s.trim())
											.filter((s) => s);
								requestOptions.body = { inbox_ids: ids };
								return requestOptions;
							},
						],
					},
				},
			},
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
				name: 'Update',
				value: 'update',
				action: 'Update a campaign',
				description: 'Update a campaign',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/campaigns/{{$parameter.campaignId}}',
					},
				},
			},
			{
				name: 'Update Schedule',
				value: 'updateSchedule',
				action: 'Update campaign schedule',
				description: "Update the campaign's sending schedule",
				routing: {
					request: {
						method: 'PATCH',
						url: '=/campaigns/{{$parameter.campaignId}}/schedule',
					},
					send: {
						preSend: [
							async function (this, requestOptions) {
								const fields = this.getNodeParameter('scheduleFields', {}) as {
									timezone?: string;
									default_window_start?: string;
									default_window_end?: string;
									daysCollection?: {
										day?: Array<{
											name: string;
											enabled: boolean;
											start?: string;
											end?: string;
										}>;
									};
								};

								const body: Record<string, unknown> = {};
								if (fields.timezone) body.timezone = fields.timezone;
								if (fields.default_window_start || fields.default_window_end) {
									const window: Record<string, string> = {};
									if (fields.default_window_start) window.start = fields.default_window_start;
									if (fields.default_window_end) window.end = fields.default_window_end;
									body.default_window = window;
								}
								if (fields.daysCollection?.day?.length) {
									const days: Record<string, unknown> = {};
									for (const entry of fields.daysCollection.day) {
										const dayBody: Record<string, unknown> = { enabled: entry.enabled };
										dayBody.start = entry.start ? entry.start : null;
										dayBody.end = entry.end ? entry.end : null;
										days[entry.name] = dayBody;
									}
									body.days = days;
								}

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
	// Campaign ID (shared across operations)
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: [
					'attachInboxes',
					'delete',
					'detachInboxes',
					'get',
					'getAnalytics',
					'update',
					'updateSchedule',
				],
			},
		},
		default: '',
		description: 'The ID of the campaign',
	},
	// Create operation fields
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Name of the campaign (max 150 characters)',
		routing: {
			send: {
				type: 'body',
				property: 'name',
			},
		},
	},
	// Attach / Detach Inboxes fields
	{
		displayName: 'Inbox IDs',
		name: 'inboxIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['attachInboxes', 'detachInboxes'],
			},
		},
		default: '',
		description:
			'Inbox UUIDs to attach or detach. Accepts a comma-separated string, or an expression that resolves to an array of IDs.',
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
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Daily Limit',
				name: 'daily_limit',
				type: 'number',
				typeOptions: { minValue: 0 },
				default: 0,
				description: 'Total daily sending across all inboxes',
				routing: {
					send: {
						type: 'body',
						property: 'daily_limit',
					},
				},
			},
			{
				displayName: 'ESP Matching',
				name: 'esp_matching',
				type: 'boolean',
				default: false,
				description:
					"Whether to only send to leads whose ESP matches the sending inbox's ESP",
				routing: {
					send: {
						type: 'body',
						property: 'esp_matching',
					},
				},
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Campaign name (max 150 characters)',
				routing: {
					send: {
						type: 'body',
						property: 'name',
					},
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Paused', value: 'paused' },
				],
				default: 'active',
				description:
					'Status to set for the campaign. Cannot launch without at least one variant and one inbox.',
				routing: {
					send: {
						type: 'body',
						property: 'status',
					},
				},
			},
			{
				displayName: 'Stop on Company Reply',
				name: 'stop_on_company_reply',
				type: 'boolean',
				default: false,
				description: 'Whether to stop the sequence when anyone at the same company replies',
				routing: {
					send: {
						type: 'body',
						property: 'stop_on_company_reply',
					},
				},
			},
			{
				displayName: 'Stop on Reply',
				name: 'stop_on_reply',
				type: 'boolean',
				default: true,
				description: 'Whether to stop the sequence when a lead replies',
				routing: {
					send: {
						type: 'body',
						property: 'stop_on_reply',
					},
				},
			},
			{
				displayName: 'Text Only',
				name: 'text_only',
				type: 'boolean',
				default: false,
				description: 'Whether to send as plain text only, omitting the HTML body',
				routing: {
					send: {
						type: 'body',
						property: 'text_only',
					},
				},
			},
			{
				displayName: 'Unsubscribe Option',
				name: 'unsubscribe_option',
				type: 'boolean',
				default: false,
				description:
					'Whether to add the List-Unsubscribe header and an {{unsubscribe_url}} link to every variant body',
				routing: {
					send: {
						type: 'body',
						property: 'unsubscribe_option',
					},
				},
			},
		],
	},
	// Update Schedule operation fields
	{
		displayName: 'Schedule Fields',
		name: 'scheduleFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['updateSchedule'],
			},
		},
		options: [
			{
				displayName: 'Day Overrides',
				name: 'daysCollection',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				default: {},
				placeholder: 'Add Day',
				description:
					'Per-day overrides. Each day overrides the default window. Set Enabled = false to skip sending entirely on that day.',
				options: [
					{
						name: 'day',
						displayName: 'Day',
						values: [
							{
								displayName: 'Day',
								name: 'name',
								type: 'options',
								options: [
									{ name: 'Friday', value: 'friday' },
									{ name: 'Monday', value: 'monday' },
									{ name: 'Saturday', value: 'saturday' },
									{ name: 'Sunday', value: 'sunday' },
									{ name: 'Thursday', value: 'thursday' },
									{ name: 'Tuesday', value: 'tuesday' },
									{ name: 'Wednesday', value: 'wednesday' },
								],
								default: 'monday',
								description: 'Day of the week to override',
							},
							{
								displayName: 'Enabled',
								name: 'enabled',
								type: 'boolean',
								default: true,
								description: 'Whether sending is enabled on this day',
							},
							{
								displayName: 'Start',
								name: 'start',
								type: 'string',
								default: '',
								placeholder: '09:00',
								description:
									'Start time (HH:MM, 24-hour). Leave empty to fall back to the default window.',
							},
							{
								displayName: 'End',
								name: 'end',
								type: 'string',
								default: '',
								placeholder: '17:00',
								description:
									'End time (HH:MM, 24-hour). Leave empty to fall back to the default window.',
							},
						],
					},
				],
			},
			{
				displayName: 'Default Window End',
				name: 'default_window_end',
				type: 'string',
				default: '',
				placeholder: '17:00',
				description: 'Default sending window end time (HH:MM, 24-hour)',
			},
			{
				displayName: 'Default Window Start',
				name: 'default_window_start',
				type: 'string',
				default: '',
				placeholder: '09:00',
				description: 'Default sending window start time (HH:MM, 24-hour)',
			},
			{
				displayName: 'Timezone',
				name: 'timezone',
				type: 'options',
				options: [
					{ name: 'America/Anchorage', value: 'America/Anchorage' },
					{ name: 'America/Chicago', value: 'America/Chicago' },
					{ name: 'America/Denver', value: 'America/Denver' },
					{ name: 'America/Los_Angeles', value: 'America/Los_Angeles' },
					{ name: 'America/New_York', value: 'America/New_York' },
					{ name: 'America/Phoenix', value: 'America/Phoenix' },
					{ name: 'America/Sao_Paulo', value: 'America/Sao_Paulo' },
					{ name: 'America/Toronto', value: 'America/Toronto' },
					{ name: 'America/Vancouver', value: 'America/Vancouver' },
					{ name: 'Asia/Bangkok', value: 'Asia/Bangkok' },
					{ name: 'Asia/Dubai', value: 'Asia/Dubai' },
					{ name: 'Asia/Hong_Kong', value: 'Asia/Hong_Kong' },
					{ name: 'Asia/Karachi', value: 'Asia/Karachi' },
					{ name: 'Asia/Kolkata', value: 'Asia/Kolkata' },
					{ name: 'Asia/Shanghai', value: 'Asia/Shanghai' },
					{ name: 'Asia/Singapore', value: 'Asia/Singapore' },
					{ name: 'Asia/Tehran', value: 'Asia/Tehran' },
					{ name: 'Asia/Tokyo', value: 'Asia/Tokyo' },
					{ name: 'Australia/Sydney', value: 'Australia/Sydney' },
					{ name: 'Europe/Berlin', value: 'Europe/Berlin' },
					{ name: 'Europe/Kiev', value: 'Europe/Kiev' },
					{ name: 'Europe/London', value: 'Europe/London' },
					{ name: 'Europe/Moscow', value: 'Europe/Moscow' },
					{ name: 'Europe/Paris', value: 'Europe/Paris' },
					{ name: 'Pacific/Auckland', value: 'Pacific/Auckland' },
					{ name: 'Pacific/Honolulu', value: 'Pacific/Honolulu' },
				],
				default: 'America/Chicago',
				description: 'IANA timezone for the campaign',
			},
		],
	},
];
