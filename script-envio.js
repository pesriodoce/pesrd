document.addEventListener('DOMContentLoaded', function() {
  const uploadInput = document.getElementById('pdfUpload');
  const btnEnviar = document.getElementById('btn-enviar');

  uploadInput.addEventListener('change', function(e) {
    if (e.target.files[0]?.type === "application/pdf") {
      btnEnviar.disabled = false;
      document.getElementById('fileName').textContent = `Arquivo selecionado: ${e.target.files[0].name}`;
    } else {
      alert('Apenas arquivos PDF são aceitos!');
    }
  });

  btnEnviar.addEventListener('click', function() {
  // Adicionar spinner
  btnEnviar.innerHTML = '<span class="spinner">⌛</span> Enviando...';
  btnEnviar.disabled = true;

  // Código do fetch...
  fetch('https://formsubmit.co/ajax/saude.riodoce@saude.gov.br', {
    method: "POST",
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    alert('Plano enviado com sucesso!');
  })
  .catch(error => {
    alert('Erro no envio. Tente novamente.');
  })
  .finally(() => {
    btnEnviar.disabled = false;
    btnEnviar.innerHTML = 'Enviar para tiago.magalhaes@saude.gov.br'; // Restaurar texto
  });
});
});
