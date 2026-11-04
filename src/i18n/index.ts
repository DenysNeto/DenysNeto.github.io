import { CONFIG } from "../config";

export type Lang = "ru" | "uk" | "pl";
export type L10n = Record<Lang, string>;
/** A plain string is the same in every language (brand names, numbers). */
export type Text = string | L10n;

export const LANGS: Lang[] = ["ru", "uk", "pl"];

export const T = (ru: string, uk: string, pl: string): L10n => ({ ru, uk, pl });

let current: Lang = "ru";
export const getLang = (): Lang => current;
export const setCurrentLang = (l: Lang): void => { current = l; };

/** Translate into a given language */
export const tl = (o: Text | null | undefined, L: Lang): string =>
  o == null ? "" : typeof o === "string" ? o : o[L] ?? o.ru;
/** Translate into the current page language */
export const t = (o: Text | null | undefined): string => tl(o, current);

export const fill = (s: string): string =>
  s.replace("{years}", String(CONFIG.years)).replace("{pct}", String(CONFIG.referral)).replace("{name}", CONFIG.name);

/** 4000 -> "4 000 zł" with non-breaking spaces */
export const money = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0") + "\u00A0zł";
