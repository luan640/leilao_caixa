'use client'

import { useCallback, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Filters, Imovel, MODALIDADES, TIPOS_IMOVEL } from '@/lib/types'

interface FilterPanelProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  imoveis: Imovel[]
  filteredCount: number
}

const DEFAULT_FILTERS: Filters = {
  search: '',
  estado: '',
  cidade: '',
  tipoImovel: [],
  modalidade: [],
  temCorretores: false,
  valorMin: '',
  valorMax: '',
  quartos: '',
}

export default function FilterPanel({
  filters,
  onFiltersChange,
  imoveis,
  filteredCount,
}: FilterPanelProps) {
  const [collapsed, setCollapsed] = useState(false)

  const estados = Array.from(new Set(imoveis.map((i) => i.estado).filter(Boolean))).sort() as string[]

  const cidades = Array.from(
    new Set(
      imoveis
        .filter((i) => !filters.estado || i.estado === filters.estado)
        .map((i) => i.cidade)
        .filter(Boolean)
    )
  ).sort() as string[]

  const update = useCallback(
    (partial: Partial<Filters>) => {
      onFiltersChange({ ...filters, ...partial })
    },
    [filters, onFiltersChange]
  )

  const toggleArrayFilter = (key: 'tipoImovel' | 'modalidade', value: string) => {
    const current = filters[key]
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    update({ [key]: next })
  }

  const clearFilters = () => {
    onFiltersChange(DEFAULT_FILTERS)
  }

  const hasActiveFilters =
    filters.search ||
    filters.estado ||
    filters.cidade ||
    filters.tipoImovel.length > 0 ||
    filters.modalidade.length > 0 ||
    filters.temCorretores ||
    filters.valorMin ||
    filters.valorMax ||
    filters.quartos

  return (
    <aside
      className="hidden h-full lg:flex flex-col overflow-hidden rounded-[24px]"
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        width: collapsed ? '80px' : '296px',
        minWidth: collapsed ? '80px' : '296px',
        transition: 'width 0.2s ease, min-width 0.2s ease',
      }}
    >
      <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.08)' }}>
        {!collapsed && (
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" style={{ color: '#8FB4FF' }} />
              <span className="text-[14px] font-medium leading-5 text-white">Filtros operacionais</span>
            </div>
            <p className="mt-1 text-[12px] leading-5" style={{ color: '#6F86AE' }}>
              {filteredCount.toLocaleString('pt-BR')} ativos no recorte atual
            </p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-xl p-2 transition-colors"
          style={{ color: '#93A8C7', backgroundColor: 'rgba(15, 23, 42, 0.72)' }}
          title={collapsed ? 'Expandir filtros' : 'Recolher filtros'}
        >
          {collapsed ? <SlidersHorizontal className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          <div
            className="rounded-[20px] p-4"
            style={{
              background:
                'linear-gradient(180deg, rgba(19, 34, 58, 0.92) 0%, rgba(12, 22, 39, 0.92) 100%)',
              border: '1px solid rgba(148, 163, 184, 0.1)',
            }}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: '#8FB4FF' }}>
              Vista ativa
            </p>
            <p className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.03em] text-white">
              {filteredCount.toLocaleString('pt-BR')}
            </p>
            <p className="mt-2 text-[13px] leading-5" style={{ color: '#A7BCE0' }}>
              Combine filtros para reduzir ruido e destacar oportunidades.
            </p>
          </div>

          <FilterSection title="Busca rapida">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: '#6F86AE' }}
              />
              <input
                type="text"
                placeholder="Titulo, endereco ou cidade"
                value={filters.search}
                onChange={(e) => update({ search: e.target.value })}
                className="w-full rounded-[16px] py-3 pl-10 pr-3 text-[14px] outline-none transition-colors"
                style={{
                  backgroundColor: '#0D1728',
                  border: '1px solid rgba(148, 163, 184, 0.12)',
                  color: '#F8FAFC',
                }}
              />
            </div>
          </FilterSection>

          <FilterSection title="Localizacao">
            <div className="space-y-2">
              <select
                value={filters.estado}
                onChange={(e) => update({ estado: e.target.value, cidade: '' })}
                className="w-full rounded-[16px] px-3 py-3 text-[14px] outline-none"
                style={{
                  backgroundColor: '#0D1728',
                  border: '1px solid rgba(148, 163, 184, 0.12)',
                  color: filters.estado ? '#F8FAFC' : '#93A8C7',
                }}
              >
                <option value="">Todos os estados</option>
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
              <select
                value={filters.cidade}
                onChange={(e) => update({ cidade: e.target.value })}
                className="w-full rounded-[16px] px-3 py-3 text-[14px] outline-none"
                style={{
                  backgroundColor: '#0D1728',
                  border: '1px solid rgba(148, 163, 184, 0.12)',
                  color: filters.cidade ? '#F8FAFC' : '#93A8C7',
                }}
                disabled={!filters.estado}
              >
                <option value="">Todas as cidades</option>
                {cidades.map((cidade) => (
                  <option key={cidade} value={cidade}>
                    {cidade}
                  </option>
                ))}
              </select>
            </div>
          </FilterSection>

          <FilterSection title="Tipo de ativo">
            <div className="flex flex-wrap gap-2">
              {TIPOS_IMOVEL.map((tipo) => (
                <Chip
                  key={tipo}
                  active={filters.tipoImovel.includes(tipo)}
                  onClick={() => toggleArrayFilter('tipoImovel', tipo)}
                  label={tipo}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Canal">
            <div className="flex flex-wrap gap-2">
              {MODALIDADES.map((mod) => (
                <Chip
                  key={mod}
                  active={filters.modalidade.includes(mod)}
                  onClick={() => toggleArrayFilter('modalidade', mod)}
                  label={mod}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Equipe comercial">
            <label className="flex cursor-pointer items-center justify-between rounded-[16px] px-3 py-3" style={{ backgroundColor: '#0D1728', border: '1px solid rgba(148, 163, 184, 0.12)' }}>
              <span className="text-[14px] leading-5" style={{ color: '#D4DEEE' }}>
                Apenas com corretores
              </span>
              <div
                onClick={() => update({ temCorretores: !filters.temCorretores })}
                className="relative h-6 w-11 rounded-full transition-colors"
                style={{ backgroundColor: filters.temCorretores ? '#2563EB' : '#243449' }}
              >
                <div
                  className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform"
                  style={{
                    left: '2px',
                    transform: filters.temCorretores ? 'translateX(20px)' : 'translateX(0)',
                  }}
                />
              </div>
            </label>
          </FilterSection>

          <FilterSection title="Faixa de valor">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Valor minimo"
                value={filters.valorMin}
                onChange={(e) => update({ valorMin: e.target.value })}
                className="w-full rounded-[16px] px-3 py-3 text-[14px] outline-none"
                style={{
                  backgroundColor: '#0D1728',
                  border: '1px solid rgba(148, 163, 184, 0.12)',
                  color: '#F8FAFC',
                }}
              />
              <input
                type="text"
                placeholder="Valor maximo"
                value={filters.valorMax}
                onChange={(e) => update({ valorMax: e.target.value })}
                className="w-full rounded-[16px] px-3 py-3 text-[14px] outline-none"
                style={{
                  backgroundColor: '#0D1728',
                  border: '1px solid rgba(148, 163, 184, 0.12)',
                  color: '#F8FAFC',
                }}
              />
            </div>
          </FilterSection>

          <FilterSection title="Quartos">
            <div className="flex flex-wrap gap-2">
              {['Qualquer', '1', '2', '3+'].map((q) => (
                <Chip
                  key={q}
                  active={(q === 'Qualquer' && !filters.quartos) || filters.quartos === q}
                  onClick={() => update({ quartos: q === 'Qualquer' ? '' : q })}
                  label={q}
                />
              ))}
            </div>
          </FilterSection>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex w-full items-center justify-center gap-2 rounded-[16px] py-3 text-[14px] font-medium transition-colors"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.22)',
                color: '#FCA5A5',
              }}
            >
              <X className="h-4 w-4" />
              Limpar filtros
            </button>
          )}
        </div>
      )}
    </aside>
  )
}

function FilterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: '#6F86AE' }}>
        {title}
      </p>
      {children}
    </div>
  )
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-3 py-2 text-[13px] font-medium transition-colors"
      style={{
        backgroundColor: active ? 'rgba(37, 99, 235, 0.18)' : '#0D1728',
        color: active ? '#DCEBFF' : '#93A8C7',
        border: `1px solid ${active ? 'rgba(96, 165, 250, 0.18)' : 'rgba(148, 163, 184, 0.12)'}`,
      }}
    >
      {label}
    </button>
  )
}
