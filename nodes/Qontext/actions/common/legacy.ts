import { NodeOperationError, type IExecuteSingleFunctions, type IHttpRequestOptions, type INodeProperties } from 'n8n-workflow';

// Resources removed in 0.2.0 when the Qontext API was rebuilt. A workflow saved against
// an older version still holds one of these values, and nothing in the current property
// set matches it, so no operation contributes a URL or a method. Left alone the node
// sends a bare request to the credential base URL and reports `Cannot GET /`, which says
// nothing about what went wrong. These entries match the stale value and stop the
// request with an explanation instead.
const REMOVED: Record<string, string> = {
	ingestion: 'The endpoints behind it no longer exist. Write files instead: File > Create, or File > Update Content for a file that already exists.',
	retrieval: 'Use Search > By Meaning, which searches the same content and tells you which file each result came from.',
};

// Always throws, so it takes no request to modify; that still satisfies PreSendAction.
async function refuseRemovedResource(this: IExecuteSingleFunctions): Promise<IHttpRequestOptions> {
	const resource = this.getNodeParameter('resource', '') as string;
	throw new NodeOperationError(this.getNode(), `The "${resource}" resource no longer exists`, {
		description: REMOVED[resource] ?? 'Pick one of File, Folder or Search.',
	});
}

export const legacyResourceGuard: INodeProperties[] = [
	{
		displayName:
			'This node is set to a resource that was removed in version 0.2.0. Pick File, Folder or Search, then set the operation and its fields again.',
		name: 'legacyNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['ingestion', 'retrieval'],
			},
		},
		routing: {
			send: {
				preSend: [refuseRemovedResource],
			},
		},
	},
];
