
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  orderStore,
  calculateTotal,
  type Order,
  type OrderInput,
} from "@/lib/orders";

export async function GET() {
  return NextResponse.json(orderStore.orders, { status: 200 });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    return NextResponse.json(
      { error: "Request body must be an object" },
      { status: 400 }
    );
  }

  const data = body as Record<string, unknown>;

  const allowedFields = [
    "customerName",
    "phone",
    "productName",
    "quantity",
    "unitPrice",
  ];

  for (const key of Object.keys(data)) {
    if (!allowedFields.includes(key)) {
      return NextResponse.json(
        { error: `Field "${key}" is not allowed` },
        { status: 400 }
      );
    }
  }

  for (const field of ["customerName", "phone", "productName"]) {
    if (
      typeof data[field] !== "string" ||
      (data[field] as string).trim() === ""
    ) {
      return NextResponse.json(
        { error: `${field} is required and cannot be blank` },
        { status: 400 }
      );
    }
  }

  if (
    typeof data.quantity !== "number" ||
    !Number.isSafeInteger(data.quantity) ||
    data.quantity < 1
  ) {
    return NextResponse.json(
      { error: "Quantity must be a positive integer" },
      { status: 400 }
    );
  }

  if (
    typeof data.unitPrice !== "number" ||
    !Number.isFinite(data.unitPrice) ||
    data.unitPrice < 0 ||
    !Number.isSafeInteger(Math.round(data.unitPrice * 100)) ||
    Math.abs(
      data.unitPrice * 100 -
      Math.round(data.unitPrice * 100)
    ) > 1e-7
  ) {
    return NextResponse.json(
      { error: "Unit price must be non-negative with at most two decimal places" },
      { status: 400 }
    );
  }

  const input: OrderInput = {
    customerName: (data.customerName as string).trim(),
    phone: (data.phone as string).trim(),
    productName: (data.productName as string).trim(),
    quantity: data.quantity,
    unitPrice: data.unitPrice,
  };

  const newOrder: Order = {
    id: randomUUID(),
    ...input,
    total: calculateTotal(input.quantity, input.unitPrice),
    status: "Pending",
  };

  orderStore.orders.push(newOrder);

  return NextResponse.json(newOrder, { status: 201 });
}
