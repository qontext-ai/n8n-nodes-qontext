// Here we define what to show when the `update` operation is selected.
// We do that by adding `operation: ["update"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';
import { folderLocator, rootAware } from '../common/locator';

// The endpoint takes exactly one of `name` or `parentId`. Sending both, or
// neither, is rejected rather than resolved by a precedence rule, so the Action
// selector gates which field is visible and therefore which one is sent.
export const updateFolderOperation: INodeProperties[] = [
	folderLocator('folderId', 'Folder ID', {
		description: 'The folder to change. A move takes the whole subtree with it and every ID in it survives.',
		required: true,
		byPath: true,
		displayOptions: { show: { resource: ['folder'], operation: ['update'] } },
	}),
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
	folderLocator('parentId', 'New Parent Folder ID', {
		description:
			'Folder to move this folder into, with everything below it. Pick "/ (Root)" to move it to the root.',
		required: true,
		includeRoot: true,
		displayOptions: {
			show: { resource: ['folder'], operation: ['update'], updateBy: ['move'] },
		},
		routing: rootAware('parentId'),
	}),
];
