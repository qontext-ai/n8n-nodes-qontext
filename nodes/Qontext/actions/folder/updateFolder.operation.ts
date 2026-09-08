// Here we define what to show when the `update` operation is selected.
// We do that by adding `operation: ["update"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';

// The endpoint takes exactly one of `name` or `parentId`. Sending both, or
// neither, is rejected rather than resolved by a precedence rule, so the Action
// selector gates which field is visible and therefore which one is sent.
export const updateFolderOperation: INodeProperties[] = [
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		default: '',
		placeholder: 'e.g. dir_9f2k1x8b3m7q0v',
		description: 'ID of the folder to rename or move',
		required: true,
		displayOptions: {
			show: {
				resource: ['folder'],
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
		description: 'Whether to rename the folder in place or move it somewhere else',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['update'],
			},
		},
		options: [
			{
				name: 'Move',
				value: 'move',
				description: 'Move the folder into another folder, taking its whole subtree and keeping every ID',
			},
			{
				name: 'Rename',
				value: 'rename',
				description: 'Change the leaf name, leaving the folder where it is',
			},
		],
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		placeholder: 'e.g. initiatives',
		description: 'New leaf name, which renames the folder in place',
		required: true,
		displayOptions: {
			show: {
				resource: ['folder'],
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
		displayName: 'New Parent Folder ID',
		name: 'parentId',
		type: 'string',
		default: '',
		placeholder: 'e.g. dir_9f2k1x8b3m7q0v',
		description:
			'Folder to move this one into, taking its whole subtree and keeping every ID. The paths below it change, but the IDs do not. Leave empty to move it to the root.',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['update'],
				updateBy: ['move'],
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
];
