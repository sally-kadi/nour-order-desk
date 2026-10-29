
# Nour's Order Desk

A full-stack order management dashboard built with Next.js, TypeScript, and Tailwind CSS for a fictional handmade candle business.

The application helps Nour manage customer orders, track preparation and delivery statuses, update order information, and calculate totals accurately.

## Project Overview

Nour previously managed customer orders through scattered messages and handwritten notes. This made it difficult to track orders, identify pending work, and correct mistakes.

Nour's Order Desk provides one centralized dashboard where orders can be created, viewed, updated, and deleted.

The project was developed as Assignment 4, focusing on full-stack CRUD operations, REST API development, server-side validation, and reliable client-server communication.

## Technologies Used

- Next.js 16 (App Router)
- React
- TypeScript
- Tailwind CSS
- REST API Route Handlers
- In-memory server-side data storage
- Git and GitHub
- Postman for API testing

## Features

### Order Management

- View all customer orders in one dashboard
- View complete details for an individual order
- Create new customer orders
- Edit existing order information
- Update order status
- Delete orders with confirmation
- Automatically refresh the dashboard after changes

### Dashboard Statistics

- Total orders
- Pending orders
- Delivered orders

Statistics are calculated from the current order data rather than hardcoded values.

### Order Statuses

Each order can have one of three statuses:

- Pending
- Preparing
- Delivered

New orders automatically receive the Pending status.

### Validation and Error Handling

- Required customer name, phone, and product name
- Quantity must be a positive integer
- Unit price must be non-negative and contain no more than two decimal places
- Invalid order statuses are rejected
- Malformed JSON requests return a validation error
- Unknown order IDs return 404 Not Found
- Invalid updates do not modify existing order data
- Order IDs cannot be modified by clients
- Order totals are calculated on the server

### User Experience

- Responsive dashboard layout
- Loading states
- Friendly error messages
- Retry functionality
- Empty-state handling
- Disabled submission while saving
- Delete confirmation
- Order details view

## Order Data Structure

Each order contains:

| Field | Description |
| --- | --- |
| id | Unique server-generated order ID |
| customerName | Customer name |
| phone | Customer phone number |
| productName | Ordered product |
| quantity | Number of items |
| unitPrice | Price per item in USD |
| total | Server-calculated order total |
| status | Pending, Preparing, or Delivered |

### Server-Side Total Calculation

The total is calculated using:

`total = quantity × unitPrice`

The server uses integer cents for monetary calculations to reduce floating-point precision issues.

Client-provided total values are not trusted.

For example:

- Product: Vanilla Candle
- Quantity: 3
- Unit price: $8.00
- Calculated total: $24.00

## REST API Endpoints

| Method | Endpoint | Description | Success Status |
| --- | --- | --- | --- |
| GET | `/api/orders` | Retrieve all orders | 200 |
| GET | `/api/orders/:id` | Retrieve a specific order | 200 |
| POST | `/api/orders` | Create a new order | 201 |
| PATCH | `/api/orders/:id` | Update an existing order | 200 |
| DELETE | `/api/orders/:id` | Delete an order | 204 |

Invalid requests return 400 Bad Request.

Requests for nonexistent orders return 404 Not Found.

### Example: Create an Order

**POST** `/api/orders`

Request body:

```json
{
  "customerName": "Demo Customer",
  "phone": "DEMO-001",
  "productName": "Vanilla Candle",
  "quantity": 3,
  "unitPrice": 8
}
```

Example response:

```json
{
  "id": "generated-order-id",
  "customerName": "Demo Customer",
  "phone": "DEMO-001",
  "productName": "Vanilla Candle",
  "quantity": 3,
  "unitPrice": 8,
  "total": 24,
  "status": "Pending"
}
```

The server generates the order ID, calculates the total, and assigns the initial status.

For detailed endpoint documentation, see [API Documentation](docs/API.md).

## Project Structure

```text
nour-order-desk/
├── app/
│   ├── api/
│   │   └── orders/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── orders.ts
├── public/
│   └── images/
├── docs/
│   ├── evidence/
│   ├── PLAN.md
│   ├── API.md
│   ├── TESTING.md
│   └── REVIEW.md
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/sally-kadi/nour-order-desk.git
```

Navigate to the project:

```bash
cd nour-order-desk
```

Switch to the assignment branch:

```bash
git checkout assignment-4-nour-order-desk
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

http://localhost:3000

### Quality Checks

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Testing

The application was manually tested using the browser, Postman, and PowerShell API requests.

### Verified Tests

| Test | Result |
| --- | --- |
| Retrieve all orders (GET 200) | Passed |
| Retrieve an existing order (GET 200) | Passed |
| Create a new order (POST 201) | Passed |
| Update order quantity and status (PATCH 200) | Passed |
| Recalculate total after quantity changes | Passed |
| Ignore client-provided total and calculate it on the server | Passed |
| Delete an order (DELETE 204) | Passed |
| Return 404 for nonexistent orders | Passed |
| Reject missing customer name (400) | Passed |
| Reject blank phone (400) | Passed |
| Reject invalid quantities (400) | Passed |
| Reject negative, nonnumeric, and overly precise prices (400) | Passed |
| Reject malformed JSON (400) | Passed |
| Reject invalid status and empty PATCH requests (400) | Passed |
| Protect server-generated order IDs from modification | Passed |
| Preserve existing order data after a rejected PATCH | Passed |
| Production build (`npm run build`) | Passed |

### Test Evidence

API testing screenshots and dashboard screenshots are available in [docs/evidence](docs/evidence/).

Detailed test cases and results are documented in [docs/TESTING.md](docs/TESTING.md).

## Data Storage

This project uses an in-memory server-side store instead of a database.

Orders can be created, updated, and deleted while the application is running.

**Important limitations:**

- Data is not permanently stored.
- Changes may be lost after a server restart or development reload.
- Data may not be shared reliably between separate server instances.
- The application does not include authentication or persistent database storage.

This approach was selected to keep the assignment focused on CRUD operations, API behavior, validation, and frontend integration.

## Project Documentation

- [Implementation Plan](docs/PLAN.md)
- [API Documentation](docs/API.md)
- [Testing and Results](docs/TESTING.md)
- [AI Reflection and Review](docs/REVIEW.md)
- [Testing Evidence](docs/evidence/)

## Assignment Submission

**Assignment:** Assignment 4 — Nour's Order Desk

**Developer:** Sally Kadi

**Repository:** https://github.com/sally-kadi/nour-order-desk

**Branch:** `assignment-4-nour-order-desk`

**Branch Link:** https://github.com/sally-kadi/nour-order-desk/tree/assignment-4-nour-order-desk

## Conclusion

Nour's Order Desk demonstrates a complete CRUD workflow using Next.js Route Handlers and a responsive frontend.

The project focuses on implementing reliable business rules, protecting server-owned fields, validating incoming data, and providing clear feedback during order management operations.
