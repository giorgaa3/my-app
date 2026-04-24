import type { OutfitVariant } from "@/lib/avatar-renderer";

type OutfitLayerProps = {
  variant: OutfitVariant;
};

const outfitColors: Record<
  OutfitVariant,
  {
    accent: string;
    main: string;
    shadow: string;
  }
> = {
  "developer-hoodie": {
    accent: "#14B8A6",
    main: "#334155",
    shadow: "#1E293B",
  },
  "focus-armor": {
    accent: "#A78BFA",
    main: "#4F46E5",
    shadow: "#312E81",
  },
  "space-suit": {
    accent: "#38BDF8",
    main: "#E2E8F0",
    shadow: "#94A3B8",
  },
  starter: {
    accent: "#34D399",
    main: "#2563EB",
    shadow: "#1D4ED8",
  },
};

export function OutfitLayer({ variant }: OutfitLayerProps) {
  const colors = outfitColors[variant];
  const isArmor = variant === "focus-armor";
  const isSuit = variant === "space-suit";
  const isHoodie = variant === "developer-hoodie";

  return (
    <svg
      className="h-full w-full"
      fill="none"
      viewBox="0 0 240 280"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M82 158c-17.2 10.4-28.5 28.8-32.2 56.4-1.5 10.8 6.9 20.6 17.8 20.6H172c10.9 0 19.3-9.8 17.8-20.6-3.7-27.6-15-46-32.2-56.4-12.8-7.8-62.8-7.8-75.6 0Z"
        fill={colors.main}
      />
      <path
        d="M87 160c7.8 20.6 18.8 33.6 33 39 14.2-5.4 25.2-18.4 33-39"
        fill={colors.shadow}
        opacity="0.6"
      />
      <path
        d="M101 151h38l-19 48-19-48Z"
        fill={isSuit ? "#F8FAFC" : "#F1F5F9"}
      />
      <path
        d="M120 158v64"
        stroke={isSuit ? "#64748B" : colors.accent}
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M87 169c-13.6 11.8-21.6 29.6-24 53"
        stroke={colors.shadow}
        strokeLinecap="round"
        strokeWidth="16"
      />
      <path
        d="M153 169c13.6 11.8 21.6 29.6 24 53"
        stroke={colors.shadow}
        strokeLinecap="round"
        strokeWidth="16"
      />
      {isHoodie ? (
        <>
          <path
            d="M86 159c12.5-11.4 55.5-11.4 68 0-5.5 17.7-16.8 28.4-34 32-17.2-3.6-28.5-14.3-34-32Z"
            fill="#111827"
            opacity="0.55"
          />
          <path
            d="M100 174c-3.2 14.2-3.8 29.2-1.8 45"
            stroke={colors.accent}
            strokeLinecap="round"
            strokeWidth="4"
          />
          <path
            d="M140 174c3.2 14.2 3.8 29.2 1.8 45"
            stroke={colors.accent}
            strokeLinecap="round"
            strokeWidth="4"
          />
        </>
      ) : null}
      {isArmor ? (
        <>
          <path
            d="M76 166h32l-10 32H68l8-32Z"
            fill="#C4B5FD"
            opacity="0.86"
          />
          <path
            d="M132 166h32l8 32h-30l-10-32Z"
            fill="#C4B5FD"
            opacity="0.86"
          />
          <path
            d="M101 191h38l-7 28h-24l-7-28Z"
            fill="#EEF2FF"
            opacity="0.95"
          />
        </>
      ) : null}
      {isSuit ? (
        <>
          <circle cx="120" cy="193" fill={colors.accent} r="10" />
          <path
            d="M78 216h84"
            stroke="#94A3B8"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <path
            d="M92 166c-4.5 16-5 33-1.5 51"
            stroke="#CBD5E1"
            strokeLinecap="round"
            strokeWidth="6"
          />
          <path
            d="M148 166c4.5 16 5 33 1.5 51"
            stroke="#CBD5E1"
            strokeLinecap="round"
            strokeWidth="6"
          />
        </>
      ) : null}
    </svg>
  );
}
