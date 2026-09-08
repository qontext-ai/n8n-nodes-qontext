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
				description: 'Create one folder, creating missing parents along a path. Not an upsert: a path already holding a folder is a conflict, so this never merges into an existing folder.',
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
				description: 'Delete a folder. Refuses a folder that still has contents unless Recursive is on, in which case the whole subtree goes.',
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
					'Get a folder by its ID. The workspace is implicit in the API key, so a folder in another workspace answers as not found and existence does not leak.',
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
				description: 'List folders by path, by path prefix or by parent. Without a filter it lists root folders.',
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
				description: 'Rename a folder in place or move it. A move takes the whole subtree and every ID in it survives, so IDs held elsewhere stay valid; the paths below it change.',
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
