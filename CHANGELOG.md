# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

The Qontext API was rebuilt. This release replaces the node's entire operation set to
match it.

### Removed (breaking)
- **Ingestion** resource. `POST /v1/ingestion/any`, `/v1/ingestion/unstructured` and
  `/v1/ingestion/website` no longer exist server-side, so all three operations returned
  404. Write files with **File > Create** instead.
- **Retrieval** resource. Superseded by **Search > By Meaning**, which searches the same
  content and returns the file each result came from.
- **Vault ID** from every operation. The workspace is now implicit in the API key and
  never appears in a request.

Workflows using the removed operations must be rebuilt. The node's internal version
stays at 1, so existing nodes pick up the new operation list on upgrade.

### Added
- **File** resource: Create, Get, Get Many, Update (rename / move / set protected),
  Update Content, Delete.
- **Folder** resource: Create, Get, Get Many, Update (rename or move), Delete.
- **Search** resource: By Meaning (hybrid) and By Regex (RE2 line matching).
- Cursor pagination on both Get Many operations, with **Return All** to follow
  `nextCursor` to the end, a manual **Cursor** field, and **Simplify** to choose between
  one item per record and the raw `{ hasMore, nextCursor, data }` envelope.
- Optimistic concurrency on **File > Update Content** via **Base Change ID**. Note a
  protected file, or an edit colliding on the same lines, answers 202 with a blocked
  change instead of the edited file — see the README, the output shape differs.

### Fixed
- Return All could loop forever if a page ever reported more results without handing
  back a cursor; it now also requires the cursor.
- The list filters were a collection that let two mutually exclusive filters be sent
  together, which the API rejects. They are now one **Filter By** choice.
- Moving to the root was expressed by leaving the target folder empty, so a
  half-configured node could relocate a subtree. It is now an explicit **Move to Root**
  action and the target field is required.
- IDs are URL-encoded before being placed in a request path.
- Domain and API Key are marked required on the credential.
- A node left on a resource removed in this release now stops with an explanation
  naming its replacement, instead of sending a bare request and reporting `Cannot GET /`.
- Credential documentation URL and the node's codex metadata pointed at
  `docs.qontext.ai/get_started`, which 404s. Now `get-started`.
- Codex node identifier was `n8n-nodes-base.Qontext`, which is wrong for a community
  package.

### Changed
- Upgraded `@n8n/node-cli` to 0.47, which brings the `@n8n/eslint-plugin-community-nodes`
  verification rules (42 of them) into the lint gate, and extended `npm run lint` to
  cover `package.json`. The previous 0.1.0 pin ran none of them.
- `package.json` description now matches what the node does.

### Note
At release time the production API serves only File > Get and File > Get Many; the rest
of the endpoints are live on staging and roll out to production shortly. See the
Compatibility section of the README.

## [0.1.5] - 2026-03-30

### Fixed
- Incorrect URL field description in the Ingest Website operation

## [0.1.4] - 2026-03-26

### Fixed
- `additionalFields` routing for the retrieval `limit` and `depth` parameters, which
  were not overriding the request body defaults

## [0.1.3] - 2026-03-25

### Changed
- Style improvements across the node definitions

## [0.1.2] - 2026-03-25

### Changed
- Removed npm overrides and updated the node description

## [0.1.1] - 2026-02-11

### Changed
- Renamed `knowledgeGraphId` to `vaultId` throughout

## [0.1.0] - 2026-01-28

### Added
- Initial release of the Qontext n8n community node
- **Retrieval Operations**:
  - Get Context: Retrieve relevant context from a vault based on a prompt
- **Ingestion Operations**:
  - Ingest Data with Metadata: Ingest structured/unstructured data with source tracking
  - Ingest Unstructured Text: Ingest plain text without metadata
  - Ingest Website: Ingest website content with single page or deep crawl options
- Qontext API credentials support with API key authentication
- Support for all major data source integrations (HubSpot, Web, Gmail, GoogleDrive, API, Notion, Gong)
- Configurable retrieval parameters (limit, depth)
- Comprehensive README documentation
