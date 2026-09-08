// Here we define what to show when the `create` operation is selected.
// We do that by adding `operation: ["create"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';

// Either `path` or `parentId` + `name`, never a mix. Each field carries its own
// `routing.send` and is gated on the Create By selector, so a hidden field
// contributes nothing to the body.
export const createFolderOperation: INodeProperties[] = [
	{
		displayName: 'Create By',
		name: 'createBy',
		type: 'options',
		noDataExpression: true,
		default: 'path',
		description: 'How to say where the new folder goes',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Parent Folder',
				value: 'parentFolder',
				description: 'Name an existing folder by ID and give the new folder a name',
			},
			{
				name: 'Path',
				value: 'path',
				description: 'Give the full absolute path, creating any missing parents on the way',
			},
		],
	},
	{
		displayName: 'Path',
		name: 'path',
		type: 'string',
		default: '',
		placeholder: 'e.g. /projects/reports',
		description:
			'Absolute path for the new folder. Missing parent folders are created on the way. Not an upsert: a path already holding a folder is a conflict.',
		required: true,
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['create'],
				createBy: ['path'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'path',
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
		description: 'Folder to create this one inside. Send with Name instead of Path. Leave empty to put it at the root.',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['create'],
				createBy: ['parentFolder'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'parentId',
				value: '={{$value || null}}',
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		placeholder: 'e.g. reports',
		description: 'Leaf name of the new folder. Send with Parent Folder ID instead of Path.',
		required: true,
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['create'],
				createBy: ['parentFolder'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'name',
				value: '={{$value}}',
			},
		},
	},
];
