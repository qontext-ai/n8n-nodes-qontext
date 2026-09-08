// Here we define what to show when the `create` operation is selected.
// We do that by adding `operation: ["create"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';

// The endpoint takes either `path` or `parentId` + `fileName`, never a mix. Each
// field carries its own `routing.send` and is gated on the Create By selector, so
// a hidden field contributes nothing to the body and the request always matches
// exactly one branch of the schema.
export const createFileOperation: INodeProperties[] = [
	{
		displayName: 'Create By',
		name: 'createBy',
		type: 'options',
		noDataExpression: true,
		default: 'path',
		description: 'How to say where the new file goes',
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Parent Folder',
				value: 'parentFolder',
				description: 'Name an existing folder by ID and give the file a name',
			},
			{
				name: 'Path',
				value: 'path',
				description: 'Give the full absolute path of the new file',
			},
		],
	},
	{
		displayName: 'Path',
		name: 'path',
		type: 'string',
		default: '',
		placeholder: 'e.g. /support/policies/refunds.md',
		description:
			'Where to create the file. Absolute, and ends in .md. A path already holding a file is a conflict, never an overwrite.',
		required: true,
		displayOptions: {
			show: {
				resource: ['file'],
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
		description: 'Parent folder ID. Send with File Name instead of Path.',
		required: true,
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['create'],
				createBy: ['parentFolder'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'parentId',
				value: '={{$value}}',
			},
		},
	},
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		default: '',
		placeholder: 'e.g. refunds.md',
		description: 'File name, ending in .md. Send with Parent Folder ID instead of Path.',
		required: true,
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['create'],
				createBy: ['parentFolder'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'fileName',
				value: '={{$value}}',
			},
		},
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		default: '',
		description: 'Markdown or plain text. Up to 51200 characters.',
		required: true,
		typeOptions: {
			rows: 6,
		},
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['create'],
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
