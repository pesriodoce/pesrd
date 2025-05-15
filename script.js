// Dados completos de acesso
const municipios = {
  MG: [
    { codigo: "MG310110", nome: "AIMORÉS" },
    { codigo: "MG310180", nome: "ALPERCATA" },
    { codigo: "MG310570", nome: "BARRA LONGA" },
    { codigo: "MG310630", nome: "BELO ORIENTE" },
    { codigo: "MG310620", nome: "BELO HORIZONTE" },
    { codigo: "MG310780", nome: "BOM JESUS DO GALHO" },
    { codigo: "MG310925", nome: "BUGRE" },
    { codigo: "MG311340", nome: "CARATINGA" },
    { codigo: "MG311840", nome: "CONSELHEIRO PENA" },
    { codigo: "MG311940", nome: "CORONEL FABRICIANO" },
    { codigo: "MG312000", nome: "CÓRREGO NOVO" },
    { codigo: "MG312180", nome: "DIONÍSIO" },
    { codigo: "MG312580", nome: "FERNANDES TOURINHO" },
    { codigo: "MG312730", nome: "GALILÉIA" },
    { codigo: "MG312770", nome: "GOVERNADOR VALADARES" },
    { codigo: "MG312930", nome: "IAPU" },
    { codigo: "MG313115", nome: "IPABA" },
    { codigo: "MG313130", nome: "IPATINGA" },
    { codigo: "MG313410", nome: "ITUETA" },
    { codigo: "MG314000", nome: "MARIANA" },
    { codigo: "MG314030", nome: "MARLIÉRIA" },
    { codigo: "MG314435", nome: "NAQUE" },
    { codigo: "MG314610", nome: "OURO PRETO" },
    { codigo: "MG314995", nome: "PERIQUITO" },
    { codigo: "MG315053", nome: "PINGO-D'ÁGUA" },
    { codigo: "MG315210", nome: "PONTE NOVA" },
    { codigo: "MG315400", nome: "RAUL SOARES" },
    { codigo: "MG315430", nome: "RESPLENDOR" },
    { codigo: "MG315490", nome: "RIO CASCA" },
    { codigo: "MG315500", nome: "RIO DOCE" },
    { codigo: "MG315740", nome: "SANTA CRUZ DO ESCALVADO" },
    { codigo: "MG315895", nome: "SANTANA DO PARAÍSO" },
    { codigo: "MG316100", nome: "SÃO DOMINGOS DO PRATA" },
    { codigo: "MG316340", nome: "SÃO JOSÉ DO GOIABAL" },
    { codigo: "MG316400", nome: "SÃO PEDRO DOS FERROS" },
    { codigo: "MG316556", nome: "SEM-PEIXE" },
    { codigo: "MG316770", nome: "SOBRÁLIA" },
    { codigo: "MG316870", nome: "TIMÓTEO" },
    { codigo: "MG316950", nome: "TUMIRITINGA" },
  ],
  ES: [
    { codigo: "ES320040", nome: "ANCHIETA" },
    { codigo: "ES320060", nome: "ARACRUZ" },
    { codigo: "ES320080", nome: "BAIXO GUANDU" },
    { codigo: "ES320150", nome: "COLATINA" },
    { codigo: "ES320160", nome: "CONCEIÇÃO DA BARRA" },
    { codigo: "ES320220", nome: "FUNDÃO" },
    { codigo: "ES320320", nome: "LINHARES" },
    { codigo: "ES320335", nome: "MARILÂNDIA" },
    { codigo: "ES320490", nome: "SÃO MATEUS" },
    { codigo: "ES320500", nome: "SERRA" },
    { codigo: "ES320501", nome: "SOORETAMA" },
    { codigo: "ES320530", nome: "VITÓRIA" },
 ],
 DF: [
    { codigo: "DF530010", nome: "BRASÍLIA" }
 ]
};

