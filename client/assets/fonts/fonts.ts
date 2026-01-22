/**
 * Centraliza TODAS as fontes do app
 * Use sempre estes nomes — nunca strings soltas
 */

export const FONT_FAMILY = {
  // JetBrains Mono
  jetbrains: {
    regular: 'JetBrainsMono-Regular',
    medium: 'JetBrainsMono-Medium',
    italic: 'JetBrainsMono-Italic',
    bold: 'JetBrainsMono-Bold',
  },
} as const;

/**
 * Atalhos para uso rápido
 * (melhora legibilidade no código)
 */
export const FONTS = {
  regular: FONT_FAMILY.jetbrains.regular,
  medium: FONT_FAMILY.jetbrains.medium,
  italic: FONT_FAMILY.jetbrains.italic,
  bold: FONT_FAMILY.jetbrains.bold,
} as const;

/**
 * Pesos padronizados
 * Útil para mapear design system
 */
export const FONT_WEIGHT = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;
