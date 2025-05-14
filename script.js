// Dados completos de acesso
const municipiosAutorizados = {
// Minas Gerais (MG + código IBGE)
    "MG310110": { nome: "AIMORÉS", senha: "PESRD2025" },
    "MG310180": { nome: "ALPERCATA", senha: "PESRD2025" },
    "MG310570": { nome: "BARRA LONGA", senha: "PESRD2025" },
    "MG310630": { nome: "BELO ORIENTE", senha: "PESRD2025" },
    "MG310780": { nome: "BOM JESUS DO GALHO", senha: "PESRD2025" },
    "MG310925": { nome: "BUGRE", senha: "PESRD2025" },
    "MG311340": { nome: "CARATINGA", senha: "PESRD2025" },
    "MG311840": { nome: "CONSELHEIRO PENA", senha: "PESRD2025" },
    "MG311940": { nome: "CORONEL FABRICIANO", senha: "PESRD2025" },
    "MG312000": { nome: "CÓRREGO NOVO", senha: "PESRD2025" },
    "MG312180": { nome: "DIONÍSIO", senha: "PESRD2025" },
    "MG312580": { nome: "FERNANDES TOURINHO", senha: "PESRD2025" },
    "MG312730": { nome: "GALILÉIA", senha: "PESRD2025" },
    "MG312770": { nome: "GOVERNADOR VALADARES", senha: "PESRD2025" },
    "MG312930": { nome: "IAPU", senha: "PESRD2025" },
    "MG313115": { nome: "IPABA", senha: "PESRD2025" },
    "MG313130": { nome: "IPATINGA", senha: "PESRD2025" },
    "MG313410": { nome: "ITUETA", senha: "PESRD2025" },
    "MG314000": { nome: "MARIANA", senha: "PESRD2025" },
    "MG314030": { nome: "MARLIÉRIA", senha: "PESRD2025" },
    "MG314435": { nome: "NAQUE", senha: "PESRD2025" },
    "MG314610": { nome: "OURO PRETO", senha: "PESRD2025" },
    "MG314995": { nome: "PERIQUITO", senha: "PESRD2025" },
    "MG315053": { nome: "PINGO-D'ÁGUA", senha: "PESRD2025" },
    "MG315210": { nome: "PONTE NOVA", senha: "PESRD2025" },
    "MG315400": { nome: "RAUL SOARES", senha: "PESRD2025" },
    "MG315430": { nome: "RESPLENDOR", senha: "PESRD2025" },
    "MG315490": { nome: "RIO CASCA", senha: "PESRD2025" },
    "MG315500": { nome: "RIO DOCE", senha: "PESRD2025" },
    "MG315740": { nome: "SANTA CRUZ DO ESCALVADO", senha: "PESRD2025" },
    "MG315895": { nome: "SANTANA DO PARAÍSO", senha: "PESRD2025" },
    "MG316100": { nome: "SÃO DOMINGOS DO PRATA", senha: "PESRD2025" },
    "MG316340": { nome: "SÃO JOSÉ DO GOIABAL", senha: "PESRD2025" },
    "MG316400": { nome: "SÃO PEDRO DOS FERROS", senha: "PESRD2025" },
    "MG316556": { nome: "SEM-PEIXE", senha: "PESRD2025" },
    "MG316770": { nome: "SOBRÁLIA", senha: "PESRD2025" },
    "MG316870": { nome: "TIMÓTEO", senha: "PESRD2025" },
    "MG316950": { nome: "TUMIRITINGA", senha: "PESRD2025" },
    
    // Espírito Santo (ES + código IBGE)
    "ES320040": { nome: "ANCHIETA", senha: "PESRD2025" },
    "ES320060": { nome: "ARACRUZ", senha: "PESRD2025" },
    "ES320080": { nome: "BAIXO GUANDU", senha: "PESRD2025" },
    "ES320150": { nome: "COLATINA", senha: "PESRD2025" },
    "ES320160": { nome: "CONCEIÇÃO DA BARRA", senha: "PESRD2025" },
    "ES320220": { nome: "FUNDÃO", senha: "PESRD2025" },
    "ES320320": { nome: "LINHARES", senha: "PESRD2025" },
    "ES320335": { nome: "MARILÂNDIA", senha: "PESRD2025" },
    "ES320490": { nome: "SÃO MATEUS", senha: "PESRD2025" },
    "ES320500": { nome: "SERRA", senha: "PESRD2025" },
    "ES320501": { nome: "SOORETAMA", senha: "PESRD2025" },

    // Distrito Federal (DF + código IBGE)
    "DF530010": { nome: "BRASÍLIA", senha: "PESRD2025" }
};

