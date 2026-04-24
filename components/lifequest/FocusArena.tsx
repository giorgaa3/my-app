"use client";

import { useEffect, useMemo, useState } from "react";

import { Icon } from "@/components/ui/Icon";
import { FOCUS_REWARD } from "@/lib/lifequest";
import type { Task } from "@/lib/types";

type FocusArenaProps = {
  onCompleteSession: () => void;
  tasks: Task[];
};

const FOCUS_DURATION_SECONDS = 25 * 60;

export function FocusArena({ onCompleteSession, tasks }: FocusArenaProps) {
  const activeTasks = useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks],
  );
  const [selectedTaskId, setSelectedTaskId] = useState(activeTasks[0]?.id ?? "");
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_DURATION_SECONDS);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setSecondsLeft((currentSeconds) => {
        if (currentSeconds <= 1) {
          window.clearInterval(intervalId);
          setIsRunning(false);
          onCompleteSession();
          return FOCUS_DURATION_SECONDS;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning, onCompleteSession]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress =
    ((FOCUS_DURATION_SECONDS - secondsLeft) / FOCUS_DURATION_SECONDS) * 100;
  const selectedValue = selectedTaskId || activeTasks[0]?.id || "";

  function resetTimer() {
    setIsRunning(false);
    setSecondsLeft(FOCUS_DURATION_SECONDS);
  }

  return (
    <section className="dashboard-card arena-card rounded-2xl p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-white/70">
            Focus Arena
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-white">
            Enter a 25-minute session
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
            Pick a task, start the arena, and earn +{FOCUS_REWARD.xp} XP and +
            {FOCUS_REWARD.coins} coins when the session ends.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white">
          +{FOCUS_REWARD.xp} XP
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_220px] lg:items-end">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase text-white/65">
            Arena target
          </span>
          <select
            className="min-h-11 rounded-xl border border-white/10 bg-white/10 px-3 text-sm text-white outline-none"
            onChange={(event) => setSelectedTaskId(event.target.value)}
            value={selectedValue}
          >
            {activeTasks.length > 0 ? (
              activeTasks.map((task) => (
                <option className="text-slate-950" key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))
            ) : (
              <option className="text-slate-950" value="">
                Add an active task first
              </option>
            )}
          </select>
        </label>

        <div className="text-center lg:text-right">
          <p className="font-mono text-5xl font-semibold text-white">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase text-white/60">
            Focus clock
          </p>
        </div>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#60a5fa,#a78bfa,#34d399)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 disabled:opacity-45"
          disabled={activeTasks.length === 0}
          onClick={() => setIsRunning((current) => !current)}
          type="button"
        >
          <Icon name={isRunning ? "circle" : "spark"} className="h-4 w-4" />
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          onClick={resetTimer}
          type="button"
        >
          <Icon name="reset" className="h-4 w-4" />
          Reset
        </button>
      </div>
    </section>
  );
}
