# @qontext/n8n-nodes-qontext

This is an n8n community node. It lets you interact with the Qontext API in your n8n workflows.

Qontext allows you to ingest, store, and retrieve contextual information from various data sources. This node enables you to integrate Qontext's context retrieval and ingestion capabilities into your n8n automation workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

## Table of Contents

- [Installation](#installation)
- [Operations](#operations)
  - [Retrieval Operations](#retrieval-operations)
  - [Ingestion Operations](#ingestion-operations)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Usage](#usage)
- [Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

The Qontext node supports two main resources: **Retrieval** and **Ingestion**.

### Retrieval Operations

#### Retrieve Context
Retrieves relevant context from a specified vault based on a prompt.

Example: retrieve information from older support tickets, documentation, and discussions to draft replies to new customer requests.

**Parameters:**
- **Vault ID** (required): The ID of the vault that should be used to retrieve context
- **Prompt** (required): The prompt to retrieve context for
- **Additional Fields:**
  - **Limit** (required, default: 5): Number of nodes on first level to consider (minimum: 1)
  - **Depth** (required, default: 1): Depth of nodes to retrieve from the graph

### Ingestion Operations

#### Ingest Data with Metadata
Ingests structured or unstructured data with metadata into a specified vault. This operation allows you to add data with source tracking information.

**Parameters:**
- **Vault ID** (required): The ID of the vault that the data should be ingested into
- **Text** (required): The unstructured data (plain or markdown text) to ingest
- **Data Source Name** (required): The system or platform where the data originates
  - Options: HubSpot, Web, Gmail, GoogleDrive, API, Notion, Gong, Slack
- **Data Source Type** (required): The specific type of data being ingested from the source
  - Options: Contact, Company, Deal, Lead, Note, Task, Meeting, Email, Website, Page, File, None, Call, Message
- **Data Source ID** (required): The unique identifier of the data item in the source system

#### Ingest Unstructured Text
Ingests plain unstructured text into a specified vault without metadata requirements.

**Parameters:**
- **Vault ID** (required): The ID of the vault that the data should be ingested into
- **Text** (required): The text data to ingest

#### Ingest Website
Ingests content from a website URL into a specified vault. Supports both single page and deep crawl options.

**Parameters:**
- **Vault ID** (required): The ID of the vault that the data should be ingested into
- **URL** (required): The website URL to ingest
- **Type** (required): The type of ingestion to perform
  - **Single Page**: Ingests only the given URL. Use for one-off pages or articles.
  - **Deep Crawl**: Crawls the whole site from that URL and follows links, scrapes multiple pages as markdown, and ingests them in one go.

## Credentials

To use the Qontext node, you need to set up Qontext API credentials.

### Prerequisites

1. Sign up for a Qontext account at [https://qontext.ai](https://qontext.ai)
2. Create an API key in your Qontext account (e.g. in **Access Keys** section in the respective Qontext vault)

### Setting Up Credentials

1. In n8n, go to **Credentials** → **Add Credential**
2. Search for **Qontext API**
3. Enter the API key you created in the Qontext UI:
   - **X-API-Key**: Your Qontext API key (this field is masked for security)
   - **Domain**: The API domain (default: `https://api.qontext.ai`)

The credentials will be automatically validated when you save them.

## Compatibility

- **Minimum n8n version**: Compatible with n8n versions that support community nodes 
- **API Version**: Uses Qontext API v1
- **Node API Version**: 1

## Usage

### Basic Workflow Example

1. **Set up credentials**: Create an API key in your [Qontext account](https://qontext.ai), then in n8n add the **Qontext API** credential and paste the key.
2. **Add the Qontext node** to your workflow and choose **Retrieval** or **Ingestion**.
3. **Pick an operation** (e.g. Retrieve Context, Ingest Website) and fill in the required fields (Vault ID, Prompt or URL, etc.).
4. **Run the workflow** to retrieve context or ingest data into your vault.

For general n8n workflow basics, see the [n8n documentation](https://docs.n8n.io/try-it-out/).

### Common Use Cases

- **Data ingestion**: Ingest data from Slack, Gmail, HubSpot, and other sources into your vaults so it can be queried later.
- **Personalized emails**: Pull in relevant context (e.g. customer history, product info) when drafting personalized marketing emails.
- **Lost deal reactivation**: Retrieve context on why a deal was lost, then draft personalized reactivation messages.
- **Sales call prep**: Before a call, get context for the lead to surface notes, deals, and past interactions.
- **Support and answer drafts**: Retrieve information related to a new support tickets in older tickets, documentations, discussions etc. and generate answer drafts for customer requests.

For new n8n users, check out the [Try it out](https://docs.n8n.io/try-it-out/) documentation to get started with n8n basics.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Qontext Documentation](https://docs.qontext.ai/get-started)
* [GitHub Repository](https://github.com/qontext-ai/n8n-nodes-qontext)