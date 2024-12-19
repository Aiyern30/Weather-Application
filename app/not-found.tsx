"use client";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import breezy_logo from "@/public/Breezy-Logo.png";

const UnauthorizedPage = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push("/invoices/expenses");
  };

  return (
    <div className=" flex items-center justify-center min-h-screen min-w-full overflow-hidden">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md mb-4">
          <div className="flex flex-col items-center">
            <div className="mb-4 text-center">
              <Image src={breezy_logo} alt="LOGO" width={300} height={300} />
            </div>
            <div className="text-center mb-4">
              <h1 className="text-4xl font-bold mb-3 text-gray-800">
                404 Not Found
              </h1>
              <p className="text-gray-600 leading-relaxed">
                Requested resource is not available
              </p>
            </div>
            <button
              onClick={handleBack}
              className="w-full max-w-xs bg-blue-500 text-white py-3 px-6 rounded-lg font-bold shadow-md hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
            >
              <i className="pi pi-sign-in mr-2"></i> Return to Previous Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
