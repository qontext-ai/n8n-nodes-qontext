// Here we define what to show when the `keyword` operation is selected.
// We do that by adding `operation: ["keyword"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';
import { returnField, includeSourcesField, limitField, queryField } from './fields';

export const searchKeywordOperation: INodeProperties[] = [
	queryField('keyword', {
		placeholder: 'e.g. refund policy',
		description:
			'The words to look for. Ranks files by how well their wording matches, so it suits names, codes and exact terms.',
	}),
	returnField('keyword'),
	limitField('keyword'),
	includeSourcesField('keyword'),
];
