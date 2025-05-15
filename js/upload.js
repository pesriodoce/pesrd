const UploadManager = {
  init: function() {
    const uploadInput = document.getElementById('pdfUpload');
    const btnEnviar = document.getElementById('btn-enviar');

    if (!uploadInput || !btnEnviar) return;

    uploadInput.addEventListener('change', (e) => this.handleFileSelect(e));
    btnEnviar.addEventListener('click', () => this.handleUpload());
  },

  handleFileSelect: function(e) {
    const file = e.target.files[0];
    const btnEnviar = document.getElementById('btn-enviar');
    const fileName = document.getElementById('fileName');

    if (!file) {
      btnEnviar.disabled = true;
      fileName.textContent = '';
      return;
    }

    if (file.type !== "application/pdf") {
      alert('Apenas arquivos PDF são aceitos!');
      btnEnviar.disabled = true;
      fileName.textContent = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('O arquivo é muito grande. Tamanho máximo: 5MB');
      btnEnviar.disabled = true;
      fileName.textContent = '';
      return;
    }

    btnEnviar.disabled = false;
    fileName.textContent = `Arquivo selecionado: ${file.name}`;
  },

  handleUpload: function() {
    const uploadInput = document.getElementById('pdfUpload');
    const btnEnviar = document.getElementById('btn-enviar');
    const session = Auth.getCurrentSession();

    if (!uploadInput.files.length) {
      alert("Selecione um arquivo antes de enviar.");
      return;
    }

    const formData = new FormData();
    formData.append('_replyto', 'no-reply@pesriodoce.org.br');
    formData.append('_subject', `Plano Aprovado - ${session?.nome || 'Desconhecido'}`);
    formData.append('uploaded_file', uploadInput.files[0]);

    btnEnviar.innerHTML = '<div class="spinner"></div> Enviando...';
    btnEnviar.disabled = true;

    fetch('https://formsubmit.co/ajax/saude.riodoce@saude.gov.br', {
      method: "POST",
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      alert('Plano enviado com sucesso!');
      uploadInput.value = '';
      document.getElementById('fileName').textContent = '';
    })
    .catch(error => {
      alert('Erro no envio. Tente novamente.');
      console.error('Upload error:', error);
    })
    .finally(() => {
      btnEnviar.disabled = false;
      btnEnviar.innerHTML = 'Enviar para tiago.magalhaes@saude.gov.br';
    });
  }
};

document.addEventListener('DOMContentLoaded', () => UploadManager.init());