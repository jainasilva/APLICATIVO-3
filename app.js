const STORAGE_KEY = "gestao_residuos_bracell_v1";
const THEME_STORAGE_KEY = "gestao_residuos_bracell_theme_v1";
const STORAGE_FALLBACK = new Map();
window.__APP_PRIMARY_READY = false;

const tiposResiduos = [
  "Cinzas (CAL) industriais",
  "Lodo biológico",
  "Óleos lubrificantes",
  "Resíduos químicos",
  "Resíduos recicláveis",
  "Biomassa",
  "Solo contaminado",
  "Absorventes e EPIs contaminados"
];

const registrosIniciais = [
  {
    id: "R-001",
    data: "2026-05-10",
    tipo: "Cinzas (CAL) industriais",
    classe: "Classe IIA",
    origem: "Caldeira de recuperação",
    quantidade: 1280,
    destino: "Reaproveitamento energético",
    status: "Destinado"
  },
  {
    id: "R-002",
    data: "2026-05-11",
    tipo: "Lodo biológico",
    classe: "Classe IIA",
    origem: "ETE industrial",
    quantidade: 860,
    destino: "Coprocessamento",
    status: "Em transporte"
  },
  {
    id: "R-003",
    data: "2026-05-12",
    tipo: "Óleos lubrificantes",
    classe: "Classe I",
    origem: "Manutenção de equipamentos móveis",
    quantidade: 180,
    destino: "Tratamento externo especializado",
    status: "Aguardando coleta"
  },
  {
    id: "R-004",
    data: "2026-05-13",
    tipo: "Resíduos químicos",
    classe: "Classe I",
    origem: "Área de preparo químico",
    quantidade: 95,
    destino: "Aterro industrial licenciado",
    status: "Não conformidade"
  },
  {
    id: "R-005",
    data: "2026-05-14",
    tipo: "Resíduos recicláveis",
    classe: "Classe IIB",
    origem: "Almoxarifado e escritório",
    quantidade: 420,
    destino: "Reciclagem",
    status: "Destinado"
  }
];

const kpisBase = [
  { label: "Resíduos para aterro (2025)", value: "33,1 kg/adt", meta: "Meta 2030: -90%" },
  { label: "Recuperação química", value: "95,8%", meta: "Meta reportada: 97%" },
  { label: "Consumo de água (2025)", value: "19,9 m³/adt", meta: "Meta 2030: 16,6 m³/adt" },
  { label: "Energia renovável", value: "90%", meta: "Biomassa + licor negro + solar" },
  { label: "CO₂ removido em 2025", value: "3,4 mi tCO₂e", meta: "Meta 2030: 25 mi tCO₂e" },
  { label: "Área nativa conservada", value: "301 mil ha", meta: "Compromisso Um-Para-Um" }
];

const fluxoTratamento = [
  {
    etapa: "Segregação na origem",
    detalhe: "Separar por classe e compatibilidade para evitar mistura e reduzir risco operacional."
  },
  {
    etapa: "Acondicionamento seguro",
    detalhe: "Identificar recipientes, manter rotulagem e usar embalagem compatível com o resíduo."
  },
  {
    etapa: "Armazenamento temporário",
    detalhe: "Manter em área impermeabilizada, com controle de acesso e proteção contra intempéries."
  },
  {
    etapa: "Tratamento e destinação",
    detalhe: "Priorizar reciclagem, coprocessamento e reaproveitamento energético antes do aterro licenciado."
  },
  {
    etapa: "Rastreabilidade",
    detalhe: "Controlar MTR, CDF, transportadora e indicadores de reaproveitamento e redução de aterro."
  }
];

const planosAcao = [
  {
    titulo: "PRAD - Erosão Hídrica",
    subtitulo: "Slide 18 e 19",
    itens: [
      "Fase 1 (16/05 a 23/05): contenção emergencial com isolamento e desvio de água.",
      "Fase 2 (24/05 a 07/06): levantamento topográfico, ensaios de solo e projeto executivo.",
      "Fase 3 (08/06 a 20/07): curvas de nível, canaletas, dissipadores e check dams.",
      "Fase 4/5 (21/07 a 12/11): revegetação, biomanta e inspeções quinzenais.",
      "KPIs: cobertura vegetal >= 85% em 180 dias e redução >= 80% de sedimentos."
    ]
  },
  {
    titulo: "Resposta a Vazamento de Óleo",
    subtitulo: "Slide 20 e 21",
    itens: [
      "D0-D1: interromper fonte, isolar área e conter com barreiras/absorventes.",
      "D1-D7: reparar equipamento e validar estanqueidade antes da liberação.",
      "D7-D30: treinar equipes, checklist pré-operação e inspeções diárias.",
      "Implantar kit de mitigação obrigatório e bacia de contenção secundária.",
      "Meta: 0 recorrência e 100% dos equipamentos críticos com contenção disponível."
    ]
  }
];

