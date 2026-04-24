import type { ShoesVariant } from "@/lib/avatar-renderer";

type ShoesLayerProps = {
  variant: ShoesVariant;
};

const shoesColors: Record<
  ShoesVariant,
  {
    accent: string;
    main: string;
    sole: string;
  }
> = {
  "focus-boots": {
    accent: "#60A5FA",
    main: "#111827",
    sole: "#475569",
  },
  "rocket-runners": {
    accent: "#F59E0B",
    main: "#7C3AED",
    sole: "#F8FAFC",
  },
  "starter-sneakers": {
    accent: "#34D399",
    main: "#F8FAFC",
    sole: "#64748B",
  },
  starter: {
    accent: "#60A5FA",
    main: "#E2E8F0",
    sole: "#64748B",
  },
};

export function ShoesLayer({ variant }: ShoesLayerProps) {
  const colors = shoesColors[variant];

  return (
    <svg
      className="h-full w-full"
      fill="none"
      viewBox="0 0 240 360"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M80 319h37v13c0 5-4 9-9 9H77c-5.5 0-9-5.7-6.7-10.7l3.4-7.4c1.1-2.4 3.5-3.9 6.3-3.9Z"
        fill={colors.main}
      />
      <path
        d="M123 319h37c2.8 0 5.2 1.5 6.3 3.9l3.4 7.4c2.3 5-1.2 10.7-6.7 10.7h-31c-5 0-9-4-9-9v-13Z"
        fill={colors.main}
      />
      <path
        d="M73 337h43"
        stroke={colors.sole}
        strokeLinecap="round"
        strokeWidth="6"
      />
      <path
        d="M124 337h43"
        stroke={colors.sole}
        strokeLinecap="round"
        strokeWidth="6"
      />
      <path
        d="M84 326h21"
        stroke={colors.accent}
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M135 326h21"
        stroke={colors.accent}
        strokeLinecap="round"
        strokeWidth="4"
      />
    </svg>
  );
}
