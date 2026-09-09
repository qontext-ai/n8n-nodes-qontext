// Here we define what to show when the `updateContent` operation is selected.
// We do that by adding `operation: ["updateContent"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';
import { fileLocator } from '../common/locator';

export const updateFileContentOperation: INodeProperties[] = [
	{
		// A blocked change is a 202, so error handling never sees it. Its body has no
		// `file` key, which is what breaks a chained node reading `$json.file.…`.
		displayName:
			'A write to a protected file, or one colliding with work that landed since, is held for review instead of merging. That answers 202 with <code>object: "change"</code> and no <code>file</code> key — a success, not an error. Branch on <code>{{ $json.object }}</code> if either is possible.',
		name: 'blockedChangeNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['updateContent'],
			},
		},
	},
	fileLocator('fileId', 'File ID', {
		description: 'The file to write to',
		required: true,
		byPath: true,
		displayOptions: { show: { resource: ['file'], operation: ['updateContent'] } },
	}),
	{
		displayName: 'Base Change ID',
		name: 'baseChangeId',
		type: 'string',
		default: '',
		placeholder: 'e.g. chg_7t4p2w9c1n6s8k',
		description:
			'The file\'s last content change when this edit started. Use the lastChangeId returned by File > Get or File > Create. A rename or a move does not advance it.',
		required: true,
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['updateContent'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'baseChangeId',
				value: '={{$value}}',
			},
		},
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		default: '',
		description: 'The full new file content, which replaces the current content',
		// No number: a second copy of the cap would go stale, and the 422 states the real one.
		hint: 'A very long document is rejected with content_too_large, which reports the current limit',
		required: true,
		typeOptions: {
			rows: 6,
		},
		displayOptions: {
			show: {
				resource: ['file'],
				operation: ['updateContent'],
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
