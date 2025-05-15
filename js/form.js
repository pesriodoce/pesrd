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
    if (!document.getElementById('eixos-container')) {
      console.error('Container de eixos não encontrado!');
      return;
    }

    // 1. Primeiro carrega os dados da sessão
    this.loadMunicipioData();
    
    // 2. Cria a estrutura de eixos
    this.setupEixos();
    
    // 3. Carrega ações salvas
    this.loadSavedActions();
    
    // 4. Configura persistência
    this.setupFormPersistence();
    
    // Garante visibilidade
    document.getElementById('eixos-container').style.display = 'block';
    console.log('FormManager inicializado com sucesso');
  },

  loadMunicipioData: function() {
    const session = Auth.getCurrentSession();
    if (session) {
      const ufField = document.getElementById('uf');
      const municipioField = document.getElementById('municipio-select');
      
      if (ufField && municipioField) {
        ufField.value = session.uf;
        const municipioObj = Auth.municipios[session.uf]?.find(m => m.codigo === session.codigo);
        if (municipioObj) {
          municipioField.value = municipioObj.nome;
        } else {
          console.error('Município não encontrado para o código:', session.codigo);
        }
      }
    }
  },

  setupEixos: function() {
    const container = document.getElementById("eixos-container");
    this.eixos.forEach((titulo, i) => {
      const n = i + 1;
      container.innerHTML += `
        <div class="section">
          <h2 onclick="FormManager.toggleAccordion('eixo${n}')">Eixo ${n} - ${titulo}</h2>
          <div class="accordion" id="eixo${n}"></div>
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
    const campos = ['responsavel', 'cargo', 'uf', 'municipio-select', 'perfil-socio', 'perfil-epidemiologico', 'estrutura-rede'];
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
        problema: body.querySelector('textarea:nth-of-type(1)')?.value || '',
        descricao: body.querySelector('textarea:nth-of-type(2)')?.value || '',
        objetivos: body.querySelector('textarea:nth-of-type(3)')?.value || '',
        itens: body.querySelector('input[type="text"]:nth-of-type(1)')?.value || '',
        tipo: body.querySelector('select')?.value || '',
        orcamento: body.querySelector('.masked-currency')?.value || '',
        dataInicio: body.querySelector('input[type="date"]:nth-of-type(1)')?.value || '',
        dataConclusao: body.querySelector('input[type="date"]:nth-of-type(2)')?.value || '',
        indicador: body.querySelector('input[type="text"]:nth-of-type(2)')?.value || '',
        meta: body.querySelector('input[type="text"]:nth-of-type(3)')?.value || '',
        observacoes: body.querySelector('textarea:nth-of-type(4)')?.value || ''
      };
      
      actions.push(actionData);
    });
    
    localStorage.setItem('form_actions', JSON.stringify(actions));
  }
};

// APENAS UM event listener no final
document.addEventListener('DOMContentLoaded', () => FormManager.init());
