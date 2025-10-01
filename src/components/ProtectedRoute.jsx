"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  console.log(user);
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.userType)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-lg mb-8">
          You do not have permission to view this page.
        </p>
        <Link href="/">
          <p className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Go to Home
          </p>
        </Link>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
