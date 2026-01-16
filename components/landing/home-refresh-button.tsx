"use client";

interface HomeRefreshButtonProps {
  className?: string;
}

export default function HomeRefreshButton({
  className,
}: HomeRefreshButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.location.reload()}
      className={className}
    >
      Ana Sayfa
    </button>
  );
}
