import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { legacyResourceGuard } from './actions/common/legacy';
import { fileOperations } from './actions/file/file.resource';
import { folderOperations } from './actions/folder/folder.resource';
import { searchOperations } from './actions/search/search.resource';

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
		description: 'Read, write and search your Qontext context repository',
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
					{ name: 'File', value: 'file' },
					{ name: 'Folder', value: 'folder' },
					{ name: 'Search', value: 'search' },
				],
				default: 'file',
			},
			...legacyResourceGuard,
			...fileOperations,
			...folderOperations,
			...searchOperations,
		],
	};
}
