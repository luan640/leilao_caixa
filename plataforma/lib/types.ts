export interface Imovel {
  id_imovel: string
  estado?: string | null
  cidade?: string | null
  titulo?: string | null
  tipo_imovel?: string | null
  modalidade?: string | null
  tipo_venda?: string | null
  valor_venda?: string | null
  valor_avaliacao?: string | null
  valor_minimo_venda?: string | null
  desconto_pct?: string | null
  prazo_leilao?: string | null
  tempo_restante?: string | null
  area_m2?: string | null
  quartos?: string | null
  vagas_garagem?: string | null
  numero_imovel?: string | null
  numero_item?: string | null
  edital?: string | null
  endereco?: string | null
  endereco_completo?: string | null
  bairro?: string | null
  cep?: string | null
  lat?: number | null
  lon?: number | null
  despesas?: string | null
  observacoes?: string | null
  matricula?: string | null
  comarca?: string | null
  oficio?: string | null
  inscricao_imobiliaria?: string | null
  area_privativa_m2?: string | null
  area_terreno_m2?: string | null
  area_total_m2?: string | null
  leiloeiro?: string | null
  data_leilao?: string | null
  formas_pagamento?: string | null
  link_edital?: string | null
  tem_corretores?: string | null
  link_corretores?: string | null
  link_detalhe?: string | null
  foto?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export type ViewMode = 'cards' | 'map'

export interface Filters {
  search: string
  estado: string
  cidade: string
  tipoImovel: string[]
  modalidade: string[]
  temCorretores: boolean
  valorMin: string
  valorMax: string
  quartos: string
}

export const MODALIDADES = [
  'Licitação Aberta',
  'Compra Direta',
  'Leilão Único',
  'Venda Online',
] as const

export const TIPOS_IMOVEL = ['Casa', 'Apartamento', 'Terreno', 'Outros'] as const
