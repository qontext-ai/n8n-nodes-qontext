import type {
	INodeProperties,
	INodePropertyMode,
	INodePropertyRouting,
	PreSendAction,
} from 'n8n-workflow';
import { resolveFilePath, resolveFolderPath } from './resolvePath';

// Every operation addresses its subject by id, and an id is not something a person
// holds in their head. These builders turn each ID field into a resource locator so it
// can be picked from a list of paths, typed as an id, or named by path.
//
// The three modes are defined once here rather than thirteen times across the operation
// files. n8n stores the field as `{ mode, value }`, and an expression reading
// `$parameter["fileId"]` unwraps it to the value, so the operations' URL templates and
// `routing.send` entries are unaffected by the change.

// Taken from the API's own id spelling: a 14-character lowercase-alphanumeric suffix.
// The bare form only: `/v1` rejects the engine's composite version id (`doc_…-cmit_…`)
// as `invalid_id` on every file endpoint, Get included. A revision is addressed by
// `baseChangeId`, not by the id.
const FILE_ID_REGEX = '^doc_[a-z0-9]{14}$';
const FOLDER_ID_REGEX = '^dir_[a-z0-9]{14}$';

// Shape only. Whether a path names anything is not knowable in the editor, so that is
// left to the resolver that runs before the request.
const FILE_PATH_REGEX = '^/.*\\.md$';
const FOLDER_PATH_REGEX = '^/(?!.*\\.md$).*$';

// What the `/ (Root)` entry stores. Not the empty string: n8n reads that as "nothing
// chosen" (`isValidResourceLocatorParameterValue` is `!!value.value`), which would make
// an explicit root indistinguishable from an untouched field and rule out `required`.
export const ROOT_VALUE = '__root__';

// The sentinel must never reach the API, and an untouched field means the same thing an
// absent parent does, so both collapse to `null`.
export const rootAware = (property: string): INodePropertyRouting => ({
	send: {
		type: 'body',
		property,
		value: `={{ !$value || $value === "${ROOT_VALUE}" ? null : $value }}`,
	},
});

// `By ID` is first, so it is the default mode. That keeps the node's AI-tool surface a
// plain id string: an agent filling this parameter supplies what it read from an earlier
// response, and never has to know the locator's shape.
function idMode(regex: string, placeholder: string, errorMessage: string): INodePropertyMode {
	// A locator mode is not a node parameter; INodePropertyMode has no `default` to add,
	// so the rule below misfires on the object literal.
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
	return {
		displayName: 'By ID',
		name: 'id',
		type: 'string',
		placeholder,
		validation: [{ type: 'regex', properties: { regex, errorMessage } }],
	};
}

function listMode(searchListMethod: string, placeholder: string): INodePropertyMode {
	// A locator mode is not a node parameter; INodePropertyMode has no `default` to add,
	// so the rule below misfires on the object literal.
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
	return {
		displayName: 'From List',
		name: 'list',
		type: 'list',
		placeholder,
		typeOptions: {
			searchListMethod,
			// The API has no text search over paths, so the filter is applied to the page
			// already fetched. Exact addressing stays available through the other modes.
			searchable: true,
		},
	};
}

function pathMode(regex: string, placeholder: string, errorMessage: string): INodePropertyMode {
	// A locator mode is not a node parameter; INodePropertyMode has no `default` to add,
	// so the rule below misfires on the object literal.
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
	return {
		displayName: 'By Path',
		name: 'path',
		type: 'string',
		placeholder,
		validation: [{ type: 'regex', properties: { regex, errorMessage } }],
	};
}

type LocatorOptions = {
	description: string;
	displayOptions: INodeProperties['displayOptions'];
	required?: boolean;
	// By Path costs one extra request per item to turn the path into an id, so it is
	// offered only where the operation has no other path route of its own.
	byPath?: boolean;
	// The move and create targets accept the root, which is addressable by neither id nor
	// path, so the list is the only place it can be offered.
	includeRoot?: boolean;
	// Passed through rather than spread over the result: By Path attaches a `preSend`
	// here too, and a caller's own `routing` would replace it silently.
	routing?: INodePropertyRouting;
};

export function fileLocator(
	name: string,
	displayName: string,
	options: LocatorOptions,
): INodeProperties {
	const modes = [
		idMode(FILE_ID_REGEX, 'e.g. doc_9f2k1x8b3m7q0v', 'Not a file ID. Expected doc_ followed by 14 characters.'),
		listMode('searchFiles', 'Select a file…'),
	];

	if (options.byPath) {
		modes.push(
			pathMode(FILE_PATH_REGEX, 'e.g. /support/policies/refunds.md', 'Not a file path. Expected an absolute path ending in .md.'),
		);
	}

	return locator(name, displayName, modes, options, resolveFilePath(name));
}

export function folderLocator(
	name: string,
	displayName: string,
	options: LocatorOptions,
): INodeProperties {
	const modes = [
		idMode(FOLDER_ID_REGEX, 'e.g. dir_9f2k1x8b3m7q0v', 'Not a folder ID. Expected dir_ followed by 14 characters.'),
		listMode(options.includeRoot ? 'searchFoldersWithRoot' : 'searchFolders', 'Select a folder…'),
	];

	if (options.byPath) {
		modes.push(
			pathMode(FOLDER_PATH_REGEX, 'e.g. /support/policies', 'Not a folder path. Expected an absolute path not ending in .md.'),
		);
	}

	return locator(name, displayName, modes, options, resolveFolderPath(name));
}

function locator(
	name: string,
	displayName: string,
	modes: INodePropertyMode[],
	options: LocatorOptions,
	resolve: PreSendAction,
): INodeProperties {
	// Only By Path needs resolving; the resolver is a no-op in the other modes. Merged
	// into the operation's own `send`, since a property carries only one `routing`.
	const send = { ...options.routing?.send };
	if (options.byPath) send.preSend = [...(send.preSend ?? []), resolve];

	return {
		displayName,
		name,
		type: 'resourceLocator',
		// By ID elsewhere, to keep the AI-tool surface a plain id string. Not here: id mode
		// validates against the id regex whenever the field is shown, `required` or not,
		// and an empty string fails it — so the field would open marked broken.
		default: { mode: options.includeRoot ? 'list' : 'id', value: '' },
		description: options.description,
		required: options.required,
		displayOptions: options.displayOptions,
		modes,
		...(Object.keys(send).length ? { routing: { ...options.routing, send } } : {}),
	};
}
