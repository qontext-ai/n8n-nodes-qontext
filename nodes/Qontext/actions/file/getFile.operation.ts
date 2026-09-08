// Here we define what to show when the `get` operation is selected.
// We do that by adding `operation: ["get"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';

export const getFileOperation: INodeProperties[] = [
	{
		displayName: 'File ID',
		name: 'fileId',
		type: 'string',
		default: '',
		placeholder: 'e.g. doc_9f2k1x8b3m7q0v',
		description: 'ID of the file. Stable: it survives a rename or a move.',
		required: true,
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['get'],
			},
		},
	},
];
