// Here we define what to show when the `ingestUnstructuredText` operation is selected.
// We do that by adding `operation: ["ingestUnstructuredText"]` to `displayOptions.show`

import { INodeProperties } from "n8n-workflow/dist/esm/interfaces";

export const ingestUnstructuredText: INodeProperties[] = [
    {
        displayName: 'Vault ID',
        name: 'knowledgeGraphId',
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
