document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:8080";
  //const API_BASE = "";

  const main = document.querySelector("main");
  const reportButtons = document.querySelectorAll(".report-button");

  const createElement = (tag, className, content = "") => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content) el.innerHTML = content;
    return el;
  };

  const createBar = (value, percentage, level) => {
    const bar = createElement("div", "bar");
    const colors = ["#3da4e9", "#22ca63", "#cde954", "#2dd4bf", "#bbbbb8"];
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

  const createToggleItem = (name, onClick) => {
    const container = createElement("div", "bar-container");
    const label = createElement(
      "span",
      "bar-label",
      `${name} <i class="fas fa-plus"></i>`
    );
    let expanded = false;
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
    return { container, label };
  };

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      return [];
    }
  };

  const fetchAndDisplayTotal = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/unidade-federativa/1/total-value-spent`
      );
      const total = Number(await response.json());
      const totalValueElement = document.querySelector(".total-value");
      totalValueElement.dataset.rawValue = total;
      totalValueElement.textContent = formatLargeCurrency(total);
    } catch (error) {
      console.error("Error fetching total:", error);
    }
  };

  const clearContent = async () => {
    const containers = Array.from(main.children).filter(
      (child) => !child.classList.contains("total-display")
    );

    containers.forEach((child) => child.classList.add("fade-out"));
    await new Promise((resolve) => setTimeout(resolve, 300));
    containers.forEach((child) => child.remove());
  };

  const renderSimplifiedReport = async () => {
    await clearContent();
    const data = await fetchData(`${API_BASE}/despesa-simplificada`);

    data.forEach((item, index) => {
      const container = createElement("div", "bar-container fade-out");
      const label = createElement(
        "span",
        "bar-label-simplified",
        item.despesaSimplificadaName
      );
      container.append(
        label,
        createBar(
          item.despesaSimplificadaTotalValue,
          item.despesaSimplificadaPercentageOfTotal,
          0
        )
      );
      main.appendChild(container);

      setTimeout(() => container.classList.remove("fade-out"), 50 * index);
    });

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
  };

  const renderFullReport = async () => {
    await clearContent();
    const poderes = await fetchData(`${API_BASE}/unidade-federativa/1/poderes`);
    poderes.forEach((poder, index) => {
      const { container, label } = createToggleItem(
        poder.name,
        async (parent) => {
          const ministerios = await fetchData(
            `${API_BASE}/poder/${poder.id}/ministerios`
          );
          renderMinisterios(parent, ministerios);
        }
      );
      container.classList.add("fade-out");
      container.append(
        label,
        createBar(poder.totalValueSpent, poder.percentageOfTotal, poder.level)
      );
      main.appendChild(container);

      // Stagger the animations
      setTimeout(() => container.classList.remove("fade-out"), 50 * index);
    });
  };

  const renderMinisterios = (parent, ministerios) => {
    const container = createElement("div", "child-bar-container");
    ministerios.forEach((ministerio) => {
      const { container: mContainer, label } = createToggleItem(
        ministerio.name,
        async (parent) => {
          const orgaos = await fetchData(
            `${API_BASE}/ministerio/${ministerio.id}/orgaos`
          );
          renderOrgaos(parent, orgaos);
        }
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
          const unidades = await fetchData(
            `${API_BASE}/orgao/${orgao.id}/unidades-gestoras`
          );
          renderUnidades(parent, unidades);
        }
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
          const elementos = await fetchData(
            `${API_BASE}/unidade-gestora/${unidade.id}/elemento-despesa`
          );
          renderElementos(parent, elementos);
        }
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
      const elementoContainer = createElement("div", "bar-container");
      const label = createElement("span", "bar-label", elemento.name);
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

      if (button.dataset.report === "simplificado") {
        await renderSimplifiedReport();
      } else {
        await renderFullReport();
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

  // Initialization
  (async () => {
    await fetchAndDisplayTotal();
    const activeReport = document.querySelector(".report-button.active").dataset
      .report;
    activeReport === "simplificado"
      ? await renderSimplifiedReport()
      : await renderFullReport();
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
