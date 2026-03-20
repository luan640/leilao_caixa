'use client'

import { useEffect } from 'react'
import ReactDOM from 'react-dom'
import {
  ArrowUpRight,
  BedDouble,
  Building2,
  Calendar,
  Car,
  FileText,
  Gavel,
  Home,
  MapPin,
  Ruler,
  ScrollText,
  Tag,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import { Imovel } from '@/lib/types'
import { formatBRL } from '@/lib/utils'

const MODALIDADE_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  'Compra Direta':    { bg: '#F0F7E6', text: '#3a6b10', dot: '#8DC63F' },
  'Licitacao Aberta': { bg: '#FFF4EC', text: '#9a3412', dot: '#F97316' },
  'Licitação Aberta': { bg: '#FFF4EC', text: '#9a3412', dot: '#F97316' },
  'Leilao Unico':     { bg: '#FEF2F2', text: '#991b1b', dot: '#EF4444' },
  'Leilão Único':     { bg: '#FEF2F2', text: '#991b1b', dot: '#EF4444' },
  'Venda Online':     { bg: '#FAF5FF', text: '#6b21a8', dot: '#A855F7' },
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F8FAFC',
        border: '1px solid #E8EDF2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '0.05em', margin: '0 0 2px' }}>{label}</p>
        <p style={{ fontSize: '13px', color: '#0F172A', margin: 0, lineHeight: 1.4 }}>{value}</p>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <p style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase',
        letterSpacing: '0.08em', margin: '0 0 12px', paddingBottom: '8px', borderBottom: '1px solid #F1F5F9' }}>
        {title}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {children}
      </div>
    </div>
  )
}

interface PropertyDrawerProps {
  imovel: Imovel
  onClose: () => void
}

