import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class QontextApi implements ICredentialType {
	name = 'qontextApi';

	displayName = 'Qontext API';

	documentationUrl = 'https://docs.qontext.ai/get-started';
	icon = {
		light: 'file:qontext_light.svg',
		dark: 'file:qontext_dark.svg',
	} as const;
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.qontext.ai',
			required: true,
			description: 'Base URL of the Qontext API. Leave the default unless you have been given a different host.',
		},
		{
			displayName: 'API Key',
			name: 'xApiKey',
			type: 'string',
			default: '',
			required: true,
			typeOptions: {
				password: true,
			}
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.xApiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			method: 'POST', // Required for validate-key
			baseURL: '={{$credentials?.baseUrl}}',
			url: '/auth/validate-key',
			headers: {
				'X-API-Key': '={{$credentials?.xApiKey}}',
				'accept': '*/*',
			},
			body: {}, // Empty object to send POST with empty payload
		},
	}
};
