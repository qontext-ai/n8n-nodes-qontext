// Here we define what to show when the `hybrid` operation is selected.
// We do that by adding `operation: ["hybrid"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';
import { returnField, expandQueryField, includeSourcesField, limitField, queryField } from './fields';

export const searchHybridOperation: INodeProperties[] = [
	queryField('hybrid', {
		placeholder: 'e.g. What is the refund policy?',
		description: 'What you are looking for. A few words or a whole question both work.',
	}),
	returnField('hybrid'),
	limitField('hybrid'),
	includeSourcesField('hybrid'),
	expandQueryField('hybrid'),
];
