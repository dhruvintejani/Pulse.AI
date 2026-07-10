# Future Roadmap

Pulse AI is already structured as a production-quality portfolio project. The roadmap below focuses on turning the current foundation into a real user-facing SaaS product.

## Phase 1 — Provider activation

- Connect real provider keys for OpenAI, Gemini, Claude, Groq, and DeepSeek.
- Add provider health checks and fallback behavior.
- Add per-provider rate limit and cost tracking.
- Add model capability metadata so the UI can show context window, speed, and best-use recommendations.
- Persist provider usage events for analytics and billing.

## Phase 2 — Document intelligence

- Add Cloudinary or object storage for uploaded files.
- Add background extraction for PDFs, DOCX, TXT, CSV, and images.
- Store extracted text chunks with document metadata.
- Add semantic search over document chunks.
- Add document question answering through the AI provider abstraction.
- Add document version history and restore support.

## Phase 3 — Collaboration

- Add organizations and workspaces.
- Add role-based access control per workspace.
- Add invitation emails and invite acceptance flow.
- Add shared folders, shared chats, and workspace activity feed.
- Add admin audit trails for sensitive actions.

## Phase 4 — Production observability

- Add CI for frontend type checks and backend tests.
- Add API contract tests for key endpoints.
- Add request tracing and structured log export.
- Add frontend error reporting through `VITE_ERROR_LOG_ENDPOINT`.
- Add uptime monitoring for `/api/v1/health` and `/api/v1/health/ready`.
- Add Lighthouse checks for performance, accessibility, best practices, SEO, and PWA.

## Phase 5 — Billing and usage

- Add plan model and entitlement checks.
- Add usage-based limits for messages, tokens, documents, storage, and team members.
- Add Stripe billing integration.
- Add invoice history and subscription management.
- Add admin usage analytics and customer support tooling.

## Phase 6 — Enterprise readiness

- Add SSO/SAML support through Clerk enterprise features.
- Add SCIM-ready user provisioning plan.
- Add retention policies and export controls.
- Add workspace-level data residency strategy.
- Add audit log export.
- Add security documentation and incident response runbook.

## Portfolio polish backlog

- Add deployed production URLs to README badges after launch.
- Add real screenshots captured from Vercel after final deployment.
- Add a short product demo video or GIF.
- Add architecture diagram image generated from the final deployment topology.
- Add a public changelog with release notes.
- Add GitHub Actions workflow for typecheck, build, and backend tests.
