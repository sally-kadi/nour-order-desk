
import { NextResponse } from "next/server";
import {
  orderStore,
  calculateTotal,
  STATUSES,
  type Order,
  type OrderStatus,
} from "@/lib/orders";

type Context = {
  params: Promise<{ id: string }>;
};

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(
  _request: Request,
  context: Context
) {
  const { id } = await context.params;

  const order = orderStore.orders.find(
    (item) => item.id === id
  );

  if (!order) {
    return errorResponse("Order not found", 404);
  }

  return NextResponse.json(order, { status: 200 });
}

export async function PATCH(
  request: Request,
  context: Context
) {
  const { id } = await context.params;

  const index = orderStore.orders.findIndex(
    (item) => item.id === id
  );

  if (index === -1) {
    return errorResponse("Order not found", 404);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    return errorResponse(
      "Request body must be a JSON object",
      400
    );
  }

  const data = body as Record<string, unknown>;
  const keys = Object.keys(data);

  if (keys.length === 0) {
    return errorResponse("Update cannot be empty", 400);
  }

  const editableFields = [
    "customerName",
    "phone",
    "productName",
    "quantity",
    "unitPrice",
    "status",
  ];

  for (const key of keys) {
    if (!editableFields.includes(key)) {
      return errorResponse(
        `Field "${key}" cannot be updated`,
        400
      );
    }
  }

  for (const field of [
    "customerName",
    "phone",
    "productName",
  ]) {
    if (field in data) {
      if (
        typeof data[field] !== "string" ||
        (data[field] as string).trim() === ""
      ) {
        return errorResponse(
          `${field} cannot be blank`,
          400
        );
      }
    }
  }

  if ("quantity" in data) {
    if (
      typeof data.quantity !== "number" ||
      !Number.isSafeInteger(data.quantity) ||
      data.quantity < 1
    ) {
      return errorResponse(
        "Quantity must be a positive integer",
        400
      );
    }
  }

  if ("unitPrice" in data) {
    if (
      typeof data.unitPrice !== "number" ||
      !Number.isFinite(data.unitPrice) ||
      data.unitPrice < 0 ||
      !Number.isSafeInteger(
        Math.round(data.unitPrice * 100)
      ) ||
      Math.abs(
        data.unitPrice * 100 -
        Math.round(data.unitPrice * 100)
      ) > 1e-7
    ) {
      return errorResponse(
        "Unit price must be non-negative with at most two decimal places",
        400
      );
    }
  }

  if ("status" in data) {
    if (
      typeof data.status !== "string" ||
      !STATUSES.includes(data.status as OrderStatus)
    ) {
      return errorResponse(
        "Status must be Pending, Preparing, or Delivered",
        400
      );
    }
  }

  const current = orderStore.orders[index];

  const updated: Order = {
    ...current,
    customerName:
      "customerName" in data
        ? (data.customerName as string).trim()
        : current.customerName,
    phone:
      "phone" in data
        ? (data.phone as string).trim()
        : current.phone,
    productName:
      "productName" in data
        ? (data.productName as string).trim()
        : current.productName,
    quantity:
      "quantity" in data
        ? (data.quantity as number)
        : current.quantity,
    unitPrice:
      "unitPrice" in data
        ? (data.unitPrice as number)
        : current.unitPrice,
    status:
      "status" in data
        ? (data.status as OrderStatus)
        : current.status,
  };

  updated.total = calculateTotal(
    updated.quantity,
    updated.unitPrice
  );

  orderStore.orders[index] = updated;

  return NextResponse.json(updated, { status: 200 });
}

export async function DELETE(
  _request: Request,
  context: Context
) {
  const { id } = await context.params;

  const index = orderStore.orders.findIndex(
    (item) => item.id === id
  );

  if (index === -1) {
    return errorResponse("Order not found", 404);
  }

  orderStore.orders.splice(index, 1);

  return new Response(null, { status: 204 });
}
