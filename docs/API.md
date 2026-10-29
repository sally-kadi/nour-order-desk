
# API Documentation — Nour's Order Desk

## Overview

Nour's Order Desk provides a REST-style API for managing customer orders using Next.js App Router Route Handlers.

Base URL (local development):

`http://localhost:3000`

All request and response bodies use JSON, except successful DELETE responses, which have no body.

## Order Data Model

| Field | Type | Description |
|---|---|---|
| id | string | Server-generated unique identifier |
| customerName | string | Customer name |
| phone | string | Customer phone number |
| productName | string | Ordered product |
| quantity | number | Positive integer |
| unitPrice | number | Non-negative price |
| total | number | Server-calculated total |
| status | string | Pending, Preparing, or Delivered |

The server calculates `total` from `quantity` and `unitPrice`.

## 1. GET /api/orders

Returns all orders.

### Request

```http
GET /api/orders
```

### Successful Response

**200 OK**

Returns a JSON array of orders.

```json
[
  {
    "id": "1",
    "customerName": "Maya",
    "phone": "DEMO-001",
    "productName": "Vanilla Candle",
    "quantity": 4,
    "unitPrice": 12,
    "total": 48,
    "status": "Preparing"
  }
]
```

The example above illustrates the response structure. The actual endpoint returns all orders currently stored in memory.

## 2. GET /api/orders/[id]

Returns one order by ID.

### Request

```http
GET /api/orders/1
```

### Successful Response

**200 OK**

Returns the matching order object.

### Error Response

**404 Not Found**

```json
{
  "error": "Order not found"
}
```

## 3. POST /api/orders

Creates a new order.

### Request

```http
POST /api/orders
Content-Type: application/json
```

### Request Body

```json
{
  "customerName": "Demo Customer",
  "phone": "DEMO-005",
  "productName": "Rose Candle",
  "quantity": 2,
  "unitPrice": 12.5
}
```

### Successful Response

**201 Created**

Returns the newly created order, including its generated ID, calculated total, and initial status.

Example:

```json
{
  "id": "generated-order-id",
  "customerName": "Demo Customer",
  "phone": "DEMO-005",
  "productName": "Rose Candle",
  "quantity": 2,
  "unitPrice": 12.5,
  "total": 25,
  "status": "Pending"
}
```

The `id` value shown is illustrative; the server generates a real unique ID.

### Validation

- Required text fields cannot be blank.
- Quantity must be a positive safe integer.
- Unit price must be non-negative and have at most two decimal places.
- Order ID, total, and initial status are controlled by the server.
- Unsupported request fields are rejected.

Invalid requests return **400 Bad Request** with an error message.

## 4. PATCH /api/orders/[id]

Updates an existing order.

### Request

```http
PATCH /api/orders/1
Content-Type: application/json
```

### Request Body

```json
{
  "quantity": 3,
  "status": "Delivered"
}
```

PATCH supports partial updates. Only the supplied editable fields are changed.

### Successful Response

**200 OK**

Returns the updated order with its recalculated total.

### Validation

- Status must be Pending, Preparing, or Delivered.
- Empty update objects are rejected.
- Quantity and price must satisfy the same validation rules as POST.
- ID and total cannot be overridden.
- Unsupported fields are rejected.

### Error Responses

- **400 Bad Request** — Invalid update data
- **404 Not Found** — Order does not exist

## 5. DELETE /api/orders/[id]

Deletes an existing order.

### Request

```http
DELETE /api/orders/1
```

### Successful Response

**204 No Content**

The response has no body.

### Error Response

**404 Not Found**

```json
{
  "error": "Order not found"
}
```

## HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Successful GET or PATCH |
| 201 | Order created |
| 204 | Order deleted |
| 400 | Invalid request |
| 404 | Order not found |

## Validation Error Examples

The following cases should return `400 Bad Request`:

- Quantity equal to zero
- Negative unit price
- Invalid order status
- Empty PATCH body (`{}`)
- Malformed JSON
- Blank required text fields
- Attempts to override server-managed fields

## Data Storage

Orders are stored in memory.

Changes are not guaranteed to persist across server restarts, rebuilds, or deployment instances.

No database or authentication is included in this assignment.

## Testing

API requests were tested locally using PowerShell.

Verified cases include:

- GET all orders
- GET an existing order
- POST a valid order
- PATCH quantity and status
- DELETE an order
- GET a nonexistent order (404)
- Reject quantity zero (400)
- Reject invalid status (400)
- Reject empty PATCH (400)
- Reject negative price (400)
- Reject malformed JSON (400)

See `docs/TESTING.md` for the detailed test record.
