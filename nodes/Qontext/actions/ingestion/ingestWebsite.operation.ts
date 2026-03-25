// Here we define what to show when the `ingestWebsite` operation is selected.
// We do that by adding `operation: ["ingestWebsite"]` to `displayOptions.show`

import type { INodeProperties } from 'n8n-workflow';

export const ingestWebsite: INodeProperties[] = [
    {
        displayName: 'Vault ID',
        name: 'vaultId',
        type: 'string',
        default: '',
        description: 'The ID of the vault that the data should be ingested into',
        displayOptions: {
            show: {
                resource: ['ingestion'],
                operation: ['ingestWebsite'],
            },
        },
        required: true,
    },
    {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        typeOptions: {
            rows: 5,
        },
        default: '',
        description: 'The text data to ingest',
        displayOptions: {
            show: {
                resource: ['ingestion'],
                operation: ['ingestWebsite'],
            },
        },
        required: true,
    },
    {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        options: [
            {
                name: 'Deep Crawl',
                value: 'deepCrawl',
            },
            {
                name: 'Single Page',
                value: 'singlePage',
            },
        ],
        default: 'singlePage',
        description: 'The type of ingestion to perform',
        displayOptions: {
            show: {
                resource: ['ingestion'],
                operation: ['ingestWebsite'],
            },
        },
        required: true,
    }
];
