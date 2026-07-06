"use client";

import { DashboardProvider } from "../context/DashboardContext";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <DashboardProvider>
      <Layout />
    </DashboardProvider>
  );
}
