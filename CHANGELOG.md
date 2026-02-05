# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
