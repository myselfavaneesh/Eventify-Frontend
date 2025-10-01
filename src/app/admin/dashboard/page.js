"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getAdminDashboardStats } from "@/services/api";
import Link from "next/link";

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className="mr-4">{icon}</div>
    <div>
      <p className="text-gray-600">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminDashboardStats();
        setStats(data);
      } catch (err) {
        setError(
          "Failed to fetch dashboard stats. You might not have the required permissions."
        );
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "VENDOR"]}>
      <div className="flex">
        <aside className="w-64 bg-gray-800 text-white h-screen p-4">
          <h2 className="text-2xl font-bold mb-8">Admin Menu</h2>
          <nav>
            <Link href="/admin/dashboard">
              <p className="block py-2 px-4 rounded hover:bg-gray-700">
                Dashboard
              </p>
            </Link>
            <Link href="/admin/create-event">
              <p className="block py-2 px-4 rounded hover:bg-gray-700">
                Create Event
              </p>
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-8 bg-gray-100">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          {error && <p className="text-red-500">{error}</p>}
          {stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={<span>&#128100;</span>}
              />
              <StatCard
                title="Total Events"
                value={stats.totalEvents}
                icon={<span>&#128197;</span>}
              />
              <StatCard
                title="Total Bookings"
                value={stats.totalBookings}
                icon={<span>&#127915;</span>}
              />
              <StatCard
                title="Total Revenue"
                value={`$${stats.totalRevenue.toFixed(2)}`}
                icon={<span>&#128176;</span>}
              />
            </div>
          ) : (
            <p>Loading stats...</p>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboardPage;
