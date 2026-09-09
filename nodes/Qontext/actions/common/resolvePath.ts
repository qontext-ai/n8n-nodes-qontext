import {
	NodeOperationError,
	type IExecuteSingleFunctions,
	type IHttpRequestOptions,
} from 'n8n-workflow';
import { FILES_URL, FOLDERS_URL } from './api';

// Turns the `By Path` mode of an ID locator into the id the endpoint actually takes.
//
// The other two modes already hold an id, so the URL an operation built is correct and
// this returns it untouched. A `preSend` is attached to the whole property rather than
// to one mode, so checking the mode first is what makes the other two free.
//
// Costs one extra request per item. That is the price of the mode, and the reason it is
// offered only on operations with no other path route.

type ListItem = { id: string; path: string };

function resolver(name: string, collection: string, kind: 'file' | 'folder') {
	return async function resolve(
		this: IExecuteSingleFunctions,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		// Raw, so the mode is still readable — extracted, this would just be the value.
		const parameter = this.getNodeParameter(name, undefined, { extractValue: false }) as {
			mode?: string;
			value?: string;
		} | null;

		if (parameter?.mode !== 'path') return requestOptions;

		const path = parameter.value ?? '';
		const body = (await this.helpers.httpRequestWithAuthentication.call(this, 'qontextApi', {
			method: 'GET',
			baseURL: (await this.getCredentials('qontextApi')).baseUrl as string,
			url: collection,
			qs: { path },
		})) as { data: ListItem[] };

		// A path naming nothing is an empty collection, not a 404 — the API has no
		// resource to report missing. Nothing downstream would say so, and the request
		// would otherwise go out with a path where an id belongs and come back as
		// `invalid_id`, so the node raises it here instead.
		const match = body.data?.[0];
		if (!match) {
			throw new NodeOperationError(this.getNode(), `No ${kind} at "${path}"`, {
				description: `Nothing in this workspace is at that path, or the API key may not read it. Check the path, or address the ${kind} by ID.`,
			});
		}

		// The operation already built the URL around the path; only the id segment
		// changes. Whatever it appended after that segment — `/content` on Update
		// Content — has to survive. The segment is found structurally rather than by
		// length: an encoded path carries no literal `/`, so the first one after the
		// collection is where the id ends.
		const rest = requestOptions.url?.startsWith(`${collection}/`)
			? requestOptions.url.slice(`${collection}/`.length)
			: '';
		const boundary = rest.indexOf('/');
		const tail = boundary === -1 ? '' : rest.slice(boundary);

		return { ...requestOptions, url: `${collection}/${match.id}${tail}` };
	};
}

export const resolveFilePath = (name: string) => resolver(name, FILES_URL, 'file');
export const resolveFolderPath = (name: string) => resolver(name, FOLDERS_URL, 'folder');
