"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL; // مثال: http://localhost:5000/api

async function parseResponse(res: Response) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  const text = await res.text();
  throw new Error(text || `HTTP ${res.status}`);
}

export default function EditOrderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    address: "",
    price: 0,
    phoneNumber: "",
    details: "",
    status: "pending",
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const r = await fetch(`${API}/orders/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          // لو Auth عندك بالكوكيز بدل التوكن:
          // credentials: "include",
        });
        const j = await parseResponse(r);
        if (!r.ok) throw new Error(j?.message || "Load error");
        const o = j.order;
        setForm({
          name: o?.name ?? "",
          address: o?.address ?? "",
          price: Number(o?.price ?? 0),
          phoneNumber: o?.phoneNumber ?? "",
          details: o?.details ?? "",
          status: o?.status ?? "pending",
        });
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const r = await fetch(`${API}/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        // credentials: "include", // فعّلها إذا Auth بالكوكيز
        body: JSON.stringify(form),
      });
      const j = await parseResponse(r);
      if (!r.ok) throw new Error(j?.message || "Update failed");

      // بعد الحفظ: رجوع للتفاصيل أو للائحة
      router.push(`/orders/${id}`);
    } catch (e: any) {
      setErr(e.message);
    }
  }

  if (loading) return <div className="p-6">عم نحمّل الطلب…</div>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold">تعديل الطلب</h1>
      {err && <div className="text-red-600 whitespace-pre-wrap">{String(err)}</div>}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            className="w-full border rounded p-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1">Address</label>
          <input
            className="w-full border rounded p-2"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1">Price</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className="block mb-1">Phone</label>
          <input
            className="w-full border rounded p-2"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1">Details</label>
          <textarea
            className="w-full border rounded p-2"
            rows={4}
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1">Status</label>
          <select
            className="w-full border rounded p-2"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as any })}
          >
            <option value="pending">pending</option>
            <option value="processing">processing</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 rounded bg-black text-white">Save</button>
          <button
            type="button"
            className="px-4 py-2 rounded border"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}