// Here we define what to show when the `get` operation is selected.
// We do that by adding `operation: ["get"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';
import { folderLocator } from '../common/locator';

export const getFolderOperation: INodeProperties[] = [
	folderLocator('folderId', 'Folder ID', {
		description: 'The folder to read',
		required: true,
		byPath: true,
		displayOptions: { show: { resource: ['folder'], operation: ['get'] } },
	}),
];
