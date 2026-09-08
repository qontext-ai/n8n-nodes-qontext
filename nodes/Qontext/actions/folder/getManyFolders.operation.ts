// Here we define what to show when the `getAll` operation is selected.
// We do that by adding `operation: ["getAll"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';
import { listProperties } from '../common/pagination';

export const getManyFoldersOperation: INodeProperties[] = [
	...listProperties('folder', 'getAll'),
	{
		displayName: 'Filter By',
		name: 'filterBy',
		type: 'options',
		noDataExpression: true,
		default: 'none',
		description: 'Which single filter to narrow the list with. The API accepts only one, and rejects a request carrying two.',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				name: 'Parent Folder ID',
				value: 'parentId',
				description: 'Lists folders directly inside this parent. Omit it to list root folders.',
			},
			{
				name: 'None',
				value: 'none',
				description: 'List the folders at the root',
			},
			{
				name: 'Path',
				value: 'path',
				description: 'Exact path to a folder. A path naming nothing is an empty collection. The root itself is not addressable here.',
			},
			{
				name: 'Path Prefix',
				value: 'pathPrefix',
				description: 'Every folder below this folder, recursively. A prefix naming nothing is an empty collection.',
			},
		],
	},
	{
		displayName: 'Path',
		name: 'path',
		type: 'string',
		default: '',
		placeholder: 'e.g. /support/policies',
		description: 'Exact path to a folder. A path naming nothing is an empty collection. The root itself is not addressable here.',
		required: true,
		displayOptions: {
			show: {
				resource: ['folder'],
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
		description: 'Every folder below this folder, recursively. A prefix naming nothing is an empty collection.',
		required: true,
		displayOptions: {
			show: {
				resource: ['folder'],
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
		displayName: 'Parent Folder ID',
		name: 'parentId',
		type: 'string',
		default: '',
		placeholder: 'e.g. dir_9f2k1x8b3m7q0v',
		description: 'Lists folders directly inside this parent. Omit it to list root folders.',
		required: true,
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['getAll'],
				filterBy: ['parentId'],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'parent_id',
				value: '={{$value}}',
			},
		},
	},
];
