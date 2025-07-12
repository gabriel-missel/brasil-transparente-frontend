document.addEventListener("DOMContentLoaded", () => {
  //const API_BASE = "http://localhost:8081";
  const API_BASE ="https://brasil-transparente-api-492194254445.us-central1.run.app";

  const main = document.querySelector("main");
  const reportButtons = document.querySelectorAll(".report-button");
  const federalEntityId = localStorage.getItem("federalEntityId") || "1";
  const loaderContainer = document.querySelector(".loader-container");

  let loaderTimeout;
  let isInitialLoadComplete = false;

  const showLoader = () => {
    clearTimeout(loaderTimeout);
    if (!isInitialLoadComplete) {
      loaderTimeout = setTimeout(() => {
        if (loaderContainer) {
          loaderContainer.style.display = "flex";
        }
      }, 1000);
    }
  };

  const hideLoader = () => {
    clearTimeout(loaderTimeout);
    if (loaderContainer) {
      loaderContainer.style.display = "none";
    }
  };

  const createElement = (tag, className, content = "") => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content) el.innerHTML = content;
    return el;
  };

  const createBar = (value, percentage, level) => {
    const bar = createElement("div", "bar");
    const colors = ["#3db6f2", "#5cbef3", "#7fcdf4", "#a1dbf3", "#bbbbb8"];
    bar.style.width = `${percentage}%`;
    bar.style.backgroundColor = colors[level];
    bar.dataset.rawValue = value;

    const getBarText = (full) =>
      `${
        full ? formatCurrency(value) : formatLargeCurrency(value)
      } (${percentage.toFixed(percentage < 0.01 ? 3 : 2)}%)`;

    bar.textContent = getBarText(false);
    bar.title = formatCurrency(value);
    bar.addEventListener(
      "mouseenter",
      () => (bar.textContent = getBarText(true))
    );
    bar.addEventListener(
      "mouseleave",
      () => (bar.textContent = getBarText(false))
    );
    return bar;
  };

  const createToggleItem = (name, onClick, level = 0) => {
    const container = createElement("div", "bar-container");
    const isLastLevel = level === 4;
    const label = createElement(
      "span",
      "bar-label" + (isLastLevel ? " bar-label-final" : ""),
      isLastLevel ? name : `${name} <i class="fas fa-plus"></i>`
    );
    let expanded = false;
    if (!isLastLevel) {
      label.style.cursor = "pointer";
      label.addEventListener("click", async () => {
        expanded = !expanded;
        label.innerHTML = `${name} <i class="fas fa-${
          expanded ? "minus" : "plus"
        }"></i>`;
        if (expanded) {
          await onClick(container);
        } else {
          container.querySelector(".child-bar-container")?.remove();
        }
      });
    } else {
      label.style.cursor = "default";
    }
    return { container, label };
  };

  const fetchData = async (url, umamiEvent = null) => {
    try {
      if (window.umami && umamiEvent) {
        umami.track(umamiEvent, {
          type: "event",
          props: { interaction: true },
        });
      }
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error(`Erro ao recuperar dado da url: ${url}:`, error);
      return [];
    }
  };

  const fetchAndDisplayTotal = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/unidade-federativa/${federalEntityId}/total-value-spent`
      );
      const total = Number(await response.json());
      const totalValueElement = document.querySelector(".total-value");
      totalValueElement.dataset.rawValue = total;
      totalValueElement.textContent = formatLargeCurrency(total);
    } catch (error) {
      console.error("Erro ao recuperar valor total gasto: ", error);
    }
  };

  const clearContent = async () => {
    const containers = Array.from(main.children).filter(
      (child) =>
        !child.classList.contains("total-display") &&
        !child.classList.contains("loader-container")
    );

    containers.forEach((child) => child.classList.add("fade-out"));
    await new Promise((resolve) => setTimeout(resolve, 300));
    containers.forEach((child) => child.remove());
  };

  const renderSimplifiedReport = async () => {
    await clearContent();
    const data = await fetchData(
      `${API_BASE}/despesa-simplificada/${federalEntityId}`,
      "called-despesa-simplificada"
    );

    data.forEach((item, index) => {
      const container = createElement("div", "bar-container fade-out");
      const label = createElement("span", "bar-label-simplified", item.name);
      container.append(
        label,
        createBar(item.totalValue, item.percentageOfTotal, 0)
      );
      main.appendChild(container);

      setTimeout(() => container.classList.remove("fade-out"), 50 * index);
    });

    if (federalEntityId === "1") {
      [
        "* Bolsa Família e outros.",
        "** Seguro Desemprego e Abono Salarial.",
      ].forEach((text, index) => {
        const p = createElement("p", "additional-text fade-out", text);
        main.appendChild(p);
        setTimeout(
          () => p.classList.remove("fade-out"),
          50 * (data.length + index)
        );
      });
    }
  };

  function renderNextLevel(parent, items) {
    if (!items || !items.length) return;
    const nextLevel = items[0].level;
    if (nextLevel === 1) {
      renderMinisterios(parent, items);
    } else if (nextLevel === 2) {
      renderOrgaos(parent, items);
    } else if (nextLevel === 3) {
      renderUnidades(parent, items);
    } else if (nextLevel === 4) {
      renderElementos(parent, items);
    }
  }

  const renderFullReport = async () => {
    await clearContent();
    const poderes = await fetchData(
      `${API_BASE}/unidade-federativa/${federalEntityId}/poderes`,
      "called-despesa-completa"
    );
    poderes.forEach((poder, index) => {
      const { container, label } = createToggleItem(
        poder.name,
        async (parent) => {
          const children = await fetchData(
            `${API_BASE}/poder/${poder.id}/ministerios`,
            "called-ministerios"
          );
          renderNextLevel(parent, children);
        },
        poder.level
      );
      container.classList.add("fade-out");
      container.append(
        label,
        createBar(poder.totalValueSpent, poder.percentageOfTotal, poder.level)
      );
      main.appendChild(container);

      setTimeout(() => container.classList.remove("fade-out"), 50 * index);
    });
  };

  const renderMinisterios = (parent, ministerios) => {
    const container = createElement("div", "child-bar-container");
    ministerios.forEach((ministerio) => {
      const { container: mContainer, label } = createToggleItem(
        ministerio.name,
        async (parent) => {
          const children = await fetchData(
            `${API_BASE}/ministerio/${ministerio.id}/orgaos`,
            "called-orgaos"
          );
          renderNextLevel(parent, children);
        },
        ministerio.level
      );
      mContainer.append(
        label,
        createBar(
          ministerio.totalValueSpent,
          ministerio.percentageOfTotal,
          ministerio.level
        )
      );
      container.appendChild(mContainer);
    });
    parent.appendChild(container);
  };

  const renderOrgaos = (parent, orgaos) => {
    const container = createElement("div", "child-bar-container");
    orgaos.forEach((orgao) => {
      const { container: oContainer, label } = createToggleItem(
        orgao.name,
        async (parent) => {
          const children = await fetchData(
            `${API_BASE}/orgao/${orgao.id}/unidades-gestoras`,
            "called-unidades-gestoras"
          );
          renderNextLevel(parent, children);
        },
        orgao.level
      );
      oContainer.append(
        label,
        createBar(orgao.totalValueSpent, orgao.percentageOfTotal, orgao.level)
      );
      container.appendChild(oContainer);
    });
    parent.appendChild(container);
  };

  const renderUnidades = (parent, unidades) => {
    const container = createElement("div", "child-bar-container");
    unidades.forEach((unidade) => {
      const { container: uContainer, label } = createToggleItem(
        unidade.name,
        async (parent) => {
          const children = await fetchData(
            `${API_BASE}/unidade-gestora/${unidade.id}/elemento-despesa`,
            "called-elemento-despesa"
          );
          renderNextLevel(parent, children);
        },
        unidade.level
      );
      uContainer.append(
        label,
        createBar(
          unidade.totalValueSpent,
          unidade.percentageOfTotal,
          unidade.level
        )
      );
      container.appendChild(uContainer);
    });
    parent.appendChild(container);
  };

  const renderElementos = (parent, elementos) => {
    const container = createElement("div", "child-bar-container");
    elementos.forEach((elemento) => {
      const { container: elementoContainer, label } = createToggleItem(
        elemento.name,
        null,
        elemento.level
      );
      elementoContainer.append(
        label,
        createBar(
          elemento.totalValueSpent,
          elemento.percentageOfTotal,
          elemento.level
        )
      );
      container.appendChild(elementoContainer);
    });
    parent.appendChild(container);
  };

  reportButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      if (button.classList.contains("active")) return;

      reportButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      try {
        if (button.dataset.report === "simplificado") {
          await renderSimplifiedReport();
        } else {
          await renderFullReport();
        }
      } catch (error) {
        console.error(
          "Erro ao renderizar gasto simplificado/total gasto: ",
          error
        );
      }
    });
  });

  const formatLargeCurrency = (value) => {
    const trillion = 1e12,
      billion = 1e9,
      million = 1e6;
    const truncate = (num) => Math.floor(num * 100) / 100;
    if (value >= trillion) {
      const truncated = truncate(value / trillion);
      const formatted = truncated.toFixed(2).replace(".", ",");
      return `R$ ${formatted} ${
        Math.floor(value / trillion) === 1 ? "trilhão" : "trilhões"
      }`;
    } else if (value >= billion) {
      const truncated = truncate(value / billion);
      const formatted = truncated.toFixed(2).replace(".", ",");
      return `R$ ${formatted} ${
        Math.floor(value / billion) === 1 ? "bilhão" : "bilhões"
      }`;
    } else if (value >= million) {
      const truncated = truncate(value / million);
      const formatted = truncated.toFixed(2).replace(".", ",");
      return `R$ ${formatted} ${
        Math.floor(value / million) === 1 ? "milhão" : "milhões"
      }`;
    }
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatCurrency = (value) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const totalValueElement = document.querySelector(".total-value");
  totalValueElement.addEventListener("mouseenter", () => {
    totalValueElement.textContent = formatCurrency(
      Number(totalValueElement.dataset.rawValue)
    );
  });
  totalValueElement.addEventListener("mouseleave", () => {
    totalValueElement.textContent = formatLargeCurrency(
      Number(totalValueElement.dataset.rawValue)
    );
  });

  (async () => {
    showLoader();
    try {
      await fetchAndDisplayTotal();
      const activeReport = document.querySelector(".report-button.active")
        .dataset.report;
      activeReport === "simplificado"
        ? await renderSimplifiedReport()
        : await renderFullReport();
    } catch (error) {
      console.error("Erro ao recuperar relatório de gasto:", error);
    } finally {
      hideLoader();
      isInitialLoadComplete = true;
    }
  })();
});

document.addEventListener("DOMContentLoaded", function () {
  const generalButton = document.querySelector(
    '.report-button[data-report="geral"]'
  );
  if (generalButton) {
    generalButton.addEventListener("mouseover", function () {
      generalButton.querySelector("span").textContent = "Selecionar outro";
    });
    generalButton.addEventListener("mouseout", function () {
      const federalEntityName =
        localStorage.getItem("federalEntityName") || "União Federal";
      generalButton.querySelector("span").textContent = federalEntityName;
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const federalEntityName =
    localStorage.getItem("federalEntityName") || "União Federal";
  const federalEntityImage =
    localStorage.getItem("federalEntityImage") || "images/estados/uniao.png";

  document.getElementById("state-name").textContent = federalEntityName;
  document.getElementById("state-image").src = federalEntityImage;
});
