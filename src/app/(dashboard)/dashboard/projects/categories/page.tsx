"use client";
import { LookupManagement } from "@/components/dashboard/lookup-management";
import { ProjectService } from "@/src/services/project.service";

export default function ProjectCategoriesPage() {
  return <LookupManagement title="Project Categories" description="Manage project category classifications." breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Projects" }, { label: "Categories" }]} fetchItems={ProjectService.getCategories} createItem={ProjectService.createCategory} updateItem={ProjectService.updateCategory} deleteItem={ProjectService.deleteCategory} />;
}
