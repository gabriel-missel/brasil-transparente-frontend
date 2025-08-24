import { OrigemPreposicao } from "../app/models/origem-fonte-dados.model";

export const environment = {
  //TODO adicionar API para rodar local
  apiBase: 'https://brasil-transparente-api-492194254445.us-central1.run.app',
  estados: [
    { nome: 'União Federal', imagem: 'images/estados/uniao.png', id: 1, ativo: true },
    { nome: 'Rio Grande do Sul', imagem: 'images/estados/rio_grande_do_sul.png', id: 2, ativo: true },
    { nome: 'Bahia', imagem: 'images/estados/bahia.png', id: 3, ativo: true },
    { nome: 'Amazonas', imagem: 'images/estados/amazonas.png', id: 4, ativo: true },
    { nome: 'São Paulo', imagem: 'images/estados/sao_paulo.png', id: 5, ativo: true },
    { nome: 'Paraíba', imagem: 'images/estados/paraiba.png', id: 6, ativo: true },
    
    // Alterar os IDs para os corretos quando os dados estiverem disponíveis
    { nome: 'Acre', imagem: 'images/estados/acre.png', id: 7, ativo: false },
    { nome: 'Alagoas', imagem: 'images/estados/alagoas.png', id: 8, ativo: false },
    { nome: 'Amapá', imagem: 'images/estados/amapa.png', id: 9, ativo: false },
    { nome: 'Ceará', imagem: 'images/estados/ceara.png', id: 10, ativo: false },
    { nome: 'Distrito Federal', imagem: 'images/estados/distrito_federal.png', id: 11, ativo: false },
    { nome: 'Espírito Santo', imagem: 'images/estados/espirito_santo.png', id: 12, ativo: false },
    { nome: 'Goiás', imagem: 'images/estados/goias.png', id: 13, ativo: false },
    { nome: 'Maranhão', imagem: 'images/estados/maranhao.png', id: 14, ativo: false },
    { nome: 'Mato Grosso', imagem: 'images/estados/mato_grosso.png', id: 15, ativo: false },
    { nome: 'Mato Grosso do Sul', imagem: 'images/estados/mato_grosso_do_sul.png', id: 16, ativo: false },
    { nome: 'Minas Gerais', imagem: 'images/estados/minas_gerais.png', id: 17, ativo: false },
    { nome: 'Pará', imagem: 'images/estados/para.png', id: 18, ativo: false },
    { nome: 'Paraná', imagem: 'images/estados/parana.png', id: 19, ativo: false },
    { nome: 'Pernambuco', imagem: 'images/estados/pernambuco.png', id: 20, ativo: false },
    { nome: 'Piauí', imagem: 'images/estados/piaui.png', id: 21, ativo: false },
    { nome: 'Rio de Janeiro', imagem: 'images/estados/rio_de_janeiro.png', id: 22, ativo: false },
    { nome: 'Rio Grande do Norte', imagem: 'images/estados/rio_grande_do_norte.png', id: 23, ativo: false },
    { nome: 'Rondônia', imagem: 'images/estados/rondonia.png', id: 24, ativo: false },
    { nome: 'Roraima', imagem: 'images/estados/roraima.png', id: 25, ativo: false },
    { nome: 'Santa Catarina', imagem: 'images/estados/santa_catarina.png', id: 26, ativo: false },
    { nome: 'Sergipe', imagem: 'images/estados/sergipe.png', id: 27, ativo: false },
    { nome: 'Tocantins', imagem: 'images/estados/tocantins.png', id: 28, ativo: false },
  ],
  fontesDadosOrigem: [
    {
      id: 'executivo',
      titulo: 'Poder Executivo',
      descricao: '',
      fontes: [
        { nome: 'Portal da Transparência', url: 'https://portaldatransparencia.gov.br/download-de-dados/despesas-execucao', preposicao: OrigemPreposicao.do }
      ]
    },
    {
      id: 'legislativo',
      titulo: 'Poder Legislativo',
      descricao: '',
      fontes: [
        { nome: 'Câmara dos Deputados', url: 'https://www2.camara.leg.br/transparencia/receitas-e-despesas/despesas/despesas-consolidadas', preposicao: OrigemPreposicao.da },
        { nome: 'Senado Federal', url: 'https://www12.senado.leg.br/transparencia/orcamento-e-financas/safin/execucao-orcamentaria-e-financeira', preposicao: OrigemPreposicao.do }
      ]
    },
    {
      id: 'judiciario',
      titulo: 'Poder Judiciário',
      descricao: 'Os dados dos órgãos abaixo são disponibilizados por meio do Conselho Nacional de Justiça (CNJ), que centraliza as informações de transparência do Poder Judiciário. Para acessar os dados detalhados dos órgãos abaixo, visite o',
      portalUrl: 'https://paineisanalytics.cnj.jus.br/single/?appid=cb1bf133-5a51-4464-9978-7bf3df3782f7&sheet=c069d72e-0640-4b17-a6de-8d6590b4a698&lang=pt-BR&opt=ctxmenu,currsel&select=clearall',
      portalNome: 'portal do CNJ',
      fontes: [
        { nome: 'Supremo Tribunal Federal', url: 'https://portal.stf.jus.br/textos/verTexto.asp?servico=centralDoCidadaoAcessoInformacaoGestaoOrcamentaria', preposicao: OrigemPreposicao.do }
      ],
      outrasEntidades: [
        { nome: 'Conselho Nacional de Justiça (CNJ)' },
        { nome: 'Superior Tribunal de Justiça (STJ)' },
        { nome: 'Justiça do Distrito Federal e Territórios' },
        { nome: 'Justiça do Trabalho' },
        { nome: 'Justiça Eleitoral' },
        { nome: 'Justiça Federal' },
        { nome: 'Justiça Militar' }
      ]
    },
    {
      id: 'autonomos',
      titulo: 'Órgãos Autônomos',
      descricao: '',
      fontes: [
        { nome: 'Tribunal de Contas da União (TCU)', url: 'https://contas.tcu.gov.br/ords/f?p=1136:1:108340862899860::NO:::', preposicao: OrigemPreposicao.do },
        { nome: 'Defensoria Pública da União (DPU)', url: 'https://www.dpu.def.br/transparencia/orcamento-e-financas', preposicao: OrigemPreposicao.da }
      ]
    },
    {
      id: 'ministerioPublico',
      titulo: 'Ministério Público da União',
      descricao: '',
      fontes: [
        { nome: 'Ministério Público Federal (MPF)', url: 'http://www.transparencia.mpf.mp.br/conteudo/execucao-orcamentaria-e-financeira/detalhamento-de-despesas', preposicao: OrigemPreposicao.do },
        { nome: 'Ministério Público do Trabalho (MPT)', url: 'https://mpt.mp.br/MPTransparencia/pages/portal/consulta.xhtml', preposicao: OrigemPreposicao.do },
        { nome: 'Ministério Público Militar (MPM)', url: 'https://transparencia.mpm.mp.br/execucao-orcamentaria-e-financeira/?ano=2024', preposicao: OrigemPreposicao.do },
        { nome: 'Ministério Público do Distrito Federal e Territórios (MPDFT)', url: 'https://www.mpdft.mp.br/transparencia/index.php?item=despesas&resp=DETALHAMENTO_DAS_DESPESAS', preposicao: OrigemPreposicao.do },
        { nome: 'Escola Superior do Ministério Público da União (ESMPU)', url: 'https://escola.mpu.mp.br/transparencia/portal-da-transparencia/execucao-orcamentaria-e-financeira/detalhamento-das-despesas', preposicao: OrigemPreposicao.da }
      ]
    },
    {
      id: 'estados',
      titulo: 'Estados',
      descricao: '',
      fontes: [
        { nome: 'Amazonas', url: 'https://www.transparenciafiscal.am.gov.br/transpprd/mnt/dadosAbertos.do', preposicao: OrigemPreposicao.do },
        { nome: 'Bahia', url: 'https://dados.gov.br/dados/conjuntos-dados/despesas2', preposicao: OrigemPreposicao.da },
        { nome: 'Rio Grande do Sul', url: 'https://www.transparencia.rs.gov.br/dados-abertos/dados-transparencia-rs/dados/', preposicao: OrigemPreposicao.do },
        { nome: 'São Paulo', url: 'https://www.fazenda.sp.gov.br/SigeoLei131/Paginas/FlexConsDespesa.aspx', preposicao: 'de' }
      ]
    }
  ]
};
