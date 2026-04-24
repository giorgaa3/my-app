"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Icon } from "@/components/ui/Icon";
import type { LevelUpDetails } from "@/lib/types";

type LevelUpModalProps = {
  details: LevelUpDetails | null;
  onClose: () => void;
};

export function LevelUpModal({ details, onClose }: LevelUpModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (!details) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [details, onClose]);

  if (!details) {
    return null;
  }

  function viewProfile() {
    onClose();
    router.push("/profile");
  }

  return (
    <div
      aria-labelledby="level-up-title"
      aria-modal="true"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/58 px-4 py-8 backdrop-blur-md"
      role="dialog"
    >
      <div className="level-up-panel relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/20 bg-[var(--surface)] p-5 shadow-[0_30px_90px_rgb(15_23_42/0.35)] sm:p-6">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        <div className="absolute right-4 top-4">
          <button
            aria-label="Close level up modal"
            className="icon-button inline-flex h-9 w-9 items-center justify-center rounded-xl transition"
            onClick={onClose}
            type="button"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-emerald-400 text-6xl shadow-[0_18px_48px_rgb(124_58_237/0.35)]">
          {details.avatar}
        </div>

        <div className="mt-5 text-center">
          <p className="section-muted text-sm font-semibold uppercase tracking-wide">
            Level Up
          </p>
          <h2
            className="section-title mt-2 text-3xl font-semibold"
            id="level-up-title"
          >
            Level {details.level} reached
          </h2>
          <p className="section-muted mt-2 text-sm leading-6">
            New title unlocked:{" "}
            <span className="font-semibold text-[var(--brand)]">
              {details.title}
            </span>
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <RewardMetric label="XP earned" value={`+${details.xpGained}`} />
          <RewardMetric label="Coins earned" value={`+${details.coinsGained}`} />
          <RewardMetric label="Coin balance" value={details.totalCoins} />
        </div>

        <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
          <p className="section-title text-sm font-semibold">
            Rewards unlocked
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {details.achievements.length > 0 ? (
              details.achievements.map((achievement) => (
                <span
                  className="accent-badge rounded-full px-3 py-1.5 text-xs font-semibold"
                  key={achievement}
                >
                  {achievement}
                </span>
              ))
            ) : (
              <span className="section-muted text-sm">
                A stronger title and progress toward new cosmetic rewards.
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            className="primary-button inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition hover:-translate-y-0.5"
            onClick={onClose}
            type="button"
          >
            <Icon name="spark" className="h-4 w-4" />
            Awesome
          </button>
          <button
            className="icon-button inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition hover:-translate-y-0.5"
            onClick={viewProfile}
            type="button"
          >
            <Icon name="target" className="h-4 w-4" />
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}

type RewardMetricProps = {
  label: string;
  value: number | string;
};

function RewardMetric({ label, value }: RewardMetricProps) {
  return (
    <div className="soft-card rounded-2xl px-4 py-3 text-center">
      <p className="section-muted text-xs font-semibold uppercase">{label}</p>
      <p className="section-title mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
