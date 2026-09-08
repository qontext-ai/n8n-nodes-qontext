// Here we define what to show when the `delete` operation is selected.
// We do that by adding `operation: ["delete"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';

export const deleteFolderOperation: INodeProperties[] = [
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		default: '',
		placeholder: 'e.g. dir_9f2k1x8b3m7q0v',
		description: 'ID of the folder to delete',
		required: true,
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['delete'],
			},
		},
	},
	{
		displayName: 'Recursive',
		name: 'recursive',
		type: 'boolean',
		default: false,
		description: 'Whether to delete the folder together with everything below it. Left off, a folder that still has contents is refused and nothing is removed.',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['delete'],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'recursive',
				value: '={{$value}}',
			},
		},
	},
];
