# @qontext/n8n-nodes-qontext

This is an n8n community node. It lets you read and maintain your Qontext context
repository from your n8n workflows.

[Qontext](https://qontext.ai) is a self-maintaining context repository: one place to hold
the company knowledge your AI systems depend on, instead of rebuilding it separately
inside every tool. Context lives as files in folders, with access control and review on
changes, and is reachable over the API, MCP and CLI.

This node puts that repository inside n8n. Workflows can create and edit files, organise
folders, and search the repository by meaning or by regular expression — so a workflow
becomes one of the things keeping your context current, not just a consumer of it. The
node is also available as an AI Agent tool, so an agent can look something up, read a
file and write one back as part of its own reasoning.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

## Table of Contents

- [Installation](#installation)
- [Operations](#operations)
  - [Choosing a File or Folder](#choosing-a-file-or-folder)
  - [File](#file)
  - [Folder](#folder)
  - [Search](#search)
- [Pagination](#pagination)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Usage](#usage)
- [Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

The node has three resources: **File**, **Folder** and **Search**. The workspace whose
context repository you are working in is implicit in your API key, so no workspace ID is
ever needed in a request.

### Choosing a file or folder

Every ID field offers more than one way to name what you mean:

| Mode | What you give it | Notes |
|---|---|---|
| **By ID** | `doc_…` / `dir_…` | The default, except on the fields that accept the root. Checked against the ID shape as you type, so a wrong prefix is an error in the editor rather than a `400 invalid_id` at run time. The bare `doc_…` form only — the API rejects the composite version id `doc_…-cmit_…` on every file endpoint. |
| **From List** | pick from a dropdown of paths | Lists the whole tree and stores the ID, so a later rename or move does not break the workflow. |
| **By Path** | `/support/policies/refunds.md` | Only on fields that name the *subject* of the operation. Costs one extra request per item to turn the path into an ID. |

**By Path** is deliberately absent from the fields that merely *reference* a folder — the
two Create operations and the two Get Many filters — because each already has a path
route of its own: Create takes a full **Path**, and Get Many has a **Path Prefix** filter.

Where the root is a legal answer — creating a folder at the top level, or moving an item
to the root — the dropdown offers **/ (Root)** as its first entry. The root has no ID and
no addressable path, so the list is the only place it can be named, and those fields open
on **From List** rather than **By ID** for that reason. Picking the root is an answer like
any other: the field is required, so a move never falls back to the top level because it
was left alone.

One limitation worth knowing: the API has no text search over paths, so typing in the
**From List** box filters the page already loaded rather than querying the server. On a
large repository a filter can miss a match further down. **By ID** and **By Path** are
always exact.

### File

#### Create
Creates a file at the path given. This is **not** an upsert: a path already holding a
file is a conflict, so it never overwrites and never creates a duplicate.

- **Create By**: `Path` (give the full absolute path) or `Parent Folder` (name an existing folder by ID)
- **Path** (required with `Path`): absolute, ending in `.md` — e.g. `/support/policies/refunds.md`
- **Parent Folder ID** + **File Name** (required with `Parent Folder`)
- **Content** (required): markdown or plain text

#### Get
Fetches a single file by its ID, with its full text. The ID is stable and survives a
rename or a move. A file in another workspace answers as not found, so existence does
not leak.

`content` and `lastChangeId` are read off the same stored revision, so together they are
everything **Update Content** needs for the next write: the base you get back is the base
the text belongs to. The other operations answer the file *without* its content — Create
projects what it just wrote, and Update answers from the write — so `File` and
`FileWithContent` are separate shapes, and only the read by ID carries the text.

- **File ID** (required)

#### Get Many
Lists files. See [Pagination](#pagination).

- **Filter By**: `None` (every file the key can read), `Path` (exact path, ending in
  `.md`, returns zero or one file), `Path Prefix` (every file below a folder,
  recursively) or `Folder ID` (files directly inside a folder, one level only). Only one
  filter can be used — the API rejects a request carrying two.

#### Update
Renames a file, moves it to another folder, or changes whether writes to it go to
review. **Exactly one** of the three per request — the API rejects two rather than
ordering them, because they are separate writes with no transaction across them. The
file's ID never changes, so IDs held elsewhere stay valid; the path does change.

- **File ID** (required)
- **Action**: `Rename` (then **Name**, including the `.md` extension), `Move` (then
  **New Folder ID**, choosing `/ (Root)` to move it to the root), or `Set Protected`
  (then **Protected**)

Note the asymmetry with folders: a file moves via **New Folder ID**, a folder via
**New Parent Folder ID**.

#### Delete
Deletes a file and outputs `{ "success": true }`. Its change history goes with it, so
this is **not reversible** through the API. A protected file, or one with changes still
awaiting review, is refused (`file_protected` / `pending_changes`) and nothing is
removed — clear **Protected** first if you mean to delete it.

- **File ID** (required)

#### Update Content
Replaces the entire content of a file.

- **File ID** (required)
- **Base Change ID** (required): the file's `lastChangeId` when your edit started
- **Content** (required): the full new content

Qontext uses optimistic concurrency, so you must read the file before writing it —
use **File → Get** first and pass its `lastChangeId` into **Base Change ID**. The same
Get also returns the current `content`, so the text you are revising and the base you
send with it come from one request:

```
Qontext (File → Get)  →  edit {{ $json.content }}  →  Qontext (File → Update Content)
                                                          Base Change ID: {{ $json.lastChangeId }}
```

If the file changed in the meantime, the edit is merged where possible. The response's
`content` is what actually landed, which is not always what you sent — adopt it before
editing the file again.

> **The edit does not always land, and a blocked edit is not an error.** Protection is
> Qontext's human-review mechanism: a write to a protected file becomes a change for
> someone to approve rather than an edit that merges. So if the file is **protected**, or
> your edit collides on the same lines as work that landed since, the
> API answers `202` — a *success* your workflow will not catch with error handling — and
> the output has a **different shape**:
>
> | outcome | output |
> |---|---|
> | landed | `{ "object": "edit", "file": { … }, "content": "…" }` |
> | blocked | `{ "object": "change", "id": "chg_…", "status": "blocked", "reason": "protected" \| "conflict", "fileIds": [ … ] }` |
>
> A blocked result has **no `file` key**, so a downstream node reading
> `{{ $json.file.lastChangeId }}` breaks. Branch on `{{ $json.object }}` (an IF node
> testing for `edit`) whenever the file might be protected or concurrently edited.
>
> A blocked change also **pins the file**: until someone resolves it, deleting that file
> or any folder containing it is refused with `pending_changes`. There is no v1 endpoint
> to resolve a change, so this is done in the Qontext UI.

### Folder

#### Create
Creates one folder. Like files, this is not an upsert; an occupied path is a conflict.

- **Create By**: `Path` (missing parents are created on the way) or `Parent Folder`
- **Path** (required with `Path`) — e.g. `/projects/reports`
- **Parent Folder ID** (choose `/ (Root)` for the top level) + **Name** (required with `Parent Folder`)

#### Get
Fetches a single folder by its ID.

- **Folder ID** (required)

#### Get Many
Lists folders. Without a filter it lists root folders. See [Pagination](#pagination).

- **Filter By**: `None` (root folders), `Path`, `Path Prefix` or `Parent Folder ID`.
  One only, for the same reason as files.

#### Update
Renames a folder in place or moves it. A move takes the whole subtree and every ID in
it survives, so IDs held elsewhere stay valid — only the paths below it change.

- **Folder ID** (required)
- **Action**: `Rename` (then **Name**) or `Move` (then **New Parent Folder ID**,
  choosing `/ (Root)` to move it to the root)

#### Delete
Deletes a folder and outputs `{ "success": true }`.

- **Folder ID** (required)
- **Recursive** (default off): delete everything below it too. Left off, a folder that
  still has contents is refused and nothing is removed.

### Search

Both operations return one n8n item per result, and a result appears only if your API
key can read the file. A new or changed file is not searchable straight away, so search
again in a moment if you do not see it.

#### By Meaning
Finds the files that match your query and returns their content, best match first. It
also matches on meaning, so it finds files that answer the query without using the same
words.

- **Query** (required): a few words or a whole question
- **Limit** (default 10, max 500)
- **Include Sources** (default on): cite the file each result came from

#### By Regex
Finds lines matching an [RE2](https://github.com/google/re2/wiki/Syntax) regular
expression. Each result cites the file the lines came from. Results are not
relevance-ranked.

- **Query** (required): the RE2 pattern
- **Limit** (default 10, max 500)
- **Include Sources** (default on)

## Errors

The API answers with `application/problem+json` carrying a machine-readable `code`, a
human-readable `detail` and a `requestId`. n8n shows a generic message for the status
code — the precise `detail` is in the node's error output, under `context.data`.

| code | status | when |
|---|---|---|
| `invalid_request` | 400 | Unknown or malformed field; two mutually exclusive filters; not exactly one action on Update |
| `invalid_id` | 400 | An ID is not of the form `doc_…` / `dir_…` |
| `invalid_cursor` | 400 | The cursor is malformed, or was issued for a different query — start again from the first page |
| `invalid_change_id` | 400 | Base Change ID is not of the form `chg_…` |
| `invalid_base_change` | 400 | Base Change ID names no change of this file |
| `unauthenticated` | 401 | Missing or invalid API key |
| `forbidden` | 403 | The key may not perform this write |
| `file_not_found` / `folder_not_found` | 404 | No such item readable with this key. An item in another workspace answers the same way, so existence does not leak |
| `path_already_exists` | 409 | Something is already at that path — Create is never an upsert |
| `folder_not_empty` | 409 | Delete a folder that still has contents; send Recursive |
| `file_protected` | 409 | Delete a protected file; clear Protected first |
| `pending_changes` | 409 | The file, or a file in the folder, has changes awaiting review |
| `content_too_large` | 422 | Content is longer than the published limit |
| `internal_error` | 500 | Unexpected failure, already reported |
| `service_unavailable` | 503 | Temporarily unreachable — honour `Retry-After` |

## Pagination

**File → Get Many** and **Folder → Get Many** are cursor paginated, never offset.

- **Return All** on: the node follows `nextCursor` until the API reports no more pages.
- **Return All** off: **Limit** (max 1000) caps the results, and **Cursor** lets you
  resume from a `nextCursor` you captured earlier. A cursor belongs to the query that
  issued it, so changing a filter means starting again from the first page.
- **Simplify** on (default): you get one n8n item per file or folder.
- **Simplify** off: you get the raw envelope — `{ object, url, hasMore, nextCursor, data }` —
  which is how you reach `nextCursor` for a manual page walk. With Return All also on,
  that means one envelope item per page.

Do not treat a short page as the end of the list: items your key may not read are
dropped after the page is read, so `hasMore` is the only reliable signal.

## Upgrading from 0.1.x

0.2.0 replaces the entire operation set, because the endpoints the previous operations
called no longer exist. Workflows built on 0.1.x need their Qontext nodes reconfigured
against the File, Folder and Search resources above.

A node still holding an old setting does not fail obscurely: it stops with a message
naming the operation to use instead. Workspace IDs are gone from every operation — the
workspace is implicit in the API key.

## Credentials

To use the Qontext node, you need to set up Qontext API credentials.

### Prerequisites

1. Sign up for a Qontext account at [https://qontext.ai](https://qontext.ai)
2. Create an API key in your Qontext account (e.g. in the **Access Keys** section)

### Setting Up Credentials

1. In n8n, go to **Credentials** → **Add Credential**
2. Search for **Qontext API**
3. Enter:
   - **API Key**: your Qontext API key (masked for security)
   - **Base URL**: the Qontext API base URL. Leave the default (`https://api.qontext.ai`)
     unless you have been given a different host.

The credentials are validated when you save them.

## Compatibility

- **Minimum n8n version**: compatible with n8n versions that support community nodes
- **API version**: Qontext API v1
- **Node API version**: 1

## Usage

### Basic workflow example

1. **Set up credentials**: create an API key in your [Qontext account](https://qontext.ai), then add the **Qontext API** credential in n8n and paste the key.
2. **Add the Qontext node** and choose **File**, **Folder** or **Search**.
3. **Pick an operation** and fill in the required fields.
4. **Run the workflow**.

The node is also usable as an AI Agent tool, so an agent can search your context, read a
file and write one back.

### Common use cases

- **Keep context current**: when a system of record changes, write the update straight into the repository so every connected AI system sees it.
- **Answer from company knowledge**: search by meaning for an incoming question — a support ticket, an RFP, a sales enquiry — and draft a reply grounded in what the repository holds.
- **Let an agent maintain its own context**: attach the node to an AI Agent so it can read a file, revise it and write it back.
- **Bring another source in**: turn records from a system Qontext has no native connector for into files under a folder per source.
- **Audit a subtree**: list every file under a path prefix with Return All and report on what is there.

For general n8n basics, see the [Try it out](https://docs.n8n.io/try-it-out/) documentation.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Qontext Documentation](https://docs.qontext.ai/get-started)
* [GitHub Repository](https://github.com/qontext-ai/n8n-nodes-qontext)
