# API Documentation

Pulse AI exposes a versioned FastAPI API under `/api/v1`. Protected routes require a Clerk JWT in the `Authorization` header.

```http
Authorization: Bearer <clerk-jwt>
```

All examples below use this base URL:

```text
http://localhost:8000/api/v1
```

## Response conventions

Successful list endpoints use pagination when the resource can grow.

```json
{
  "items": [],
  "page": 1,
  "size": 10,
  "total": 0,
  "pages": 0
}
```

Successful mutation endpoints return the updated resource or a typed success payload.

Errors are normalized by global exception handlers and should include a friendly message plus diagnostic context when appropriate.

## Health

| Method | Path | Auth | Description |
|---|---|---:|---|
| GET | `/health` | No | API liveness check |
| GET | `/health/ready` | No | Database readiness check |

## Authentication and users

| Method | Path | Auth | Description |
|---|---|---:|---|
| GET | `/auth/me` | Yes | Return the authenticated Clerk-synced user |
| GET | `/users/me` | Yes | Return the current MongoDB user profile |

The backend should automatically create a MongoDB user profile the first time a valid Clerk user accesses a protected route.

## Conversations

| Method | Path | Description |
|---|---|---|
| GET | `/conversations` | List conversations with pagination and optional pinned, favorite, or status filters |
| POST | `/conversations` | Create a conversation |
| GET | `/conversations/{conversation_id}` | Get conversation detail |
| PATCH | `/conversations/{conversation_id}` | Update conversation metadata |
| DELETE | `/conversations/{conversation_id}` | Soft-delete a conversation |
| PATCH | `/conversations/{conversation_id}/rename` | Rename a conversation |
| PATCH | `/conversations/{conversation_id}/pin` | Toggle pinned state |
| PATCH | `/conversations/{conversation_id}/favorite` | Toggle favorite state |

## Messages

| Method | Path | Description |
|---|---|---|
| GET | `/conversations/{conversation_id}/messages` | List messages in a conversation |
| POST | `/conversations/{conversation_id}/messages` | Create a message |
| GET | `/conversations/{conversation_id}/messages/{message_id}` | Get one message |
| PATCH | `/conversations/{conversation_id}/messages/{message_id}` | Update message content or metadata |
| DELETE | `/conversations/{conversation_id}/messages/{message_id}` | Delete a message |
| PATCH | `/conversations/{conversation_id}/messages/{message_id}/reaction` | Update reaction state |
| POST | `/conversations/{conversation_id}/messages/{message_id}/regenerate` | Regenerate assistant response |
| POST | `/conversations/{conversation_id}/stream` | Stream assistant response as `text/event-stream` |
| GET | `/conversations/{conversation_id}/typing` | Get typing status |
| POST | `/conversations/{conversation_id}/typing` | Set typing status |

## Documents

| Method | Path | Description |
|---|---|---|
| GET | `/documents` | List documents with category, kind, folder, tags, pagination |
| POST | `/documents/upload` | Upload a document and store metadata |
| GET | `/documents/recent` | Return recent documents |
| GET | `/documents/categories` | Return document category facets |
| GET | `/documents/tags` | Return document tag facets |
| GET | `/documents/{document_id}` | Get document detail |
| GET | `/documents/{document_id}/preview` | Get preview metadata/content |
| PATCH | `/documents/{document_id}` | Update document metadata |
| PATCH | `/documents/{document_id}/rename` | Rename a document |
| PATCH | `/documents/{document_id}/move` | Move a document to another folder |
| DELETE | `/documents/{document_id}` | Soft-delete a document |

## Uploads

The upload module returns metadata and progress-friendly responses. It is designed so Cloudinary or another object store can be added later without changing frontend contracts.

| Method | Path | Description |
|---|---|---|
| POST | `/uploads` | Validate file and return upload metadata |
| POST | `/uploads/validate` | Validate supported file type and size |
| GET | `/uploads/{upload_id}/progress` | Return upload progress state |

Supported file families:

- PDF
- DOCX
- TXT
- CSV
- Images

## Dashboard

