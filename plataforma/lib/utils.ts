/**
 * Format a Brazilian-format currency string with "R$ " prefix.
 * Input examples: "174.293,16" or "1.200.000,00"
 */
export function formatBRL(value?: string | null): string {
  if (!value) return '-'
  return 'R$ ' + value
}

/**
 * Parse a Brazilian-format number string to a JS number for comparison.
 * "174.293,16" -> 174293.16
 */
export function parseBRL(value?: string | null): number {
  if (!value) return 0
  const cleaned = value.replace(/\./g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

export function getModalidadeColor(modalidade?: string | null): {
  bg: string
  text: string
  border: string
} {
  switch (modalidade) {
    case 'Licitacao Aberta':
    case 'LicitaÃ§Ã£o Aberta':
      return {
        bg: 'rgba(249, 115, 22, 0.16)',
        text: '#FDBA74',
        border: 'rgba(249, 115, 22, 0.2)',
      }
    case 'Compra Direta':
      return {
        bg: 'rgba(59, 130, 246, 0.16)',
        text: '#93C5FD',
        border: 'rgba(59, 130, 246, 0.2)',
      }
    case 'Leilao Unico':
    case 'LeilÃ£o Ãšnico':
      return {
        bg: 'rgba(239, 68, 68, 0.16)',
        text: '#FCA5A5',
        border: 'rgba(239, 68, 68, 0.2)',
      }
    case 'Venda Online':
      return {
        bg: 'rgba(168, 85, 247, 0.16)',
        text: '#D8B4FE',
        border: 'rgba(168, 85, 247, 0.2)',
      }
    default:
      return {
        bg: 'rgba(100, 116, 139, 0.16)',
        text: '#CBD5E1',
        border: 'rgba(100, 116, 139, 0.2)',
      }
  }
}

export function getModalidadeHex(modalidade?: string | null): string {
  switch (modalidade) {
    case 'Licitacao Aberta':
    case 'LicitaÃ§Ã£o Aberta':
      return '#F97316'
    case 'Compra Direta':
      return '#3B82F6'
    case 'Leilao Unico':
    case 'LeilÃ£o Ãšnico':
      return '#EF4444'
    case 'Venda Online':
      return '#A855F7'
    default:
      return '#64748B'
  }
}
