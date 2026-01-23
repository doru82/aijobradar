"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton({ isPremium }: { isPremium: boolean }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className={`p-3 rounded-xl transition-all ${
        isPremium
          ? "bg-white border-2 border-red-200 hover:border-red-400 text-red-500"
          : "bg-slate-800 border border-slate-700 hover:border-red-500 text-gray-300 hover:text-red-400"
      }`}
    >
      <LogOut className="w-5 h-5" />
    </button>
  );
}