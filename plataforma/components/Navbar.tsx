'use client'

import { Building2, LayoutGrid, Map, TrendingDown } from 'lucide-react'
import { Imovel, ViewMode } from '@/lib/types'
import { parseBRL } from '@/lib/utils'

interface NavbarProps {
  imoveis: Imovel[]
  view: ViewMode
  onViewChange: (view: ViewMode) => void
  filteredCount: number
}

export default function Navbar({ imoveis, view, onViewChange, filteredCount }: NavbarProps) {
  const totalImoveis = imoveis.length

  const comDesconto = imoveis.filter(
    (i) => i.desconto_pct && i.desconto_pct !== '0' && i.desconto_pct !== ''
  ).length

  const valoresMinimos = imoveis
    .map((i) => parseBRL(i.valor_minimo_venda || i.valor_venda))
    .filter((v) => v > 0)

  const valorMedioMinimo =
    valoresMinimos.length > 0
      ? valoresMinimos.reduce((a, b) => a + b, 0) / valoresMinimos.length
      : 0

  const formatCurrency = (value: number): string => {
    if (value === 0) return 'R$ 0'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <header
      className="flex flex-col gap-5 px-5 py-5 md:px-7 md:py-6 xl:flex-row xl:items-center xl:justify-between"
      style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.08)' }}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em]"
            style={{
              color: '#AFC4E7',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(148, 163, 184, 0.1)',
            }}
          >
            Dashboard
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: '#7F93B5' }}>
            Workspace de triagem
          </span>
        </div>
        <h1 className="mt-3 text-[26px] font-semibold tracking-[-0.03em] text-white md:text-[30px]">
          Central de ativos
        </h1>
        <p className="mt-2 text-[14px] leading-6" style={{ color: '#97ABCC' }}>
          Monitoramento da base, filtros operacionais e comparacao entre cards e mapa.
        </p>
      </div>

      <div className="flex flex-col gap-3 xl:items-end">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <KpiPill
            icon={<Building2 className="h-4 w-4" />}
            label="Ativos"
            value={`${filteredCount.toLocaleString('pt-BR')} / ${totalImoveis.toLocaleString('pt-BR')}`}
          />
          <KpiPill
            icon={<TrendingDown className="h-4 w-4" />}
            label="Desconto"
            value={`${comDesconto.toLocaleString('pt-BR')} ativos`}
          />
          <KpiPill
            icon={<Building2 className="h-4 w-4" />}
            label="Ticket medio"
            value={formatCurrency(valorMedioMinimo)}
          />
        </div>

        <div
          className="flex items-center gap-1 rounded-[16px] p-1"
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
          }}
        >
          <button
            onClick={() => onViewChange('cards')}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium transition-all"
            style={{
              backgroundColor: view === 'cards' ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: view === 'cards' ? '#FFFFFF' : '#93A8C7',
            }}
          >
            <LayoutGrid className="h-4 w-4" />
            Cards
          </button>
          <button
            onClick={() => onViewChange('map')}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium transition-all"
            style={{
              backgroundColor: view === 'map' ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: view === 'map' ? '#FFFFFF' : '#93A8C7',
            }}
          >
            <Map className="h-4 w-4" />
            Mapa
          </button>
        </div>
      </div>
    </header>
  )
}

function KpiPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div
      className="flex min-w-[190px] items-center gap-3 rounded-[18px] px-3.5 py-3"
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
      }}
    >
      <span style={{ color: '#8FB4FF' }}>{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: '#6F86AE' }}>
          {label}
        </p>
        <p className="truncate text-[14px] font-medium leading-5 text-white">{value}</p>
      </div>
    </div>
  )
}
