// Here we define what to show when the `get` operation is selected.
// We do that by adding `operation: ["get"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';
import { fileLocator } from '../common/locator';

export const getFileOperation: INodeProperties[] = [
	fileLocator('fileId', 'File ID', {
		description:
			'The file to read. Its ID is stable: it survives a rename or a move. The response carries the file content and the lastChangeId it belongs to, which is what Update Content takes as its Base Change ID.',
		required: true,
		byPath: true,
		displayOptions: { show: { resource: ['file'], operation: ['get'] } },
	}),
];
