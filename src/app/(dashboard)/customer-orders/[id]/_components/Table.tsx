"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { getColumns } from "@/app/(dashboard)/orders/_components/orders-table/columns";
import DataTable from "@/components/shared/table/DataTable";
import { DataTableProps } from "@/types/data-table";
import { useAuthorization } from "@/hooks/use-authorization";
import { Order } from "@/services/orders/types";

export default function CustomerOrdersTable({
  data,
}: Omit<DataTableProps<Order>, "columns" | "pagination">) {
  const { hasPermission } = useAuthorization();
  const columns = getColumns({ hasPermission });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DataTable
      table={table}
      pagination={{
        limit: 0,
        current: 0,
        items: 0,
        pages: 0,
        next: null,
        prev: null,
      }}
    />
  );
}