const relatorioRecuperacao = {
  area: "Talude de drenagem - Setor Florestal Leste",
  municipio: "Lençóis Paulista - SP",
  referencia: "18/05/2026",
  diagnostico: [
    "Processo erosivo em ravina com risco de evolução para voçoroca.",
    "Concentração de escoamento superficial por ausência de drenagem definitiva.",
    "Solo exposto com baixa cobertura vegetal e perda de horizonte superficial.",
    "Risco de carreamento de sedimentos para área de APP a jusante."
  ],
  metas: [
    "Estabilizar fisicamente 100% da feição erosiva em até 90 dias.",
    "Alcançar cobertura vegetal >= 85% em até 180 dias.",
    "Reduzir >= 80% do carreamento de sedimentos em eventos de chuva.",
    "Manter 100% de funcionalidade do sistema de drenagem implantado."
  ],
  cronograma: [
    {
      fase: "Fase 1 - Contenção emergencial",
      periodo: "16/05/2026 a 23/05/2026",
      escopo: "Isolamento de área, desvio temporário de água e barreiras de sedimento.",
      entregavel: "Área estabilizada provisoriamente e risco imediato reduzido."
    },
    {
      fase: "Fase 2 - Projeto executivo",
      periodo: "24/05/2026 a 07/06/2026",
      escopo: "Levantamento topográfico, sondagem/ensaio e dimensionamento hidráulico.",
      entregavel: "Projeto técnico validado e plano de obra aprovado."
    },
    {
      fase: "Fase 3 - Obras de recuperação",
      periodo: "08/06/2026 a 20/07/2026",
      escopo: "Canaletas, dissipadores, terraceamento e proteção superficial do solo.",
      entregavel: "Drenagem definitiva implantada e erosão controlada."
    },
    {
      fase: "Fase 4 - Revegetação e monitoramento",
      periodo: "21/07/2026 a 12/11/2026",
      escopo: "Hidrossemeadura/gramínea, biomanta e inspeções quinzenais.",
      entregavel: "Cobertura vegetal consolidada e relatório de eficácia."
    }
  ],
  acoes: [
    {
      acao: "Implantar drenagem superficial definitiva no trecho crítico.",
      responsavel: "Engenharia Ambiental + Civil",
      prazo: "20/07/2026",
      prioridade: "Alta",
      status: "Em andamento"
    },
    {
      acao: "Executar recomposição de solo e proteção anti-erosiva com biomanta.",
      responsavel: "Operação Florestal",
      prazo: "05/08/2026",
      prioridade: "Alta",
      status: "Planejada"
    },
    {
      acao: "Revegetar área degradada com espécies adaptadas e manutenção inicial.",
      responsavel: "Equipe de Restauração",
      prazo: "30/08/2026",
      prioridade: "Média",
      status: "Planejada"
    },
    {
      acao: "Realizar monitoramento e auditoria técnica mensal por 6 meses.",
      responsavel: "SGA / Meio Ambiente",
      prazo: "12/11/2026",
      prioridade: "Média",
      status: "Planejada"
    }
  ],
  monitoramento: [
    "Inspeções quinzenais com checklist de estabilidade geotécnica.",
    "Levantamento fotográfico em pontos fixos para rastreabilidade.",
    "Medição de cobertura vegetal e taxa de sobrevivência das mudas.",
    "Controle de sedimentos em pontos de saída de drenagem.",
    "Relatório técnico mensal com ações corretivas e preventivas."
  ]
};

const statusClasses = {
  "Destinado": "ok",
  "Aguardando coleta": "warn",
  "Em transporte": "info",
  "Não conformidade": "alert"
};

const PALETA_DESTINO = ["#00b894", "#00cec9", "#0984e3", "#6c5ce7", "#fdcb6e", "#e17055"];
const PALETA_STATUS = ["#2ecc71", "#3498db", "#f1c40f", "#e74c3c", "#8e44ad"];
const PALETA_CLASSE = ["#1abc9c", "#2980b9", "#9b59b6", "#f39c12", "#c0392b"];

const form = document.getElementById("residue-form");
const formTitle = document.getElementById("form-title");
const inputId = document.getElementById("registro-id");
const inputData = document.getElementById("data");
const inputTipo = document.getElementById("tipo");
const inputClasse = document.getElementById("classe");
const inputOrigem = document.getElementById("origem");
const inputQuantidade = document.getElementById("quantidade");
const inputDestino = document.getElementById("destino");
const inputStatus = document.getElementById("status");
const cancelBtn = document.getElementById("cancel-btn");
const searchInput = document.getElementById("search");
const filtroStatus = document.getElementById("filtro-status");
const tableBody = document.getElementById("residue-table-body");
const slideSearchInput = document.getElementById("slide-search");
const themeLightBtn = document.getElementById("theme-light");
const themeDarkBtn = document.getElementById("theme-dark");

const kpiGrid = document.getElementById("kpi-grid");
const statusBars = document.getElementById("status-bars");
const destinoList = document.getElementById("destino-list");
const resumoOperacional = document.getElementById("resumo-operacional");
const chartDestino = document.getElementById("chart-destino");
const chartDestinoLegend = document.getElementById("chart-destino-legend");
const chartStatus = document.getElementById("chart-status");
const chartStatusLegend = document.getElementById("chart-status-legend");
const chartClasseBar = document.getElementById("chart-classe-bar");
const chartClasseLegend = document.getElementById("chart-classe-legend");
const tendenciaMensal = document.getElementById("tendencia-mensal");
const comparativoMensal = document.getElementById("comparativo-mensal");
const classeBars = document.getElementById("classe-bars");
const eficienciaList = document.getElementById("eficiencia-list");
const origemList = document.getElementById("origem-list");
const relatorioIndicadores = document.getElementById("relatorio-indicadores");
const relatorioDiagnostico = document.getElementById("relatorio-diagnostico");
const relatorioMetas = document.getElementById("relatorio-metas");
const relatorioCronograma = document.getElementById("relatorio-cronograma");
const relatorioAcoes = document.getElementById("relatorio-acoes");
const relatorioMonitoramento = document.getElementById("relatorio-monitoramento");
const fluxoList = document.getElementById("fluxo-list");
const planosList = document.getElementById("planos-list");
const slidesGrid = document.getElementById("slides-grid");
const footer = document.querySelector("footer");

