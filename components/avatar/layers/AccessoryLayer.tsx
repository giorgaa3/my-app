import type { AccessoryVariant } from "@/lib/avatar-renderer";

type AccessoryLayerProps = {
  variant: AccessoryVariant;
};

export function AccessoryLayer({ variant }: AccessoryLayerProps) {
  if (variant === "none") {
    return null;
  }

  if (variant === "headphones") {
    return (
      <svg
        className="h-full w-full"
        fill="none"
        viewBox="0 0 240 360"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M75 108c0-34.5 18-58 45-58s45 23.5 45 58"
          stroke="#0F172A"
          strokeLinecap="round"
          strokeWidth="7"
        />
        <rect fill="#2563EB" height="34" rx="11" width="19" x="62" y="95" />
        <rect fill="#2563EB" height="34" rx="11" width="19" x="159" y="95" />
        <rect fill="#0F172A" height="22" rx="8" width="12" x="66" y="101" />
        <rect fill="#0F172A" height="22" rx="8" width="12" x="162" y="101" />
      </svg>
    );
  }

  if (variant === "shadow-shades") {
    return (
      <svg
        className="h-full w-full"
        fill="none"
        viewBox="0 0 240 360"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M83 101h30c4.6 0 8.1 4 7.4 8.6l-1.3 7.9c-.9 5.2-5.4 9-10.7 9H91.7c-5.5 0-10.2-4.1-10.8-9.6L80 109c-.5-4.4 3-8 7.4-8Z"
          fill="#111827"
        />
        <path
          d="M127 101h30c4.4 0 7.9 3.6 7.4 8l-.9 7.9c-.6 5.5-5.3 9.6-10.8 9.6h-16.7c-5.3 0-9.8-3.8-10.7-9l-1.3-7.9c-.7-4.6 2.8-8.6 7.4-8.6Z"
          fill="#111827"
        />
        <path d="M119 108h7" stroke="#111827" strokeLinecap="round" strokeWidth="5" />
        <path
          d="M91 107h20"
          stroke="#475569"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <path
          d="M136 107h20"
          stroke="#475569"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
    );
  }

  return (
    <svg
      className="h-full w-full"
      fill="none"
      viewBox="0 0 240 360"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M87 55 103 35l17 22 17-22 16 20-7 24H94l-7-24Z"
        fill="#F59E0B"
      />
      <path
        d="M94 79h52"
        stroke="#B45309"
        strokeLinecap="round"
        strokeWidth="7"
      />
      <circle cx="103" cy="53" fill="#FEF3C7" r="4" />
      <circle cx="120" cy="51" fill="#FEF3C7" r="4" />
      <circle cx="137" cy="53" fill="#FEF3C7" r="4" />
    </svg>
  );
}
