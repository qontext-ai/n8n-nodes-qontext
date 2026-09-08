import type { INodeProperties } from 'n8n-workflow';
import { SEARCH_URL } from '../common/api';
import { searchHybridOperation } from './searchHybrid.operation';
import { searchRegexOperation } from './searchRegex.operation';

// Both endpoints answer with `{ object, data }` and no pagination metadata, so the
// `data` array is always split into one item per result.
const splitResults: INodeProperties['routing'] = {
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
};

export const searchOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['search'],
			},
		},
		options: [
			{
				name: 'By Meaning',
				value: 'hybrid',
				action: 'Search files by meaning',
				description:
					'Find the files that match your query and return their content, best match first. Also matches on meaning, so it finds files that answer the query without using the same words.',
				routing: {
					request: {
						method: 'POST',
						url: `${SEARCH_URL}/hybrid`,
					},
					...splitResults,
				},
			},
			{
				name: 'By Regex',
				value: 'regex',
				action: 'Search file lines with a regular expression',
				description:
					'Find lines that match an RE2 regular expression, citing the file each came from. Results are not relevance-ranked.',
				routing: {
					request: {
						method: 'POST',
						url: `${SEARCH_URL}/regex`,
					},
					...splitResults,
				},
			},
		],
		default: 'hybrid',
	},
	...searchHybridOperation,
	...searchRegexOperation,
];
