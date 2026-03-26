// Here we define what to show when the `retrieveContext` operation is selected.
// We do that by adding `operation: ["retrieveContext"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';

export const retrievalContextOperation: INodeProperties[] = [
	{
		displayName: 'Vault ID',
		name: 'vaultId',
		type: 'string',
		default: '',
		description: 'The ID of the vault that should be used to answer the question',
		displayOptions: {
			show: {
				resource: ['retrieval'],
				operation: ['retrieveContext'],
			},
		},
		required: true,
	},
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		typeOptions: {
			rows: 5, 
		},
		default: '',
		description: 'The prompt to retrieve context for',
		displayOptions: {
			show: {
				resource: ['retrieval'],
				operation: ['retrieveContext'],
			},
		},
		required: true,
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['retrieval'],
				operation: ['retrieveContext'],
			},
		},
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-limit
				default: 5,
				// eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-limit
				description: 'Number of nodes on first level to consider',
				routing: {
					send: {
						type: 'body',
						property: 'limit',
						value: '={{$value}}',
					},
				},
			},
			{
				displayName: 'Depth',
				name: 'depth',
				type: 'number',
				default: 1,
				description: 'Depth of nodes to retrieve from the graph',
				routing: {
					send: {
						type: 'body',
						property: 'depth',
						value: '={{$value}}',
					},
				},
			},
		],
	},
];
