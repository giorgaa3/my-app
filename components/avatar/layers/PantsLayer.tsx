import type { PantsVariant } from "@/lib/avatar-renderer";

type PantsLayerProps = {
  variant: PantsVariant;
};

const pantsColors: Record<
  PantsVariant,
  {
    accent: string;
    main: string;
    seam: string;
  }
> = {
  "focus-trousers": {
    accent: "#38BDF8",
    main: "#1E293B",
    seam: "#60A5FA",
  },
  "lunar-pants": {
    accent: "#A78BFA",
    main: "#CBD5E1",
    seam: "#64748B",
  },
  "utility-joggers": {
    accent: "#34D399",
    main: "#475569",
    seam: "#0F766E",
  },
  starter: {
    accent: "#60A5FA",
    main: "#334155",
    seam: "#1D4ED8",
  },
};

export function PantsLayer({ variant }: PantsLayerProps) {
  const colors = pantsColors[variant];
  const isLunar = variant === "lunar-pants";

  return (
    <svg
      className="h-full w-full"
      fill="none"
      viewBox="0 0 240 360"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M78 234h84l-9 88c-.4 4.2-4 7.4-8.2 7.4H132l-12-73.5-12 73.5H95.2c-4.2 0-7.8-3.2-8.2-7.4l-9-88Z"
        fill={colors.main}
      />
      <path
        d="M120 240v82"
        stroke={colors.seam}
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M91 251c9.8 6.6 19.5 8.6 29 6"
        stroke={colors.accent}
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M149 251c-9.8 6.6-19.5 8.6-29 6"
        stroke={colors.accent}
        strokeLinecap="round"
        strokeWidth="4"
      />
      {isLunar ? (
        <>
          <path
            d="M91 286h20"
            stroke="#F8FAFC"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <path
            d="M129 286h20"
            stroke="#F8FAFC"
            strokeLinecap="round"
            strokeWidth="5"
          />
        </>
      ) : null}
    </svg>
  );
}
