
# PLAN — Assignment 4: Nour's Order Desk

## 1. Project Goal

Build a responsive full-stack order management application for Nour, the owner of a fictional handmade candle studio.

The application allows the business to create, view, update, and delete customer orders using Next.js API Route Handlers.

## 2. Problem Statement

Nour needs a simple way to organize customer orders, track their progress, and calculate totals without relying on manual records.

The solution should provide a clear dashboard and reliable server-side validation.

## 3. Technology Stack

- Next.js 16 (App Router)
- React
- TypeScript
- Tailwind CSS
- Next.js Route Handlers
- In-memory data storage
- Git and GitHub

## 4. Core Requirements

### Order Management

- Display a list of customer orders.
- View individual order details.
- Create new orders.
- Edit existing orders.
- Delete orders with confirmation.
- Update order status.
- Automatically calculate order totals.

### API Requirements

- GET `/api/orders`
- GET `/api/orders/[id]`
- POST `/api/orders`
- PATCH `/api/orders/[id]`
- DELETE `/api/orders/[id]`

### Validation

- Reject blank required fields.
- Require positive integer quantities.
- Reject negative unit prices.
- Reject invalid order statuses.
- Reject malformed JSON.
- Return appropriate HTTP status codes.
- Prevent clients from overriding server-generated fields.

### User Interface

- Responsive dashboard.
- Order summary cards.
- Order table.
- Create and edit forms.
- Order details view.
- Loading, empty, and error states.
- Retry functionality when loading fails.

## 5. Implementation Plan

| Phase | Planned Work | Current Status |
|---|---|---|
| 1 | Set up Next.js and TypeScript | Completed |
| 2 | Define order types and in-memory storage | Completed |
| 3 | Implement REST API endpoints | Completed |
| 4 | Add server-side validation | Completed |
| 5 | Build responsive dashboard | Completed |
| 6 | Implement Create, View, Edit, Delete | Completed |
| 7 | Add error handling and retry | Implemented; retry testing pending |
| 8 | Run API and UI tests | In progress |
| 9 | Prepare documentation and evidence | In progress |
| 10 | Final review and submission | Pending |

## 6. Data Model

Each order includes:

- `id`
- `customerName`
- `phone`
- `productName`
- `quantity`
- `unitPrice`
- `total`
- `status`

Supported statuses:

- Pending
- Preparing
- Delivered

The server generates the order ID and calculates the total.

## 7. Testing Strategy

### Functional Tests

- Load the order list.
- View an individual order.
- Create an order.
- Update quantity and status.
- Verify total recalculation.
- Delete an order.
- Confirm dashboard counts update.

### API Validation Tests

- Reject quantity equal to zero.
- Reject negative unit prices.
- Reject invalid statuses.
- Reject empty PATCH requests.
- Reject malformed JSON.
- Return 404 for nonexistent orders.

### Quality Checks

- Run `npm run lint`.
- Run `npm run build`.
- Check responsive layouts.
- Verify loading, empty, error, and retry states.

## 8. Known Limitations

- Orders are stored in memory rather than a persistent database.
- Data may reset when the server restarts.
- No authentication or payment processing is included.
- The project uses fictional customer data.

## 9. Deliverables

- Working Next.js application.
- REST API with CRUD operations.
- Responsive dashboard.
- README with setup instructions.
- `docs/PLAN.md`
- `docs/API.md`
- `docs/TESTING.md`
- `docs/REVIEW.md`
- Screenshots and testing evidence in `docs/evidence/`
- GitHub repository and assignment branch.

## 10. Completion Criteria

The assignment is ready for submission when:

- Required functionality is working.
- Validation and error handling are verified.
- Acceptance tests are documented.
- ESLint and production build pass.
- Documentation and evidence are complete.
- Final changes are pushed to GitHub.
