
# Nour's Order Desk 🕯️

A full-stack order management dashboard built with Next.js, TypeScript, and Tailwind CSS for a fictional handmade candle studio.

This project was developed as part of **Assignment 4 — Nour's Order Desk**.

## Project Overview

Nour's Order Desk allows a small candle business to create, view, update, and delete customer orders through a responsive dashboard.

The application uses Next.js API Route Handlers and a shared in-memory store. No external database or authentication is required.

## Features

### Order Management
- View all customer orders
- Create new orders
- Edit existing order details
- Update order status
- Delete orders
- View automatically calculated order totals
- Display order counts by status

### Dashboard
- Responsive user interface
- Handmade candle studio branding
- Overview cards for total, pending, preparing, and delivered orders
- Customer order table
- Status badges
- Add, Edit, and Delete actions
- Loading, empty, and error states

## Technologies Used

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Next.js API Route Handlers
- Git and GitHub

## Order Data Model

Each order contains:

| Field | Description |
|---|---|
| id | Unique server-generated identifier |
| customerName | Customer name |
| phone | Customer phone number stored as text |
| productName | Candle product name |
| quantity | Positive integer |
| unitPrice | Non-negative price in USD |
| total | Server-calculated quantity × unit price |
| status | Pending, Preparing, or Delivered |

New orders automatically receive the **Pending** status.

The order ID and total cannot be edited directly by the client.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | Retrieve all orders |
| GET | `/api/orders/[id]` | Retrieve a specific order |
| POST | `/api/orders` | Create a new order |
| PATCH | `/api/orders/[id]` | Update an existing order |
| DELETE | `/api/orders/[id]` | Delete an order |

### API Response Codes

- `200 OK` — Successful GET or PATCH
- `201 Created` — Order created
- `204 No Content` — Order deleted
- `400 Bad Request` — Invalid request data
- `404 Not Found` — Order does not exist

## Validation Rules

- Customer name, phone, and product name must not be blank.
- Quantity must be a positive integer.
- Unit price must be non-negative and have no more than two decimal places.
- Status must be Pending, Preparing, or Delivered.
- Empty PATCH requests are rejected.
- Unsupported fields cannot overwrite the order ID or calculated total.
- The server calculates totals using integer cents to reduce floating-point rounding issues.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/nour-order-desk.git
cd nour-order-desk
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

## Testing

The application has been manually tested using the browser and PowerShell API requests.

### Verified Tests

| Test | Result |
|---|---|
| Retrieve all orders | Passed |
| Retrieve an existing order | Passed |
| Create a new order | Passed |
| Update quantity and status | Passed |
| Recalculate total after updating quantity | Passed |
| Delete an order | Passed |
| Request a nonexistent order (404) | Passed |
| Reject quantity of zero (400) | Passed |
| Production build (`npm run build`) | Passed |

Additional negative cases should be checked before final submission.

## Data Storage

Orders are stored in server memory using a shared in-memory store.

**Important:** Changes are temporary and may be lost when the server restarts or reloads. This application does not use a persistent database.

## Project Scope

Included:
- CRUD operations
- Server-side validation
- REST-style API endpoints
- Order dashboard
- Responsive design

Not included:
- Database persistence
- Authentication
- Payment processing
- Inventory management
- External integrations

## Author

**Sally Kadi**

Management Information Systems Student  
Web Development Intern

GitHub: https://github.com/sally-kadi

Portfolio: https://sally-kadi.github.io/sally-portfolio/
