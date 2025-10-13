// import { Fragment } from "react";
// import { Metadata } from "next";

// import PageTitle from "@/components/shared/PageTitle";
// import SalesOverview from "./_components/SalesOverview";
// import StatusOverview from "./_components/StatusOverview";
// import DashboardCharts from "./_components/dashboard-charts";
// import RecentOrders from "@/app/(dashboard)/orders/_components/orders-table";

// export const metadata: Metadata = {
//   title: "Dashboard",
// };

// export default async function DashboardPage() {
//   return (
//     <Fragment>
//       <section>
//         <PageTitle>Dashboard Overview</PageTitle>

//         <div className="space-y-8 mb-8">
//           <SalesOverview />
//           <StatusOverview />
//           <DashboardCharts />
//         </div>
//       </section>

//       <section>
//         <PageTitle component="h2">Recent Orders</PageTitle>

//         <RecentOrders />
//       </section>
//     </Fragment>
//   );
// }

import { Metadata } from "next";

import PageTitle from "@/components/shared/PageTitle";
import AllCustomers from "./customers/_components/customers-table";
import CustomerActions from "./customers/_components/CustomerActions";
import CustomerFilters from "./customers/_components/CustomerFilters";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function CustomersPage() {
  return (
    <section>
      <PageTitle>Customers</PageTitle>

      <CustomerActions />
      <CustomerFilters />
      <AllCustomers />
    </section>
  );
}
