import React from "react";

export const Button = ({ children }: { children: React.ReactNode }) => {
  return (
    <button className="bg-primary cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600 transition">
      {children}
    </button>
  );
};