| Method | Path | Description |
|---|---|---|
| GET | `/dashboard/overview` | Dashboard summary cards |
| GET | `/dashboard/recent-chats` | Recent chats with search, pinned, favorite filters |
| GET | `/dashboard/recent-documents` | Recent documents with search, category, kind, tag filters |
| GET | `/dashboard/user-statistics` | User-level statistics |
| GET | `/dashboard/ai-usage` | AI usage summary over a time range |
| GET | `/dashboard/notifications` | Paginated dashboard notifications |
| GET | `/dashboard/activity-timeline` | Paginated activity timeline |
| GET | `/dashboard/charts` | Chart-ready dashboard data |
| GET | `/dashboard/search` | Dashboard-scoped search |

## Notifications

| Method | Path | Description |
|---|---|---|
| GET | `/notifications` | List notifications with status/type filters |
| POST | `/notifications` | Create a notification |
| GET | `/notifications/unread-count` | Get unread count |
| GET | `/notifications/categories` | Get notification categories |
| GET | `/notifications/preferences` | Get notification preferences |
| PATCH | `/notifications/preferences` | Update notification preferences |
| POST | `/notifications/mark-all-read` | Mark all notifications read |
| DELETE | `/notifications/clear-all` | Clear all notifications |
| GET | `/notifications/stream` | Stream real-time-ready events |
| PATCH | `/notifications/{notification_id}` | Update a notification |
| PATCH | `/notifications/{notification_id}/read` | Mark one notification read |
| PATCH | `/notifications/{notification_id}/unread` | Mark one notification unread |
| DELETE | `/notifications/{notification_id}` | Delete one notification |

## Global search

| Method | Path | Description |
|---|---|---|
| GET | `/search?q=&page=1&size=10` | Search across chats, messages, documents, users, and settings |
| GET | `/search/filters` | Return supported filter types |

Supported filters:

- `chat`
- `message`
- `document`
- `user`
- `setting`

## Settings

| Method | Path | Description |
|---|---|---|
| GET | `/settings/me` | Get user settings |
| PATCH | `/settings/me` | Update user settings |
| GET | `/settings/me/recent-searches` | Get recent searches |
| POST | `/settings/me/recent-searches` | Add recent search |
| DELETE | `/settings/me/recent-searches` | Clear recent searches |

Settings support:

- Theme
- Language
- Notification preferences
- Timezone
- Profile settings
- Privacy settings
- Security settings

## Admin

Admin routes require `require_admin_user` authorization.

| Method | Path | Description |
|---|---|---|
| GET | `/admin/dashboard` | Admin dashboard overview |
| GET | `/admin/users` | Paginated users with role/status filters |
| PATCH | `/admin/users/{user_id}` | Update user role/status metadata |
| DELETE | `/admin/users/{user_id}` | Delete or deactivate user |
| GET | `/admin/chats` | Paginated chats |
| GET | `/admin/documents` | Paginated documents |
| GET | `/admin/analytics` | Admin analytics |
| GET | `/admin/system-logs` | Paginated system logs |
| POST | `/admin/system-logs` | Create system log entry |
| GET | `/admin/feedback` | Paginated feedback |
| PATCH | `/admin/feedback/{feedback_id}` | Update feedback status |
| GET | `/admin/notifications` | Paginated notifications |
| POST | `/admin/notifications/broadcast` | Broadcast notification |
| GET | `/admin/roles` | List roles |
| POST | `/admin/roles` | Upsert role |
| GET | `/admin/permissions` | List permissions |
| GET | `/admin/settings` | Admin settings overview |

## Streaming responses

Chat streaming returns `text/event-stream`.

```http
POST /api/v1/conversations/{conversation_id}/stream
Content-Type: application/json
Authorization: Bearer <clerk-jwt>
```

The frontend should treat each event as provider-agnostic. Provider selection belongs to backend configuration and request metadata, not frontend branching.

## Versioning

The current API version is `v1`. Breaking changes should be introduced under a new prefix, for example:

```text
/api/v2
```

## API quality checklist

- All protected routes require Clerk JWT verification.
- User-owned resources are scoped to the authenticated MongoDB user.
- List endpoints support pagination.
- Search endpoints cap query length.
- Upload endpoints validate file type and size.
- Admin routes require admin authorization.
- Error responses are normalized.
- Health endpoints stay unauthenticated for deployment checks.
