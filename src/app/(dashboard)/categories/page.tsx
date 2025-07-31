import { Metadata } from "next";

import PageTitle from "@/components/shared/PageTitle";
import AllCategories from "./_components/categories-table";
import CategoryActions from "./_components/CategoryActions";
import CategoryFilters from "./_components/CategoryFilters";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function CategoriesPage() {
  return (
    <section>
      <PageTitle>Categories</PageTitle>

      <CategoryActions />
      <CategoryFilters />
      <AllCategories />
    </section>
  );
}
