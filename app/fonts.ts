import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";

/**
 * Fonts live in their own module because <html> now lives in the per-locale
 * layout (app/[locale]/layout) rather than the root — the font variables need
 * to be attached there AND on the standalone global 404 shell, so both import
 * `fontVariables` from here.
 */
const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const fontVariables = `${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`;
