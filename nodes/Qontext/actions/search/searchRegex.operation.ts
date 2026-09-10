// Here we define what to show when the `regex` operation is selected.
// We do that by adding `operation: ["regex"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';

export const searchRegexOperation: INodeProperties[] = [
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		default: '',
		placeholder: 'e.g. refund(s|ed)?\\s+within',
		description: 'An RE2 regular expression matched against each line. Results are not relevance-ranked.',
		required: true,
		typeOptions: {
			rows: 3,
		},
		displayOptions: {
			show: {
				resource: ['search'],
				operation: ['regex'],
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
		// n8n's standard Limit default, and the one the list operations already use. The
		// API's own default is 10, so the field is always sent rather than left off.
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
			maxValue: 500,
		},
		displayOptions: {
			show: {
				resource: ['search'],
				operation: ['regex'],
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
				operation: ['regex'],
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
