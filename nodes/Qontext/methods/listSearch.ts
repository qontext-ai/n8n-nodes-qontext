import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { FILES_URL, FOLDERS_URL } from '../actions/common/api';
import { ROOT_VALUE } from '../actions/common/locator';

// Backs the `From List` mode of every ID locator. Both collections are listed by the
// same cursor-paginated contract the operations use, so a page here is read the same
// way: `nextCursor` is handed back to n8n as its `paginationToken` and the dropdown
// asks for the next page when the user scrolls.

type ListItem = { id: string; path: string };
type ListEnvelope = { data: ListItem[]; nextCursor: string | null };

const matches = (name: string, filter: string) =>
	name.toLowerCase().includes(filter.toLowerCase());

// `path_prefix: '/'` is the whole tree. Root is a legal prefix for both collections —
// only the exact `path` selector on folders refuses it — so this is one request, not a
// walk. Items the key may not read are dropped after the page is read, which is why the
// cursor decides where to stop rather than the item count.
async function search(
	context: ILoadOptionsFunctions,
	url: string,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const body = (await context.helpers.httpRequestWithAuthentication.call(context, 'qontextApi', {
		method: 'GET',
		baseURL: (await context.getCredentials('qontextApi')).baseUrl as string,
		url,
		qs: {
			path_prefix: '/',
			limit: 100,
			cursor: paginationToken || undefined,
		},
	})) as ListEnvelope;

	// Guarded as in the path resolver: a page without `data` would otherwise surface as a
	// raw TypeError in the dropdown.
	let results: INodeListSearchItems[] = (body.data ?? []).map((item) => ({
		name: item.path,
		value: item.id,
	}));

	// The API has no text search over paths, so this narrows the page just fetched. A
	// filter can therefore miss a match on a later page; By ID and By Path stay exact.
	if (filter) {
		results = results.filter((item) => matches(item.name, filter));
	}

	return { results, paginationToken: body.nextCursor ?? undefined };
}

export async function searchFiles(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return await search(this, FILES_URL, filter, paginationToken);
}

export async function searchFolders(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	return await search(this, FOLDERS_URL, filter, paginationToken);
}

// Root has neither an id nor an addressable path, so the list is the only place it can
// be named; `rootAware` turns the sentinel back into `null`.
//
// First page only, so it is not repeated on scroll, and filtered like any other entry —
// prepended to a filtered page it was the highlighted row, so typing `sales` and pressing
// Enter picked the root.
const ROOT_ITEM = { name: '/ (Root)', value: ROOT_VALUE };

export async function searchFoldersWithRoot(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const page = await search(this, FOLDERS_URL, filter, paginationToken);

	if (paginationToken) return page;
	if (filter && !matches(ROOT_ITEM.name, filter)) return page;

	return {
		...page,
		results: [ROOT_ITEM, ...page.results],
	};
}
