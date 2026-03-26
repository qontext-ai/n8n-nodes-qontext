import type { INodeProperties } from 'n8n-workflow';
import { retrievalContextOperation } from './retrieveContext.operation';

export const retrievalOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['retrieval'],
            },
        },
        options: [
            {
                name: 'Retrieve Context',
                value: 'retrieveContext',
                action: 'Retrieve context',
                description: 'Retrieve context from the specified vault related to your prompt',
                routing: {
					request: {
						method: 'POST',
						url: 'v1/retrieval',
						body: {
							vaultId: '={{$parameter["vaultId"]}}',
							prompt: '={{$parameter["prompt"]}}',
							includeSources: true,
							limit: 5,
							depth: 1
						},
					},
				},
            },
        ],
        default: 'retrieveContext',
    },
    ...retrievalContextOperation,
];
