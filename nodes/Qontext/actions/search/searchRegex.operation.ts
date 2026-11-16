// Here we define what to show when the `regex` operation is selected.
// We do that by adding `operation: ["regex"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';
import { includeSourcesField, limitField, queryField, returnField } from './fields';

export const searchRegexOperation: INodeProperties[] = [
	queryField('regex', {
		placeholder: 'e.g. refund(s|ed)?\\s+within',
		description:
			'A case-sensitive RE2 regular expression matched against passages of each file. Anchors apply to passage boundaries. Results are not relevance-ranked.',
	}),
	// The endpoint no longer returns matched lines; Return = Passages is the closest
	// to them, one item per match.
	returnField('regex'),
	limitField('regex'),
	includeSourcesField('regex'),
];
