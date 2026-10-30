
# Testing Report — Nour's Order Desk

## 1. Testing Overview

This document records manual testing performed for Assignment 4 — Nour's Order Desk.

Testing methods:
- Browser-based UI testing
- PowerShell and Postman API requests
- Chrome DevTools
- Responsive viewport testing
- ESLint
- Next.js production build

Testing dates: October 28–30, 2026

## 2. Test Environment

- Framework: Next.js 16.4.3
- Language: TypeScript
- Styling: Tailwind CSS
- Operating System: Windows
- Local URL: http://localhost:3000
- Data storage: In-memory
- Mobile viewport: 360 × 642 px

## 3. Functional Testing

| ID | Test Case | Observed Result | Status |
|---|---|---|---|
| F01 | Load order list | Existing orders displayed | Passed |
| F02 | Create order | New order appeared with Pending status | Passed |
| F03 | Edit quantity | Quantity and total updated | Passed |
| F04 | Change order status | Status updated to Delivered | Passed |
| F05 | Delete order | Order removed from dashboard | Passed |
| F06 | View order details | Selected order details displayed | Passed |
| F07 | Refresh dashboard counts | Counts reflected order changes | Passed |
| F08 | API load failure | Error message and Retry button appeared | Passed |
| F09 | Retry after recovery | Orders returned without page refresh | Passed |
| F10 | Dialog keyboard navigation | Tab focus stayed inside dialog | Passed |
| F11 | Escape closes dialog | Dialog closed successfully | Passed |
| F12 | Restore focus | Enter reopened dialog without mouse | Passed |
| F13 | Mobile order table | Horizontal scrolling exposed actions | Passed |
| F14 | Mobile form | Fields and buttons were visible | Passed |
| F15 | Cancel form | Form closed without creating an order | Passed |
| F16 | Empty order list | "No orders yet" appeared with 0 orders using a temporary Chrome response override | Passed |
| F17 | Prevent changes during pending save | Dedicated disabled-control interaction not conclusively verified | Pending |
| F18 | Create test order | Test Pending Save appeared once, quantity 2, price $8, total $16 | Passed |

## 4. API Testing

| ID | HTTP Request | Expected Result | Status |
|---|---|---|---|
| A01 | GET /api/orders | 200 OK | Passed |
| A02 | GET /api/orders/1 | 200 OK | Passed |
| A03 | POST /api/orders | 201 Created | Passed |
| A04 | PATCH /api/orders/[id] | 200 OK | Passed |
| A05 | DELETE /api/orders/[id] | 204 No Content | Passed |
| A06 | GET /api/orders/999 | 404 Not Found | Passed |
| A07 | POST with quantity 0 | 400 Bad Request | Passed |
| A08 | PATCH with invalid status | 400 Bad Request | Passed |
| A09 | PATCH with empty body | 400 Bad Request | Passed |
| A10 | PATCH with negative unit price | 400 Bad Request | Passed |
| A11 | POST with malformed JSON | 400 Bad Request | Passed |
| A12 | POST followed by GET | Same order ID and data returned | Passed |
| A13 | Rejected PATCH followed by GET | Original order remained unchanged | Passed |
| A14 | PATCH /api/orders/999 | 404 Not Found | Passed |
| A15 | DELETE /api/orders/999 | 404 Not Found | Passed |
| F16 | Empty order list | Empty-state message appears correctly | Deleted all three demo orders; dashboard displayed 0 orders, "No orders yet", and the create-first-order message | Passed |
| F17 | Prevent form changes while save is pending | Add Order and Cancel cannot interrupt an in-flight save | Tested using Slow Save Test throttling; Saving... appeared and Add Order and Cancel were disabled during the request | Passed |

## 5. Validation Evidence

- Invalid quantity 0 returned 400.
- Invalid status "Cancelled" returned 400.
- Empty PATCH body returned 400.
- Negative unit price returned 400.
- Malformed JSON returned 400.
- Unknown order IDs returned 404.
- Rejected updates did not modify existing order data.

## 6. API Failure and Recovery

Date: October 30, 2026

Steps:
1. Blocked `/api/orders` using Chrome DevTools.
2. Refreshed the dashboard.
3. Confirmed the error message and Retry button appeared.
4. Disabled request blocking.
5. Clicked Retry.
6. Confirmed the original orders returned without refreshing the page.

Result: Passed

## 7. Accessibility Testing

Date: October 30, 2026

- Opened the order details dialog.
- Verified Tab focus remained inside.
- Pressed Escape to close the dialog.
- Pressed Enter to reopen it without using the mouse.

Result: Passed

## 8. Mobile Testing

Viewport: 360 × 642 px

- Dashboard heading and Add Order button visible.
- Order table supported horizontal scrolling.
- Status and View/Edit/Delete actions reachable.
- Order form fields and Save/Cancel buttons visible.
- Cancel closed the form.

Result: Passed

## 9. Empty-State Testing

Date: October 30, 2026

Used Chrome DevTools Local Overrides to temporarily replace the GET `/api/orders` response with:

```json
[]
```

After reloading:
- Dashboard displayed 0 orders.
- Message "No orders yet" appeared.
- Empty-state guidance appeared.
- No real orders were deleted.

The override was disabled after testing.

Result: Passed

## 10. Exact CRUD Acceptance Scenario

Date: October 30, 2026

| Step | Observed Result | Status |
|---|---|---|
| Set Maya's Vanilla Candle order to quantity 3 at $8 | Total $24, Pending | Passed |
| Edit quantity from 3 to 4 | Total updated to $32 | Passed |
| Change status to Delivered | Status updated | Passed |
| PATCH quantity -2 | 400 Bad Request | Passed |
| GET order after rejected PATCH | Quantity 4, price $8, total $32, Delivered remained unchanged | Passed |
| Delete Maya through the UI | Maya disappeared from the list | Passed |
| GET /api/orders/1 after deletion | 404 "Order not found" | Passed |

The acceptance scenario was completed using the existing Maya order.

Result: Passed

## 11. Additional Create Test

Date: October 30, 2026

Created a temporary order:

- Customer: Test Pending Save
- Phone: DEMO-005
- Product: Vanilla Candle
- Quantity: 2
- Unit Price: $8
- Expected total: $16
- Status: Pending

Observed:
- The order appeared once.
- The calculated total was $16.
- Dashboard count increased from 3 to 4.
- The form closed after successful submission.

Result: Create operation passed.

The test did not conclusively establish whether Cancel and other controls were disabled during the in-flight save.

## 12. Quality Checks

| Check | Result |
|---|---|
| npm run lint | Passed |
| npm run build | Passed |
| TypeScript compilation | Passed |
| Static page generation | Passed (4/4) |
| API route compilation | Passed |

The successful production build was completed on October 30, 2026.

## 13. Remaining Verification

- Dedicated interaction test confirming that Cancel, Add, Edit, and form fields cannot interrupt an in-flight save.

## 14. Data Storage Limitations

Orders are stored in memory.

- Data may reset when the server restarts.
- No persistent database is connected.
- Customer records are fictional test data.

## 15. Conclusion

Core CRUD functionality, API validation, rejected-update protection, keyboard navigation, API recovery, mobile layout, empty-state handling, and the exact acceptance scenario passed manual testing.

ESLint and the Next.js production build also passed.

The dedicated pending-save control interaction remains pending.
