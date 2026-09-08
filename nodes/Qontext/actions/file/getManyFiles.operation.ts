// Here we define what to show when the `getAll` operation is selected.
// We do that by adding `operation: ["getAll"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';
import { listProperties } from '../common/pagination';

export const getManyFilesOperation: INodeProperties[] = [
	...listProperties('file', 'getAll'),
	{
		displayName: 'Filter By',
		name: 'filterBy',
		type: 'options',
		noDataExpression: true,
		default: 'none',
		description: 'Which single filter to narrow the list with. The API accepts only one, and rejects a request carrying two.',
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				name: 'Folder ID',
				value: 'folderId',
				description: 'Files directly inside this folder, one level only. Use Path Prefix for a whole subtree. A folder ID naming nothing is an empty collection.',
			},
			{
				name: 'Nothing',
				value: 'none',
				description: 'List every file the key can read',
			},
			{
				name: 'Path',
				value: 'path',
				description: 'Exact path to a file, so it ends in .md. Returns zero or one file: a path naming nothing is an empty collection, not an error.',
			},
			{
				name: 'Path Prefix',
				value: 'pathPrefix',
				description: 'Every file below this folder, recursively. A folder path, so it does not end in .md. A prefix naming no folder is an empty collection.',
			},
		],
	},
	{
		displayName: 'Path',
		name: 'path',
		type: 'string',
		default: '',
		placeholder: 'e.g. /support/policies/refunds.md',
		description: 'Exact path to a file, so it ends in .md. Returns zero or one file: a path naming nothing is an empty collection, not an error.',
		required: true,
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['getAll'],
				filterBy: ['path'],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'path',
				value: '={{$value}}',
			},
		},
	},
	{
		displayName: 'Path Prefix',
		name: 'pathPrefix',
		type: 'string',
		default: '',
		placeholder: 'e.g. /support',
		description: 'Every file below this folder, recursively. A folder path, so it does not end in .md. A prefix naming no folder is an empty collection.',
		required: true,
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['getAll'],
				filterBy: ['pathPrefix'],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'path_prefix',
				value: '={{$value}}',
			},
		},
	},
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		default: '',
		placeholder: 'e.g. dir_9f2k1x8b3m7q0v',
		description: 'Files directly inside this folder, one level only. Use Path Prefix for a whole subtree. A folder ID naming nothing is an empty collection.',
		required: true,
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['getAll'],
				filterBy: ['folderId'],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'folder_id',
				value: '={{$value}}',
			},
		},
	},
];
