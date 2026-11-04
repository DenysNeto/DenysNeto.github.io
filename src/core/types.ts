import type { Text } from "../i18n";
import type { Phone } from "./phone";

export type DemoKind = "chat" | "app" | "site";

/** A button in the phone's bottom action bar */
export interface Action {
  label: Text;
  primary?: boolean;
  onClick: () => void;
}

/** What a screen renders: HTML for the phone body and optional bottom actions */
export interface View {
  html: string;
  actions?: Action[];
}

/** Anything that can run inside a Phone */
export interface Demo {
  kind: DemoKind;
  ph: Phone | null;
  scr: string | null;
  top(): string;
  start(): void;
  /** Called on clicks on elements with data-act / data-val inside the phone body */
  act?(action: string, value?: string): void;
}
