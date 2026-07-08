# Pulse AI Design System

Pulse AI now has a reusable design system layer built around shared tokens, accessible primitives, and consistent motion patterns.

## Token source

The main token file is:

```text
src/styles/design-system.css
```

It defines:

- Color tokens for background, surface, text, muted text, borders, accent, success, warning, and danger.
- Spacing tokens from `--ds-space-1` through `--ds-space-10`.
- Radius tokens from `--ds-radius-sm` through `--ds-radius-2xl` and `--ds-radius-full`.
- Shadow tokens from `--ds-shadow-xs` through `--ds-shadow-lg`.
- Motion tokens for durations and easing.
- Focus ring, glass surface, card, control, hit target, scrollbar, and visually hidden utilities.

## Component primitives

Reusable UI primitives live in:

```text
src/components/ui
```

Available primitives:

- `Button`
- `Input`
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- `Dialog`
- `Dropdown`
- `Badge`
- `Avatar`
- `Alert`
- `ToastProvider`, `useToast`
- `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`
- `Tabs`
- `Accordion`
- `Tooltip`
- `Progress`
- `Skeleton`, `SkeletonLine`
- `EmptyState`
- `IconButton`
- `VisuallyHidden`
- `OptimizedImage`

## Accessibility standards

All new primitives should follow these rules:

- Every icon-only control must have an accessible label.
- Every form control must have an associated label, description, or `aria-label`.
- Modals must use `role="dialog"`, `aria-modal="true"`, labelled title, Escape close, and focus trapping.
- Dropdowns must support Arrow keys, Home, End, Escape, Enter, and Space.
- Tabs must support Arrow keys, Home, End, proper `tablist`, `tab`, and `tabpanel` roles.
- Accordions must use `aria-expanded` and `aria-controls`.
- Progress bars must expose `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and `aria-valuetext`.
- Toasts should use `role="status"` for informational updates and `role="alert"` for urgent updates.
- Motion must respect `prefers-reduced-motion`.

## Usage examples

```tsx
import { Button, Card, CardContent, Dialog, Input, Tabs, useToast } from '@/components/ui';
```

```tsx
<Card interactive>
  <CardContent>
    <h2>Workspace intelligence</h2>
  </CardContent>
</Card>
```

```tsx
<Input label="Email" type="email" required description="Used for account updates." />
```

```tsx
<Button variant="primary" loading={saving}>Save changes</Button>
```

## Migration rule

When building or editing UI, prefer design system primitives over page-local one-off controls. Keep product-specific composition in feature components and keep reusable behavior in `src/components/ui`.
