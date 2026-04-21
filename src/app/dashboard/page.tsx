"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { CourseProgressList } from "@/components/dashboard/CourseProgressList";
import { BadgeShelf } from "@/components/dashboard/BadgeShelf";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <DashboardHeader />
      <StatsCards />
      <CourseProgressList />
      <BadgeShelf />
    </div>
  );
}
