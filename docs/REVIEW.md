
# REVIEW — Assignment 4: Nour's Order Desk

## 1. Project Summary

Nour's Order Desk is a full-stack order management application developed for a fictional handmade candle studio.

The project uses Next.js, TypeScript, Tailwind CSS, REST-style API Route Handlers, and in-memory data storage.

The application provides a responsive dashboard where users can manage customer orders.

## 2. Completed Implementation

### Backend

- Implemented five REST API operations.
- Added an in-memory order store with fictional seed data.
- Implemented server-generated order IDs.
- Calculated order totals on the server.
- Added validation for required fields, quantities, prices, and statuses.
- Returned appropriate HTTP status codes for successful and invalid requests.

### Frontend

- Created a branded candle studio interface.
- Built dashboard summary cards.
- Displayed orders in a responsive table.
- Added Create, View, Edit, and Delete actions.
- Added confirmation before deleting orders.
- Implemented loading, empty, and error states.
- Added retry controls for loading failures.
- Displayed order details in a dialog.

## 3. Testing Completed

The following functionality has been manually verified:

- Retrieve all orders.
- Retrieve an individual order.
- Create a new order.
- Edit quantity and status.
- Recalculate totals after updates.
- Delete an order.
- Display order details.
- Reject zero quantity.
- Reject negative unit price.
- Reject invalid status.
- Reject empty PATCH requests.
- Reject malformed JSON.
- Return 404 for an unknown order.

The latest ESLint check passed without errors or warnings.

A production build passed before the most recent View/Retry interface changes.

See `docs/TESTING.md` for the detailed testing record.

## 4. Technical Challenges

### React Effect Lint Rule

An earlier implementation triggered the React `set-state-in-effect` ESLint rule.

The initial data-loading logic was revised, and ESLint subsequently passed.

### API Validation

The API must validate incoming data independently of the frontend.

Server-side checks were added for invalid quantities, prices, statuses, malformed JSON, and unsupported updates.

### Calculated Totals

The total must remain controlled by the server rather than being supplied directly by the client.

Order totals are recalculated whenever quantity or unit price changes.

### Temporary Data Storage

The assignment uses an in-memory store rather than a database.

The implementation documents that order changes may be lost after server restarts or rebuilds.

## 5. Design Decisions

- Used a warm beige and brown color palette to match the fictional candle studio.
- Used a single-page dashboard to simplify order management.
- Used a separate details dialog for read-only order viewing.
- Used clear status labels and dashboard counters.
- Used server-side validation to protect data integrity.
- Used fictional customer information for demonstration purposes.

## 6. Known Limitations

- No persistent database.
- No user authentication.
- No payment processing.
- No inventory management.
- In-memory data may reset between server sessions.

These features are outside the current project scope.

## 7. Remaining Verification

Before final submission:

- Run the production build again after the latest changes.
- Verify the retry behavior during an API failure.
- Verify the empty state.
- Check the mobile layout.
- Test nonexistent order updates and deletions.
- Confirm rejected updates do not change existing orders.
- Complete the assignment acceptance test.
- Capture screenshots and testing evidence.
- Push the final changes and documentation to the assignment branch.

## 8. Final Reflection

This assignment provided practice in connecting a responsive React interface to Next.js API Route Handlers.

The implementation reinforced the importance of server-side validation, meaningful HTTP responses, derived order totals, error handling, and testing both successful and unsuccessful API requests.

The remaining checks will be documented before the project is marked ready for submission.


## 9. AI Usage and Technical Understanding

### 1. Trace one Add Order action from the form to the Route Handler and back.

When the user completes the Add Order form and submits it, the frontend sends a POST request using `fetch()` to `/api/orders`.

The Route Handler in `app/api/orders/route.ts` receives the JSON request and validates the submitted fields using the server-side order logic.

If the input is valid, the server creates an order with a generated ID, calculates its total, and assigns the initial status `Pending`.

The API returns the saved order with HTTP 201. The dashboard then refreshes the orders list so the new order and updated summary counts are displayed.

If the request fails, the form displays an error instead of treating the order as saved.

### 2. Where is the total calculated, and why is that decision important?

The total is calculated on the server in `lib/orders.ts`.

The calculation converts the unit price to integer cents, multiplies it by the quantity, and converts the result back to dollars.

Calculating the total on the server prevents the client from controlling the final amount and reduces floating-point precision problems.

The total is recalculated when quantity or unit price changes.

### 3. Show one invalid request. Why did it fail, and did stored data remain unchanged?

I tested an invalid PATCH request:

`PATCH /api/orders/[id]`

Request body:

```json
{
  "status": "Cancelled"
}
```

The API returned HTTP 400 because `Cancelled` is not one of the supported statuses.

I fetched the same order before and after the rejected request.

Observed results:

- Before: Pending, total $24.00
- Rejected PATCH: HTTP 400
- After: Pending, total $24.00

This confirmed that the rejected update did not change the stored order.

### 4. What is the difference between PATCH and replacing an entire object?

PATCH updates only the fields supplied in the request.

For example, sending:

```json
{
  "quantity": 4
}
```

should update the quantity while preserving the existing customer name, phone, product name, and status.

Replacing an entire object would require providing the complete replacement representation and could overwrite or remove fields that were omitted.

For this assignment, PATCH is appropriate because Nour often needs to correct only one part of an order.

### 5. What happens to your orders after a server restart?

Orders are stored in server memory, not in a database.

They may reset after a server restart, development reload, or rebuild.

The store is intended for local learning and demonstration, not permanent storage.

A deployed demo would not make the data persistent.

### 6. Which AI suggestion did you correct or verify, and what evidence helped you decide?

AI helped with planning, implementing, and debugging the order dashboard and API.

One suggestion I verified was to use a shared server-side in-memory store for all Route Handlers.

I tested this by creating an order with POST and retrieving it with GET using the generated order ID.

The GET response returned the same ID, customer details, quantity, total, and status as the created order.

I also verified that an invalid PATCH request returned HTTP 400 without changing the existing order.

These checks helped confirm the behavior through actual API responses rather than relying only on the suggested code.