// Função para atualizar municípios
function atualizarMunicipios(uf) {
  const select = document.getElementById("municipio-select");
  select.innerHTML = "<option value=''>Selecione o município</option>";
  
  if (municipios[uf]) {
    municipios[uf].forEach(m => {
      const option = document.createElement("option");
      option.value = m.codigo; 
      option.textContent = m.nome;
      select.appendChild(option);
    });
  }
}

// Evento para carregar municípios ao selecionar a UF
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("uf").addEventListener("change", function(e) {
    atualizarMunicipios(e.target.value);
  });
});

// Inicialização segura
document.addEventListener('DOMContentLoaded', function () {
  checkLogin();

  // ===== PREENCHER UF E MUNICÍPIO (FORMULÁRIO) ===== //
  if (window.location.pathname.includes('formulario.html')) {
    const codigo = localStorage.getItem('municipioLogado');
    if (codigo) {
      const uf = codigo.substring(0, 2);
      const municipioObj = municipios[uf].find(m => m.codigo === codigo);
      if (municipioObj) {
        document.getElementById('uf').value = uf;
        atualizarMunicipios(uf); // repopular o select
        document.getElementById('municipio-select').value = codigo;
      }
    }

  }
    
// Evento de login
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const uf = document.getElementById('uf').value;
  const codigoMunicipio = document.getElementById('municipio-select').value;
  const senhaDigitada = document.getElementById('senha').value;

  // Verificar se a senha é igual ao código do município selecionado
  if (senhaDigitada === codigoMunicipio) {
    localStorage.setItem('municipioLogado', codigoMunicipio);
    checkLogin();
  } else {
    alert('Senha incorreta! Use o código do município (ex: MG310110).');
  }
});
    
// Sessão
function checkLogin() {
  const codigo = localStorage.getItem('municipioLogado');
  const loginScreen = document.getElementById('login-screen');
  const mainContent = document.getElementById('main-content');
  const municipioLogado = document.getElementById('municipio-logado');

  if (codigo && municipios[codigo]) {
    // Extrair UF (primeiros 2 caracteres)
    const uf = codigo.substring(0, 2);
    // Buscar nome do município
    const nomeMunicipio = municipios[codigo].nome;

    if (loginScreen) loginScreen.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';
    if (municipioLogado) {
      municipioLogado.textContent = `UF: ${uf} | Município: ${nomeMunicipio}`;
    }
  } else {
    if (loginScreen) loginScreen.style.display = 'flex';
    if (mainContent) mainContent.style.display = 'none';
  }
}

// Logout
function logout() {
  localStorage.removeItem('municipioLogado');
  location.reload();
}


window.actionCount = 0;

const eixos = [
  "Fortalecimento e ampliação dos serviços de Atenção à Saúde",
  "Fortalecimento e ampliação das ações e serviços de Vigilância em Saúde",
  "Fortalecimento, ampliação e melhorias da infraestrutura de saúde",
  "Melhoria das práticas de gestão em saúde",
  "Ações de inteligência e ciências de dados e serviços de saúde digital",
  "Formação e educação permanente"
];

const container = document.getElementById("eixos-container");
eixos.forEach((titulo, i) => {
  const n = i + 1;
  container.innerHTML += `
    <div class="section">
      <h2 onclick="toggleAccordion('eixo${n}')">Eixo ${n} - ${titulo}</h2>
      <div class="accordion" id="eixo${n}"></div>
      <button class="add-action" onclick="addAction('eixo${n}')">Adicionar nova ação</button>
    </div>`;
});
    
function toggleAccordion(id) {
  document.querySelectorAll(".accordion-body").forEach(el => {
    if (el.id !== id) el.style.display = "none";
  });
  const el = document.getElementById(id);
  if (el) {
    el.style.display = el.style.display === "block" ? "none" : "block";
  }
}

