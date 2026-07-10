# Contributing Guide

Thank you for improving Pulse AI. This project is structured like a production SaaS application, so contributions should keep code quality, accessibility, security, and documentation in mind.

## Development workflow

1. Pull the latest `main` branch.
2. Create a focused feature branch.
3. Keep changes small and reviewable.
4. Run type checks and builds before opening a pull request.
5. Update documentation when behavior, setup, or API contracts change.

```bash
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
```

## Frontend checks

```bash
npm install
npm run typecheck
npm run build
```

## Backend checks

```bash
cd backend
pip install -r requirements.txt
pytest
```

## Code style

### Frontend

- Use React + TypeScript.
- Prefer reusable components from `src/components/ui` before creating page-specific UI.
- Keep route pages focused on orchestration and composition.
- Put repeated logic in hooks, services, constants, or utilities.
- Use design tokens and existing spacing/radius/shadow patterns.
- Keep accessibility attributes, focus states, and keyboard navigation intact.
- Respect reduced-motion preferences for animations.

### Backend

- Keep endpoints thin.
- Put business logic in services.
- Validate request and response shapes with Pydantic schemas.
- Scope user-owned data to the authenticated MongoDB user.
- Add indexes when a model field is used for filtering, sorting, or search.
- Preserve soft delete behavior.
- Keep Clerk as the only authentication provider.

## Commit messages

Use Conventional Commits:

```text
feat(chat): add message reaction controls
fix(api): validate document upload size before persistence
docs(readme): add deployment checklist
refactor(ui): extract shared empty state component
```

Recommended types:

- `feat`
- `fix`
- `refactor`
- `perf`
- `test`
- `docs`
- `style`
- `chore`
- `build`
- `ci`

## Pull request checklist

Before requesting review:

- Frontend typecheck passes.
- Frontend production build passes.
- Backend tests pass when backend files change.
- New UI is responsive on mobile, tablet, and desktop.
- Interactive elements are keyboard accessible.
- Empty, loading, error, and success states are handled.
- No inactive buttons or broken navigation remain.
- Documentation is updated.
- Environment values are not committed.
- Screenshots or notes are added for visual changes.

## Documentation expectations

Update the relevant document when making changes:

- `README.md` for project-level overview and setup.
- `docs/ARCHITECTURE.md` for structural changes.
- `docs/FRONTEND_GUIDE.md` for frontend behavior and conventions.
- `docs/BACKEND_GUIDE.md` for backend setup and API architecture.
- `docs/API_DOCUMENTATION.md` for endpoint changes.
- `docs/DEPLOYMENT.md` for deployment changes.
- `docs/ROADMAP.md` for planned future work.

## Security rules

- Never commit real Clerk keys, MongoDB credentials, provider keys, or JWT secrets.
- Keep production CORS restricted to deployed domains.
- Keep admin access controlled by configured admin emails and backend authorization.
- Do not introduce password authentication; Clerk remains the sole auth provider.
- Validate file uploads before accepting metadata.
- Keep API error messages helpful without leaking secrets.

## Accessibility rules

- Every dialog needs a title and close path.
- Every icon-only button needs an accessible label.
- Menus must support keyboard navigation.
- Forms need labels, validation messages, and focus states.
- Route changes should keep focus management working.
- Motion must respect reduced-motion settings.

## Definition of done

A change is done when it is usable, responsive, documented, accessible, and safe to deploy.
