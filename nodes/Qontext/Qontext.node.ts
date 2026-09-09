import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { searchFiles, searchFolders, searchFoldersWithRoot } from './methods/listSearch';
import { legacyResourceGuard } from './actions/common/legacy';
import { fileOperations } from './actions/file/file.resource';
import { folderOperations } from './actions/folder/folder.resource';
import { searchOperations } from './actions/search/search.resource';

export class Qontext implements INodeType {
	// Backs the `From List` mode of every ID locator. Named methods rather than inline
	// routing because a dropdown pages independently of any request the node makes.
	methods = {
		listSearch: {
			searchFiles,
			searchFolders,
			searchFoldersWithRoot,
		},
	};

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
		// Shown on the output, after the run, because the thing worth saying is about the
		// shape that came back: Update Content answers 202 with a blocked change instead of
		// an edit when the file is protected or the edit collided, and that is a success, so
		// nothing else in the UI marks it.
		hints: [
			{
				message:
					'Check <code>object</code> on the output. <code>edit</code> means the content landed; <code>change</code> means it was held for review and there is no <code>file</code> key to read.',
				type: 'info',
				location: 'outputPane',
				displayCondition: '={{ $parameter.operation === "updateContent" }}',
				whenToDisplay: 'afterExecution',
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
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
