"use client";
import { Metadata } from "next";
import { notFound, useParams, useSearchParams } from "next/navigation";
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
import { useEffect, useState } from "react";
import { Order as OrderType } from "@/services/orders/types";

type PageParams = {
  params: {
    id: string;
  };
};

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
    // When in print mode and data is ready, trigger print automatically
    if (isPrintMode && order) {
      // Wait a tiny bit for images/layout
      setTimeout(() => {
        window.print();
      }, 1000);
    }
  }, [isPrintMode, order]);

  if (!order) {
    return <div>Loading...</div>;
  }

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

          {/* Company Info */}
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
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-10 print:flex-row print:justify-between print:text-black">
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
              <Typography component="p">{order.name}</Typography>
              {order.phone && (
                <Typography component="p">{order.phone}</Typography>
              )}
              {order.address && (
                <Typography component="p" className="max-w-80">
                  {order.address}
                </Typography>
              )}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="mb-10 print:text-black">
          <Typography
            variant="h3"
            className="font-semibold text-card-foreground mb-3 print:text-black"
          >
            {order.name}
          </Typography>

          {order.details && (
            <Typography className="text-gray-700 leading-relaxed mb-6 print:text-black">
              {order.details}
            </Typography>
          )}

          {order.images?.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {order.images.map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Image ${idx + 1}`}
                  className=" h-64 object-contain rounded-md border"
                />
              ))}
            </div>
          )}
        </div>

        {/* Payment Section */}
        <div className="bg-background rounded-lg flex flex-col gap-4 md:justify-end md:flex-row p-6 md:px-8 mb-4 print:flex-row print:justify-between print:mb-0 print:p-0 print:px-2 print:bg-white">
          <div>
            <Typography
              component="h4"
              className="font-medium text-sm uppercase mb-1 tracking-wide print:text-black"
            >
              total amount
            </Typography>
            <Typography className="text-xl capitalize font-semibold tracking-wide text-primary">
              JOD{order.price?.toFixed(2)}
            </Typography>
          </div>
        </div>
      </Card>

      <InvoiceActions order={order} />
    </section>
  );
}
