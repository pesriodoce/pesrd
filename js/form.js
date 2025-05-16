
const FormManager = {
  actionCount: 0,
  eixos: [
    "Fortalecimento e ampliação dos serviços de Atenção à Saúde",
    "Fortalecimento e ampliação das ações e serviços de Vigilância em Saúde",
    "Fortalecimento, ampliação e melhorias da infraestrutura de saúde",
    "Melhoria das práticas de gestão em saúde",
    "Ações de inteligência e ciências de dados e serviços de saúde digital",
    "Formação e educação permanente"
  ],

  init: function() {
    console.log('Inicializando FormManager...');
    const container = document.getElementById('eixos-container');
    if (!container) {
      console.error('ERRO: Elemento #eixos-container não encontrado!');
      return;
    }

    this.loadMunicipioData();
    this.setupEixos();
    this.setupFormPersistence();

    console.log('FormManager inicializado com sucesso');
  },

loadMunicipioData: function () {
  try {
    const session = Auth.getCurrentSession();
    if (!session) {
      console.warn("Sessão não encontrada");
      return;
    }

    // Preencher campos UF e Município
    const ufField = document.getElementById("uf");
    const municipioField = document.getElementById("municipio-select");

    if (ufField) ufField.value = session.uf;
    if (municipioField) municipioField.value = session.nome;

    // Preencher o campo de e-mail, se tiver salvo anteriormente
    const emailField = document.getElementById("email");
    if (emailField) {
      const emailSalvo = localStorage.getItem("form_email");
      emailField.value = emailSalvo || "";
    }

  } catch (e) {
    console.error("Erro ao carregar dados da sessão:", e);
  }
}

,

  setupEixos: function() {
    const container = document.getElementById("eixos-container");
    this.eixos.forEach((titulo, i) => {
      const n = i + 1;
      container.innerHTML += `
        <div class="section">
          <h2 onclick="FormManager.toggleAccordion('eixo${n}')">Eixo ${n} - ${titulo}</h2>
          <div class="accordion accordion-body" id="eixo${n}"></div>
          <button class="add-action" onclick="FormManager.addAction('eixo${n}')">Adicionar nova ação</button>
        </div>`;
    });
  },

  toggleAccordion: function(id) {
    document.querySelectorAll(".accordion-body").forEach(el => {
      if (el.id !== id) el.style.display = "none";
    });
    const el = document.getElementById(id);
    if (el) {
      el.style.display = el.style.display === "block" ? "none" : "block";
    }
  },

  addAction: function(eixoId) {
    document.querySelectorAll('.accordion-body').forEach(body => {
      body.style.display = 'none';
    });

    this.actionCount++;
    const eixo = document.getElementById(eixoId);
    const newId = `acao${eixoId}_${this.actionCount}`;
    const newAction = document.createElement('div');
    newAction.classList.add('accordion-item');

    newAction.innerHTML = `
      <div class="accordion-header" onclick="FormManager.toggleAccordion('${newId}')">Nova Ação</div>
      <div class="accordion-body" id="${newId}">
        <label>Nome da ação:</label>
        <input type="text" class="nome-acao">

        <label>Identificação do Problema:</label>
        <textarea class="problema"></textarea>

        <label>Descrição da ação:</label>
        <textarea class="descricao"></textarea>

        <label>Objetivos:</label>
        <textarea class="objetivos"></textarea>

        <label>Itens previstos:</label>
        <textarea class="itens"></textarea>

        <label>Tipo da Ação:</label>
        <select class="tipo">
          <option>Investimento</option>
          <option>Custeio</option>
        </select>

        <label>Orçamento previsto:</label>
        <input type="text" class="masked-currency" id="budget-${newId}">

        <label>Data de início:</label>
        <input type="date" class="inicio">

        <label>Data de conclusão:</label>
        <input type="date" class="fim">

        <label>Indicador:</label>
        <textarea class="indicador"></textarea>

        <label>Meta:</label>
        <textarea class="meta"></textarea>

        <label>Observações:</label>
        <textarea class="observacoes"></textarea>
      </div>
    `;

    eixo.appendChild(newAction);

    const nomeInput = newAction.querySelector('.nome-acao');
    const header = newAction.querySelector('.accordion-header');
    nomeInput.addEventListener('input', () => {
      header.innerText = nomeInput.value || 'Nova Ação';
    });

    const inputBudget = document.getElementById(`budget-${newId}`);
    inputBudget.addEventListener('input', function() {
      let value = inputBudget.value.replace(/\D/g, '');
      value = (parseInt(value, 10) / 100).toFixed(2).toString();
      value = value.replace('.', ',');
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      inputBudget.value = value ? 'R$ ' + value : '';
    });

    this.setupActionButtons(newAction, eixoId, newId);
    this.toggleAccordion(newId);
    this.scrollToAction(eixoId);
  },

  setupActionButtons: function(actionElement, eixoId, actionId) {
    const body = actionElement.querySelector('.accordion-body');

    const salvarBtn = document.createElement('button');
    salvarBtn.innerText = 'Salvar ação';
    salvarBtn.className = 'add-action';
    salvarBtn.onclick = () => {
      document.getElementById(actionId).style.display = "none";
      this.scrollToAction(eixoId);
    };

    const excluirBtn = document.createElement('button');
    excluirBtn.innerText = 'Excluir ação';
    excluirBtn.className = 'remove-action';
    excluirBtn.onclick = () => {
      actionElement.remove();
      this.scrollToAction(eixoId);
    };

    body.append(salvarBtn, excluirBtn);
  },

  scrollToAction: function(eixoId) {
    setTimeout(() => {
      const heading = document.getElementById(eixoId).previousElementSibling;
      const offset = heading.getBoundingClientRect().top + window.scrollY - 20;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }, 100);
  },

  setupFormPersistence: function() {
    const campos = ['responsavel', 'cargo', 'perfil-socio', 'perfil-epidemiologico', 'estrutura-rede'];
    campos.forEach(id => {
      const campo = document.getElementById(id);
      if (campo) {
        campo.addEventListener('input', () => {
          localStorage.setItem(`form_${id}`, campo.value);
        });
        campo.value = localStorage.getItem(`form_${id}`) || '';
      }
    });
  },

  saveAllActions: function() {
    const actions = [];

    document.querySelectorAll('.accordion-item').forEach(action => {
      const body = action.querySelector('.accordion-body');
      if (!body) return;

      const actionData = {
        eixoId: body.id.split('_')[0].replace('acao', 'eixo'),
        nome: body.querySelector('.nome-acao')?.value || '',
        problema: body.querySelector('.problema')?.value || '',
        descricao: body.querySelector('.descricao')?.value || '',
        objetivos: body.querySelector('.objetivos')?.value || '',
        itens: body.querySelector('.itens')?.value || '',
        tipo: body.querySelector('.tipo')?.value || '',
        orcamento: body.querySelector('.masked-currency')?.value || '',
        dataInicio: body.querySelector('.inicio')?.value || '',
        dataConclusao: body.querySelector('.fim')?.value || '',
        indicador: body.querySelector('.indicador')?.value || '',
        meta: body.querySelector('.meta')?.value || '',
        observacoes: body.querySelector('.observacoes')?.value || ''
      };

      actions.push(actionData);
    });

    localStorage.setItem('form_actions', JSON.stringify(actions));
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const waitForSession = setInterval(() => {
    const session = Auth?.getCurrentSession?.();
    if (session) {
      clearInterval(waitForSession);
      FormManager.init();
    } else {
      console.log("Aguardando sessão do Auth...");
    }
  }, 100); // verifica a cada 100ms
});

