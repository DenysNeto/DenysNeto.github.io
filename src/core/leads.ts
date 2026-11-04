import { CONFIG } from "../config";

// Messages that arrive in WhatsApp already written: the owner only presses "send".

export const waLink = (text: string): string => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
