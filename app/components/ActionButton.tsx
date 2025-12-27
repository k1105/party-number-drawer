"use client";

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function ActionButton({
  label,
  onClick,
  disabled = false,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`fixed bottom-8 right-8 z-50 px-10 py-5 font-bold text-lg tracking-[0.2em] uppercase transition-all border-2 ${
        disabled
          ? "bg-black/20 text-black/40 border-black/20 cursor-not-allowed"
          : "bg-black text-white border-black hover:bg-white hover:text-black active:scale-95"
      }`}
    >
      {label}
    </button>
  );
}
