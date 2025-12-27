"use client";

interface StatusHeaderProps {
  status: "ENTRY" | "GAME" | "RESULT";
}

export default function StatusHeader({status}: StatusHeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black">
      <div className="px-8 py-4 flex items-center">
        <div className="text-white font-bold text-sm tracking-[0.3em] uppercase">
          {status}
        </div>
      </div>
    </header>
  );
}
