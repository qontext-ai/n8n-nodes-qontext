import type { INodeProperties } from 'n8n-workflow';
import { FOLDERS_URL } from '../common/api';
import { listRouting } from '../common/pagination';
import { createFolderOperation } from './createFolder.operation';
import { deleteFolderOperation } from './deleteFolder.operation';
import { getFolderOperation } from './getFolder.operation';
import { getManyFoldersOperation } from './getManyFolders.operation';
import { updateFolderOperation } from './updateFolder.operation';

export const folderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['folder'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a folder',
				description: 'Create one folder at a path, creating missing parents, or inside a parent folder when given a name. Not an upsert: an occupied path is a conflict.',
				routing: {
					request: {
						method: 'POST',
						url: FOLDERS_URL,
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a folder',
				description: 'Delete a folder. Refuses a folder that still has contents unless Recursive is on. The refusal changes nothing.',
				routing: {
					request: {
						method: 'DELETE',
						url: `=${FOLDERS_URL}/{{ encodeURIComponent($parameter["folderId"]) }}`,
					},
					output: {
						// The endpoint answers with no body, so report the outcome instead of an empty item.
						postReceive: [
							{
								type: 'set',
								properties: {
									value: '={{ { "success": true } }}',
								},
							},
						],
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a folder',
				description:
					'Get a folder by its ID. A folder in another workspace answers as not found, so existence does not leak.',
				routing: {
					request: {
						method: 'GET',
						url: `=${FOLDERS_URL}/{{ encodeURIComponent($parameter["folderId"]) }}`,
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many folders',
				description: 'List folders by path, path prefix or parent. Without a filter it lists root folders. Cursor paginated, never offset.',
				routing: {
					request: {
						method: 'GET',
						url: FOLDERS_URL,
					},
					...listRouting,
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a folder',
				description: 'Rename a folder in place or move it. A move takes the whole subtree and every ID survives; the paths below it change.',
				routing: {
					request: {
						method: 'PATCH',
						url: `=${FOLDERS_URL}/{{ encodeURIComponent($parameter["folderId"]) }}`,
					},
				},
			},
		],
		default: 'getAll',
	},
	...createFolderOperation,
	...deleteFolderOperation,
	...getFolderOperation,
	...getManyFoldersOperation,
	...updateFolderOperation,
];
