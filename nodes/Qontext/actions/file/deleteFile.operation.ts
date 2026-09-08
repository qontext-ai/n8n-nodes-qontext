// Here we define what to show when the `delete` operation is selected.
// We do that by adding `operation: ["delete"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';

export const deleteFileOperation: INodeProperties[] = [
	{
		displayName: 'File ID',
		name: 'fileId',
		type: 'string',
		default: '',
		placeholder: 'e.g. doc_9f2k1x8b3m7q0v',
		description: 'ID of the file to delete',
		required: true,
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['delete'],
			},
		},
	},
];
