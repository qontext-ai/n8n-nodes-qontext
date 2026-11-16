// Here we define what to show when the `semantic` operation is selected.
// We do that by adding `operation: ["semantic"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';
import { returnField, includeSourcesField, limitField, queryField } from './fields';

export const searchSemanticOperation: INodeProperties[] = [
	queryField('semantic', {
		placeholder: 'e.g. What is the refund policy?',
		description:
			'What you are looking for. A few words or a whole question both work. Matches on meaning only, so it finds files that answer the query even when they share none of its words.',
	}),
	returnField('semantic'),
	limitField('semantic'),
	includeSourcesField('semantic'),
];
