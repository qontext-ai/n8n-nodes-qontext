import type { INodeProperties } from 'n8n-workflow';
import { FILES_URL } from '../common/api';
import { listRouting } from '../common/pagination';
import { createFileOperation } from './createFile.operation';
import { deleteFileOperation } from './deleteFile.operation';
import { getFileOperation } from './getFile.operation';
import { getManyFilesOperation } from './getManyFiles.operation';
import { updateFileOperation } from './updateFile.operation';
import { updateFileContentOperation } from './updateFileContent.operation';

export const fileOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['file'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a file',
				description: 'Create a file at the path given. Not an upsert: a path already holding a file is a conflict, so this never overwrites and never creates a duplicate.',
				routing: {
					request: {
						method: 'POST',
						url: FILES_URL,
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a file',
				description:
					'Delete a file. Its change history goes with it, so this is not reversible through this API. A protected file, or one with changes still awaiting review, is refused and nothing is removed.',
				routing: {
					request: {
						method: 'DELETE',
						url: `=${FILES_URL}/{{ encodeURIComponent($parameter["fileId"]) }}`,
					},
					output: {
						// 204 with no body, so report the outcome instead of an empty item.
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
				action: 'Get a file',
				description:
					'Get a file by its ID. The workspace is implicit in the API key, so a file in another workspace answers as not found and existence does not leak.',
				routing: {
					request: {
						method: 'GET',
						url: `=${FILES_URL}/{{ encodeURIComponent($parameter["fileId"]) }}`,
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many files',
				description:
					'List files. Cursor paginated, never offset. A short page does not mean the end: items the key may not read are dropped after the page is read, so page until there are no more.',
				routing: {
					request: {
						method: 'GET',
						url: FILES_URL,
					},
					...listRouting,
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a file',
				description:
					'Rename a file, move it to another folder, or change whether writes to it go to review. Exactly one of the three per request. The ID never changes, so IDs held elsewhere stay valid; the path does change.',
				routing: {
					request: {
						method: 'PATCH',
						url: `=${FILES_URL}/{{ encodeURIComponent($parameter["fileId"]) }}`,
					},
				},
			},
			{
				name: 'Update Content',
				value: 'updateContent',
				action: 'Update file content',
				description: 'Replace the entire content of a file. The response carries the content that actually landed, which is not always the content sent: an edit based on an older change is merged with the work that landed since.',
				routing: {
					request: {
						method: 'PUT',
						url: `=${FILES_URL}/{{ encodeURIComponent($parameter["fileId"]) }}/content`,
					},
				},
			},
		],
		default: 'getAll',
	},
	...createFileOperation,
	...deleteFileOperation,
	...getFileOperation,
	...getManyFilesOperation,
	...updateFileOperation,
	...updateFileContentOperation,
];