let registros = loadRegistros();
let termoSlide = "";

if (registros.length === 0) {
  registros = registrosIniciais;
  saveRegistros();
}

const slides = (window.SLIDES_DATA || []).map((slide) => ({
  ...slide,
  title: normalizarTexto(slide.title || ""),
  texts: (slide.texts || []).map((t) => normalizarTexto(t)).filter(Boolean)
}));

iniciar();

function iniciar() {
  if (!form || !tableBody || !inputTipo) {
    return;
  }

  executarComSeguranca(aplicarTemaSalvo);
  executarComSeguranca(preencherTiposResiduos);
  executarComSeguranca(preencherDataHoje);

  form.addEventListener("submit", salvarRegistro);
  if (cancelBtn) {
    cancelBtn.addEventListener("click", cancelarEdicao);
  }
  if (searchInput) {
    searchInput.addEventListener("input", () => executarComSeguranca(renderTabela));
  }
  if (filtroStatus) {
    filtroStatus.addEventListener("change", () => executarComSeguranca(renderTabela));
  }
  if (themeLightBtn) {
    themeLightBtn.addEventListener("click", () => definirTema("light"));
  }
  if (themeDarkBtn) {
    themeDarkBtn.addEventListener("click", () => definirTema("dark"));
  }

  if (slideSearchInput) {
    slideSearchInput.addEventListener("input", (event) => {
      termoSlide = event.target.value.trim().toLowerCase();
      executarComSeguranca(renderSlides);
    });
  }

  tableBody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const id = target.dataset.id;
    const action = target.dataset.action;

    if (!id || !action) {
      return;
    }

    if (action === "edit") {
      editarRegistro(id);
    }

    if (action === "delete") {
      excluirRegistro(id);
    }
  });

  renderizarTudo();
  mostrarAviso("Aplicativo carregado.");
  window.__APP_PRIMARY_READY = true;
}

function renderizarTudo() {
  executarComSeguranca(renderFluxo);
  executarComSeguranca(renderPlanosAcao);
  executarComSeguranca(renderRelatorioRecuperacao);
  executarComSeguranca(renderTabela);
  executarComSeguranca(renderDashboard);
  executarComSeguranca(renderSlides);
}

function executarComSeguranca(fn) {
  try {
    fn();
  } catch (erro) {
    if (window.console && console.error) {
      console.error("Falha na execução:", fn.name, erro);
    }
    mostrarAviso(`Falha ao executar ${fn.name}. Recarregue a página.`);
  }
}

function preencherTiposResiduos() {
  inputTipo.innerHTML = "";
  tiposResiduos.forEach((tipo) => {
    const option = document.createElement("option");
    option.value = tipo;
    option.textContent = tipo;
    inputTipo.append(option);
  });
}

function preencherDataHoje() {
  const hoje = new Date();
  const iso = hoje.toISOString().slice(0, 10);
  inputData.value = iso;
}

function aplicarTemaSalvo() {
  const salvo = storageGet(THEME_STORAGE_KEY);
  const prefereEscuro = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const tema = salvo === "dark" || salvo === "light" ? salvo : (prefereEscuro ? "dark" : "light");
  definirTema(tema);
}

function definirTema(tema) {
  document.body.dataset.theme = tema;
  storageSet(THEME_STORAGE_KEY, tema);

  if (themeLightBtn) {
    themeLightBtn.classList.toggle("is-active", tema === "light");
    themeLightBtn.setAttribute("aria-pressed", tema === "light" ? "true" : "false");
  }
  if (themeDarkBtn) {
    themeDarkBtn.classList.toggle("is-active", tema === "dark");
    themeDarkBtn.setAttribute("aria-pressed", tema === "dark" ? "true" : "false");
  }
}

function salvarRegistro(event) {
  event.preventDefault();
  const quantidade = parseQuantidade(inputQuantidade.value);

  const registro = {
    id: inputId.value || `R-${Date.now()}`,
    data: inputData.value,
    tipo: inputTipo.value,
    classe: inputClasse.value,
    origem: inputOrigem.value.trim(),
    quantidade,
    destino: inputDestino.value,
    status: inputStatus.value
  };

  if (!registro.data || !registro.origem || !Number.isFinite(registro.quantidade)) {
    return;
  }

  if (inputId.value) {
    registros = registros.map((item) => (item.id === registro.id ? registro : item));
  } else {
    registros.unshift(registro);
  }

  saveRegistros();
  resetForm();
  executarComSeguranca(renderTabela);
  executarComSeguranca(renderDashboard);
  mostrarAviso("Registro salvo com sucesso.");
}

function editarRegistro(id) {
  const registro = registros.find((item) => item.id === id);
  if (!registro) {
    return;
  }

  inputId.value = registro.id;
  inputData.value = registro.data;
  inputTipo.value = registro.tipo;
  inputClasse.value = registro.classe;
  inputOrigem.value = registro.origem;
  inputQuantidade.value = String(registro.quantidade);
  inputDestino.value = registro.destino;
  inputStatus.value = registro.status;

  formTitle.textContent = "Editar Registro";
  cancelBtn.hidden = false;
  window.scrollTo({ top: document.getElementById("residuos").offsetTop - 20, behavior: "smooth" });
}

