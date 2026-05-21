(function () {
  "use strict";

  if (window.__APP_PRIMARY_READY || window.__APP_FALLBACK_READY) {
    return;
  }

  var STORAGE_KEY = "gestao_residuos_bracell_v1";
  var THEME_KEY = "gestao_residuos_bracell_theme_v1";
  var MEMORY_STORAGE = {};

  var TIPOS_RESIDUOS = [
    "Cinzas (CAL) industriais",
    "Lodo biológico",
    "Óleos lubrificantes",
    "Resíduos químicos",
    "Resíduos recicláveis",
    "Biomassa",
    "Solo contaminado",
    "Absorventes e EPIs contaminados"
  ];

  var FALLBACK_REGISTROS_INICIAIS = [
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
      tipo: "Resíduos recicláveis",
      classe: "Classe IIB",
      origem: "Almoxarifado e escritório",
      quantidade: 420,
      destino: "Reciclagem",
      status: "Destinado"
    }
  ];

  var PALETA_DESTINO = ["#00b894", "#00cec9", "#0984e3", "#6c5ce7", "#fdcb6e", "#e17055"];
  var PALETA_STATUS = ["#2ecc71", "#3498db", "#f1c40f", "#e74c3c", "#8e44ad"];
  var PALETA_CLASSE = ["#1abc9c", "#2980b9", "#9b59b6", "#f39c12", "#c0392b"];

  function safeRun(fn) {
    try {
      return fn();
    } catch (error) {
      if (window.console && console.error) {
        console.error("Fallback error:", error);
      }
      return null;
    }
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function storageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (_) {
      return Object.prototype.hasOwnProperty.call(MEMORY_STORAGE, key) ? MEMORY_STORAGE[key] : null;
    }
  }

  function storageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (_) {
      MEMORY_STORAGE[key] = value;
    }
  }

  function showNotice(message) {
    var footer = document.querySelector("footer");
    if (!footer || !message) {
      return;
    }

    var notice = byId("app-aviso");
    if (!notice) {
      notice = document.createElement("p");
      notice.id = "app-aviso";
      notice.style.margin = "6px 0 0";
      notice.style.fontSize = "0.85rem";
      notice.style.color = "var(--accent)";
      footer.appendChild(notice);
    }

    notice.textContent = message;
  }

  function parseQuantidade(value) {
    var text = String(value || "").trim();
    var normalized = text.indexOf(",") >= 0
      ? text.replace(/\./g, "").replace(",", ".")
      : text;
    return Number(normalized);
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }).format(Number(value || 0));
  }

  function formatDate(isoDate) {
    if (!isoDate) {
      return "-";
    }

    var date = new Date(isoDate + "T00:00:00");
    return Number.isNaN(date.getTime()) ? isoDate : date.toLocaleDateString("pt-BR");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function toNumber(value) {
    var numeric = Number(value);
    return isFinite(numeric) ? numeric : 0;
  }

  function contarPorCampo(array, campo, campoSoma) {
    return array.reduce(function (acc, item) {
      var chave = item[campo] || "Não informado";
      var incremento = campoSoma ? toNumber(item[campoSoma]) : 1;
      acc[chave] = (acc[chave] || 0) + incremento;
      return acc;
    }, {});
  }

  function renderGraficoRosca(container, legendContainer, entries, palette, unidade) {
    if (!container || !legendContainer) {
      return;
    }

    if (!entries || entries.length === 0) {
      container.style.background = "none";
      container.innerHTML = '<div class="donut-hole"><strong>0</strong><span>' + escapeHtml(unidade) + "</span></div>";
      legendContainer.innerHTML = '<div class="empty">Sem dados para o gráfico.</div>';
      return;
    }

    var total = entries.reduce(function (acc, entry) {
      return acc + toNumber(entry[1]);
    }, 0);

    if (total <= 0) {
      container.style.background = "none";
      container.innerHTML = '<div class="donut-hole"><strong>0</strong><span>' + escapeHtml(unidade) + "</span></div>";
      legendContainer.innerHTML = '<div class="empty">Sem dados para o gráfico.</div>';
      return;
    }

    var acumulado = 0;
    var fatias = [];
    var legenda = entries.map(function (entry, index) {
      var nome = entry[0];
      var valor = toNumber(entry[1]);
      var cor = palette[index % palette.length];
      var pct = (valor / total) * 100;
      var inicio = acumulado;
      acumulado += pct * 3.6;
      fatias.push(cor + " " + inicio.toFixed(2) + "deg " + acumulado.toFixed(2) + "deg");

      var valorFormatado = unidade === "kg" ? formatNumber(valor) + " kg" : formatNumber(valor) + " reg";
      return [
        '<div class="legend-item">',
        '<span class="legend-chip" style="background:' + cor + '"></span>',
        "<span>" + escapeHtml(nome) + ": <strong>" + escapeHtml(valorFormatado) + "</strong> (" + formatNumber(pct) + "%)</span>",
        "</div>"
      ].join("");
    }).join("");

    container.style.background = "conic-gradient(" + fatias.join(",") + ")";
    container.innerHTML = '<div class="donut-hole"><strong>' + formatNumber(total) + "</strong><span>" + escapeHtml(unidade) + "</span></div>";
    legendContainer.innerHTML = legenda;
  }

  function renderBarraEmpilhada(container, legendContainer, entries, palette, unidade) {
    if (!container || !legendContainer) {
      return;
    }

    if (!entries || entries.length === 0) {
      container.innerHTML = '<div class="empty">Sem dados para o gráfico.</div>';
      legendContainer.innerHTML = "";
      return;
    }

    var total = entries.reduce(function (acc, entry) {
      return acc + toNumber(entry[1]);
    }, 0);

    if (total <= 0) {
      container.innerHTML = '<div class="empty">Sem dados para o gráfico.</div>';
      legendContainer.innerHTML = "";
      return;
    }

    var segmentos = entries.map(function (entry, index) {
      var valor = toNumber(entry[1]);
      var cor = palette[index % palette.length];
      var pct = (valor / total) * 100;
      return '<span class="stack-segment" style="width:' + pct.toFixed(2) + "%;background:" + cor + '"></span>';
    }).join("");

    var legenda = entries.map(function (entry, index) {
      var nome = entry[0];
      var valor = toNumber(entry[1]);
      var cor = palette[index % palette.length];
      var pct = (valor / total) * 100;
      return [
        '<div class="legend-item">',
        '<span class="legend-chip" style="background:' + cor + '"></span>',
        "<span>" + escapeHtml(nome) + ": <strong>" + formatNumber(valor) + " " + escapeHtml(unidade) + "</strong> (" + formatNumber(pct) + "%)</span>",
        "</div>"
      ].join("");
    }).join("");

    container.innerHTML = '<div class="stack-track">' + segmentos + "</div>";
    legendContainer.innerHTML = legenda;
  }

  function applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    storageSet(THEME_KEY, theme);

    var lightBtn = byId("theme-light");
    var darkBtn = byId("theme-dark");

    if (lightBtn) {
      lightBtn.classList.toggle("is-active", theme === "light");
      lightBtn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    }

    if (darkBtn) {
      darkBtn.classList.toggle("is-active", theme === "dark");
      darkBtn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }
  }

  function initializeTheme() {
    var saved = storageGet(THEME_KEY);
    var prefersDark = false;

    try {
      prefersDark = !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    } catch (_) {
      prefersDark = false;
    }

    applyTheme(saved === "dark" || saved === "light" ? saved : (prefersDark ? "dark" : "light"));

    var lightBtn = byId("theme-light");
    var darkBtn = byId("theme-dark");

    if (lightBtn) {
      lightBtn.addEventListener("click", function () {
        applyTheme("light");
      });
    }

    if (darkBtn) {
      darkBtn.addEventListener("click", function () {
        applyTheme("dark");
      });
    }
  }

  function fillTipoOptions() {
    var tipoSelect = byId("tipo");
    if (!tipoSelect) {
      return;
    }

    if (tipoSelect.options.length > 0) {
      return;
    }

    for (var i = 0; i < TIPOS_RESIDUOS.length; i += 1) {
      var option = document.createElement("option");
      option.value = TIPOS_RESIDUOS[i];
      option.textContent = TIPOS_RESIDUOS[i];
      tipoSelect.appendChild(option);
    }
  }

  function loadRegistros() {
    try {
      var raw = storageGet(STORAGE_KEY);
      if (!raw) {
        return [];
      }

      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function saveRegistros(registros) {
    storageSet(STORAGE_KEY, JSON.stringify(registros));
  }

  function defaultDate() {
    var inputData = byId("data");
    if (inputData) {
      inputData.value = new Date().toISOString().slice(0, 10);
    }
  }

  function bootFallback() {
    if (window.__APP_PRIMARY_READY || window.__APP_FALLBACK_READY) {
      return;
    }

    var form = byId("residue-form");
    var tableBody = byId("residue-table-body");
    if (!form || !tableBody) {
      return;
    }

    window.__APP_FALLBACK_READY = true;

    var registros = loadRegistros();
    if (!Array.isArray(registros) || registros.length === 0) {
      registros = JSON.parse(JSON.stringify(FALLBACK_REGISTROS_INICIAIS));
      saveRegistros(registros);
    }

    function resetForm() {
      var formTitle = byId("form-title");
      var inputId = byId("registro-id");
      var inputTipo = byId("tipo");
      var inputClasse = byId("classe");
      var inputDestino = byId("destino");
      var inputStatus = byId("status");
      var cancelBtn = byId("cancel-btn");

      form.reset();
      defaultDate();

      if (inputId) {
        inputId.value = "";
      }
      if (formTitle) {
        formTitle.textContent = "Novo Registro";
      }
      if (cancelBtn) {
        cancelBtn.hidden = true;
      }
      if (inputTipo && inputTipo.options.length > 0) {
        inputTipo.value = inputTipo.options[0].value;
      }
      if (inputClasse) {
        inputClasse.value = "Classe I";
      }
      if (inputDestino) {
        inputDestino.value = "Reciclagem";
      }
      if (inputStatus) {
        inputStatus.value = "Aguardando coleta";
      }
    }

    function renderTabela() {
      var searchInput = byId("search");
      var filtroStatus = byId("filtro-status");
      var termo = searchInput ? searchInput.value.trim().toLowerCase() : "";
      var statusFiltro = filtroStatus ? filtroStatus.value : "";

      var filtrados = registros.filter(function (item) {
        var texto = (item.tipo + " " + item.origem + " " + item.destino).toLowerCase();
        var passaTexto = termo === "" || texto.indexOf(termo) >= 0;
        var passaStatus = statusFiltro === "" || item.status === statusFiltro;
        return passaTexto && passaStatus;
      });

      if (filtrados.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8"><div class="empty">Nenhum registro encontrado para o filtro atual.</div></td></tr>';
        return;
      }

      var rows = filtrados.map(function (item) {
        return [
          "<tr>",
          "<td>" + formatDate(item.data) + "</td>",
          "<td>" + escapeHtml(item.tipo) + "</td>",
          "<td>" + escapeHtml(item.classe) + "</td>",
          "<td>" + escapeHtml(item.origem) + "</td>",
          "<td>" + formatNumber(item.quantidade) + "</td>",
          "<td>" + escapeHtml(item.destino) + "</td>",
          "<td>" + escapeHtml(item.status) + "</td>",
          '<td><button class="btn small" data-action="edit" data-id="' + item.id + '">Editar</button> <button class="btn small danger" data-action="delete" data-id="' + item.id + '">Excluir</button></td>',
          "</tr>"
        ].join("");
      });

      tableBody.innerHTML = rows.join("");
    }

    function renderDashboardFallback() {
      var kpiGrid = byId("kpi-grid");
      var statusBars = byId("status-bars");
      var destinoList = byId("destino-list");
      var resumoOperacional = byId("resumo-operacional");
      var chartDestino = byId("chart-destino");
      var chartDestinoLegend = byId("chart-destino-legend");
      var chartStatus = byId("chart-status");
      var chartStatusLegend = byId("chart-status-legend");
      var chartClasseBar = byId("chart-classe-bar");
      var chartClasseLegend = byId("chart-classe-legend");

      if (!kpiGrid || !statusBars || !destinoList || !resumoOperacional) {
        return;
      }

      var totalKg = registros.reduce(function (acc, item) {
        return acc + toNumber(item.quantidade);
      }, 0);
      var destinados = registros.filter(function (item) {
        return item.status === "Destinado";
      }).length;
      var taxaDestinacao = registros.length > 0 ? (destinados / registros.length) * 100 : 0;

      var destinosValorizacao = ["Reciclagem", "Coprocessamento", "Reaproveitamento energético"];
      var kgValorizado = registros.reduce(function (acc, item) {
        return destinosValorizacao.indexOf(item.destino) >= 0 ? acc + toNumber(item.quantidade) : acc;
      }, 0);
      var taxaValorizacao = totalKg > 0 ? (kgValorizado / totalKg) * 100 : 0;
      var kgAterro = registros.filter(function (item) {
        return item.destino === "Aterro industrial licenciado";
      }).reduce(function (acc, item) {
        return acc + toNumber(item.quantidade);
      }, 0);

      kpiGrid.innerHTML = [
        '<article class="kpi"><div class="label">Total cadastrado</div><div class="value">' + formatNumber(totalKg) + ' kg</div><div class="meta">' + registros.length + " registros</div></article>",
        '<article class="kpi"><div class="label">Taxa destinado</div><div class="value">' + formatNumber(taxaDestinacao) + '%</div><div class="meta">Status Destinado / total</div></article>',
        '<article class="kpi"><div class="label">Taxa de valorização</div><div class="value">' + formatNumber(taxaValorizacao) + '%</div><div class="meta">Reciclagem + coprocessamento + reaproveitamento</div></article>',
        '<article class="kpi"><div class="label">Envio para aterro</div><div class="value">' + formatNumber(kgAterro) + ' kg</div><div class="meta">Monitoramento de passivo</div></article>'
      ].join("");

      var statusCount = contarPorCampo(registros, "status");
      var maxStatus = Math.max.apply(null, Object.keys(statusCount).map(function (k) {
        return toNumber(statusCount[k]);
      }).concat([1]));

      statusBars.innerHTML = Object.keys(statusCount).length === 0
        ? '<div class="empty">Sem dados de status.</div>'
        : Object.keys(statusCount).map(function (status) {
            var valor = toNumber(statusCount[status]);
            var pct = (valor / maxStatus) * 100;
            return [
              '<div class="bar-item">',
              "<span>" + escapeHtml(status) + " (" + valor + ")</span>",
              '<div class="bar-track"><div class="bar-fill" style="width:' + pct.toFixed(1) + '%"></div></div>',
              "</div>"
            ].join("");
          }).join("");

      var destinoCount = contarPorCampo(registros, "destino", "quantidade");
      var destinosOrdenados = Object.keys(destinoCount).map(function (destino) {
        return [destino, toNumber(destinoCount[destino])];
      }).sort(function (a, b) {
        return b[1] - a[1];
      });

      destinoList.innerHTML = destinosOrdenados.length === 0
        ? '<div class="empty">Sem dados de destinação.</div>'
        : destinosOrdenados.map(function (entry) {
            return '<div class="list-item">' + escapeHtml(entry[0]) + ": <strong>" + formatNumber(entry[1]) + " kg</strong></div>";
          }).join("");

      var classeI = registros.filter(function (item) {
        return item.classe === "Classe I";
      }).length;
      var naoConformes = registros.filter(function (item) {
        return item.status === "Não conformidade";
      }).length;
      var conformidade = registros.length > 0 ? ((registros.length - naoConformes) / registros.length) * 100 : 0;
      var mediaKg = registros.length > 0 ? totalKg / registros.length : 0;

      resumoOperacional.innerHTML = [
        "<li>Registros Classe I (perigosos): <strong>" + classeI + "</strong></li>",
        "<li>Não conformidades ativas: <strong>" + naoConformes + "</strong></li>",
        "<li>Índice de conformidade: <strong>" + formatNumber(conformidade) + "%</strong></li>",
        "<li>Média por registro: <strong>" + formatNumber(mediaKg) + " kg</strong></li>"
      ].join("");

      var dadosDestino = destinosOrdenados.filter(function (entry) {
        return entry[1] > 0;
      });
      var dadosStatus = Object.keys(statusCount).map(function (status) {
        return [status, toNumber(statusCount[status])];
      }).filter(function (entry) {
        return entry[1] > 0;
      });
      var classeCount = contarPorCampo(registros, "classe", "quantidade");
      var dadosClasse = Object.keys(classeCount).map(function (classe) {
        return [classe, toNumber(classeCount[classe])];
      }).filter(function (entry) {
        return entry[1] > 0;
      }).sort(function (a, b) {
        return b[1] - a[1];
      });

      renderGraficoRosca(chartDestino, chartDestinoLegend, dadosDestino, PALETA_DESTINO, "kg");
      renderGraficoRosca(chartStatus, chartStatusLegend, dadosStatus, PALETA_STATUS, "reg");
      renderBarraEmpilhada(chartClasseBar, chartClasseLegend, dadosClasse, PALETA_CLASSE, "kg");
    }

    function fillForm(registro) {
      var formTitle = byId("form-title");
      var cancelBtn = byId("cancel-btn");

      byId("registro-id").value = registro.id;
      byId("data").value = registro.data;
      byId("tipo").value = registro.tipo;
      byId("classe").value = registro.classe;
      byId("origem").value = registro.origem;
      byId("quantidade").value = String(registro.quantidade);
      byId("destino").value = registro.destino;
      byId("status").value = registro.status;

      if (formTitle) {
        formTitle.textContent = "Editar Registro";
      }
      if (cancelBtn) {
        cancelBtn.hidden = false;
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var inputId = byId("registro-id");
      var registro = {
        id: inputId && inputId.value ? inputId.value : "R-" + Date.now(),
        data: byId("data").value,
        tipo: byId("tipo").value,
        classe: byId("classe").value,
        origem: byId("origem").value.trim(),
        quantidade: parseQuantidade(byId("quantidade").value),
        destino: byId("destino").value,
        status: byId("status").value
      };

      if (!registro.data || !registro.origem || !isFinite(registro.quantidade)) {
        showNotice("Preencha os campos obrigatórios antes de salvar.");
        return;
      }

      if (inputId && inputId.value) {
        registros = registros.map(function (item) {
          return item.id === registro.id ? registro : item;
        });
      } else {
        registros.unshift(registro);
      }

      saveRegistros(registros);
      resetForm();
      renderTabela();
      renderDashboardFallback();
      showNotice("Registro salvo com fallback de segurança.");
    });

    tableBody.addEventListener("click", function (event) {
      var target = event.target;
      if (!target || !target.dataset) {
        return;
      }

      var id = target.dataset.id;
      var action = target.dataset.action;
      if (!id || !action) {
        return;
      }

      var registro = registros.find(function (item) {
        return item.id === id;
      });

      if (action === "edit" && registro) {
        fillForm(registro);
        return;
      }

      if (action === "delete") {
        registros = registros.filter(function (item) {
          return item.id !== id;
        });
        saveRegistros(registros);
        renderTabela();
        renderDashboardFallback();
      }
    });

    var cancelBtn = byId("cancel-btn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", resetForm);
    }

    var searchInput = byId("search");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        renderTabela();
        renderDashboardFallback();
      });
    }

    var filtroStatus = byId("filtro-status");
    if (filtroStatus) {
      filtroStatus.addEventListener("change", function () {
        renderTabela();
        renderDashboardFallback();
      });
    }

    fillTipoOptions();
    initializeTheme();
    resetForm();
    renderTabela();
    renderDashboardFallback();
    showNotice("Modo de segurança ativo. Recursos essenciais funcionando.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      safeRun(bootFallback);
    });
  } else {
    safeRun(bootFallback);
  }
})();
