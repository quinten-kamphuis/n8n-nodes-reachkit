import { type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { blocklistDescription } from './resources/blocklist';
import { campaignDescription } from './resources/campaign';
import { conversationDescription } from './resources/conversation';
import { inboxDescription } from './resources/inbox';
import { leadDescription } from './resources/lead';
import { sequenceDescription } from './resources/sequence';

export class Reachkit implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Reachkit',
		name: 'reachkit',
		icon: { light: 'file:reachkit.svg', dark: 'file:reachkit.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Reachkit API',
		defaults: {
			name: 'Reachkit',
		},
		usableAsTool: true,
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{ name: 'reachkitApi', required: true }],
		requestDefaults: {
			baseURL: 'https://reachkit.ai/api/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Blocklist',
						value: 'blocklist',
					},
					{
						name: 'Campaign',
						value: 'campaign',
					},
					{
						name: 'Conversation',
						value: 'conversation',
					},
					{
						name: 'Inbox',
						value: 'inbox',
					},
					{
						name: 'Lead',
						value: 'lead',
					},
					{
						name: 'Sequence',
						value: 'sequence',
					},
				],
				default: 'campaign',
			},
			...blocklistDescription,
			...campaignDescription,
			...conversationDescription,
			...inboxDescription,
			...leadDescription,
			...sequenceDescription,
		],
	};
}