function excluirRegistro(id) {
  const confirmado = window.confirm("Deseja remover este registro?");
  if (!confirmado) {
    return;
  }

  registros = registros.filter((item) => item.id !== id);
  saveRegistros();
  executarComSeguranca(renderTabela);
  executarComSeguranca(renderDashboard);

  if (inputId.value === id) {
    resetForm();
  }
}

function cancelarEdicao() {
  resetForm();
}

function resetForm() {
  form.reset();
  inputId.value = "";
  formTitle.textContent = "Novo Registro";
  cancelBtn.hidden = true;
  preencherDataHoje();
  inputTipo.value = tiposResiduos[0];
  inputClasse.value = "Classe I";
  inputDestino.value = "Reciclagem";
  inputStatus.value = "Aguardando coleta";
}

function renderTabela() {
  if (!tableBody || !searchInput || !filtroStatus) {
    return;
  }

  const termo = searchInput.value.trim().toLowerCase();
  const statusFiltro = filtroStatus.value;

  const filtrados = registros.filter((item) => {
    const textoComposto = `${item.tipo} ${item.origem} ${item.destino}`.toLowerCase();
    const passaTexto = termo === "" || textoComposto.includes(termo);
    const passaStatus = statusFiltro === "" || item.status === statusFiltro;
    return passaTexto && passaStatus;
  });

  if (filtrados.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="8"><div class="empty">Nenhum registro encontrado para o filtro atual.</div></td></tr>`;
    return;
  }

  tableBody.innerHTML = filtrados
    .map((item) => {
      const classeStatus = statusClasses[item.status] || "info";
      return `
        <tr>
          <td>${formatarData(item.data)}</td>
          <td>${escapeHtml(item.tipo)}</td>
          <td>${escapeHtml(item.classe)}</td>
          <td>${escapeHtml(item.origem)}</td>
          <td>${formatarNumero(item.quantidade)}</td>
          <td>${escapeHtml(item.destino)}</td>
          <td><span class="tag ${classeStatus}">${escapeHtml(item.status)}</span></td>
          <td>
            <button class="btn small" data-action="edit" data-id="${item.id}">Editar</button>
            <button class="btn small danger" data-action="delete" data-id="${item.id}">Excluir</button>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderDashboard() {
  if (!kpiGrid || !statusBars || !destinoList || !resumoOperacional) {
    return;
  }

  const totalKg = registros.reduce((acc, item) => acc + Number(item.quantidade || 0), 0);
  const destinados = registros.filter((item) => item.status === "Destinado").length;
  const taxaDestinacao = registros.length > 0 ? (destinados / registros.length) * 100 : 0;
  const destinosValorizacao = new Set(["Reciclagem", "Coprocessamento", "Reaproveitamento energético"]);
  const kgValorizado = registros.reduce((acc, item) => {
    return destinosValorizacao.has(item.destino) ? acc + Number(item.quantidade || 0) : acc;
  }, 0);
  const taxaValorizacao = totalKg > 0 ? (kgValorizado / totalKg) * 100 : 0;
  const kgAterro = registros
    .filter((item) => item.destino === "Aterro industrial licenciado")
    .reduce((acc, item) => acc + Number(item.quantidade || 0), 0);
  const taxaAterro = totalKg > 0 ? (kgAterro / totalKg) * 100 : 0;

  const kpis = [
    ...kpisBase,
    {
      label: "Total cadastrado no app",
      value: `${formatarNumero(totalKg)} kg`,
      meta: `${registros.length} registros ativos`
    },
    {
      label: "Taxa de registros destinados",
      value: `${formatarNumero(taxaDestinacao)}%`,
      meta: "Status Destinado / total"
    },
    {
      label: "Taxa de valorização",
      value: `${formatarNumero(taxaValorizacao)}%`,
      meta: "Reciclagem + coprocessamento + reaproveitamento"
    },
    {
      label: "Envio para aterro",
      value: `${formatarNumero(kgAterro)} kg`,
      meta: `${formatarNumero(taxaAterro)}% do total`
    }
  ];

  kpiGrid.innerHTML = kpis
    .map(
      (kpi) => `
      <article class="kpi">
        <div class="label">${escapeHtml(kpi.label)}</div>
        <div class="value">${escapeHtml(kpi.value)}</div>
        <div class="meta">${escapeHtml(kpi.meta)}</div>
      </article>
    `
    )
    .join("");

  const statusCount = contarPorCampo(registros, "status");
  const totalStatus = objectValues(statusCount).reduce((acc, n) => acc + n, 0);

  if (totalStatus === 0) {
    statusBars.innerHTML = `<div class="empty">Sem dados de status.</div>`;
  } else {
    const maxStatus = Math.max(...objectValues(statusCount), 1);
    statusBars.innerHTML = objectEntries(statusCount)
      .map(([status, valor]) => {
        const pct = (valor / maxStatus) * 100;
        return `
          <div class="bar-item">
            <span>${escapeHtml(status)} (${valor})</span>
            <div class="bar-track"><div class="bar-fill" style="width:${pct.toFixed(1)}%"></div></div>
          </div>
        `;
      })
      .join("");
  }

  const destinoCount = contarPorCampo(registros, "destino", "quantidade");
  const destinosOrdenados = objectEntries(destinoCount).sort((a, b) => b[1] - a[1]);

  destinoList.innerHTML =
    destinosOrdenados.length === 0
      ? `<div class="empty">Sem dados de destinação.</div>`
      : destinosOrdenados
          .map(([destino, quantidade]) => `<div class="list-item">${escapeHtml(destino)}: <strong>${formatarNumero(quantidade)} kg</strong></div>`)
          .join("");

  const classeI = registros.filter((item) => item.classe === "Classe I").length;
  const naoConformes = registros.filter((item) => item.status === "Não conformidade").length;
  const conformidade = registros.length > 0 ? ((registros.length - naoConformes) / registros.length) * 100 : 0;
  const mediaKg = totalKg / Math.max(registros.length, 1);

  resumoOperacional.innerHTML = `
    <li>Registros Classe I (perigosos): <strong>${classeI}</strong></li>
    <li>Não conformidades ativas: <strong>${naoConformes}</strong></li>
    <li>Índice de conformidade: <strong>${formatarNumero(conformidade)}%</strong></li>
    <li>Média por registro: <strong>${formatarNumero(mediaKg)} kg</strong></li>
    <li>Objetivo operacional: reduzir envio para aterro e ampliar reaproveitamento.</li>
  `;

  const dadosDestino = destinosOrdenados.filter(([, quantidade]) => Number(quantidade) > 0);
  const dadosStatus = objectEntries(statusCount).filter(([, quantidade]) => Number(quantidade) > 0);
  const dadosClasse = objectEntries(contarPorCampo(registros, "classe", "quantidade"))
    .filter(([, quantidade]) => Number(quantidade) > 0)
    .sort((a, b) => b[1] - a[1]);

  renderGraficoRosca(chartDestino, chartDestinoLegend, dadosDestino, PALETA_DESTINO, "kg");
  renderGraficoRosca(chartStatus, chartStatusLegend, dadosStatus, PALETA_STATUS, "reg");
  renderBarraEmpilhada(chartClasseBar, chartClasseLegend, dadosClasse, PALETA_CLASSE, "kg");

  if (classeBars) {
    const classeCount = contarPorCampo(registros, "classe", "quantidade");
    const entradasClasse = objectEntries(classeCount);
    if (entradasClasse.length === 0) {
      classeBars.innerHTML = `<div class="empty">Sem dados de classe.</div>`;
    } else {
      const maxClasse = Math.max(...objectValues(classeCount), 1);
      classeBars.innerHTML = entradasClasse
        .map(([classe, kg]) => {
          const pct = (kg / maxClasse) * 100;
          return `
            <div class="bar-item">
              <span>${escapeHtml(classe)} (${formatarNumero(kg)} kg)</span>
              <div class="bar-track"><div class="bar-fill" style="width:${pct.toFixed(1)}%"></div></div>
            </div>
          `;
        })
        .join("");
    }
  }

  if (tendenciaMensal) {
    const serieMensal = agruparKgPorMes(registros);
    if (serieMensal.length === 0) {
      tendenciaMensal.innerHTML = `<div class="empty">Sem histórico mensal para exibir.</div>`;
    } else {
      const maxMes = Math.max(...serieMensal.map(([, kg]) => kg), 1);
      tendenciaMensal.innerHTML = serieMensal
        .map(([mes, kg]) => {
          const pct = (kg / maxMes) * 100;
          return `
            <div class="trend-item">
              <span>${escapeHtml(formatarMesAno(mes))}</span>
              <div class="trend-track">
                <div class="trend-fill" style="width:${pct.toFixed(1)}%"></div>
              </div>
              <strong>${formatarNumero(kg)} kg</strong>
            </div>
          `;
        })
        .join("");
    }
  }

  if (comparativoMensal) {
    const comparativo = agruparValorizacaoAterroPorMes(registros);
    if (comparativo.length === 0) {
      comparativoMensal.innerHTML = `<div class="empty">Sem histórico mensal para comparação.</div>`;
    } else {
      const maxComparativo = Math.max(...comparativo.map((item) => Math.max(item.valorizacao, item.aterro)), 1);
      comparativoMensal.innerHTML = comparativo
        .map((item) => {
          const pctValorizacao = (item.valorizacao / maxComparativo) * 100;
          const pctAterro = (item.aterro / maxComparativo) * 100;
          return `
            <div class="compare-item">
              <span>${escapeHtml(formatarMesAno(item.mes))}</span>
              <div class="compare-bars">
                <div class="compare-track"><div class="compare-fill valor" style="width:${pctValorizacao.toFixed(1)}%"></div></div>
                <div class="compare-track"><div class="compare-fill aterro" style="width:${pctAterro.toFixed(1)}%"></div></div>
              </div>
              <strong>V ${formatarNumero(item.valorizacao)} | A ${formatarNumero(item.aterro)} kg</strong>
            </div>
          `;
        })
        .join("");
    }
  }

  if (eficienciaList) {
    const aguardando = registros.filter((item) => item.status === "Aguardando coleta").length;
    const transporte = registros.filter((item) => item.status === "Em transporte").length;
    eficienciaList.innerHTML = `
      <li>Valorização do volume: <strong>${formatarNumero(taxaValorizacao)}%</strong></li>
      <li>Volume em aterro: <strong>${formatarNumero(kgAterro)} kg</strong></li>
      <li>Registros aguardando coleta: <strong>${aguardando}</strong></li>
      <li>Registros em transporte: <strong>${transporte}</strong></li>
    `;
  }

  if (origemList) {
    const origens = objectEntries(contarPorCampo(registros, "origem", "quantidade"))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    origemList.innerHTML =
      origens.length === 0
        ? `<div class="empty">Sem dados de origem.</div>`
        : origens
            .map(([origem, kg]) => `<div class="list-item">${escapeHtml(origem)}: <strong>${formatarNumero(kg)} kg</strong></div>`)
            .join("");
  }
}

function renderFluxo() {
  if (!fluxoList) {
    return;
  }

  fluxoList.innerHTML = fluxoTratamento
    .map(
      (item, idx) => `
      <article class="timeline-step">
        <strong>Etapa ${idx + 1}: ${escapeHtml(item.etapa)}</strong>
        <p>${escapeHtml(item.detalhe)}</p>
      </article>
    `
    )
    .join("");
}

function renderPlanosAcao() {
  if (!planosList) {
    return;
  }

  planosList.innerHTML = planosAcao
    .map(
      (plano) => `
      <article class="plano">
        <h3>${escapeHtml(plano.titulo)}</h3>
        <p class="subtitle">${escapeHtml(plano.subtitulo)}</p>
        <ul>
          ${plano.itens.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </article>
    `
    )
    .join("");
}

function renderRelatorioRecuperacao() {
  if (!relatorioIndicadores || !relatorioDiagnostico || !relatorioMetas || !relatorioCronograma || !relatorioAcoes || !relatorioMonitoramento) {
    return;
  }

  const totalKg = registros.reduce((acc, item) => acc + Number(item.quantidade || 0), 0);
  const soloContaminadoKg = registros
    .filter((item) => String(item.tipo || "").toLowerCase().includes("solo contaminado"))
    .reduce((acc, item) => acc + Number(item.quantidade || 0), 0);
  const naoConformes = registros.filter((item) => item.status === "Não conformidade").length;
  const taxaNaoConforme = registros.length > 0 ? (naoConformes / registros.length) * 100 : 0;
  const destinacoesValorizadas = new Set(["Reciclagem", "Coprocessamento", "Reaproveitamento energético"]);
  const kgValorizado = registros.reduce((acc, item) => {
    return destinacoesValorizadas.has(item.destino) ? acc + Number(item.quantidade || 0) : acc;
  }, 0);
  const taxaValorizacao = totalKg > 0 ? (kgValorizado / totalKg) * 100 : 0;

  relatorioIndicadores.innerHTML = `
    <article class="kpi">
      <div class="label">Área em recuperação</div>
      <div class="value">3,8 ha</div>
      <div class="meta">${escapeHtml(relatorioRecuperacao.area)}</div>
    </article>
    <article class="kpi">
      <div class="label">Solo contaminado monitorado</div>
      <div class="value">${formatarNumero(soloContaminadoKg)} kg</div>
      <div class="meta">Base de registros operacionais</div>
    </article>
    <article class="kpi">
      <div class="label">Não conformidades</div>
      <div class="value">${naoConformes}</div>
      <div class="meta">${formatarNumero(taxaNaoConforme)}% dos registros</div>
    </article>
    <article class="kpi">
      <div class="label">Valorização de resíduos</div>
      <div class="value">${formatarNumero(taxaValorizacao)}%</div>
      <div class="meta">Referência para redução de passivo</div>
    </article>
  `;

  relatorioDiagnostico.innerHTML = relatorioRecuperacao.diagnostico
    .map((item) => `<div class="list-item">${escapeHtml(item)}</div>`)
    .join("");

  relatorioMetas.innerHTML = relatorioRecuperacao.metas
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  relatorioCronograma.innerHTML = relatorioRecuperacao.cronograma
    .map(
      (fase) => `
      <tr>
        <td>${escapeHtml(fase.fase)}</td>
        <td>${escapeHtml(fase.periodo)}</td>
        <td>${escapeHtml(fase.escopo)}</td>
        <td>${escapeHtml(fase.entregavel)}</td>
      </tr>
    `
    )
    .join("");

  relatorioAcoes.innerHTML = relatorioRecuperacao.acoes
    .map((acao) => {
      const classeStatus = mapearClasseStatusAcao(acao.status);
      return `
        <tr>
          <td>${escapeHtml(acao.acao)}</td>
          <td>${escapeHtml(acao.responsavel)}</td>
          <td>${escapeHtml(acao.prazo)}</td>
          <td>${escapeHtml(acao.prioridade)}</td>
          <td><span class="tag ${classeStatus}">${escapeHtml(acao.status)}</span></td>
        </tr>
      `;
    })
    .join("");

  relatorioMonitoramento.innerHTML = relatorioRecuperacao.monitoramento
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
}

function mapearClasseStatusAcao(status) {
  if (status === "Concluída") {
    return "ok";
  }
  if (status === "Em andamento") {
    return "info";
  }
  if (status === "Atrasada") {
    return "alert";
  }
  return "warn";
}

function renderSlides() {
  if (!slidesGrid) {
    return;
  }

  const filtrados = slides.filter((slide) => {
    if (!termoSlide) {
      return true;
    }

    const texto = `${slide.title} ${slide.texts.join(" ")}`.toLowerCase();
    return texto.includes(termoSlide);
  });

  if (filtrados.length === 0) {
    slidesGrid.innerHTML = `<div class="empty">Nenhum slide encontrado para essa busca.</div>`;
    return;
  }

  slidesGrid.innerHTML = filtrados
    .map((slide) => {
      const pontos = slide.texts
        .filter((linha) => linha && linha !== slide.title)
        .slice(0, 8)
        .map((linha) => `<li>${escapeHtml(linha)}</li>`)
        .join("");

      const imagens = (slide.images || [])
        .map(
          (img) =>
            `<img src="assets/images/${encodeURIComponent(img)}" alt="Slide ${slide.slide} - ${escapeHtml(slide.title)}" loading="lazy" />`
        )
        .join("");

      return `
        <article class="slide-card">
          <h3>Slide ${slide.slide}: ${escapeHtml(slide.title)}</h3>
          <div class="slide-image-group">${imagens || `<div class="empty">Sem imagem neste slide.</div>`}</div>
          <details>
            <summary>Ver pontos do slide</summary>
            <ul>${pontos || `<li>Conteúdo textual não identificado.</li>`}</ul>
          </details>
        </article>
      `;
    })
    .join("");
}

function loadRegistros() {
  try {
    const raw = storageGet(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item, index) => normalizarRegistroCarregado(item, index))
      .filter(Boolean);
  } catch (_) {
    return [];
  }
}

function normalizarRegistroCarregado(item, index) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const quantidade = parseQuantidade(item.quantidade);
  return {
    id: String(item.id || `R-${Date.now()}-${index}`),
    data: String(item.data || ""),
    tipo: String(item.tipo || "Não informado"),
    classe: String(item.classe || "Não informado"),
    origem: String(item.origem || "Não informado"),
    quantidade: Number.isFinite(quantidade) ? quantidade : 0,
    destino: String(item.destino || "Não informado"),
    status: String(item.status || "Não informado")
  };
}

