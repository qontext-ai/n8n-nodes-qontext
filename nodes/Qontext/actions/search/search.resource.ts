import type { INodeProperties } from 'n8n-workflow';
import { searchRouting } from './fields';
import { searchHybridOperation } from './searchHybrid.operation';
import { searchKeywordOperation } from './searchKeyword.operation';
import { searchRegexOperation } from './searchRegex.operation';
import { searchSemanticOperation } from './searchSemantic.operation';

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
				name: 'By Keyword',
				value: 'keyword',
				action: 'Search files by keyword',
				description:
					'Find the files whose wording best matches your query and return their content, best match first. Suits names, codes and exact terms.',
				routing: searchRouting('keyword'),
			},
			{
				name: 'By Meaning',
				value: 'hybrid',
				action: 'Search files by meaning',
				description:
					'Find the files that match your query and return their content, best match first. Also matches on meaning, so it finds files that answer the query without using the same words.',
				routing: searchRouting('hybrid'),
			},
			{
				name: 'By Regex',
				value: 'regex',
				action: 'Search files with a regular expression',
				description:
					'Find passages or files that match an RE2 regular expression. Results are not relevance-ranked.',
				routing: searchRouting('regex'),
			},
			{
				name: 'By Semantic Similarity',
				value: 'semantic',
				action: 'Search files by semantic similarity',
				description:
					'Find the files closest in meaning to your query and return their content, best match first. Matches on meaning only, not wording.',
				routing: searchRouting('semantic'),
			},
		],
		default: 'hybrid',
	},
	...searchHybridOperation,
	...searchKeywordOperation,
	...searchRegexOperation,
	...searchSemanticOperation,
];
