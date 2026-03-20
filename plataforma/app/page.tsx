'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import {
  AlertCircle,
  Bell,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Loader2,
  Map,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { supabase, isConfigured } from '@/lib/supabase'
import { Filters, Imovel } from '@/lib/types'
import PropertyCard from '@/components/PropertyCard'

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), { ssr: false })

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

const PAGE_SIZE = 10
const MODALIDADES = ['Compra Direta', 'Licitacao Aberta', 'Leilao Unico', 'Venda Online']
const TIPOS = ['Casa', 'Apartamento', 'Terreno', 'Outros']

type ViewMode = 'grid' | 'map'

export default function DashboardPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [view, setView] = useState<ViewMode>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Dropdown options (lightweight, fetched once)
  const [estados, setEstados] = useState<string[]>([])
  const [cidades, setCidades] = useState<string[]>([])

  // Fetch unique estados on mount
  useEffect(() => {
    if (!isConfigured) return
    supabase
      .from('imoveis')
      .select('estado')
      .not('estado', 'is', null)
      .limit(1000)
      .then(({ data }) => {
        if (data) {
          const unique = [...new Set(data.map((r) => r.estado as string))].sort()
          setEstados(unique)
        }
      })
  }, [])

  // Fetch cidades when estado changes
  useEffect(() => {
    if (!isConfigured || !filters.estado) {
      setCidades([])
      return
    }
    supabase
      .from('imoveis')
      .select('cidade')
      .eq('estado', filters.estado)
      .not('cidade', 'is', null)
      .limit(1000)
      .then(({ data }) => {
        if (data) {
          const unique = [...new Set(data.map((r) => r.cidade as string))].sort()
          setCidades(unique)
        }
      })
  }, [filters.estado])

  // Core fetch — applies all filters server-side, paginates via range()
  const fetchPage = useCallback(
    async (pageNum: number, f: Filters) => {
      setLoading(true)
      setError(null)

      if (!isConfigured) {
        setError(
          'Supabase nao configurado. Crie o arquivo .env.local com NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.'
        )
        setLoading(false)
        return
      }

      try {
        const from = pageNum * PAGE_SIZE
        // Fetch PAGE_SIZE + 1 to know if there's a next page (avoids count query)
        const to = from + PAGE_SIZE

        let q = supabase
          .from('imoveis')
          .select('id_imovel,titulo,cidade,estado,bairro,endereco,endereco_completo,modalidade,valor_venda,valor_avaliacao,valor_minimo_venda,desconto_pct,area_m2,area_privativa_m2,area_terreno_m2,quartos,vagas_garagem,foto,link_detalhe,link_edital,tem_corretores,tipo_imovel,lat,lon,leiloeiro,data_leilao,formas_pagamento,despesas,prazo_leilao,observacoes,matricula,comarca')
          .order('created_at', { ascending: false })
          .range(from, to)

        // Text search
        if (f.search.trim()) {
          const term = `%${f.search.trim()}%`
          q = q.or(
            `titulo.ilike.${term},cidade.ilike.${term},bairro.ilike.${term},endereco.ilike.${term}`
          )
        }

        // Location
        if (f.estado) q = q.eq('estado', f.estado)
        if (f.cidade) q = q.eq('cidade', f.cidade)

        // Modalidade
        if (f.modalidade.length > 0) q = q.in('modalidade', f.modalidade)

        // Corretor
        if (f.temCorretores) q = q.eq('tem_corretores', 'Sim')

        // Quartos
        if (f.quartos) {
          if (f.quartos === '3+') {
            q = q.gte('quartos', '3')
          } else {
            q = q.eq('quartos', f.quartos)
          }
        }

        // Tipo de imovel
        if (f.tipoImovel.length > 0) {
          const semOutros = f.tipoImovel.filter((t) => t !== 'Outros')
          if (semOutros.length > 0) {
            const orStr = semOutros.map((t) => `tipo_imovel.ilike.%${t}%`).join(',')
            q = q.or(orStr)
          }
        }

        const { data, error: supabaseError } = await q

        if (supabaseError) throw supabaseError
        const rows = (data as Imovel[]) || []
        setHasMore(rows.length > PAGE_SIZE)
        setImoveis(rows.slice(0, PAGE_SIZE))
        setInitialLoad(false)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido ao buscar dados.'
        setError(message)
        setInitialLoad(false)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Re-fetch when page or filters change
  useEffect(() => {
    fetchPage(page, filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters])


  const updateFilters = (next: Filters) => {
    setPage(0) // reset to first page when filters change
    setFilters(next)
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
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: '#F4F6F9' }}>
      {/* ── Top Navbar ── */}
      <header style={{ backgroundColor: '#0F172A', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: '#8DC63F' }}
            >
              <Building2 className="h-4.5 w-4.5 text-white" strokeWidth={2.5} style={{ color: '#1a2e05' }} />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-white">LeilãoBR</span>
            <span
              className="rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase"
              style={{ backgroundColor: 'rgba(141,198,63,0.15)', color: '#8DC63F', border: '1px solid rgba(141,198,63,0.25)' }}
            >
              Pro
            </span>
          </div>

          {/* Nav links */}
          <nav className="hidden items-center gap-7 md:flex">
            {['Explorar', 'Favoritos', 'Dashboard', 'Análise'].map((item, i) => (
              <button
                key={item}
                className="text-[13px] font-medium transition-colors hover:text-white"
                style={{ color: i === 0 ? '#FFFFFF' : 'rgba(255,255,255,0.38)' }}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/8"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              <Bell className="h-4 w-4" />
            </button>
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold"
              style={{ background: 'linear-gradient(135deg,#8DC63F,#5a8a1f)', color: '#1a2e05' }}
            >
              U
            </div>
          </div>
        </div>
      </header>

      {/* ── Filter Bar ── */}
      <div
        className="sticky top-0 z-10 border-b"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
      >
        <div className="flex items-center gap-2 overflow-x-auto px-6 py-2.5">
          {/* View toggle */}
          <div
            className="flex flex-shrink-0 items-center gap-0.5 rounded-xl p-1"
            style={{ backgroundColor: '#F3F4F6' }}
          >
            {(
              [
                { id: 'grid', icon: <LayoutGrid className="h-3.5 w-3.5" />, label: 'Grade' },
                { id: 'map', icon: <Map className="h-3.5 w-3.5" />, label: 'Mapa' },
              ] as const
            ).map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-all"
                style={
                  view === id
                    ? {
                        backgroundColor: '#FFFFFF',
                        color: '#111827',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                      }
                    : { color: '#6B7280' }
                }
              >
                {icon}
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className="h-5 w-px flex-shrink-0" style={{ backgroundColor: '#E5E7EB' }} />

          {/* Estado */}
          <FilterDropdown
            label={filters.estado || 'Qualquer Estado'}
            active={!!filters.estado}
            onClear={() => updateFilters({ ...filters, estado: '', cidade: '' })}
          >
            <select
              value={filters.estado}
              onChange={(e) =>
                updateFilters({ ...filters, estado: e.target.value, cidade: '' })
              }
              className="absolute inset-0 cursor-pointer opacity-0"
            >
              <option value="">Todos</option>
              {estados.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </FilterDropdown>

          {/* Cidade */}
          <FilterDropdown
            label={filters.cidade || 'Qualquer Cidade'}
            active={!!filters.cidade}
            onClear={() => updateFilters({ ...filters, cidade: '' })}
          >
            <select
              value={filters.cidade}
              onChange={(e) => updateFilters({ ...filters, cidade: e.target.value })}
              className="absolute inset-0 cursor-pointer opacity-0"
            >
              <option value="">Todas</option>
              {cidades.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </FilterDropdown>

          {/* Tipo */}
          <FilterDropdown
            label={
              filters.tipoImovel.length > 0 ? filters.tipoImovel.join(', ') : 'Tipo de Imóvel'
            }
            active={filters.tipoImovel.length > 0}
            onClear={() => updateFilters({ ...filters, tipoImovel: [] })}
          >
            <select
              value={filters.tipoImovel[0] ?? ''}
              onChange={(e) =>
                updateFilters({
                  ...filters,
                  tipoImovel: e.target.value ? [e.target.value] : [],
                })
              }
              className="absolute inset-0 cursor-pointer opacity-0"
            >
              <option value="">Todos</option>
              {TIPOS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </FilterDropdown>

          {/* Search */}
          <div
            className="flex min-w-[180px] flex-1 items-center gap-2 rounded-xl px-3 py-2"
            style={{ border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}
          >
            <Search className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Buscar imóveis..."
              value={filters.search}
              onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
              className="w-full border-none bg-transparent text-[13px] outline-none"
              style={{ color: '#111827' }}
            />
            {filters.search && (
              <button onClick={() => updateFilters({ ...filters, search: '' })}>
                <X className="h-3.5 w-3.5" style={{ color: '#9CA3AF' }} />
              </button>
            )}
          </div>

          {/* Search button */}
          <button
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#8DC63F' }}
            aria-label="Buscar"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Filtros avançados */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex flex-shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-medium transition-colors"
            style={{
              border: `1px solid ${showFilters ? '#8DC63F' : '#E5E7EB'}`,
              color: showFilters ? '#5a8a1f' : '#6B7280',
              backgroundColor: showFilters ? '#f5fbe8' : '#FFFFFF',
            }}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtros
            {hasActiveFilters && (
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
                style={{ backgroundColor: '#8DC63F' }}
              >
                !
              </span>
            )}
          </button>
        </div>

        {/* Advanced filter panel */}
        {showFilters && (
          <div
            className="border-t px-6 py-4"
            style={{ borderColor: '#F3F4F6', backgroundColor: '#FAFAFA' }}
          >
            <div className="flex flex-wrap items-end gap-4">
              {/* Modalidade */}
              <div>
                <label
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide"
                  style={{ color: '#9CA3AF' }}
                >
                  Modalidade
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {MODALIDADES.map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        const active = filters.modalidade.includes(m)
                        updateFilters({
                          ...filters,
                          modalidade: active
                            ? filters.modalidade.filter((x) => x !== m)
                            : [...filters.modalidade, m],
                        })
                      }}
                      className="rounded-full px-3 py-1 text-[12px] font-medium transition-all"
                      style={
                        filters.modalidade.includes(m)
                          ? { backgroundColor: '#8DC63F', color: '#1a2e05' }
                          : {
                              backgroundColor: '#F3F4F6',
                              color: '#374151',
                              border: '1px solid #E5E7EB',
                            }
                      }
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quartos */}
              <div>
                <label
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide"
                  style={{ color: '#9CA3AF' }}
                >
                  Quartos
                </label>
                <div className="flex gap-1.5">
                  {['1', '2', '3+'].map((q) => (
                    <button
                      key={q}
                      onClick={() =>
                        updateFilters({ ...filters, quartos: filters.quartos === q ? '' : q })
                      }
                      className="rounded-full px-3 py-1 text-[12px] font-medium transition-all"
                      style={
                        filters.quartos === q
                          ? { backgroundColor: '#8DC63F', color: '#1a2e05' }
                          : {
                              backgroundColor: '#F3F4F6',
                              color: '#374151',
                              border: '1px solid #E5E7EB',
                            }
                      }
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Corretor */}
              <button
                onClick={() =>
                  updateFilters({ ...filters, temCorretores: !filters.temCorretores })
                }
                className="rounded-full px-3 py-1.5 text-[12px] font-medium transition-all"
                style={
                  filters.temCorretores
                    ? { backgroundColor: '#8DC63F', color: '#1a2e05' }
                    : {
                        backgroundColor: '#F3F4F6',
                        color: '#374151',
                        border: '1px solid #E5E7EB',
                      }
                }
              >
                Com Corretor
              </button>

              {/* Clear */}
              {hasActiveFilters && (
                <button
                  onClick={() => updateFilters(DEFAULT_FILTERS)}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors hover:bg-red-50"
                  style={{ color: '#EF4444', border: '1px solid #FECACA' }}
                >
                  <X className="h-3.5 w-3.5" />
                  Limpar filtros
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <main className="flex-1 px-6 py-6">
        {/* Section header */}
        {!loading && !error && (
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h1 className="text-[20px] font-bold tracking-tight" style={{ color: '#0F172A', letterSpacing: '-0.03em' }}>
                Imóveis em Leilão
              </h1>
              <p className="mt-1 text-[12px]" style={{ color: '#94A3B8' }}>
                {imoveis.length} imóveis · página {page + 1}
                {hasActiveFilters && <span style={{ color: '#8DC63F', fontWeight: 600 }}> · filtros ativos</span>}
              </p>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              {['Todos', 'Compra Direta', 'Licitação', 'Venda Online'].map((tab, i) => (
                <button
                  key={tab}
                  onClick={() =>
                    updateFilters({
                      ...filters,
                      modalidade:
                        i === 0
                          ? []
                          : [tab === 'Licitação' ? 'Licitacao Aberta' : tab],
                    })
                  }
                  className="rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all"
                  style={
                    (i === 0 && filters.modalidade.length === 0) ||
                    (i > 0 &&
                      filters.modalidade.includes(
                        tab === 'Licitação' ? 'Licitacao Aberta' : tab
                      ))
                      ? { backgroundColor: '#1A1A1A', color: '#FFFFFF' }
                      : {
                          backgroundColor: '#FFFFFF',
                          color: '#6B7280',
                          border: '1px solid #E5E7EB',
                        }
                  }
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* States */}
        {loading && initialLoad ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} onRetry={() => fetchPage(page, filters)} />
        ) : imoveis.length === 0 && !hasActiveFilters ? (
          <EmptyState />
        ) : imoveis.length === 0 ? (
          <NoResultsState onClear={() => updateFilters(DEFAULT_FILTERS)} />
        ) : view === 'map' ? (
          <div style={{ height: 'calc(100vh - 200px)', borderRadius: '16px', overflow: 'hidden' }}>
            <PropertyMap imoveis={imoveis} />
          </div>
        ) : (
          <>
            <style>{`
              @keyframes cardPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.45; }
              }
            `}</style>

            <div
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
              style={loading ? {
                animation: 'cardPulse 1.2s ease-in-out infinite',
                pointerEvents: 'none',
              } : undefined}
            >
              {imoveis.map((imovel) => (
                <PropertyCard key={imovel.id_imovel} imovel={imovel} />
              ))}
            </div>

            {/* Pagination */}
            {(page > 0 || hasMore) && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0 || loading}
                  className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-medium transition-all disabled:opacity-30 hover:bg-gray-50"
                  style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', color: '#374151' }}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </button>

                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[13px] font-bold"
                  style={{ backgroundColor: '#8DC63F', color: '#1a2e05' }}
                >
                  {page + 1}
                </span>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasMore || loading}
                  className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-medium transition-all disabled:opacity-30 hover:bg-gray-50"
                  style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', color: '#374151' }}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

// ── Sub-components ──

function FilterDropdown({
  label,
  active,
  onClear,
  children,
}: {
  label: string
  active: boolean
  onClear: () => void
  children: React.ReactNode
}) {
  return (
    <div className="relative flex-shrink-0">
      <div
        className="flex max-w-[160px] cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-medium transition-colors"
        style={{
          border: `1px solid ${active ? '#8DC63F' : '#E5E7EB'}`,
          color: active ? '#5a8a1f' : '#374151',
          backgroundColor: active ? '#f5fbe8' : '#FFFFFF',
        }}
      >
        <span className="truncate">{label}</span>
        {active ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
            className="ml-1 flex-shrink-0"
          >
            <X className="h-3 w-3" />
          </button>
        ) : (
          <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#9CA3AF' }} />
        )}
      </div>
      {children}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin" style={{ color: '#8DC63F' }} />
        <div className="text-center">
          <p className="text-base font-semibold" style={{ color: '#111827' }}>
            Carregando imóveis...
          </p>
          <p className="mt-1 text-sm" style={{ color: '#6B7280' }}>
            Buscando dados do Supabase
          </p>
        </div>
      </div>
    </div>
  )
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <div
        className="w-full max-w-md rounded-[28px] p-8 text-center"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(239,68,68,0.15)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
        }}
      >
        <AlertCircle className="mx-auto mb-4 h-12 w-12" style={{ color: '#EF4444' }} />
        <h2 className="mb-2 text-lg font-semibold" style={{ color: '#111827' }}>
          Erro ao carregar dados
        </h2>
        <p className="mb-2 text-sm" style={{ color: '#6B7280' }}>
          {error}
        </p>
        <p className="mb-6 text-xs" style={{ color: '#9CA3AF' }}>
          Verifique se as variaveis de ambiente do Supabase estao configuradas no .env.local.
        </p>
        <button
          onClick={onRetry}
          className="mx-auto flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#8DC63F' }}
        >
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </button>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <div className="w-full max-w-md text-center">
        <div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[24px]"
          style={{ backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB' }}
        >
          <AlertCircle className="h-10 w-10" style={{ color: '#9CA3AF' }} />
        </div>
        <h2 className="mb-2 text-xl font-semibold" style={{ color: '#111827' }}>
          Nenhum imóvel encontrado
        </h2>
        <p className="mb-6 text-sm" style={{ color: '#6B7280' }}>
          O banco de dados ainda nao possui registros. Execute a sincronizacao para carregar os dados.
        </p>
        <div
          className="rounded-2xl p-4 text-left text-xs font-mono"
          style={{ backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', color: '#6B7280' }}
        >
          <p style={{ color: '#9CA3AF' }}># Sincronizar dados do CSV</p>
          <p style={{ color: '#5a8a1f' }}>python sync_supabase.py</p>
        </div>
      </div>
    </div>
  )
}

function NoResultsState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <div className="text-center">
        <p className="mb-2 text-base font-semibold" style={{ color: '#111827' }}>
          Nenhum resultado para os filtros aplicados
        </p>
        <p className="mb-4 text-sm" style={{ color: '#6B7280' }}>
          Ajuste os filtros ou limpe o painel para voltar ao conjunto completo.
        </p>
        <button
          onClick={onClear}
          className="rounded-xl px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#8DC63F' }}
        >
          Limpar filtros
        </button>
      </div>
    </div>
  )
}
