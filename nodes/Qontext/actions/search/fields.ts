// Shared pieces of the four search operations. Every search endpoint takes the same
// `query`, `limit` and `includeSources` members and answers the same list envelope, so
// the fields and the request setup are defined once here and each operation file
// only says what is particular to it.

import type { INodeProperties } from 'n8n-workflow';
import { SEARCH_URL } from '../common/api';

export type SearchOperation = 'hybrid' | 'keyword' | 'regex' | 'semantic';

const showFor = (operation: SearchOperation): INodeProperties['displayOptions'] => ({
	show: {
		resource: ['search'],
		operation: [operation],
	},
});

const sendAsBody = (property: string): INodeProperties['routing'] => ({
	send: {
		type: 'body',
		property,
		value: '={{$value}}',
	},
});

// Request setup for one search operation. `mode`, which every search endpoint requires
// (a request without it answers 400), is sent by the Return field.
//
// A search is always one page: `hasMore` is always false and `nextCursor` null. So the
// `data` array is always split into one item per result.
export const searchRouting = (path: SearchOperation): INodeProperties['routing'] => ({
	request: {
		method: 'POST',
		url: `${SEARCH_URL}/${path}`,
	},
	output: {
		postReceive: [
			{
				type: 'rootProperty',
				properties: {
					property: 'data',
				},
			},
		],
	},
});

export const queryField = (
	operation: SearchOperation,
	{ placeholder, description }: { placeholder: string; description: string },
): INodeProperties => ({
	displayName: 'Query',
	name: 'query',
	type: 'string',
	default: '',
	placeholder,
	description,
	required: true,
	typeOptions: {
		rows: 3,
	},
	displayOptions: showFor(operation),
	routing: sendAsBody('query'),
});

export const limitField = (operation: SearchOperation): INodeProperties => ({
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	// n8n's standard Limit default, and the one the list operations already use. The
	// API's own default is 10, so the field is always sent rather than left off.
	default: 50,
	// n8n's linter fixes this description, so what the limit counts goes in `hint`.
	description: 'Max number of results to return',
	hint: 'Counts files when Return is Files. Counts passages when Return is Passages, so a few files can fill it.',
	typeOptions: {
		minValue: 1,
		maxValue: 500,
	},
	displayOptions: showFor(operation),
	routing: sendAsBody('limit'),
});

export const includeSourcesField = (operation: SearchOperation): INodeProperties => ({
	displayName: 'Include Sources',
	name: 'includeSources',
	type: 'boolean',
	default: true,
	description:
		'Whether to list the external records (such as a Notion page) each matched file came from. The matched file is always returned.',
	displayOptions: showFor(operation),
	routing: sendAsBody('includeSources'),
});

export const expandQueryField = (operation: SearchOperation): INodeProperties => ({
	displayName: 'Expand Query',
	name: 'expandQuery',
	type: 'boolean',
	// The API's own default, sent explicitly so the request says what it does.
	default: true,
	description:
		'Whether to also search rewrites of the query, which finds more files phrased differently. Turn off to search only the query as written. Word and meaning matching both run either way.',
	displayOptions: showFor(operation),
	routing: sendAsBody('expandQuery'),
});

// Lets the user choose `mode`. Sent as the request's `mode` member. Defaults to
// "files": one item per matching file, which is what every search returned before the
// API added modes, so a saved workflow still runs its next node once per file. Same
// field, options and default as the Make app's search modules.
export const returnField = (operation: SearchOperation): INodeProperties => ({
	displayName: 'Return',
	name: 'mode',
	type: 'options',
	default: 'files',
	description: 'Whether each result is one matching passage or one whole file',
	options: [
		{
			name: 'Files',
			value: 'files',
			description:
				'One item per matching file, with its whole content in text. Each file appears once.',
		},
		{
			name: 'Passages',
			value: 'passages',
			description:
				'One item per matching passage, with the passage in text. A file with several matching passages appears once for each.',
		},
	],
	displayOptions: showFor(operation),
	routing: sendAsBody('mode'),
});