export default function PropertyDrawer({ imovel, onClose }: PropertyDrawerProps) {
  const mod = MODALIDADE_STYLE[imovel.modalidade ?? ''] ?? { bg: '#F1F5F9', text: '#475569', dot: '#94A3B8' }
  const displayPrice = imovel.valor_venda || imovel.valor_minimo_venda
  const location = [imovel.bairro, imovel.cidade, imovel.estado].filter(Boolean).join(' · ')

  // Fechar com ESC e bloquear scroll da página
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return ReactDOM.createPortal(
    <>
      <style>{`
        @keyframes drawerIn {
          from { transform: translateX(-100%); opacity: 0.6; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          backgroundColor: 'rgba(15,23,42,0.45)',
          backdropFilter: 'blur(2px)',
          animation: 'backdropIn 0.2s ease',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: '100%', maxWidth: '480px',
          zIndex: 9999,
          backgroundColor: '#FFFFFF',
          boxShadow: '4px 0 40px rgba(15,23,42,0.18)',
          display: 'flex', flexDirection: 'column',
          animation: 'drawerIn 0.28s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* ── Imagem + header ── */}
        <div style={{ position: 'relative', height: '220px', flexShrink: 0, backgroundColor: '#F1F5F9' }}>
          {imovel.foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imovel.foto} alt={imovel.titulo ?? 'Imóvel'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', background: 'linear-gradient(135deg,#E2E8F0,#CBD5E1)' }}>
              <Home style={{ width: '48px', height: '48px', color: '#94A3B8' }} />
            </div>
          )}

          {/* Overlay gradiente para legibilidade */}
          <div style={{ position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(15,23,42,0.7) 0%, transparent 50%)' }} />

          {/* Fechar */}
          <button onClick={onClose} aria-label="Fechar"
            style={{ position: 'absolute', top: '12px', right: '12px',
              width: '32px', height: '32px', borderRadius: '50%', border: 'none', cursor: 'pointer',
              backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
          >
            <X style={{ width: '16px', height: '16px', color: '#fff' }} />
          </button>

          {/* Desconto */}
          {imovel.desconto_pct && imovel.desconto_pct !== '0' && (
            <div style={{ position: 'absolute', top: '12px', left: '12px',
              backgroundColor: '#EF4444', color: '#fff', fontSize: '12px', fontWeight: 700,
              padding: '3px 10px', borderRadius: '6px' }}>
              -{imovel.desconto_pct}%
            </div>
          )}

          {/* Título e modalidade sobre a imagem */}
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
            {imovel.modalidade && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px',
                backgroundColor: mod.bg, color: mod.text,
                fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px',
                marginBottom: '6px', letterSpacing: '0.02em' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%',
                  backgroundColor: mod.dot, flexShrink: 0 }} />
                {imovel.modalidade}
              </div>
            )}
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#fff',
              lineHeight: 1.3, letterSpacing: '-0.02em',
              textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
              {imovel.titulo || 'Imóvel sem título'}
            </h2>
          </div>
        </div>

        {/* ── Preço ── */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', margin: 0,
              letterSpacing: '-0.03em', lineHeight: 1 }}>
              {displayPrice ? formatBRL(displayPrice) : <span style={{ color: '#94A3B8', fontWeight: 400, fontSize: '16px' }}>Sob consulta</span>}
            </p>
            {imovel.valor_avaliacao && (
              <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0' }}>
                Avaliação: {formatBRL(imovel.valor_avaliacao)}
              </p>
            )}
          </div>

          {/* Specs inline */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {imovel.area_m2 && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{imovel.area_m2}</p>
                <p style={{ fontSize: '10px', color: '#94A3B8', margin: '1px 0 0' }}>m²</p>
              </div>
            )}
            {imovel.quartos && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{imovel.quartos}</p>
                <p style={{ fontSize: '10px', color: '#94A3B8', margin: '1px 0 0' }}>quartos</p>
              </div>
            )}
            {imovel.vagas_garagem && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{imovel.vagas_garagem}</p>
                <p style={{ fontSize: '10px', color: '#94A3B8', margin: '1px 0 0' }}>vagas</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Conteúdo scrollável ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

          <Section title="Localização">
            <Row icon={<MapPin style={{ width:'14px', height:'14px', color:'#64748B' }} />}
              label="Endereço" value={imovel.endereco_completo || imovel.endereco} />
            <Row icon={<Building2 style={{ width:'14px', height:'14px', color:'#64748B' }} />}
              label="Bairro / Cidade / Estado" value={location || null} />
          </Section>

          <Section title="Imóvel">
            <Row icon={<Home style={{ width:'14px', height:'14px', color:'#64748B' }} />}
              label="Tipo" value={imovel.tipo_imovel} />
            <Row icon={<Ruler style={{ width:'14px', height:'14px', color:'#64748B' }} />}
              label="Área total" value={imovel.area_total_m2 ? `${imovel.area_total_m2} m²` : null} />
            <Row icon={<Ruler style={{ width:'14px', height:'14px', color:'#64748B' }} />}
              label="Área privativa" value={imovel.area_privativa_m2 ? `${imovel.area_privativa_m2} m²` : null} />
            <Row icon={<Ruler style={{ width:'14px', height:'14px', color:'#64748B' }} />}
              label="Área terreno" value={imovel.area_terreno_m2 ? `${imovel.area_terreno_m2} m²` : null} />
            <Row icon={<BedDouble style={{ width:'14px', height:'14px', color:'#64748B' }} />}
              label="Quartos" value={imovel.quartos} />
            <Row icon={<Car style={{ width:'14px', height:'14px', color:'#64748B' }} />}
              label="Vagas de garagem" value={imovel.vagas_garagem} />
          </Section>

          <Section title="Leilão">
            <Row icon={<Gavel style={{ width:'14px', height:'14px', color:'#64748B' }} />}
              label="Leiloeiro" value={imovel.leiloeiro} />
            <Row icon={<Calendar style={{ width:'14px', height:'14px', color:'#64748B' }} />}
              label="Data do leilão" value={imovel.data_leilao} />
            <Row icon={<Tag style={{ width:'14px', height:'14px', color:'#64748B' }} />}
              label="Prazo" value={imovel.prazo_leilao} />
            <Row icon={<Wallet style={{ width:'14px', height:'14px', color:'#64748B' }} />}
              label="Formas de pagamento" value={imovel.formas_pagamento} />
            <Row icon={<Wallet style={{ width:'14px', height:'14px', color:'#64748B' }} />}
              label="Despesas" value={imovel.despesas} />
            <Row icon={<Users style={{ width:'14px', height:'14px', color:'#64748B' }} />}
              label="Tem corretores" value={imovel.tem_corretores} />
          </Section>

          <Section title="Dados Legais">
            <Row icon={<ScrollText style={{ width:'14px', height:'14px', color:'#64748B' }} />}
              label="Matrícula" value={imovel.matricula} />
            <Row icon={<ScrollText style={{ width:'14px', height:'14px', color:'#64748B' }} />}
              label="Comarca" value={imovel.comarca} />
            <Row icon={<ScrollText style={{ width:'14px', height:'14px', color:'#64748B' }} />}
              label="Ofício" value={imovel.oficio} />
            <Row icon={<ScrollText style={{ width:'14px', height:'14px', color:'#64748B' }} />}
              label="Inscrição imobiliária" value={imovel.inscricao_imobiliaria} />
          </Section>

          {imovel.observacoes && (
            <Section title="Observações">
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {imovel.observacoes}
              </p>
            </Section>
          )}
        </div>

        {/* ── Rodapé com links ── */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid #F1F5F9',
          display: 'flex', gap: '10px', flexShrink: 0 }}>
          {imovel.link_edital && (
            <a href={imovel.link_edital} target="_blank" rel="noopener noreferrer"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '6px', height: '40px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                color: '#475569', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
                textDecoration: 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
            >
              <FileText style={{ width: '14px', height: '14px' }} /> Edital
            </a>
          )}
          {imovel.link_corretores && (
            <a href={imovel.link_corretores} target="_blank" rel="noopener noreferrer"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '6px', height: '40px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                color: '#475569', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
                textDecoration: 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
            >
              <Users style={{ width: '14px', height: '14px' }} /> Corretores
            </a>
          )}
          {imovel.link_detalhe && (
            <a href={imovel.link_detalhe} target="_blank" rel="noopener noreferrer"
              style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '6px', height: '40px', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
                color: '#1a2e05', backgroundColor: '#8DC63F',
                textDecoration: 'none', transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Ver imóvel <ArrowUpRight style={{ width: '14px', height: '14px' }} />
            </a>
          )}
        </div>
      </div>
    </>,
    document.body
  )
}
