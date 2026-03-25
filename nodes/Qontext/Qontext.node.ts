import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { ingestionOperations } from './actions/ingestion/ingestion.resource';
import { retrievalOperations } from './actions/retrieval/retrieval.resource';

export class Qontext implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qontext',
		name: 'qontext',
		icon: { 
			light: 'file:qontext_light.svg', 
			dark: 'file:qontext_dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] || "Select operation"}}: {{$parameter["resource"] || "Select resource"}}',
		description: 'Ingest and retrieve company context with the Qontext API',
		defaults: {
			name: 'Qontext',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'qontextApi', required: true }],
		requestDefaults: {
			baseURL: '={{$credentials.domain}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			// Resource selector
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Ingestion', value: 'ingestion' },
					{ name: 'Retrieval', value: 'retrieval' },
				],
				default: 'retrieval',
			},
			...ingestionOperations,
			...retrievalOperations,
		],
	};
}
