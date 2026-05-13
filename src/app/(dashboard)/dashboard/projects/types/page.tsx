"use client";
import { LookupManagement } from "@/components/dashboard/lookup-management";
import { ProjectService } from "@/src/services/project.service";

export default function ProjectTypesPage() {
  return <LookupManagement title="Project Types" description="Manage project type classifications." breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Projects" }, { label: "Types" }]} fetchItems={ProjectService.getTypes} createItem={ProjectService.createType} updateItem={ProjectService.updateType} deleteItem={ProjectService.deleteType} />;
}
