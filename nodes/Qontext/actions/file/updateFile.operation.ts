// Here we define what to show when the `update` operation is selected.
// We do that by adding `operation: ["update"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';

// The endpoint takes exactly one of `name`, `folderId` or `protected`. Sending two is
// rejected rather than ordered, because they are separate writes with no transaction
// across them: a request doing two could land the first and fail the second with no
// way to say which. The Action selector gates which field is visible, and a hidden
// field contributes nothing to the body.
export const updateFileOperation: INodeProperties[] = [
	{
		displayName: 'File ID',
		name: 'fileId',
		type: 'string',
		default: '',
		placeholder: 'e.g. doc_9f2k1x8b3m7q0v',
		description: 'ID of the file to change. The ID never changes, only the path does.',
		required: true,
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Action',
		name: 'updateBy',
		type: 'options',
		noDataExpression: true,
		default: 'rename',
		description: 'Which single change to make',
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['update'],
			},
		},
		options: [
			{
				name: 'Move',
				value: 'move',
				description: 'Move the file into another folder, keeping its ID and its name',
			},
			{
				name: 'Rename',
				value: 'rename',
				description: 'Change the file name, leaving it where it is',
			},
			{
				name: 'Set Protected',
				value: 'protected',
				description: 'Change whether writes to this file go to review instead of merging',
			},
		],
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		placeholder: 'e.g. returns.md',
		description: 'New file name, including its extension. Renames the file in place.',
		required: true,
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['update'],
				updateBy: ['rename'],
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
	{
		displayName: 'New Folder ID',
		name: 'folderId',
		type: 'string',
		default: '',
		placeholder: 'e.g. dir_9f2k1x8b3m7q0v',
		description:
			'Folder to move this file into, keeping its ID and its name. Leave empty to move it to the root.',
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['update'],
				updateBy: ['move'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'folderId',
				value: '={{$value || null}}',
			},
		},
	},
	{
		displayName: 'Protected',
		name: 'protected',
		type: 'boolean',
		default: false,
		description:
			'Whether a change touching this file goes to review instead of merging straight away',
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['update'],
				updateBy: ['protected'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'protected',
				value: '={{$value}}',
			},
		},
	},
];