function saveRegistros() {
  storageSet(STORAGE_KEY, JSON.stringify(registros));
}

function storageGet(chave) {
  try {
    return localStorage.getItem(chave);
  } catch (_) {
    return STORAGE_FALLBACK.has(chave) ? STORAGE_FALLBACK.get(chave) : null;
  }
}

function storageSet(chave, valor) {
  try {
    localStorage.setItem(chave, valor);
  } catch (_) {
    STORAGE_FALLBACK.set(chave, valor);
  }
}

function mostrarAviso(texto) {
  if (!footer || !texto) {
    return;
  }

  let aviso = document.getElementById("app-aviso");
  if (!aviso) {
    aviso = document.createElement("p");
    aviso.id = "app-aviso";
    aviso.style.margin = "6px 0 0";
    aviso.style.fontSize = "0.85rem";
    aviso.style.color = "var(--accent)";
    footer.append(aviso);
  }

  aviso.textContent = texto;
}

function renderGraficoRosca(container, legendContainer, entries, palette, unidade) {
  if (!container || !legendContainer) {
    return;
  }

  if (!entries || entries.length === 0) {
    container.style.background = "none";
    container.innerHTML = `<div class="donut-hole"><strong>0</strong><span>${unidade}</span></div>`;
    legendContainer.innerHTML = `<div class="empty">Sem dados para o gráfico.</div>`;
    return;
  }

  const total = entries.reduce((acc, [, valor]) => acc + Number(valor || 0), 0);
  if (total <= 0) {
    container.style.background = "none";
    container.innerHTML = `<div class="donut-hole"><strong>0</strong><span>${unidade}</span></div>`;
    legendContainer.innerHTML = `<div class="empty">Sem dados para o gráfico.</div>`;
    return;
  }

  let acumulado = 0;
  const fatias = [];
  const legenda = entries
    .map(([nome, valor], index) => {
      const cor = palette[index % palette.length];
      const numeric = Number(valor || 0);
      const pct = (numeric / total) * 100;
      const inicio = acumulado;
      acumulado += pct * 3.6;
      fatias.push(`${cor} ${inicio.toFixed(2)}deg ${acumulado.toFixed(2)}deg`);
      const valorFormatado = unidade === "kg" ? `${formatarNumero(numeric)} kg` : `${formatarNumero(numeric)} reg`;
      return `
        <div class="legend-item">
          <span class="legend-chip" style="background:${cor}"></span>
          <span>${escapeHtml(nome)}: <strong>${valorFormatado}</strong> (${formatarNumero(pct)}%)</span>
        </div>
      `;
    })
    .join("");

  container.style.background = `conic-gradient(${fatias.join(",")})`;
  container.innerHTML = `<div class="donut-hole"><strong>${formatarNumero(total)}</strong><span>${unidade}</span></div>`;
  legendContainer.innerHTML = legenda;
}

