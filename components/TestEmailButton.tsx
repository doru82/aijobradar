"use client";

import { useState } from "react";
import { Mail, Loader2, Check, X } from "lucide-react";

export default function TestEmailButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const sendTestEmail = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Email sent! Check your inbox.");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to send");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Network error");
    }

    // Reset după 5 secunde
    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 5000);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={sendTestEmail}
        disabled={status === "loading"}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          status === "success"
            ? "bg-green-500 text-white"
            : status === "error"
            ? "bg-red-500 text-white"
            : "bg-slate-700 hover:bg-slate-600 text-white"
        }`}
      >
        {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
        {status === "success" && <Check className="w-4 h-4" />}
        {status === "error" && <X className="w-4 h-4" />}
        {status === "idle" && <Mail className="w-4 h-4" />}
        
        {status === "loading" ? "Sending..." : status === "success" ? "Sent!" : status === "error" ? "Failed" : "Send Test Email"}
      </button>
      
      {message && (
        <p className={`text-sm ${status === "success" ? "text-green-400" : "text-red-400"}`}>
          {message}
        </p>
      )}
    </div>
  );
}