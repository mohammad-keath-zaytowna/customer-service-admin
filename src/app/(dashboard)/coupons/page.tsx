import { Metadata } from "next";

import PageTitle from "@/components/shared/PageTitle";
import AllCoupons from "./_components/coupons-table";
import CouponActions from "./_components/CouponActions";
import CouponFilters from "./_components/CouponFilters";

export const metadata: Metadata = {
  title: "Coupons",
};

export default async function CouponsPage() {
  return (
    <section>
      <PageTitle>Coupons</PageTitle>

      <CouponActions />
      <CouponFilters />
      <AllCoupons />
    </section>
  );
}