function renderBarraEmpilhada(container, legendContainer, entries, palette, unidade) {
  if (!container || !legendContainer) {
    return;
  }

  if (!entries || entries.length === 0) {
    container.innerHTML = `<div class="empty">Sem dados para o gráfico.</div>`;
    legendContainer.innerHTML = "";
    return;
  }

  const total = entries.reduce((acc, [, valor]) => acc + Number(valor || 0), 0);
  if (total <= 0) {
    container.innerHTML = `<div class="empty">Sem dados para o gráfico.</div>`;
    legendContainer.innerHTML = "";
    return;
  }

  const segmentos = entries
    .map(([, valor], index) => {
      const cor = palette[index % palette.length];
      const pct = (Number(valor || 0) / total) * 100;
      return `<span class="stack-segment" style="width:${pct.toFixed(2)}%; background:${cor}"></span>`;
    })
    .join("");

  const legenda = entries
    .map(([nome, valor], index) => {
      const cor = palette[index % palette.length];
      const numeric = Number(valor || 0);
      const pct = (numeric / total) * 100;
      return `
        <div class="legend-item">
          <span class="legend-chip" style="background:${cor}"></span>
          <span>${escapeHtml(nome)}: <strong>${formatarNumero(numeric)} ${unidade}</strong> (${formatarNumero(pct)}%)</span>
        </div>
      `;
    })
    .join("");

  container.innerHTML = `<div class="stack-track">${segmentos}</div>`;
  legendContainer.innerHTML = legenda;
}

