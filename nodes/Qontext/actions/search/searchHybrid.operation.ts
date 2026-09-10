// Here we define what to show when the `hybrid` operation is selected.
// We do that by adding `operation: ["hybrid"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';

export const searchHybridOperation: INodeProperties[] = [
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		default: '',
		placeholder: 'e.g. What is the refund policy?',
		description: 'What you are looking for. A few words or a whole question both work.',
		required: true,
		typeOptions: {
			rows: 3,
		},
		displayOptions: {
			show: {
				resource: ['search'],
				operation: ['hybrid'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'query',
				value: '={{$value}}',
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		// The API defaults to 10 here, which is a sensible number of search results;
		// the rule wants n8n's usual 50.
		// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-limit
		default: 10,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
			maxValue: 500,
		},
		displayOptions: {
			show: {
				resource: ['search'],
				operation: ['hybrid'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'limit',
				value: '={{$value}}',
			},
		},
	},
	{
		displayName: 'Include Sources',
		name: 'includeSources',
		type: 'boolean',
		default: true,
		description: 'Whether to cite the file each result came from',
		displayOptions: {
			show: {
				resource: ['search'],
				operation: ['hybrid'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'includeSources',
				value: '={{$value}}',
			},
		},
	},
];
