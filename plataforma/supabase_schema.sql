create table if not exists public.imoveis (
  id_imovel text primary key,
  estado text,
  cidade text,
  titulo text,
  tipo_imovel text,
  modalidade text,
  tipo_venda text,
  valor_venda text,
  valor_avaliacao text,
  valor_minimo_venda text,
  desconto_pct text,
  prazo_leilao text,
  tempo_restante text,
  area_m2 text,
  quartos text,
  vagas_garagem text,
  numero_imovel text,
  numero_item text,
  edital text,
  endereco text,
  endereco_completo text,
  bairro text,
  cep text,
  lat double precision,
  lon double precision,
  despesas text,
  observacoes text,
  matricula text,
  comarca text,
  oficio text,
  inscricao_imobiliaria text,
  area_privativa_m2 text,
  area_terreno_m2 text,
  area_total_m2 text,
  leiloeiro text,
  data_leilao text,
  data_1_leilao text,
  data_2_leilao text,
  formas_pagamento text,
  link_edital text,
  tem_corretores text,
  link_corretores text,
  link_detalhe text,
  foto text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.imoveis add column if not exists data_1_leilao text;
alter table public.imoveis add column if not exists data_2_leilao text;
CREATE INDEX imoveis_created_at_idx ON imoveis (created_at DESC);

alter table public.imoveis enable row level security;
create policy "Public read" on public.imoveis for select using (true);
create policy "Service insert/update" on public.imoveis for all using (true);