function contarPorCampo(array, campo, campoSoma) {
  return array.reduce((acc, item) => {
    const chave = item[campo] || "Não informado";
    const incremento = campoSoma ? Number(item[campoSoma] || 0) : 1;
    acc[chave] = (acc[chave] || 0) + incremento;
    return acc;
  }, {});
}

function objectEntries(obj) {
  const entries = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      entries.push([key, obj[key]]);
    }
  }
  return entries;
}

function objectValues(obj) {
  const values = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      values.push(obj[key]);
    }
  }
  return values;
}

function agruparKgPorMes(array) {
  const acumulado = new Map();

  array.forEach((item) => {
    if (!item.data) {
      return;
    }

    const mes = String(item.data).slice(0, 7);
    if (mes.length !== 7) {
      return;
    }

    const atual = acumulado.get(mes) || 0;
    acumulado.set(mes, atual + Number(item.quantidade || 0));
  });

  return [...acumulado.entries()].sort(([mesA], [mesB]) => mesA.localeCompare(mesB));
}

function agruparValorizacaoAterroPorMes(array) {
  const destinosValorizacao = new Set(["Reciclagem", "Coprocessamento", "Reaproveitamento energético"]);
  const acumulado = new Map();

  array.forEach((item) => {
    if (!item.data) {
      return;
    }

    const mes = String(item.data).slice(0, 7);
    if (mes.length !== 7) {
      return;
    }

    const atual = acumulado.get(mes) || { valorizacao: 0, aterro: 0 };
    const quantidade = Number(item.quantidade || 0);

    if (item.destino === "Aterro industrial licenciado") {
      atual.aterro += quantidade;
    } else if (destinosValorizacao.has(item.destino)) {
      atual.valorizacao += quantidade;
    }

    acumulado.set(mes, atual);
  });

  return [...acumulado.entries()]
    .sort(([mesA], [mesB]) => mesA.localeCompare(mesB))
    .map(([mes, valores]) => ({
      mes,
      valorizacao: valores.valorizacao,
      aterro: valores.aterro
    }));
}

