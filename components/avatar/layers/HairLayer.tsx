import type { HairVariant } from "@/lib/avatar-renderer";

type HairLayerProps = {
  variant: HairVariant;
};

export function HairLayer({ variant }: HairLayerProps) {
  if (variant === "classic-cap") {
    return (
      <svg
        className="h-full w-full"
        fill="none"
        viewBox="0 0 240 360"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M74 83c5-29 22-45 46-45s41 16 46 45c-23.7-9.2-68.3-9.2-92 0Z"
          fill="#1E293B"
        />
        <path
          d="M73 82c21.5-8.7 72.6-8.7 94 0 7.6 3.1 10.5 9.4 6.4 14.2-18.3-5.2-88.4-5.2-106.8 0-4.1-4.8-1.2-11.1 6.4-14.2Z"
          fill="#2563EB"
        />
        <path
          d="M126 81c22 0 40.4 3.8 53 11.6"
          stroke="#1D4ED8"
          strokeLinecap="round"
          strokeWidth="8"
        />
        <path
          d="M98 45c8.8-4.8 35.6-4.8 44 0"
          stroke="#60A5FA"
          strokeLinecap="round"
          strokeWidth="5"
        />
      </svg>
    );
  }

  if (variant === "cyber-hair") {
    return (
      <svg
        className="h-full w-full"
        fill="none"
        viewBox="0 0 240 360"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M75 91c1.6-34.4 20.8-55 49.6-55 25.4 0 42.6 18.8 40.4 44-10.6-6.2-23.8-11.6-39.6-16.2 4.4 8 3.8 18.2-1.8 30.6-12-8.5-25.5-12.5-40.6-12-2.6 2.8-5.3 5.7-8 8.6Z"
          fill="#111827"
        />
        <path
          d="M96 55c11.8 1.2 25.2 4.1 40.2 8.7"
          stroke="#22D3EE"
          strokeLinecap="round"
          strokeWidth="6"
        />
        <path
          d="M86 73c18.2-.6 35 2.4 50.4 9"
          stroke="#A78BFA"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          d="M151 61c8.8 7.4 13 16.2 12.6 26.4"
          stroke="#22D3EE"
          strokeLinecap="round"
          strokeWidth="5"
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
        d="M75 92c.9-34.5 19.6-55.7 48.8-55.7 26.5 0 45.5 20.5 41.7 55.7-13.1-8.8-31.6-13.2-55.5-13.2-14 0-25.6 4.4-35 13.2Z"
        fill="#7C4A29"
      />
      <path
        d="M83 81c12.4-14.2 31.3-20.6 56.5-19.2"
        stroke="#9A6B43"
        strokeLinecap="round"
        strokeWidth="7"
      />
      <path
        d="M139 64c10.3 6.1 18.1 15.2 23.3 27.3"
        stroke="#5F351F"
        strokeLinecap="round"
        strokeWidth="6"
      />
    </svg>
  );
}
