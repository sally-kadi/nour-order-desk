
# REVIEW — Assignment 4: Nour's Order Desk

## 1. Project Summary

Nour's Order Desk is a full-stack order management dashboard for a fictional handmade candle studio.

The application was built using Next.js 16, TypeScript, and Tailwind CSS.

It supports creating, viewing, updating, and deleting customer orders through REST API endpoints.

## 2. Completed Implementation

### Backend

- Five REST API operations: GET all, GET by ID, POST, PATCH, DELETE.
- Shared in-memory order storage.
- Server-generated order IDs.
- Order totals calculated using integer cents.
- Input validation and meaningful HTTP status codes.
- Partial PATCH updates without replacing unrelated fields.
- Rejected updates leave existing data unchanged.
- Unknown order IDs return 404.
- Successful DELETE returns 204 No Content.

### Frontend

- Responsive order dashboard.
- Order counts and status summaries.
- Create, edit, view, and delete actions.
- Delete confirmation.
- Loading, error, retry, and empty states.
- Order details dialog with keyboard support.
- Form protection implemented for pending save requests.
- Mobile-friendly table with horizontal scrolling.

## 3. Testing Completed

Manual testing covered:

- Creating, editing, viewing, and deleting orders.
- Server-calculated totals.
- Status updates.
- API validation and error responses.
- Unknown GET, PATCH, and DELETE requests returning 404.
- Rejected updates preserving original order data.
- API failure and recovery using the Retry button.
- Keyboard focus trapping, Escape, and focus restoration.
- Mobile layout at 360 × 642 px.
- Empty-state rendering using a temporary response override.
- Exact CRUD acceptance scenario.
- Additional order creation with quantity 2 and total $16.

Quality checks completed:

- `npm run lint` — Passed.
- `npm run build` — Passed.
- TypeScript compilation — Passed.

Full testing details are documented in `docs/TESTING.md`.

## 4. Technical Challenges

### API Validation

The API needed to reject invalid quantities, prices, statuses, and malformed JSON without changing valid stored data.

### Accurate Totals

Order totals are calculated using integer cents to reduce floating-point rounding problems.

### State Synchronization

After creating, editing, or deleting an order, the dashboard refreshes its list and counts.

### Accessibility

The order details dialog supports keyboard navigation, Escape to close, and focus restoration.

### Network Failure Handling

The dashboard shows a useful error and Retry button when loading orders fails.

## 5. Design Decisions

- A warm, minimal visual style reflects the handmade candle studio theme.
- A single dashboard keeps order management straightforward.
- REST endpoints separate server operations from the user interface.
- A native dialog supports accessible order details.
- In-memory storage keeps the assignment focused on CRUD and API behavior.
- Fictional customer data avoids using real personal information.

## 6. Known Limitations

- Orders are not persisted in a database.
- Data may reset when the server restarts.
- Authentication and user roles are not implemented.
- Payment processing and inventory management are outside the assignment scope.

## 7. Remaining Verification

- Complete a dedicated interaction test proving that form fields and Cancel/Add/Edit controls cannot interrupt an in-flight save.
- Ensure any required evidence screenshots are saved in the repository.
- Commit and push the final changes to the assignment branch.

## 8. Final Reflection

This assignment strengthened my understanding of full-stack CRUD development with Next.js and TypeScript.

I practiced connecting frontend actions to API routes, validating input, calculating totals safely, handling failed requests, and testing accessibility and responsive layouts.

The most important lesson was that a successful API response is not enough: rejected updates must also preserve existing data, and the interface must handle loading and error states clearly.

## 9. AI Usage and Technical Understanding

### How does creating an order work?

The frontend sends a POST request to `/api/orders`. The server validates the submitted data, generates an ID, calculates the total, stores the order, and returns 201 Created.

### How is the total calculated?

The server converts the unit price to integer cents, multiplies it by quantity, and converts the result back to dollars.

### What happens when a PATCH request is invalid?

The API returns 400 Bad Request and does not modify the existing order.

### Why use PATCH instead of replacing the entire order?

PATCH allows updating selected fields while preserving the other values.

### What happens when the server restarts?

Because storage is in memory, order changes may be lost.

### How was AI assistance verified?

AI-assisted suggestions were checked against the actual implementation and manual tests, including POST followed by GET, rejected PATCH followed by GET, and the exact CRUD acceptance scenario.
