import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Typography from "@/components/ui/typography";

export default function InvoicePdfTemplate({ order }: { order: any }) {
  const store = order.userId; // store info (e.g. pharmacy, clinic, etc.)

  return (
    <Card
      id={`invoice-${order.invoice_no}`}
      className="text-black p-20 border-none bg-white rounded-none"
      style={{ width: "794px", height: "1123px" }} // A4 size
    >
      {/* 🏪 Store Info */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <Typography variant="h2" className="font-bold uppercase text-black">
            {store?.name || "Store Name"}
          </Typography>

          {order.address && (
            <Typography className="text-sm text-gray-700 mt-1">
              {order.address}
            </Typography>
          )}
        </div>

        {/* 💰 Total Price */}
        <div className="text-right">
          <Typography className="text-sm uppercase font-semibold text-gray-600">
            Total Price
          </Typography>
          <Typography className="text-3xl font-bold text-primary">
            ${order.price?.toFixed(2)}
          </Typography>
        </div>
      </div>

      <Separator className="my-6 bg-print-border" />

      {/* 🧾 Product Info */}
      <div className="flex flex-col gap-4">
        <Typography variant="h3" className="font-semibold text-black">
          {order.name}
        </Typography>

        {order.details && (
          <Typography className="text-gray-700 leading-relaxed">
            {order.details}
          </Typography>
        )}
      </div>

      {/* 🖼️ Show All Images */}
      {order.images?.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-8">
          {order.images.map((img: string, idx: number) => (
            <img
              key={idx}
              src={img}
              alt={`Image ${idx + 1}`}
              className="w-full h-60 object-cover rounded-md border"
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <Separator className="my-10 bg-print-border" />
      <Typography className="text-xs text-gray-500 text-center">
        Thank you for your purchase!
      </Typography>
    </Card>
  );
}
