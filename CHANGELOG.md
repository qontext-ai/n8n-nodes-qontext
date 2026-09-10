# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-09-10

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

- **Existing API keys stop working.** Keys issued before this release were scoped to a
  vault, and vaults no longer exist. Every credential saved on 0.1.5 has to be replaced
  with a key issued by the current API — there is no upgrade path that keeps one.

- **Domain** from the credential, renamed to **Base URL** (`domain` → `baseUrl`). The
  property name is the storage key, so the old value is left behind; since the key has
  to be re-entered anyway, the Base URL is on screen at the same moment and can be set
  with it.

Workflows using the removed operations must be rebuilt. The node's internal version
stays at 1, so existing nodes pick up the new operation list on upgrade.

### Added
- **File** resource: Create, Get, Get Many, Update (rename / move / set protected),
  Update Content, Delete.
- **Folder** resource: Create, Get, Get Many, Update (rename or move), Delete.
- **Search** resource: By Meaning (hybrid) and By Regex (RE2 line matching).
- Every file and folder ID field is now a resource locator with more than one mode.
  **By ID** (the default) validates the `doc_…` / `dir_…` shape in the editor, so a wrong
  prefix is an inline error instead of a `400 invalid_id`. Only the bare `doc_…` form is
  accepted, since the API rejects the composite version id (`doc_…-cmit_…`) on every file
  endpoint. **From List** is a dropdown of paths that stores the
  ID, so a later rename or move does not break the workflow. **By Path** names the
  subject of an operation directly and resolves to an ID before the request, at the cost
  of one extra request per item; it is offered only where the operation has no other path
  route. Fields where the root is a legal answer offer **/ (Root)** in the dropdown, since
  the root has neither an ID nor an addressable path; those fields open on **From List**
  and are required, so picking the root is an explicit answer rather than what an
  untouched field happens to mean.
- Cursor pagination on both Get Many operations, with **Return All** to follow
  `nextCursor` to the end, a manual **Cursor** field, and **Simplify** to choose between
  one item per record and the raw `{ hasMore, nextCursor, data }` envelope.
- Optimistic concurrency on **File > Update Content** via **Base Change ID**. Note a
  protected file, or an edit colliding on the same lines, answers 202 with a blocked
  change instead of the edited file — see the README, the output shape differs.
- **File > Update Content** now says so in the editor too: a notice on the operation, and
  a hint on the output pane after a run, both pointing at the `object` field to branch on.
  The 202 is a success, so nothing else in the UI distinguishes it.

### Fixed
- Return All could loop forever if a page ever reported more results without handing
  back a cursor; it now also requires the cursor.
- The list filters were a collection that let two mutually exclusive filters be sent
  together, which the API rejects. They are now one **Filter By** choice.
- **Cursor** was offered alongside **Filter By: Path** on both Get Many operations, and
  the API rejects that pair — a path addresses at most one item, so it issues no cursor.
  Cursor now shows only for the filters that actually page.
- IDs are URL-encoded before being placed in a request path.
- Domain and API Key are marked required on the credential.
- A node left on a resource removed in this release now stops with an explanation
  naming its replacement, instead of sending a bare request and reporting `Cannot GET /`.
- Credential documentation URL and the node's codex metadata pointed at
  `docs.qontext.ai/get_started`, which 404s. Now `get-started`.
- Codex node identifier was `n8n-nodes-base.Qontext`. Community nodes use the bare
  package name, so it is now `@qontext/n8n-nodes-qontext`.

### Changed
- ID fields keep **By ID** as their default mode, so an ID pasted from an earlier
  response — or supplied by an AI Agent using this node as a tool — still works as a
  plain string. The dropdown's filter narrows the page already loaded rather than
  querying the server, because the API has no text search over paths.
- Upgraded `@n8n/node-cli` to 0.47, which brings the `@n8n/eslint-plugin-community-nodes`
  verification rules (42 of them) into the lint gate, and extended `npm run lint` to
  cover `package.json`. The previous 0.1.0 pin ran none of them.
- Publishing now runs from the CLI's own workflow: triggered by a version tag, driven by
  `npm run release`, and authenticated by OIDC when no `NPM_TOKEN` is set. CI moved to
  Node 22, which a transitive dependency of the toolchain requires.
- **File > Get** now answers the file's content alongside its metadata, following the
  API's new `FileWithContent` read. `content` and `lastChangeId` come off the same
  revision, so a Get feeds **Update Content** directly. The other operations are
  unchanged and still answer the file without its text.
- `package.json` description now matches what the node does.
- Field descriptions follow the API reference wording, and no longer state the content
  length limit, which the API reports in its own error.

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
