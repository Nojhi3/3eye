# IdeaForge QA module

## Automated checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:qa
```

The Vitest suite covers chat input limits, history normalization, Gemini conversation ordering, API-key detection, fallback intent routing, and the health/chat route contracts.

## Manual acceptance checklist

- Landing page loads at desktop, tablet, and mobile widths without horizontal overflow.
- Signup and login validate required fields and route each role to the correct dashboard.
- Unauthenticated access to a protected screen redirects to login.
- A package purchase creates an order and appointment.
- Appointments can be rescheduled and cancelled.
- A consultant can start an audit, complete its checklist, submit notes, and finish the job.
- Completing a package audit provisions devices and updates maintenance data.
- Device filters, add, toggle, and delete actions behave correctly.
- AI chat handles a normal prompt, a blank prompt, a long prompt, provider failure, and fallback mode.
- `/api/health` reports the selected Gemini model without revealing secrets.
- Admin screens render charts and package/user operations without console errors.
- Keyboard focus, form labels, error messages, contrast, and mobile navigation are usable.

## Known QA limitations

The current application uses browser-local IndexedDB with a localStorage migration/backup path. Multi-user isolation, secure sessions, database constraints, payment webhooks, and server-side role enforcement require a hosted backend before production use. Browser automation and Lighthouse should be added in CI after the deployment environment is made available to the test runner.
