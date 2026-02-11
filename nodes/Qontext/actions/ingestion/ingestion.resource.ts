import type { INodeProperties } from 'n8n-workflow';
import { ingestDataWithMetadata } from './ingestDataWithMetadata.operation';
import { ingestUnstructuredText } from './ingestUnstructuredText.operation';
import { ingestWebsite} from './ingestWebsite.operation';

export const ingestionOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['ingestion'],
            },
        },
        options: [
            {
                name: 'Ingest Data with Metadata',
                value: 'ingestDataWithMetadata',
                action: 'Ingest data with metadata',
                description: 'Ingest data with metadata into the specified vault',
                routing: {
                    request: {
                        method: 'POST',
                        url: 'v1/ingestion/any',
                        body: {
                            vaultId: '={{$parameter["vaultId"]}}',
                            string_data: '={{$parameter["string_data"]}}',
                            source: {
                                source_integration: '={{ $parameter["source"].source.source_integration }}',
                                source_data_type: '={{ $parameter["source"].source.source_data_type }}',
                                source_id: '={{ $parameter["source"].source.source_id }}',
                              }
                        },
                    },
                },
            },
            {
                name: 'Ingest Unstructured Text',
                value: 'ingestUnstructuredText',
                action: 'Ingest unstructured text',
                description: 'Ingest unstructured text into the specified vault',
                routing: {
                    request: {
                        method: 'POST',
                        url: 'v1/ingestion/unstructured',
                        body: {
                            vaultId: '={{$parameter["vaultId"]}}',
                            text: '={{$parameter["text"]}}',
                        },
                    },
                },
            },
            {
                name: 'Ingest Website',
                value: 'ingestWebsite',
                action: 'Ingest website',
                description: 'Ingest website into the specified vault',
                routing: {
                    request: {
                        method: 'POST',
                        url: 'v1/ingestion/website',
                        body: {
                            vaultId: '={{$parameter["vaultId"]}}',
                            url: '={{$parameter["url"]}}',
                            type: '={{$parameter["type"]}}',
                        },
                    },
                },
            },
        ],
        default: 'ingestDataWithMetadata',
    },
     ...ingestDataWithMetadata,
     ...ingestUnstructuredText,
     ...ingestWebsite,
];
