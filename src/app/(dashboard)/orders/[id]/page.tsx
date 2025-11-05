"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { FaBagShopping } from "react-icons/fa6";
import { format } from "date-fns";

import PageTitle from "@/components/shared/PageTitle";
import Typography from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { OrderBadgeVariants } from "@/constants/badge";
import { fetchOrderDetails } from "@/services/orders";
import { InvoiceActions } from "./_components/InvoiceActions";
import { Order as OrderType } from "@/services/orders/types";

export default function Order() {
  const [order, setOrder] = useState<OrderType | null>(null);
  const { id } = useParams();
  const searchParams = useSearchParams();
  const isPrintMode = searchParams.get("print") === "true";

  useEffect(() => {
    async function load() {
      if (typeof id === "string") {
        const data = await fetchOrderDetails({ id });
        setOrder(data.order);
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    if (isPrintMode && order) {
      setTimeout(() => {
        window.print();
      }, 1000);
    }
  }, [isPrintMode, order]);

  if (!order) return <div>Loading...</div>;

  const buyerName =
    (order as any)?.name ||
    (order as any)?.userId?.name ||
    (order as any)?.customer?.name ||
    "Customer";

  const phoneCandidates = [
    (order as any)?.phoneNumber,
    (order as any)?.phone,
    (order as any)?.userId?.phoneNumber,
    (order as any)?.userId?.phone,
    (order as any)?.customer?.phoneNumber,
    (order as any)?.customer?.phone,
  ].filter((v) => typeof v === "string" && v.trim().length > 0);

  const buyerPhone = phoneCandidates[0] ?? "-";

  return (
    <section>
      <PageTitle className="print:hidden">Invoice</PageTitle>

      <Card className="mb-8 text-muted-foreground p-4 lg:p-6 print:border-none print:bg-white print:mb-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-x-4 gap-y-6 print:flex-row print:justify-between">
          <div className="flex flex-col">
            <Typography
              className="uppercase text-card-foreground mb-1.5 md:text-xl tracking-wide print:text-black"
              variant="h2"
            >
              invoice
            </Typography>
            <div className="flex items-center gap-x-2">
              <Typography className="uppercase font-semibold text-xs print:text-black">
                status
              </Typography>
              <Badge
                variant={OrderBadgeVariants[order.status]}
                className="flex-shrink-0 text-xs capitalize"
              >
                {order.status}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col text-sm gap-y-0.5 md:text-right print:text-right print:text-black">
            <div className="flex items-center md:justify-end gap-x-1 print:justify-end">
              <FaBagShopping className="size-6 text-primary mb-1 flex-shrink-0" />
              <Typography
                component="span"
                variant="h2"
                className="text-card-foreground print:text-black"
              >
                {order.userId?.name || "Store"}
              </Typography>
            </div>
            {order.address && (
              <Typography component="p">{order.address}</Typography>
            )}
          </div>
        </div>

        <Separator className="my-6 print:bg-print-border" />

        {/* Invoice Meta Info */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6 print:flex-row print:justify-between print:text-black">
          <div>
            <Typography
              variant="p"
              component="h4"
              className="font-semibold uppercase text-card-foreground mb-1 print:text-black"
            >
              date
            </Typography>
            <Typography className="text-sm">
              {order.createdAt ? format(new Date(order.createdAt), "PPP") : "-"}
            </Typography>
          </div>

          <div>
            <Typography
              variant="p"
              component="h4"
              className="font-semibold uppercase text-card-foreground mb-1 print:text-black"
            >
              invoice no
            </Typography>
            <Typography className="text-sm">#{order.invoice_no}</Typography>
          </div>

          <div className="md:text-right print:text-right">
            <Typography
              variant="p"
              component="h4"
              className="font-semibold uppercase text-card-foreground mb-1 print:text-black"
            >
              invoice to
            </Typography>
            <div className="flex flex-col text-sm gap-y-0.5">
              <Typography component="p">{buyerName}</Typography>
              <Typography component="p">
                <span dir="ltr" className="font-mono">
                  {buyerPhone}
                </span>
              </Typography>
              {order.address && (
                <Typography component="p" className="max-w-80">
                  {order.address}
                </Typography>
              )}
            </div>
          </div>
        </div>

        {/* Product Info + Price */}
        <div
          className="no-break flex flex-col items-center gap-2 mb-4 print:text-black"
          style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
        >
          <Typography
            variant="h3"
            className="font-semibold text-card-foreground mb-2 print:text-black"
          >
            {order.name}
          </Typography>

          {order.details && (
            <Typography className="text-gray-700 leading-relaxed mb-2 text-center print:text-black">
              {order.details}
            </Typography>
          )}

          {order.images?.length > 0 && (
            <div
              className="grid grid-cols-2 gap-2 w-full"
              style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
            >
              {order.images.map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Image ${idx + 1}`}
                  className="h-48 object-contain rounded-md border"
                  style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                />
              ))}
            </div>
          )}

          {/* ✅ السعر صار ملزق تحت الصور ومضمون يضل بنفس الصفحة */}
          <div
            className="bg-background rounded-lg flex flex-col gap-1 items-center p-3 md:px-6 print:bg-white print:p-0 print:px-2"
            style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
          >
            <Typography
              component="h4"
              className="font-medium text-sm uppercase tracking-wide print:text-black"
            >
              total amount
            </Typography>
            <Typography className="text-lg capitalize font-semibold tracking-wide text-primary">
              {typeof order.price === "number"
                ? `JOD${order.price.toFixed(2)}`
                : "-"}
            </Typography>
          </div>
        </div>
      </Card>

      <InvoiceActions order={order} />
    </section>
  );
}
