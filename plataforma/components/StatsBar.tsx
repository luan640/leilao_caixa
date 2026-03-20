'use client'

import { Building2, CalendarClock, DollarSign, TrendingDown } from 'lucide-react'
import { Imovel } from '@/lib/types'
import { parseBRL } from '@/lib/utils'

interface StatsBarProps {
  imoveis: Imovel[]
  filteredCount: number
}

export default function StatsBar({ imoveis, filteredCount }: StatsBarProps) {
  const comDesconto = imoveis.filter(
    (i) => i.desconto_pct && i.desconto_pct !== '0' && i.desconto_pct !== ''
  ).length

  const comLeiloeiro = imoveis.filter((i) => i.leiloeiro && i.leiloeiro.trim() !== '').length

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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={<Building2 className="h-5 w-5" />}
        label="Ativos retornados"
        value={filteredCount.toLocaleString('pt-BR')}
        subValue={filteredCount > 0 ? 'Conjunto em analise agora' : 'Sem registros ativos'}
        iconColor="#7DD3FC"
        iconBg="rgba(14, 165, 233, 0.12)"
      />
      <StatCard
        icon={<TrendingDown className="h-5 w-5" />}
        label="Com desconto"
        value={comDesconto.toLocaleString('pt-BR')}
        subValue={
          imoveis.length > 0 ? `${Math.round((comDesconto / imoveis.length) * 100)}% da base filtrada` : 'Sem amostra'
        }
        iconColor="#4ADE80"
        iconBg="rgba(34, 197, 94, 0.12)"
      />
      <StatCard
        icon={<CalendarClock className="h-5 w-5" />}
        label="Com leiloeiro"
        value={comLeiloeiro.toLocaleString('pt-BR')}
        subValue="Apoia a triagem comercial"
        iconColor="#FBBF24"
        iconBg="rgba(251, 191, 36, 0.12)"
      />
      <StatCard
        icon={<DollarSign className="h-5 w-5" />}
        label="Valor medio"
        value={formatCurrency(valorMedioMinimo)}
        subValue="Media do valor minimo de venda"
        iconColor="#C4B5FD"
        iconBg="rgba(168, 85, 247, 0.12)"
      />
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  subValue,
  iconColor,
  iconBg,
}: {
  icon: React.ReactNode
  label: string
  value: string
  subValue?: string
  iconColor: string
  iconBg: string
}) {
  return (
    <div
      className="rounded-[22px] p-5"
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
      }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-[14px]"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {icon}
      </div>
      <div className="mt-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: '#6F86AE' }}>
          {label}
        </p>
        <p className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.03em] text-white">{value}</p>
        {subValue && (
          <p className="mt-2 text-[13px] leading-5" style={{ color: '#96AACC' }}>
            {subValue}
          </p>
        )}
      </div>
    </div>
  )
}