function addAction(eixoId) {
  document.querySelectorAll('.accordion-body').forEach(body => {
    body.style.display = 'none';
  });

  window.actionCount++;
  const eixo = document.getElementById(eixoId);
  const newId = `acao${eixoId}_${window.actionCount}`;
  const newAction = document.createElement('div');
  newAction.classList.add('accordion-item');

  newAction.innerHTML = `
    <div class="accordion-header" onclick="toggleAccordion('${newId}')">Nova Ação</div>
    <div class="accordion-body" id="${newId}">
      <label>Identificação do Problema:</label>
      <textarea></textarea>

      <label>Nome da ação:</label>
      <input type="text" class="nome-acao">

      <label>Descrição da ação:</label>
      <textarea></textarea>

      <label>Objetivos:</label>
      <textarea></textarea>

      <label>Itens previstos:</label>
      <input type="text">

      <label>Tipo da Ação:</label>
      <select>
        <option>Investimento</option>
        <option>Custeio</option>
      </select>

      <label>Orçamento previsto:</label>
      <input type="text" class="masked-currency" id="budget-${newId}">

      <label>Data de início:</label>
      <input type="date">

      <label>Data de conclusão:</label>
      <input type="date">

      <label>Indicador:</label>
      <input type="text">

      <label>Meta:</label>
      <input type="text">

      <label>Observações:</label>
      <textarea></textarea>
    </div>
  `;

  eixo.appendChild(newAction);

  const nomeInput = newAction.querySelector('.nome-acao');
  const header = newAction.querySelector('.accordion-header');
  nomeInput.addEventListener('input', () => {
    header.innerText = nomeInput.value || 'Nova Ação';
  });

  const inputBudget = document.getElementById(`budget-${newId}`);
  inputBudget.addEventListener('input', function () {
    let value = inputBudget.value.replace(/\D/g, '');
    value = (parseInt(value, 10) / 100).toFixed(2).toString();
    value = value.replace('.', ',');
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    inputBudget.value = value ? 'R$ ' + value : '';
  });

  const body = newAction.querySelector('.accordion-body');

  const salvarBtn = document.createElement('button');
  salvarBtn.innerText = 'Salvar ação';
  salvarBtn.className = 'add-action';
  salvarBtn.onclick = () => {
    if (body) body.style.display = "none";
    const heading = eixo.previousElementSibling;
    const offset = heading.getBoundingClientRect().top + window.scrollY - 20;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  };
  body.appendChild(salvarBtn);

  const excluirBtn = document.createElement('button');
  excluirBtn.innerText = 'Excluir ação';
  excluirBtn.className = 'remove-action';
  excluirBtn.onclick = () => {
    newAction.remove();
    const heading = eixo.previousElementSibling;
    const offset = heading.getBoundingClientRect().top + window.scrollY - 20;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  };
  body.appendChild(excluirBtn);

  toggleAccordion(newId);

  setTimeout(() => {
    const heading = eixo.previousElementSibling;
    const offset = heading.getBoundingClientRect().top + window.scrollY - 20;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  }, 100);
}

