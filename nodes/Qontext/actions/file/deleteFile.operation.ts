// Here we define what to show when the `delete` operation is selected.
// We do that by adding `operation: ["delete"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';
import { fileLocator } from '../common/locator';

export const deleteFileOperation: INodeProperties[] = [
	fileLocator('fileId', 'File ID', {
		description: 'The file to delete',
		required: true,
		byPath: true,
		displayOptions: { show: { resource: ['file'], operation: ['delete'] } },
	}),
];
