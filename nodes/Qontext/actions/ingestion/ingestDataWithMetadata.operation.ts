// Here we define what to show when the `ingestDataWithMetadata` operation is selected.
// We do that by adding `operation: ["ingestDataWithMetadata"]` to `displayOptions.show`
import type { INodeProperties } from 'n8n-workflow';

export const ingestDataWithMetadata: INodeProperties[] = [
	{
		displayName: 'Vault ID',
		name: 'vaultId',
		type: 'string',
		default: '',
		description: 'The ID of the vault that the data should be ingested into',
		displayOptions: {
			show: {
				resource: ['ingestion'],
				operation: ['ingestDataWithMetadata'],
			},
		},
		required: true,
	},
	{
		displayName: 'Text',
		name: 'string_data',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		default: '',
		description: 'The unstructured data (plain or markdown text) to ingest',
		displayOptions: {
			show: {
				resource: ['ingestion'],
				operation: ['ingestDataWithMetadata'],
			},
		},
		required: true,
	},
	{
		displayName: 'Source',
		name: 'source',
		type: 'fixedCollection',
		default: {},
		displayOptions: {
			show: {
				resource: ['ingestion'],
				operation: ['ingestDataWithMetadata'],
			},
		},
		typeOptions: {
			multipleValues: false, 
		},
		required: true,
		options: [
			{
				displayName: 'Source',
				name: 'source',
				values: [

					{
						displayName: 'Data Source Name',
						name: 'source_integration',
						type: 'options',
						default: 'HubSpot',
						description: 'The system or platform where the data originates',
						options: [
							{name: 'API', value: 'API'},
							{name: 'Gmail', value: 'Gmail'},
							{name: 'Gong', value: 'Gong'},
							{name: 'GoogleDrive', value: 'GoogleDrive'},
							{name: 'HubSpot', value: 'HubSpot'},
							{name: 'Notion', value: 'Notion'},
							{name: 'Slack', value: 'Slack'},
							{name: 'Web', value: 'Web'},
						],
					},
					// API - Only None
					{
						displayName: 'Data Type',
						name: 'source_data_type',
						type: 'options',
						default: 'None',
						description: 'The specific type of data being ingested from the source',
						options: [
							{name: 'None', value: 'None'},
						],
						displayOptions: {
							show: {
								source_integration: ['API'],
							},
						},
					},
					// Gmail - Only Email
					{
						displayName: 'Data Type',
						name: 'source_data_type',
						type: 'options',
						default: 'Email',
						description: 'The specific type of data being ingested from the source',
						displayOptions: {
							show: {
								source_integration: ['Gmail'],
							},
						},
						options: [
							{name: 'Email',value: 'Email'},
						],
					},
					// Gong - Only Call
					{
						displayName: 'Data Type',
						name: 'source_data_type',
						type: 'options',
						default: 'Call',
						description: 'The specific type of data being ingested from the source',
						displayOptions: {
							show: {
								source_integration: ['Gong'],
							},
						},
						options: [
							{name: 'Call',value: 'Call'},
						],
					},
					// GoogleDrive - File types
					{
						displayName: 'Data Type',
						name: 'source_data_type',
						type: 'options',
						default: 'File',
						description: 'The specific type of data being ingested from the source',
						displayOptions: {
							show: {
								source_integration: ['GoogleDrive'],
							},
						},
						options: [
							{name: 'Doc', value: 'Doc'},
							{name: 'File', value: 'File'},
							{name: 'PDF', value: 'PDF'},
							{name: 'Sheet', value: 'Sheet'},
							{name: 'Slide', value: 'Slide'},
						],
					},
					// HubSpot - Multiple types
					{
						displayName: 'Data Type',
						name: 'source_data_type',
						type: 'options',
						default: 'Contact',
						description: 'The specific type of data being ingested from the source',
						displayOptions: {
							show: {
								source_integration: ['HubSpot'],
							},
						},
						options: [
							{name: 'Call', value: 'Call'},
							{name: 'Company', value: 'Company'},
							{name: 'Contact', value: 'Contact'},
							{name: 'Deal', value: 'Deal'},
							{name: 'Email', value: 'Email'},
							{name: 'Lead', value: 'Lead'},
							{name: 'Meeting', value: 'Meeting'},
							{name: 'Note', value: 'Note'},
							{name: 'Task', value: 'Task'},
						],
					},
					// Notion - Only Page
					{
						displayName: 'Data Type',
						name: 'source_data_type',
						type: 'options',
						default: 'Page',
						description: 'The specific type of data being ingested from the source',
						displayOptions: {
							show: {
								source_integration: ['Notion'],
							},
						},
						options: [
							{name: 'Page', value: 'Page'},
						],
					},
					// Slack - Only Message
					{
						displayName: 'Data Type',
						name: 'source_data_type',
						type: 'options',
						default: 'Message',
						description: 'The specific type of data being ingested from the source',
						displayOptions: {
							show: {
								source_integration: ['Slack'],
							},
						},
						options: [
							{name: 'Message', value: 'Message'},
						],
					},
					// Web - Only Website
					{
						displayName: 'Data Type',
						name: 'source_data_type',
						type: 'options',
						default: 'Website',
						description: 'The specific type of data being ingested from the source',
						displayOptions: {
							show: {
								source_integration: ['Web'],
							},
						},
						options: [
							{name: 'Website', value: 'Website'},
						],
					},
					{
						displayName: 'Source ID',
						name: 'source_id',
						type: 'string',
						default: '',
						description: 'The unique identifier of the data item in the source system',
					},
				],
			},
		],
	},
];
