const PDFGenerator = {
  init: function () {
    document.getElementById('generate-pdf')?.addEventListener('click', () => this.generatePDF());
  },

  generatePDF: function () {
    if (!this.validateRequiredFields()) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');
    let y = 60;

    this.addTitle(doc, y);
    y += 40;

    y = this.addFieldSection(doc, y, "Informações Iniciais", [
      { label: "Responsável", value: document.getElementById('responsavel').value },
      { label: "Cargo", value: document.getElementById('cargo').value },
      { label: "UF", value: document.getElementById('uf').value },
      { label: "Município", value: document.getElementById('municipio-select').value }
    ]);

    y = this.addFieldSection(doc, y, "Diagnóstico Situacional", [
      { label: "Perfil socioeconômico", value: document.getElementById('perfil-socio').value },
      { label: "Perfil epidemiológico", value: document.getElementById('perfil-epidemiologico').value },
      { label: "Estrutura da rede", value: document.getElementById('estrutura-rede').value }
    ]);

    y = this.addEixosTable(doc, y);

    doc.save(`plano_acao_${Date.now()}.pdf`);
  },

  validateRequiredFields: function () {
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

  addTitle: function (doc, y) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text("Plano de Ação - Programa Especial de Saúde do Rio Doce", 60, y);
  },

  addFieldSection: function (doc, y, titulo, fields) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(titulo, 60, y);
    y += 20;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    fields.forEach(field => {
      const lines = doc.splitTextToSize(`${field.label}: ${field.value || 'Não preenchido'}`, 480);
      lines.forEach(line => {
        if (y > 780) {
          doc.addPage();
          y = 60;
        }
        doc.text(line, 60, y);
        y += 12;
      });
      y += 5;
    });

    return y + 10;
  },

addEixosTable: function (doc, y) {
  // Inicia uma nova página em paisagem
  doc.addPage('a4', 'landscape');
  y = 40;

  document.querySelectorAll('.section').forEach(section => {
    const eixoTitulo = section.querySelector('h2')?.textContent || '';
    const rows = [];

    section.querySelectorAll('.accordion-item').forEach(item => {
      const nome = item.querySelector('.nome-acao')?.value || 'Sem título';
      const descricao = item.querySelector('textarea:nth-of-type(2)')?.value || '';
      const tipo = item.querySelector('select')?.value || '';
      const orcamento = item.querySelector('.masked-currency')?.value || '';
      const inicio = item.querySelector('input[type="date"]:nth-of-type(1)')?.value || '';
      const fim = item.querySelector('input[type="date"]:nth-of-type(2)')?.value || '';

      rows.push([nome, descricao, tipo, orcamento, `${inicio} a ${fim}`]);
    });

    if (rows.length) {
      doc.setFontSize(12);
      doc.text(eixoTitulo, 40, y);
      y += 10;

      doc.autoTable({
        startY: y,
        head: [['Nome da Ação', 'Descrição', 'Tipo', 'Orçamento', 'Período']],
        body: rows,
        margin: { left: 40, right: 40 },
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 4,
          overflow: 'linebreak'
        },
        headStyles: { fillColor: [74, 104, 133] }
      });

      y = doc.lastAutoTable.finalY + 20;
    }
  });

  return y;
}
};

document.addEventListener('DOMContentLoaded', () => PDFGenerator.init());
