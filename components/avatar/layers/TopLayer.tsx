import type { TopVariant } from "@/lib/avatar-renderer";

type TopLayerProps = {
  variant: TopVariant;
};

const topColors: Record<
  TopVariant,
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

export function TopLayer({ variant }: TopLayerProps) {
  const colors = topColors[variant];
  const isArmor = variant === "focus-armor";
  const isSuit = variant === "space-suit";
  const isHoodie = variant === "developer-hoodie";

  return (
    <svg
      className="h-full w-full"
      fill="none"
      viewBox="0 0 240 360"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M82 164c11-8.2 65-8.2 76 0 7.2 18.6 9.7 43.7 7.5 75.2H74.5C72.3 207.7 74.8 182.6 82 164Z"
        fill={colors.main}
      />
      <path
        d="M87 166c7.8 21 18.8 34.2 33 39.5 14.2-5.3 25.2-18.5 33-39.5"
        fill={colors.shadow}
        opacity="0.55"
      />
      <path
        d="M102 155h36l-18 50-18-50Z"
        fill={isSuit ? "#F8FAFC" : "#F1F5F9"}
      />
      <path
        d="M120 163v73"
        stroke={isSuit ? "#64748B" : colors.accent}
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M82 171c-13.4 14.6-20.5 35.5-21.4 62.8"
        stroke={colors.shadow}
        strokeLinecap="round"
        strokeWidth="18"
      />
      <path
        d="M158 171c13.4 14.6 20.5 35.5 21.4 62.8"
        stroke={colors.shadow}
        strokeLinecap="round"
        strokeWidth="18"
      />
      {isHoodie ? (
        <>
          <path
            d="M86 165c12.5-11.4 55.5-11.4 68 0-5.5 18-16.8 29-34 33-17.2-4-28.5-15-34-33Z"
            fill="#111827"
            opacity="0.55"
          />
          <path
            d="M99 180c-3.2 14.2-3.8 29.2-1.8 45"
            stroke={colors.accent}
            strokeLinecap="round"
            strokeWidth="4"
          />
          <path
            d="M141 180c3.2 14.2 3.8 29.2 1.8 45"
            stroke={colors.accent}
            strokeLinecap="round"
            strokeWidth="4"
          />
        </>
      ) : null}
      {isArmor ? (
        <>
          <path
            d="M76 171h32l-10 34H68l8-34Z"
            fill="#C4B5FD"
            opacity="0.88"
          />
          <path
            d="M132 171h32l8 34h-30l-10-34Z"
            fill="#C4B5FD"
            opacity="0.88"
          />
          <path
            d="M101 199h38l-7 31h-24l-7-31Z"
            fill="#EEF2FF"
            opacity="0.95"
          />
        </>
      ) : null}
      {isSuit ? (
        <>
          <circle cx="120" cy="203" fill={colors.accent} r="10" />
          <path
            d="M77 226h86"
            stroke="#94A3B8"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <path
            d="M92 170c-4.5 16-5 34-1.5 54"
            stroke="#CBD5E1"
            strokeLinecap="round"
            strokeWidth="6"
          />
          <path
            d="M148 170c4.5 16 5 34 1.5 54"
            stroke="#CBD5E1"
            strokeLinecap="round"
            strokeWidth="6"
          />
        </>
      ) : null}
    </svg>
  );
}
