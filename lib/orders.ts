
export const STATUSES = [
  "Pending",
  "Preparing",
  "Delivered",
] as const;

export type OrderStatus = (typeof STATUSES)[number];

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status: OrderStatus;
};

export type OrderInput = {
  customerName: string;
  phone: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

type OrderStore = {
  orders: Order[];
};

export function calculateTotal(
  quantity: number,
  unitPrice: number
): number {
  const priceInCents = Math.round(unitPrice * 100);
  return (priceInCents * quantity) / 100;
}

function seedOrder(
  id: string,
  input: OrderInput,
  status: OrderStatus
): Order {
  return {
    id,
    ...input,
    total: calculateTotal(input.quantity, input.unitPrice),
    status,
  };
}

const initialOrders: Order[] = [
  seedOrder(
    "1",
    {
      customerName: "Maya",
      phone: "DEMO-001",
      productName: "Vanilla Candle",
      quantity: 2,
      unitPrice: 12,
    },
    "Pending"
  ),
  seedOrder(
    "2",
    {
      customerName: "Lina",
      phone: "DEMO-002",
      productName: "Lavender Candle",
      quantity: 1,
      unitPrice: 15,
    },
    "Preparing"
  ),
  seedOrder(
    "3",
    {
      customerName: "Sara",
      phone: "DEMO-003",
      productName: "Gift Candle Box",
      quantity: 3,
      unitPrice: 15,
    },
    "Delivered"
  ),
];

const globalStore = globalThis as typeof globalThis & {
  nourOrderStore?: OrderStore;
};

globalStore.nourOrderStore ??= {
  orders: initialOrders,
};

export const orderStore = globalStore.nourOrderStore;
