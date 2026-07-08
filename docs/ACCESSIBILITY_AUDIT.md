# Pulse AI Accessibility Audit

## Current accessibility improvements

Pulse AI now includes reusable accessibility primitives and application-level patterns:

- Shared focus ring token through `--ds-focus-ring`.
- Reduced motion support through CSS and `MotionConfig`.
- Accessible `Dialog` with labelled title, optional description, Escape close, focus trap, body scroll lock, and focus return.
- Accessible `Dropdown` with menu roles and keyboard navigation.
- Accessible `Tabs` with `tablist`, `tab`, `tabpanel`, Arrow keys, Home, and End.
- Accessible `Accordion` with `aria-expanded`, `aria-controls`, and labelled regions.
- Accessible `Progress` with progressbar values and text.
- Accessible `Toast` live regions.
- `Input` now supports descriptions, hidden labels, required state, invalid state, and error messages with `role="alert"`.
- `Card` now supports keyboard activation when clickable.
- `VisuallyHidden` primitive added for screen-reader-only content.

## WCAG 2.2-oriented checklist

Use this checklist before shipping each page:

### Keyboard

- All interactive elements are reachable with Tab.
- Interactive cards activate with Enter and Space.
- Dialogs trap focus and return focus after close.
- Dropdowns support Arrow keys, Home, End, Escape, Enter, and Space.
- Tabs support Arrow keys, Home, and End.

### Screen readers

- Every page has a clear heading hierarchy.
- Icon-only buttons have `aria-label`.
- Form fields have labels.
- Error messages are associated with inputs using `aria-describedby`.
- Loading states use `aria-busy` where appropriate.
- Empty states use `role="status"` when they describe dynamic results.

### Visual accessibility

- Focus state is visible and consistent.
- Text uses sufficient contrast in light and dark mode.
- UI does not rely on color alone to communicate state.
- Touch targets are at least 44px for primary controls.
- Layout supports mobile, tablet, desktop, and zoom without horizontal overflow.

### Motion

- Decorative animations respect `prefers-reduced-motion`.
- Motion does not block reading or interaction.
- Hover animations have reduced-motion fallbacks.

## Recommended manual testing flow

1. Open the app and navigate only with keyboard.
2. Test login, dashboard navigation, chat, documents, analytics, profile, settings, notifications, and admin pages.
3. Open and close every dialog with keyboard and Escape.
4. Test all dropdowns with Arrow keys and Enter.
5. Test tabs and accordions with keyboard.
6. Enable reduced motion in the OS and repeat key flows.
7. Test dark mode and system mode.
8. Test at 200% browser zoom.
9. Test mobile viewport width around 360px.
10. Run an automated axe/Lighthouse audit after local build.

## Future hardening

- Add Playwright accessibility smoke tests for keyboard-only flows.
- Add axe checks in CI.
- Add route announcements for screen reader users.
- Add a command palette shortcut with documented keyboard help.
- Add automated color-contrast tests for the final brand palette.
