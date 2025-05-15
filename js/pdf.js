const PDFGenerator = {
  init: function() {
    document.getElementById('generate-pdf')?.addEventListener('click', () => this.generatePDF());
  },

  generatePDF: function() {
    if (!this.validateRequiredFields()) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');
    let y = 60;

    // Adicionar conteúdo ao PDF
    this.addTitle(doc, y);
    y = this.addInitialInfo(doc, y + 30);
    y = this.addDiagnostico(doc, y);
    y = this.addEixos(doc, y);

    doc.save(`plano_acao_${Date.now()}.pdf`);
  },

  validateRequiredFields: function() {
    const obrigatorios = {
      'uf': 'Selecione a UF!',
      'municipio-select': 'Selecione o município!',
      'responsavel': 'Preencha o responsável!'
    };

    for (const [id, mensagem] of Object.entries(obrigatorios)) {
      const campo = document.getElementById(id);
      if (!campo?.value.trim()) {
        alert(mensagem);
        campo?.focus();
        return false;
      }
    }
    return true;
  },

  addTitle: function(doc, y) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text("Plano de Ação - Programa Especial de Saúde do Rio Doce", 60, y);
  },

  addInitialInfo: function(doc, y) {
    doc.setFontSize(14);
    doc.text("Informações Iniciais", 60, y);
    y += 20;

    const fields = [
      { label: "Responsável", value: document.getElementById('responsavel').value },
      { label: "Cargo", value: document.getElementById('cargo').value },
      { label: "UF", value: document.getElementById('uf').value },
      { label: "Município", value: document.getElementById('municipio-select').value }
    ];

    return this.addFieldList(doc, y, fields);
  },

  addDiagnostico: function(doc, y) {
    doc.setFontSize(14);
    doc.text("Diagnóstico Situacional", 60, y);
    y += 20;

    const fields = [
      { label: "Perfil socioeconômico", value: document.getElementById('perfil-socio').value },
      { label: "Perfil epidemiológico", value: document.getElementById('perfil-epidemiologico').value },
      { label: "Estrutura da rede", value: document.getElementById('estrutura-rede').value }
    ];

    return this.addFieldList(doc, y, fields);
  },

  addEixos: function(doc, y) {
    document.querySelectorAll('.section').forEach(section => {
      y = this.addDivider(doc, y);
      
      const tituloEixo = section.querySelector('h2').textContent;
      doc.setFontSize(14);
      doc.text(tituloEixo, 60, y);
      y += 20;

      section.querySelectorAll('.accordion-item').forEach(acao => {
        const tituloAcao = acao.querySelector('.accordion-header').textContent;
        doc.setFontSize(12);
        doc.text(`• ${tituloAcao}`, 60, y);
        y += 15;

        acao.querySelectorAll('label').forEach(label => {
          const campo = label.nextElementSibling;
          const valor = campo.value || campo.textContent || 'Não preenchido';
          
          doc.setFontSize(10);
          doc.text(`${label.textContent.replace(':', '')}:`, 60, y);
          y += 10;
          
          const lines = doc.splitTextToSize(valor, 500);
          lines.forEach(line => {
            if (y > doc.internal.pageSize.height - 40) {
              doc.addPage();
              y = 60;
            }
            doc.text(70, y, line);
            y += 12;
          });
          y += 8;
        });
      });
    });
    
    return y;
  },

  addFieldList: function(doc, y, fields) {
    fields.forEach(field => {
      doc.setFontSize(10);
      doc.text(`${field.label}:`, 60, y);
      y += 10;
      
      const lines = doc.splitTextToSize(field.value || 'Não preenchido', 500);
      lines.forEach(line => {
        if (y > doc.internal.pageSize.height - 40) {
          doc.addPage();
          y = 60;
        }
        doc.text(70, y, line);
        y += 12;
      });
      y += 8;
    });
    
    return y;
  },

  addDivider: function(doc, y) {
    if (y > doc.internal.pageSize.height - 40) {
      doc.addPage();
      y = 60;
    }
    doc.setDrawColor(180);
    doc.line(60, y, doc.internal.pageSize.width - 60, y);
    return y + 20;
  }
};

document.addEventListener('DOMContentLoaded', () => PDFGenerator.init());