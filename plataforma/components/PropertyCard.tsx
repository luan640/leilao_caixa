'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { BedDouble, Car, ExternalLink, Heart, Home, Info, MapPin, Ruler } from 'lucide-react'
import { Imovel } from '@/lib/types'
import { formatBRL } from '@/lib/utils'

const PropertyDrawer = dynamic(() => import('./PropertyDrawer'), { ssr: false })

interface PropertyCardProps {
  imovel: Imovel
}

const MODALIDADE_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  'Compra Direta':    { bg: '#F0F7E6', text: '#3a6b10', dot: '#8DC63F' },
  'Licitacao Aberta': { bg: '#FFF4EC', text: '#9a3412', dot: '#F97316' },
  'Licitação Aberta': { bg: '#FFF4EC', text: '#9a3412', dot: '#F97316' },
  'Leilao Unico':     { bg: '#FEF2F2', text: '#991b1b', dot: '#EF4444' },
  'Leilão Único':     { bg: '#FEF2F2', text: '#991b1b', dot: '#EF4444' },
  'Venda Online':     { bg: '#FAF5FF', text: '#6b21a8', dot: '#A855F7' },
}

export default function PropertyCard({ imovel }: PropertyCardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [liked, setLiked] = useState(false)

  const displayPrice = imovel.valor_venda || imovel.valor_minimo_venda
  const mod = MODALIDADE_STYLE[imovel.modalidade ?? ''] ?? { bg: '#F1F5F9', text: '#475569', dot: '#94A3B8' }
  const location = [imovel.bairro, imovel.cidade, imovel.estado].filter(Boolean).join(' · ')

  return (
    <>
      <article
        className="group"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          overflow: 'hidden',
          border: '1px solid #E8EDF2',
          boxShadow: '0 1px 4px rgba(15,23,42,0.06)',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(15,23,42,0.12)'
          ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(15,23,42,0.06)'
          ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
        }}
      >
        {/* ── Imagem ── */}
        <div style={{ position: 'relative', height: '160px', flexShrink: 0, backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
          {imovel.foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imovel.foto}
              alt={imovel.titulo ?? 'Imóvel'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s ease' }}
              className="group-hover:scale-105"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', background: 'linear-gradient(135deg,#E2E8F0,#CBD5E1)' }}>
              <Home style={{ width: '36px', height: '36px', color: '#94A3B8' }} />
            </div>
          )}

          <button
            onClick={() => setLiked(l => !l)}
            aria-label="Favoritar"
            style={{
              position: 'absolute', top: '10px', right: '10px',
              width: '32px', height: '32px', borderRadius: '50%', border: 'none', cursor: 'pointer',
              backgroundColor: liked ? '#FEF2F2' : 'rgba(255,255,255,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
          >
            <Heart style={{ width: '14px', height: '14px', color: liked ? '#EF4444' : '#94A3B8',
              fill: liked ? '#EF4444' : 'none', transition: 'all 0.15s' }} />
          </button>

          {imovel.desconto_pct && imovel.desconto_pct !== '0' && (
            <div style={{ position: 'absolute', top: '10px', left: '10px',
              backgroundColor: '#EF4444', color: '#fff', fontSize: '11px', fontWeight: 700,
              padding: '3px 8px', borderRadius: '6px', lineHeight: 1 }}>
              -{imovel.desconto_pct}%
            </div>
          )}

          {imovel.modalidade && (
            <div style={{ position: 'absolute', bottom: '10px', left: '10px',
              backgroundColor: mod.bg, color: mod.text, fontSize: '10px', fontWeight: 700,
              padding: '3px 8px', borderRadius: '20px',
              display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%',
                backgroundColor: mod.dot, flexShrink: 0 }} />
              {imovel.modalidade}
            </div>
          )}
        </div>

        {/* ── Conteúdo ── */}
        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', lineHeight: 1.35, margin: 0,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            title={imovel.titulo ?? undefined}>
            {imovel.titulo || 'Imóvel sem título'}
          </h3>

          {location && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', marginTop: '6px' }}>
              <MapPin style={{ width: '11px', height: '11px', color: '#94A3B8', flexShrink: 0, marginTop: '1px' }} />
              <p style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.35, margin: 0 }}>{location}</p>
            </div>
          )}

          <div style={{ marginTop: '10px' }}>
            <p style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              {displayPrice
                ? formatBRL(displayPrice)
                : <span style={{ color: '#94A3B8', fontWeight: 400, fontSize: '13px' }}>Sob consulta</span>}
            </p>
            {imovel.valor_avaliacao && (
              <p style={{ fontSize: '11px', color: '#94A3B8', margin: '2px 0 0' }}>
                Avaliação: {formatBRL(imovel.valor_avaliacao)}
              </p>
            )}
          </div>

          {(imovel.area_m2 || imovel.quartos || imovel.vagas_garagem) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 12px',
              marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
              {imovel.area_m2 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#64748B' }}>
                  <Ruler style={{ width: '11px', height: '11px' }} />{imovel.area_m2}m²
                </span>
              )}
              {imovel.quartos && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#64748B' }}>
                  <BedDouble style={{ width: '11px', height: '11px' }} />{imovel.quartos} quartos
                </span>
              )}
              {imovel.vagas_garagem && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#64748B' }}>
                  <Car style={{ width: '11px', height: '11px' }} />{imovel.vagas_garagem} vaga{Number(imovel.vagas_garagem) !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}

          {/* Botões */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button
              onClick={() => setDrawerOpen(true)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                height: '34px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s ease',
                border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#475569',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#F0F7E6'
                e.currentTarget.style.borderColor = '#8DC63F'
                e.currentTarget.style.color = '#3a6b10'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#F8FAFC'
                e.currentTarget.style.borderColor = '#E2E8F0'
                e.currentTarget.style.color = '#475569'
              }}
            >
              <Info style={{ width: '13px', height: '13px' }} />
              Detalhes
            </button>

            {imovel.link_detalhe && (
              <a
                href={imovel.link_detalhe}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  height: '34px', paddingInline: '14px', borderRadius: '8px',
                  fontSize: '12px', fontWeight: 700, flexShrink: 0,
                  backgroundColor: '#8DC63F', color: '#1a2e05',
                  textDecoration: 'none', transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Ver <ExternalLink style={{ width: '12px', height: '12px' }} />
              </a>
            )}
          </div>
        </div>
      </article>

      {drawerOpen && (
        <PropertyDrawer imovel={imovel} onClose={() => setDrawerOpen(false)} />
      )}
    </>
  )
}
