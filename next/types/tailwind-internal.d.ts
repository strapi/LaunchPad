declare module 'tailwindcss/lib/util/flattenColorPalette' {
  type FlattenedColors = Record<string, string>;

  export default function flattenColorPalette(
    colors: Record<string, unknown>
  ): FlattenedColors;
}
