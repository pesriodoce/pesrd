const Auth = {
  municipios: {
    MG: [
    { codigo: "MG310110", nome: "AIMORÉS" },
    { codigo: "MG310180", nome: "ALPERCATA" },
    { codigo: "MG310570", nome: "BARRA LONGA" },
    { codigo: "MG310630", nome: "BELO ORIENTE" },
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
