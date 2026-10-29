
# Testing Report — Nour's Order Desk

## 1. Testing Overview

This document records the manual testing performed for Assignment 4 — Nour's Order Desk.

Testing was carried out locally using:
- Browser-based UI interactions
- PowerShell API requests
- ESLint
- Next.js production build

Testing date: October 28, 2026

## 2. Test Environment

- Framework: Next.js 16.4.3
- Language: TypeScript
- Styling: Tailwind CSS
- Operating System: Windows
- Local URL: http://localhost:3000
- Data storage: In-memory

## 3. Functional Testing

| ID | Test Case | Expected Result | Observed Result | Status |
|---|---|---|---|---|
| F01 | Load order list | Orders appear in dashboard | Existing orders displayed | Passed |
| F02 | Create valid order | New order appears with Pending status | Test Customer order created | Passed |
| F03 | Edit quantity | Quantity and total update | Quantity changed from 2 to 3; total from $25.00 to $37.50 | Passed |
| F04 | Change status | Updated status appears | Status changed to Delivered | Passed |
| F05 | Delete order | Order removed from list | Test Customer removed | Passed |
| F06 | View order details | Selected order details appear | Maya's order details displayed | Passed |
| F07 | Update dashboard counts | Counts reflect current orders | Dashboard returned to 3 orders after deletion | Passed |

## 4. API Testing

| ID | Method | Endpoint | Test | Expected | Observed | Status |
|---|---|---|---|---|---|---|
| A01 | GET | `/api/orders` | Retrieve all orders | 200 | Orders returned | Passed |
| A02 | GET | `/api/orders/1` | Retrieve existing order | 200 | Order returned | Passed |
| A03 | POST | `/api/orders` | Valid order creation | 201 | Order created | Passed |
| A04 | PATCH | `/api/orders/[id]` | Update quantity and status | 200 | Order updated | Passed |
| A05 | DELETE | `/api/orders/[id]` | Delete existing order | 204 | Order deleted | Passed |
| A06 | GET | `/api/orders/999` | Unknown order | 404 | 404 returned | Passed |
| A07 | POST | `/api/orders` | Quantity = 0 | 400 | 400 returned | Passed |
| A08 | PATCH | `/api/orders/1` | Status = Cancelled | 400 | 400 returned | Passed |
| A09 | PATCH | `/api/orders/1` | Empty body `{}` | 400 | 400 returned | Passed |
| A10 | PATCH | `/api/orders/1` | Unit price = -5 | 400 | 400 returned | Passed |
| A11 | POST | `/api/orders` | Malformed JSON | 400 | 400 returned | Passed |
| A12 | POST + GET | `/api/orders` and `/api/orders/[id]` | Verify shared in-memory store | Same order returned | Same ID and data returned | Passed |
| A13 | PATCH + GET | `/api/orders/[id]` | Rejected update must preserve existing data | 400 and unchanged order | 400; Pending/24 before and after | Passed |
| A14 | PATCH | `/api/orders/999` | Update nonexistent order | 404 | 404 returned | Passed |
| A15 | DELETE | `/api/orders/999` | Delete nonexistent order | 404 | 404 returned | Passed |
| A16 | PATCH attempt to change order ID | 400 Bad Request | 400 — Field "id" cannot be updated | Passed |
| A17 | GET order after rejected ID update | 200 OK, original ID and data unchanged | 200 — ID "2", Lina, Preparing, total $15 | Passed |

## 5. Validation Evidence

### Invalid Quantity

Request:

```json
{
  "customerName": "Test Customer",
  "phone": "DEMO-007",
  "productName": "Vanilla Candle",
  "quantity": 0,
  "unitPrice": 12
}
```

Observed response:

```json
{
  "error": "Quantity must be a positive integer"
}
```

HTTP status: 400 Bad Request

### Invalid Status

Request:

```json
{
  "status": "Cancelled"
}
```

Observed HTTP status: 400 Bad Request

### Empty PATCH

Request:

```json
{}
```

Observed HTTP status: 400 Bad Request

### Negative Price

Request:

```json
{
  "unitPrice": -5
}
```

Observed HTTP status: 400 Bad Request

### Malformed JSON

Request body:

```text
{"customerName":
```

Observed HTTP status: 400 Bad Request

### Unknown Order

Request:

```http
GET /api/orders/999
```

Observed response:

```json
{
  "error": "Order not found"
}
```

HTTP status: 404 Not Found

## 6. Quality Checks

| Check | Result |
|---|---|
| `npm run lint` | Passed — 0 errors, 0 warnings |
| `npm run build` | Passed on October 28, 2026 before the latest View/Retry changes |
| TypeScript compilation | Passed in the previous production build |
| New View/Retry UI lint check | Passed |

A final production build is required after the latest interface changes.

## 7. Additional Tests Pending

The following tests have not yet been fully verified or documented:

- Retry after a simulated API failure
- Empty order list state
- Mobile layout after the latest interface changes
- Final production build after View/Retry changes

These tests must not be marked Passed until executed.

## 8. Data Storage Limitations

Orders are stored in memory and may reset when the server restarts.

Test data is fictional. The application does not use a persistent database.

## 9. Conclusion

The core CRUD workflow and the listed API validation tests have passed.

Additional acceptance, recovery, and final build checks remain before submission.
