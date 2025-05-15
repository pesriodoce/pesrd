const Auth = {
  municipios: {
    MG: [
      { codigo: "MG310110", nome: "AIMORÉS" },
      // ... outros municípios MG ...
    ],
    ES: [
      { codigo: "ES320040", nome: "ANCHIETA" },
      // ... outros municípios ES ...
    ],
    DF: [
      { codigo: "DF530010", nome: "BRASÍLIA" }
    ]
  },

  init: function() {
    this.setupUFListener();
    this.setupLogin();
    this.checkLogin();
    this.setupLogout();
  },

  setupUFListener: function() {
    document.getElementById("uf")?.addEventListener("change", (e) => {
      this.updateMunicipios(e.target.value);
    });
  },

  updateMunicipios: function(uf) {
    const select = document.getElementById("municipio-select");
    if (!select) return;
    
    select.innerHTML = "<option value=''>Selecione o município</option>";
    
    if (this.municipios[uf]) {
      this.municipios[uf].forEach(m => {
        const option = new Option(m.nome, m.codigo);
        select.add(option);
      });
    }
  },

  setupLogin: function() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const uf = document.getElementById('uf').value;
      const codigoMunicipio = document.getElementById('municipio-select').value;
      const senhaDigitada = document.getElementById('senha').value;

      if (senhaDigitada === codigoMunicipio) {
        this.storeSession(codigoMunicipio);
        this.checkLogin();
      } else {
        alert('Senha incorreta! Use o código do município (ex: MG310110).');
      }
    });
  },

  storeSession: function(codigo) {
    const uf = codigo.substring(0, 2);
    const municipio = this.municipios[uf].find(m => m.codigo === codigo);
    
    if (municipio) {
      const sessionData = {
        codigo,
        uf,
        nome: municipio.nome,
        timestamp: Date.now()
      };
      localStorage.setItem('session', JSON.stringify(sessionData));
    }
  },

  checkLogin: function() {
    const session = JSON.parse(localStorage.getItem('session'));
    const loginScreen = document.getElementById('login-screen');
    const mainContent = document.getElementById('main-content');
    const municipioLogado = document.getElementById('municipio-logado');

    if (session && this.municipios[session.uf]) {
      if (loginScreen) loginScreen.style.display = 'none';
      if (mainContent) mainContent.style.display = 'block';
      if (municipioLogado) {
        municipioLogado.textContent = `UF: ${session.uf} | Município: ${session.nome}`;
      }
    } else {
      if (loginScreen) loginScreen.style.display = 'flex';
      if (mainContent) mainContent.style.display = 'none';
    }
  },

  setupLogout: function() {
    const logoutBtn = document.querySelector('.btn-sair');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('session');
        window.location.href = 'index.html';
      });
    }
  },

  getCurrentSession: function() {
    return JSON.parse(localStorage.getItem('session'));
  }
};

document.addEventListener('DOMContentLoaded', () => Auth.init());