// Inicialização segura
document.addEventListener('DOMContentLoaded', function () {
  checkLogin();

// Evento de login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const codigo = document.getElementById('codigo').value.trim().toUpperCase();
      const senha = document.getElementById('senha').value;

      if (municipiosAutorizados[codigo] && municipiosAutorizados[codigo].senha === senha) {
        localStorage.setItem('municipioLogado', codigo);
        checkLogin();
      } else {
        alert('Credenciais inválidas!');
      }
    });
  } 
});
    
// Sessão
function checkLogin() {
  const codigo = localStorage.getItem('municipioLogado');
  const loginScreen = document.getElementById('login-screen');
  const mainContent = document.getElementById('main-content');

  if (codigo && municipiosAutorizados[codigo]) {
    if (loginScreen) loginScreen.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';
    const municipioLogado = document.getElementById('municipio-logado');
    if (municipioLogado) municipioLogado.textContent = `Município: ${municipiosAutorizados[codigo].nome}`;
  } else {
    if (loginScreen) loginScreen.style.display = 'flex';
    if (mainContent) mainContent.style.display = 'none';
  }
}

// Logout
function logout() {
  localStorage.removeItem('municipioLogado');
  document.getElementById('codigo').value = '';
  document.getElementById('senha').value = '';
  checkLogin();
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
  // ... (Validação de campos mantida)

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'pt', 'a4');
  let y = 40;

  // ---- Funções Auxiliares Preservadas ----
  const addDivider = () => {
    doc.setDrawColor(200);
    doc.line(30, y, doc.internal.pageSize.getWidth() - 30, y);
    y += 20;
  };

  const addFieldPair = (label, value) => {
    doc.setFont('helvetica', 'bold');
    doc.text(30, y, `${label}:`);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(value || 'Não preenchido', doc.internal.pageSize.getWidth() - 60);
    lines.forEach((line, i) => {
      if (y > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        y = 40;
      }
      doc.text(40, y + 15 + (i * 15), line); // Alinhamento à direita do label
    });
    y += (lines.length * 15) + 10;
  };

  // ---- Conteúdo do PDF ----
  doc.setFontSize(16).setFont('helvetica', 'bold');
  doc.text(30, y, "Plano de Ação - Programa Especial de Saúde do Rio Doce");
  y += 30;

  // Seção 1: Informações Iniciais
  addDivider();
  doc.setFontSize(14).text(30, y, "Informações Iniciais");
  y += 20;
  addFieldPair("Responsável", document.getElementById('responsavel').value);
  addFieldPair("Cargo", document.getElementById('cargo').value);
  addFieldPair("UF", document.getElementById('uf').value);
  addFieldPair("Município", document.getElementById('municipio-select').value);

  // Seção 2: Diagnóstico Situacional
  addDivider();
  doc.setFontSize(14).text(30, y, "Diagnóstico Situacional");
  y += 20;
  addFieldPair("Perfil socioeconômico", document.getElementById('perfil-socio').value);
  addFieldPair("Perfil epidemiológico", document.getElementById('perfil-epidemiologico').value);
  addFieldPair("Estrutura da rede", document.getElementById('estrutura-rede').value);

  // Seções Dinâmicas (Eixos e Ações)
  document.querySelectorAll('.section').forEach(section => {
    addDivider();
    const tituloEixo = section.querySelector('h2').textContent;
    doc.setFontSize(14).text(30, y, tituloEixo);
    y += 20;

    section.querySelectorAll('.accordion-item').forEach(acao => {
      const tituloAcao = acao.querySelector('.accordion-header').textContent;
      doc.setFont('helvetica', 'bold').text(35, y, `• ${tituloAcao}`);
      y += 15;

      acao.querySelectorAll('label').forEach(label => {
        const campo = label.nextElementSibling;
        const valor = campo.value || campo.textContent || 'Não preenchido';
        addFieldPair(label.textContent.replace(':', ''), valor); // Remove ":" do label
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
