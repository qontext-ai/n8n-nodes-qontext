// Here we define what to show when the `updateContent` operation is selected.
// We do that by adding `operation: ["updateContent"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';

export const updateFileContentOperation: INodeProperties[] = [
	{
		displayName: 'File ID',
		name: 'fileId',
		type: 'string',
		default: '',
		placeholder: 'e.g. doc_9f2k1x8b3m7q0v',
		description: 'ID of the file to write to',
		required: true,
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['updateContent'],
			},
		},
	},
	{
		displayName: 'Base Change ID',
		name: 'baseChangeId',
		type: 'string',
		default: '',
		placeholder: 'e.g. chg_7t4p2w9c1n6s8k',
		description:
			'The file\'s last content change when this edit started. Use the lastChangeId returned by File > Get or File > Create. A rename or a move does not advance it.',
		required: true,
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['updateContent'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'baseChangeId',
				value: '={{$value}}',
			},
		},
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		default: '',
		description: 'The full new file content, which replaces the current content. Up to 51200 characters.',
		required: true,
		typeOptions: {
			rows: 6,
		},
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['updateContent'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'content',
				value: '={{$value}}',
			},
		},
	},
];
