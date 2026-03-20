'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Imovel } from '@/lib/types'
import { formatBRL, getModalidadeHex } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'

// Fix Leaflet default icon paths broken by bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface PropertyMapProps {
  imoveis: Imovel[]
}

function createColoredIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 14px;
      height: 14px;
      background-color: ${color};
      border: 2px solid rgba(255,255,255,0.8);
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  })
}

function MapBoundsController({ imoveis }: { imoveis: Imovel[] }) {
  const map = useMap()
  const fitted = useRef(false)

  useEffect(() => {
    if (fitted.current) return
    const validPoints = imoveis.filter(
      (i) => i.lat != null && i.lon != null && !isNaN(i.lat!) && !isNaN(i.lon!)
    )
    if (validPoints.length === 0) return
    if (validPoints.length === 1) {
      map.setView([validPoints[0].lat!, validPoints[0].lon!], 12)
    } else {
      const bounds = L.latLngBounds(validPoints.map((i) => [i.lat!, i.lon!]))
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 })
    }
    fitted.current = true
  }, [imoveis, map])

  return null
}

export default function PropertyMap({ imoveis }: PropertyMapProps) {
  const validImoveis = imoveis.filter(
    (i) => i.lat != null && i.lon != null && !isNaN(Number(i.lat)) && !isNaN(Number(i.lon))
  )

  const invalidCount = imoveis.length - validImoveis.length

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[-15.7801, -47.9292]}
        zoom={5}
        style={{ height: '100%', width: '100%', background: '#0F172A' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validImoveis.length > 0 && <MapBoundsController imoveis={validImoveis} />}

        {validImoveis.map((imovel) => {
          const color = getModalidadeHex(imovel.modalidade)
          const icon = createColoredIcon(color)
          const displayPrice = imovel.valor_venda || imovel.valor_minimo_venda

          return (
            <Marker
              key={imovel.id_imovel}
              position={[imovel.lat!, imovel.lon!]}
              icon={icon}
            >
              <Popup minWidth={240} maxWidth={300}>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: '#F1F5F9',
                    padding: '4px',
                  }}
                >
                  {/* Image thumbnail */}
                  {imovel.foto && (
                    <div
                      style={{
                        width: '100%',
                        height: '120px',
                        marginBottom: '10px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imovel.foto}
                        alt={imovel.titulo || 'Imóvel'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          ;(e.currentTarget.parentElement as HTMLElement).style.display = 'none'
                        }}
                      />
                    </div>
                  )}

                  {/* Modalidade */}
                  {imovel.modalidade && (
                    <div style={{ marginBottom: '6px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: color + '30',
                          color: color,
                          border: `1px solid ${color}50`,
                        }}
                      >
                        {imovel.modalidade}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#F1F5F9',
                      marginBottom: '4px',
                      lineHeight: 1.3,
                    }}
                  >
                    {imovel.titulo || 'Imóvel sem título'}
                  </p>

                  {/* Price */}
                  <p
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#F1F5F9',
                      marginBottom: '4px',
                    }}
                  >
                    {formatBRL(displayPrice)}
                  </p>

                  {/* Discount */}
                  {imovel.desconto_pct && imovel.desconto_pct !== '0' && (
                    <p style={{ fontSize: '12px', color: '#22c55e', marginBottom: '4px' }}>
                      Desconto: -{imovel.desconto_pct}%
                    </p>
                  )}

                  {/* Address */}
                  {imovel.endereco && (
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#94A3B8',
                        marginBottom: '8px',
                        lineHeight: 1.4,
                      }}
                    >
                      {imovel.endereco}
                      {imovel.cidade && `, ${imovel.cidade}`}
                      {imovel.estado && ` - ${imovel.estado}`}
                    </p>
                  )}

                  {/* Link */}
                  {imovel.link_detalhe && (
                    <a
                      href={imovel.link_detalhe}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#60a5fa',
                        textDecoration: 'none',
                      }}
                    >
                      Ver detalhes
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Info overlay */}
      <div
        className="absolute bottom-4 left-4 z-[1000] rounded-lg px-3 py-2 text-xs space-y-1"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid #334155',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div style={{ color: '#F1F5F9' }}>
          <span style={{ color: '#F97316', fontWeight: 700 }}>
            {validImoveis.length.toLocaleString('pt-BR')}
          </span>{' '}
          imóveis no mapa
        </div>
        {invalidCount > 0 && (
          <div style={{ color: '#64748b' }}>
            {invalidCount.toLocaleString('pt-BR')} sem coordenadas
          </div>
        )}
      </div>

      {/* Legend */}
      <div
        className="absolute top-4 right-4 z-[1000] rounded-lg px-3 py-2 text-xs space-y-1.5"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid #334155',
          backdropFilter: 'blur(4px)',
        }}
      >
        <p className="font-semibold mb-1" style={{ color: '#94A3B8' }}>
          Modalidade
        </p>
        {[
          { label: 'Licitação Aberta', color: '#f97316' },
          { label: 'Compra Direta', color: '#3b82f6' },
          { label: 'Leilão Único', color: '#ef4444' },
          { label: 'Venda Online', color: '#a855f7' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: color,
                flexShrink: 0,
              }}
            />
            <span style={{ color: '#94A3B8' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
