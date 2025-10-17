"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DownloadCloud, Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/shared/DatePicker";

import { exportAsCSV } from "@/helpers/exportData";

export default function OrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "",
    method: searchParams.get("method") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  });

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.status && filters.status !== "all")
      params.set("status", filters.status);
    if (filters.method && filters.method !== "all")
      params.set("method", filters.method);
    if (filters.startDate) params.set("start-date", filters.startDate);
    if (filters.endDate) params.set("end-date", filters.endDate);

    params.set("page", "1");
    params.set("limit", searchParams.get("limit") || "10");
    router.push(`/orders?${params.toString()}`);
  };

  const handleReset = () => {
    setFilters({
      search: "",
      status: "",
      method: "",
      startDate: "",
      endDate: "",
    });
    router.push("/orders");
  };

  const handleSetStartDate = (date: string) => {
    setFilters({ ...filters, startDate: date });
  };

  const handleSetEndDate = (date: string) => {
    setFilters({ ...filters, endDate: date });
  };

  return (
    <Card className="mb-5">
      <form onSubmit={handleFilter} className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
          <Input
            type="search"
            placeholder="Search by customer name"
            className="h-12 md:basis-1/4"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value })}
          >
            <SelectTrigger className="capitalize md:basis-1/4">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-4 lg:gap-6">
          <div className="md:basis-[35%]">
            <Label className="text-muted-foreground font-normal">
              Start date
            </Label>
            <DatePicker date={filters.startDate} setDate={handleSetStartDate} />
          </div>

          <div className="md:basis-[35%]">
            <Label className="text-muted-foreground font-normal">
              End date
            </Label>
            <DatePicker date={filters.endDate} setDate={handleSetEndDate} />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-4 md:basis-[30%]">
            <Button type="submit" size="lg" className="h-12 flex-grow">
              Filter
            </Button>
            <Button
              type="button"
              size="lg"
              variant="secondary"
              className="h-12 flex-grow"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
