import type { INodeProperties, INodePropertyRouting } from 'n8n-workflow';

// Files and folders are listed by the same cursor-paginated contract, so the
// Return All / Limit / Cursor / Simplify controls are built once and reused.
//
// The list envelope is `{ object, url, hasMore, nextCursor, data }`. A short page
// does not mean the end: items the key may not read are dropped after the page is
// read, so `hasMore` is the only correct stop condition, never the item count.

// `cursorFilters` names the Filter By values that may carry a cursor. The API makes
// `path` mutually exclusive with `cursor` — it addresses at most one item, so its single
// page issues no cursor and one sent with it was invented or copied from another query.
// The other selectors page normally, so each caller passes its own list rather than the
// rule being restated here.
export function listProperties(
	resource: string,
	operation: string,
	cursorFilters: string[],
): INodeProperties[] {
	const show = { resource: [resource], operation: [operation] };

	return [
		{
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			default: false,
			description: 'Whether to return all results or only up to a given limit',
			displayOptions: { show },
			routing: {
				// Switches on the operation's pagination. Off, the request is sent once.
				send: {
					paginate: '={{$value}}',
				},
			},
		},
		{
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			default: 50,
			description: 'Max number of results to return',
			typeOptions: {
				minValue: 1,
				maxValue: 1000,
			},
			displayOptions: { show: { ...show, returnAll: [false] } },
			routing: {
				send: {
					type: 'query',
					property: 'limit',
					value: '={{$value}}',
				},
				output: {
					maxResults: '={{$value}}',
				},
			},
		},
		{
			displayName: 'Cursor',
			name: 'cursor',
			type: 'string',
			default: '',
			placeholder: 'e.g. c_9f2k1x8b3m7q0v',
			description:
				'A nextCursor from an earlier page. Opaque: echo it back, never construct one. Changing a filter invalidates it, so start again from the first page.',
			displayOptions: {
				show: { ...show, returnAll: [false], filterBy: cursorFilters },
			},
			routing: {
				send: {
					type: 'query',
					property: 'cursor',
					// The filter this cannot combine with is gated above, so what is left here
					// is the empty field: unset it would send `cursor=`, which is not a cursor
					// this API issued and is rejected as malformed rather than read as absent.
					value: '={{ $value || undefined }}',
				},
			},
		},
		{
			displayName: 'Simplify',
			name: 'simplify',
			type: 'boolean',
			default: true,
			description: 'Whether to return a simplified version of the response instead of the raw data',
			displayOptions: { show },
			routing: {
				output: {
					postReceive: [
						{
							type: 'rootProperty',
							// Off, the raw envelope comes through so hasMore and nextCursor stay reachable.
							enabled: '={{$value}}',
							properties: {
								property: 'data',
							},
						},
					],
				},
			},
		},
	];
}

// Follows `nextCursor` until `hasMore` is false. Only runs when the Return All
// property has switched pagination on.
//
// n8n merges this request over the base one shallowly — `options: { ...base, ...here }` —
// so whatever `qs` holds here REPLACES the entire query string rather than extending it.
// Every filter therefore has to be carried across by hand; leaving them out does not
// error, it silently widens each page to the unfiltered collection. `$request` is the
// base request and keeps its original `qs` for every iteration, so it is the source to
// copy from. Undefined entries are dropped before the request is sent.
export const listRouting: Pick<INodePropertyRouting, 'operations'> = {
	operations: {
		pagination: {
			type: 'generic',
			properties: {
				// Both halves matter. n8n's generic pagination is an uncapped do/while, so a
				// page reporting more results without handing back a cursor would re-request
				// page one for ever; requiring the cursor makes that terminate instead.
				continue:
					'={{ $response.body?.hasMore === true && !!$response.body?.nextCursor }}',
				request: {
					qs: {
						limit: '={{ $request.qs.limit }}',
						path: '={{ $request.qs.path }}',
						path_prefix: '={{ $request.qs.path_prefix }}',
						folder_id: '={{ $request.qs.folder_id }}',
						parent_id: '={{ $request.qs.parent_id }}',
						cursor: '={{ $response.body ? $response.body.nextCursor : undefined }}',
					},
				},
			},
		},
	},
};
