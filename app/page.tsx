
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";

type OrderStatus = "Pending" | "Preparing" | "Delivered";

type Order = {
  id: string;
  customerName: string;
  phone: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status: OrderStatus;
};

type OrderForm = {
  customerName: string;
  phone: string;
  productName: string;
  quantity: string;
  unitPrice: string;
  status: OrderStatus;
};

const emptyForm: OrderForm = {
  customerName: "",
  phone: "",
  productName: "",
  quantity: "1",
  unitPrice: "",
  status: "Pending",
};

const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Preparing: "bg-blue-100 text-blue-800",
  Delivered: "bg-emerald-100 text-emerald-800",
};

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<OrderForm>({ ...emptyForm });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadOrders() {
    try {
      setError("");

      const response = await fetch("/api/orders", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load orders");
      }

      const data: Order[] = await response.json();
      setOrders(data);
    } catch {
      setError("Unable to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  const pending = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const preparing = orders.filter(
    (order) => order.status === "Preparing"
  ).length;

  const delivered = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  function updateForm(field: keyof OrderForm, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function startAdd() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setFormError("");
    setShowForm(true);
    window.setTimeout(() => {
      document.getElementById("order-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  function startEdit(order: Order) {
    setEditingId(order.id);

    setForm({
      customerName: order.customerName,
      phone: order.phone,
      productName: order.productName,
      quantity: String(order.quantity),
      unitPrice: String(order.unitPrice),
      status: order.status,
    });

    setFormError("");
    setShowForm(true);

    window.setTimeout(() => {
      document.getElementById("order-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm });
    setFormError("");
  }

  async function handleSaveOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const quantity = Number(form.quantity);
    const unitPrice = Number(form.unitPrice);

    if (
      !form.customerName.trim() ||
      !form.phone.trim() ||
      !form.productName.trim()
    ) {
      setFormError("Please complete all required fields.");
      return;
    }

    if (
      form.quantity.trim() === "" ||
      !Number.isSafeInteger(quantity) ||
      quantity < 1
    ) {
      setFormError("Quantity must be a positive integer.");
      return;
    }

    if (
      form.unitPrice.trim() === "" ||
      !Number.isFinite(unitPrice) ||
      unitPrice < 0 ||
      !/^\d+(\.\d{1,2})?$/.test(form.unitPrice.trim())
    ) {
      setFormError(
        "Unit price must be non-negative with at most two decimal places."
      );
      return;
    }

    setSaving(true);

    try {
      const isEditing = editingId !== null;

      const response = await fetch(
        isEditing
          ? `/api/orders/${encodeURIComponent(editingId)}`
          : "/api/orders",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName: form.customerName.trim(),
            phone: form.phone.trim(),
            productName: form.productName.trim(),
            quantity,
            unitPrice,
            ...(isEditing ? { status: form.status } : {}),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not save order.");
      }

      cancelForm();
      await loadOrders();
    } catch (caughtError) {
      setFormError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteOrder(order: Order) {
    const confirmed = window.confirm(
      `Are you sure you want to delete the order for ${order.customerName}?`
    );

    if (!confirmed) return;

    setDeletingId(order.id);

    try {
      setError("");

      const response = await fetch(
        `/api/orders/${encodeURIComponent(order.id)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Could not delete order.");
      }

      if (editingId === order.id) {
        cancelForm();
      }

      await loadOrders();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not delete order."
      );
    } finally {
      setDeletingId(null);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#e5d8c9] bg-white px-4 py-3 text-[#382b25] outline-none focus:border-[#a47a51] focus:ring-2 focus:ring-[#a47a51]/20";

  return (
    <main className="min-h-screen bg-[#faf7f2] text-[#382b25]">
      {/* NAVBAR */}
      <nav className="border-b border-[#e9dfd3] bg-white/95">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <a
            href="#home"
            className="font-serif text-2xl font-bold tracking-wide text-[#563c2d]"
          >
            NOUR<span className="text-[#bb8d55]">.</span>
          </a>

          <div className="flex items-center gap-6 text-sm font-medium">
            <a href="#home" className="hover:text-[#a47a51]">
              Home
            </a>
            <a href="#story" className="hover:text-[#a47a51]">
              Our Story
            </a>
            <a href="#orders" className="hover:text-[#a47a51]">
              Orders
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="bg-[#efe5d8]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-12 md:grid-cols-2 md:py-20">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#a47a51]">
              Nour Candle Studio
            </p>

            <h1 className="max-w-xl font-serif text-5xl leading-tight font-semibold md:text-6xl">
              Handcrafted
              <span className="block italic text-[#a47a51]">
                with love.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-[#6d5b50]">
              Thoughtfully made candles for beautiful everyday moments.
              Manage every customer order with warmth, care, and simplicity.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#orders"
                className="rounded-xl bg-[#563c2d] px-6 py-3 font-semibold text-white transition hover:bg-[#38271e]"
              >
                Manage Orders
              </a>

              <a
                href="#story"
                className="rounded-xl border border-[#b99b80] px-6 py-3 font-semibold text-[#563c2d] transition hover:bg-white"
              >
                Our Story
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] shadow-xl">
            <Image
              src="/images/candle-making.webp"
              alt="Handmade candles being carefully poured"
              width={1100}
              height={750}
              priority
              className="h-[340px] w-full object-cover md:h-[450px]"
            />
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a47a51]">
            Studio Overview
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold">
            Order Dashboard
          </h2>
          <p className="mt-2 text-[#7b6b60]">
            A quick look at your handmade candle orders.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total Orders",
              value: orders.length,
              color: "bg-[#563c2d] text-white",
              icon: "✦",
            },
            {
              label: "Pending",
              value: pending,
              color: "bg-[#fff0d7] text-[#8b5b25]",
              icon: "◷",
            },
            {
              label: "Preparing",
              value: preparing,
              color: "bg-[#e5eef5] text-[#426783]",
              icon: "✧",
            },
            {
              label: "Delivered",
              value: delivered,
              color: "bg-[#e4f0e6] text-[#3d7050]",
              icon: "✓",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl p-6 shadow-sm ${stat.color}`}
            >
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold">{stat.label}</p>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className="mt-5 text-4xl font-bold">
                {loading ? "—" : stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2">
          <div className="grid grid-cols-2 gap-3">
            <Image
              src="/images/handmade-candles.webp"
              alt="Candle maker creating handmade candles"
              width={650}
              height={800}
              className="h-72 w-full rounded-2xl object-cover md:h-96"
            />

            <Image
              src="/images/luxury-candles.webp"
              alt="Luxury candles in amber glass jars"
              width={650}
              height={800}
              className="mt-8 h-72 w-full rounded-2xl object-cover md:h-96"
            />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a47a51]">
              Made with Care
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight font-semibold">
              A little light.
              <span className="block italic text-[#a47a51]">
                A lot of love.
              </span>
            </h2>

            <p className="mt-6 leading-8 text-[#756459]">
              Every candle tells a story of craftsmanship, comfort,
              and thoughtful details. Nour Candle Studio celebrates
              the beauty of handmade products and meaningful gifts.
            </p>

            <p className="mt-4 leading-8 text-[#756459]">
              Behind every candle is an order, a customer, and a
              moment worth making special.
            </p>
          </div>
        </div>
      </section>

      {/* ORDERS */}
      <section id="orders" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a47a51]">
              Order Management
            </p>

            <h2 className="mt-2 font-serif text-4xl font-semibold">
              Customer Orders
            </h2>

            <p className="mt-3 text-[#7b6b60]">
              Create, update, and manage orders in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (showForm) {
                cancelForm();
              } else {
                startAdd();
              }
            }}
            className="rounded-xl bg-[#563c2d] px-6 py-3 font-semibold text-white transition hover:bg-[#38271e]"
          >
            {showForm ? "Cancel" : "+ Add Order"}
          </button>
        </div>

        {/* ADD / EDIT FORM */}
        {showForm && (
          <form
            id="order-form"
            onSubmit={handleSaveOrder}
            className="mb-8 scroll-mt-6 rounded-3xl border border-[#eadfd2] bg-white p-6 shadow-sm md:p-8"
          >
            <h3 className="font-serif text-2xl font-semibold">
              {editingId ? "Edit Order" : "Create New Order"}
            </h3>

            <p className="mt-2 text-sm text-[#8a776a]">
              Fill in the details below to manage this candle order.
            </p>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <label className="text-sm font-semibold">
                Customer Name
                <input
                  required
                  type="text"
                  value={form.customerName}
                  onChange={(event) =>
                    updateForm("customerName", event.target.value)
                  }
                  placeholder="Demo Customer"
                  className={inputClass}
                />
              </label>

              <label className="text-sm font-semibold">
                Phone
                <input
                  required
                  type="text"
                  value={form.phone}
                  onChange={(event) =>
                    updateForm("phone", event.target.value)
                  }
                  placeholder="DEMO-005"
                  className={inputClass}
                />
              </label>

              <label className="text-sm font-semibold">
                Product Name
                <input
                  required
                  type="text"
                  value={form.productName}
                  onChange={(event) =>
                    updateForm("productName", event.target.value)
                  }
                  placeholder="Vanilla Candle"
                  className={inputClass}
                />
              </label>

              <label className="text-sm font-semibold">
                Quantity
                <input
                  required
                  type="number"
                  min="1"
                  step="1"
                  value={form.quantity}
                  onChange={(event) =>
                    updateForm("quantity", event.target.value)
                  }
                  className={inputClass}
                />
              </label>

              <label className="text-sm font-semibold">
                Unit Price (USD)
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.unitPrice}
                  onChange={(event) =>
                    updateForm("unitPrice", event.target.value)
                  }
                  placeholder="12.00"
                  className={inputClass}
                />
              </label>

              {editingId && (
                <label className="text-sm font-semibold">
                  Status
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateForm("status", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </label>
              )}
            </div>

            {formError && (
              <p role="alert" className="mt-5 text-sm text-red-600">
                {formError}
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#563c2d] px-6 py-3 font-semibold text-white hover:bg-[#38271e] disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Save Order"}
              </button>

              <button
                type="button"
                onClick={cancelForm}
                className="rounded-xl border border-[#d9c8b6] px-6 py-3 font-semibold text-[#563c2d]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {error && (
          <p
            role="alert"
            className="mb-5 rounded-xl bg-red-50 p-4 text-red-700"
          >
            {error}
          </p>
        )}

        {/* ORDERS TABLE */}
        <div className="overflow-hidden rounded-3xl border border-[#eadfd2] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#eee4d9] px-6 py-5">
            <h3 className="font-serif text-xl font-semibold">
              All Orders
            </h3>

            <span className="rounded-full bg-[#f5ece1] px-4 py-2 text-xs font-semibold text-[#76543b]">
              {orders.length} orders
            </span>
          </div>

          {loading ? (
            <p className="p-8 text-[#7b6b60]">
              Loading orders...
            </p>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-3xl">🕯️</p>
              <h4 className="mt-3 text-xl font-semibold">
                No orders yet
              </h4>
              <p className="mt-2 text-[#8a776a]">
                Create your first candle order to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-[#f7f0e7] text-[#6b5040]">
                  <tr>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Phone</th>
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Qty</th>
                    <th className="px-5 py-4">Unit Price</th>
                    <th className="px-5 py-4">Total</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t border-[#f1e9e1] transition hover:bg-[#fdfaf6]"
                    >
                      <td className="px-5 py-5 font-semibold">
                        {order.customerName}
                      </td>

                      <td className="px-5 py-5">
                        {order.phone}
                      </td>

                      <td className="px-5 py-5">
                        {order.productName}
                      </td>

                      <td className="px-5 py-5">
                        {order.quantity}
                      </td>

                      <td className="px-5 py-5">
                        ${order.unitPrice.toFixed(2)}
                      </td>

                      <td className="px-5 py-5 font-bold">
                        ${order.total.toFixed(2)}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`inline-block whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(order)}
                            className="rounded-lg bg-[#f1e5d7] px-4 py-2 font-semibold text-[#76543b] hover:bg-[#e7d3bd]"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={deletingId !== null}
                            onClick={() => handleDeleteOrder(order)}
                            className="rounded-lg bg-red-50 px-4 py-2 font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                          >
                            {deletingId === order.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#e5d9ca] bg-[#563c2d] px-6 py-8 text-center text-sm text-[#f1e5d7]">
        <p className="font-serif text-xl font-semibold text-white">
          NOUR Candle Studio
        </p>
        <p className="mt-2">
          Handcrafted with love · Order Management Dashboard
        </p>
      </footer>
    </main>
  );
}
