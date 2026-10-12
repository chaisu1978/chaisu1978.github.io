const KEY = {
  high: "tta_high",
  muted: "tta_muted",
  difficulty: "tta_difficulty",
};

export type Difficulty = "casual" | "sysadmin";

export const DIFF_MODS: Record<Difficulty, { speed: number; delay: number }> = {
  casual: { speed: 0.85, delay: 1.25 },
  sysadmin: { speed: 1.2, delay: 0.8 },
};

export const storage = {
  get high(): number {
    return Number(localStorage.getItem(KEY.high) ?? 0);
  },
  set high(v: number) {
    localStorage.setItem(KEY.high, String(v));
  },
  get muted(): boolean {
    return localStorage.getItem(KEY.muted) === "1";
  },
  set muted(v: boolean) {
    localStorage.setItem(KEY.muted, v ? "1" : "0");
  },
  get difficulty(): Difficulty {
    return (localStorage.getItem(KEY.difficulty) as Difficulty) ?? "casual";
  },
  set difficulty(v: Difficulty) {
    localStorage.setItem(KEY.difficulty, v);
  },
};