function generatePDF() {
  // Validação de campos obrigatórios (mantida)
  const obrigatorios = {
    'uf': 'Selecione a UF!',
    'municipio-select': 'Selecione o município!',
    'responsavel': 'Preencha o responsável!'
  };

  for (const [id, mensagem] of Object.entries(obrigatorios)) {
    const campo = document.getElementById(id);
    if (!campo.value.trim()) {
      alert(mensagem);
      campo.focus();
      return;
    }
  }

  // Configuração do PDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'pt', 'a4');
  let y = 60; // Posição inicial Y

  // ---- Funções de Formatação Original ----
  const addText = (text, options = {}) => {
    const { bold = false, size = 12, spacingBefore = 0, spacingAfter = 16 } = options;
    y += spacingBefore;
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    
    // Quebrar texto em linhas
    const lines = doc.splitTextToSize(text, 500);
    lines.forEach(line => {
      if (y > doc.internal.pageSize.height - 40) {
        doc.addPage();
        y = 60;
      }
      doc.text(60, y, line);
      y += spacingAfter;
    });
  };

  const addDivider = () => {
    if (y > doc.internal.pageSize.height - 40) {
      doc.addPage();
      y = 60;
    }
    doc.setDrawColor(180);
    doc.line(60, y, doc.internal.pageSize.width - 60, y);
    y += 20;
  };

  const addFieldPair = (label, value) => {
    // Label
    addText(label + ":", { bold: true, size: 12, spacingBefore: 10 });
    // Valor
    addText(value || 'Não preenchido', { size: 12, spacingBefore: 4, spacingAfter: 12 });
  };

  // ---- Conteúdo do PDF ----
  // Título
  addText("Plano de Ação - Programa Especial de Saúde do Rio Doce", {
    bold: true,
    size: 16,
    spacingAfter: 30
  });

  // Seção 1: Informações Iniciais
  addDivider();
  addText("Informações Iniciais", { bold: true, size: 14, spacingAfter: 20 });
  addFieldPair("Responsável", document.getElementById('responsavel').value);
  addFieldPair("Cargo", document.getElementById('cargo').value);
  addFieldPair("UF", document.getElementById('uf').value);
  addFieldPair("Município", document.getElementById('municipio-select').value);

  // Seção 2: Diagnóstico Situacional
  addDivider();
  addText("Diagnóstico Situacional", { bold: true, size: 14, spacingAfter: 20 });
  addFieldPair("Perfil socioeconômico", document.getElementById('perfil-socio').value);
  addFieldPair("Perfil epidemiológico", document.getElementById('perfil-epidemiologico').value);
  addFieldPair("Estrutura da rede", document.getElementById('estrutura-rede').value);

  // Seções Dinâmicas (Eixos e Ações)
  document.querySelectorAll('.section').forEach(section => {
    addDivider();
    const tituloEixo = section.querySelector('h2').textContent;
    addText(tituloEixo, { bold: true, size: 14, spacingAfter: 15 });

    section.querySelectorAll('.accordion-item').forEach(acao => {
      const tituloAcao = acao.querySelector('.accordion-header').textContent;
      addText(`• ${tituloAcao}`, { bold: true, spacingAfter: 10 });

      acao.querySelectorAll('label').forEach(label => {
        const campo = label.nextElementSibling;
        const valor = campo.value || campo.textContent || 'Não preenchido';
        addFieldPair(label.textContent.replace(':', ''), valor);
      });
    });
  });

  // Finalizar
  doc.save(`plano_acao_${Date.now()}.pdf`);
}


// Persistência de dados (formulario.html)
if (window.location.pathname.includes('formulario.html')) {
  // Salvar dados
  const campos = ['responsavel', 'cargo', 'uf', 'municipio-select', 'perfil-socio', 'perfil-epidemiologico', 'estrutura-rede'];
  campos.forEach(id => {
    const campo = document.getElementById(id);
    if (campo) {
      campo.addEventListener('input', () => {
        localStorage.setItem(id, campo.value);
      });
      campo.value = localStorage.getItem(id) || ''; // Recuperar dados
    }
  });
}

// Popular municípios com base na UF
function atualizarMunicipios(uf) {
  const select = document.getElementById("municipio-select");
  select.innerHTML = "<option value=''>Selecione o município</option>";
  
  municipios[uf].forEach(m => {
    const option = document.createElement("option");
    option.value = m.codigo; // Valor = código do município
    option.textContent = m.nome;
    select.appendChild(option);
  });
}

// Evento para atualizar municípios ao selecionar a UF
document.getElementById("uf").addEventListener("change", function(e) {
  atualizarMunicipios(e.target.value);
});

if (!uploadInput.files.length) {
  alert("Selecione um arquivo antes de enviar.");
  return;
}
                         