function formatarMesAno(chaveMes) {
  const [ano, mes] = String(chaveMes).split("-");
  const data = new Date(Number(ano), Number(mes) - 1, 1);
  if (Number.isNaN(data.getTime())) {
    return chaveMes;
  }

  return data.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}

function parseQuantidade(valor) {
  const texto = String(valor || "").trim();
  const normalizado = texto.includes(",")
    ? texto.replace(/\./g, "").replace(",", ".")
    : texto;
  return Number(normalizado);
}

function formatarNumero(valor) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(Number(valor || 0));
}

function formatarData(isoData) {
  if (!isoData) {
    return "-";
  }

  const data = new Date(`${isoData}T00:00:00`);
  return Number.isNaN(data.getTime()) ? isoData : data.toLocaleDateString("pt-BR");
}

const MOJIBAKE_MAP = new Map([
  ["â€¢", "•"],
  ["â€“", "–"],
  ["â€”", "—"],
  ["â€œ", "\""],
  ["â€", "\""],
  ["â€˜", "'"],
  ["â€™", "'"],
  ["Ã¡", "á"],
  ["Ã¢", "â"],
  ["Ã£", "ã"],
  ["Ã ", "à"],
  ["Ã¤", "ä"],
  ["Ã©", "é"],
  ["Ãª", "ê"],
  ["Ã¨", "è"],
  ["Ã­", "í"],
  ["Ã¬", "ì"],
  ["Ã³", "ó"],
  ["Ã´", "ô"],
  ["Ãµ", "õ"],
  ["Ã²", "ò"],
  ["Ãº", "ú"],
  ["Ã¹", "ù"],
  ["Ã§", "ç"],
  ["Ã", "Á"],
  ["Ã‚", "Â"],
  ["Ãƒ", "Ã"],
  ["Ã€", "À"],
  ["Ã‰", "É"],
  ["ÃŠ", "Ê"],
  ["Ã“", "Ó"],
  ["Ã”", "Ô"],
  ["Ã•", "Õ"],
  ["Ãš", "Ú"],
  ["Ã‡", "Ç"],
  ["Âº", "º"],
  ["Âª", "ª"],
  ["Â°", "°"],
  ["Â", ""]
]);

function corrigirMojibake(texto) {
  let saida = texto;

  for (let i = 0; i < 3; i += 1) {
    const antes = saida;
    for (const [quebrado, correto] of MOJIBAKE_MAP.entries()) {
      saida = saida.split(quebrado).join(correto);
    }

    if (saida === antes) {
      break;
    }
  }

  return saida;
}

function normalizarTexto(texto) {
  if (!texto) {
    return "";
  }

  let normalizado = String(texto).trim();

  if (/[ÃÂâ]/.test(normalizado)) {
    normalizado = corrigirMojibake(normalizado);
  }

  if (normalizado === "•") {
    return "";
  }

  return normalizado.replace(/\s+/g, " ").trim();
}

function escapeHtml(valor) {
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

