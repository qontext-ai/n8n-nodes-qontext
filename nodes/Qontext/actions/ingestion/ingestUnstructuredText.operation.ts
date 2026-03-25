// Here we define what to show when the `ingestUnstructuredText` operation is selected.
// We do that by adding `operation: ["ingestUnstructuredText"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';

export const ingestUnstructuredText: INodeProperties[] = [
    {
        displayName: 'Vault ID',
        name: 'vaultId',
        type: 'string',
        default: '',
        description: 'The ID of the vault that the data should be ingested into',
        displayOptions: {
            show: {
                resource: ['ingestion'],
                operation: ['ingestUnstructuredText'],
            },
        },
        required: true,
    },
    {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        typeOptions: {
            rows: 5, 
        },
        default: '',
        description: 'The text data to ingest',
        displayOptions: {
            show: {
                resource: ['ingestion'],
                operation: ['ingestUnstructuredText'],
            },
        },
        required: true,
    },
];
