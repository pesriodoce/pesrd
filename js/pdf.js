const PDFGenerator = {
  init: function () {
    document.getElementById('generate-pdf')?.addEventListener('click', () => this.generatePDF());
  },

generatePDF: function () {
  if (!this.validateRequiredFields()) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'pt', 'a4');

  // Dados da sessão
  const uf = document.getElementById('uf').value || '';
  const municipio = document.getElementById('municipio-select').value || '';
  const dataGeracao = new Date().toLocaleDateString('pt-BR');

  // Inicial
  let y = 60;
  this.addTitle(doc, y);
  y += 40;

  y = this.addFieldSection(doc, y, "Informações Iniciais", [
    { label: "Responsável", value: document.getElementById('responsavel').value },
    { label: "Cargo", value: document.getElementById('cargo').value },
    { label: "UF", value: uf },
    { label: "Município", value: municipio }
  ]);

  y = this.addFieldSection(doc, y, "Diagnóstico Situacional", [
    { label: "Perfil socioeconômico", value: document.getElementById('perfil-socio').value },
    { label: "Perfil epidemiológico", value: document.getElementById('perfil-epidemiologico').value },
    { label: "Estrutura da rede", value: document.getElementById('estrutura-rede').value }
  ]);

  // Nova página paisagem para eixos
  doc.addPage('a4', 'landscape');
  this.addEixosTable(doc);

  // Rodapé e paginação em todas as páginas
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    this.addFooter(doc, i, totalPages, uf, municipio, dataGeracao);
  }

  // Nome do arquivo personalizado
  const nomeArquivo = `plano_${municipio.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.pdf`;
  doc.save(nomeArquivo);
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

addEixosTable: function (doc) {
  const eixos = document.querySelectorAll('.section');
  let y = 40;

  eixos.forEach(section => {
    const eixoTitulo = section.querySelector('h2')?.textContent || '';
    const rows = [];

    section.querySelectorAll('.accordion-item').forEach(item => {
      const getValue = (selector) => item.querySelector(selector)?.value || '';

      rows.push([
        getValue('.nome-acao'),
        getValue('textarea:nth-of-type(1)'), // Problema
        getValue('textarea:nth-of-type(2)'), // Descrição
        getValue('textarea:nth-of-type(3)'), // Objetivos
        getValue('input[type="text"]:nth-of-type(1)'), // Itens
        getValue('select'), // Tipo
        getValue('.masked-currency'), // Orçamento
        getValue('input[type="date"]:nth-of-type(1)'), // Início
        getValue('input[type="date"]:nth-of-type(2)'), // Fim
        getValue('input[type="text"]:nth-of-type(2)'), // Indicador
        getValue('input[type="text"]:nth-of-type(3)'), // Meta
        getValue('textarea:nth-of-type(4)') // Observações
      ]);
    });

    if (rows.length) {
      doc.setFontSize(12);
      doc.text(eixoTitulo, 40, y);
      y += 10;

      doc.autoTable({
        startY: y,
        head: [[
          'Nome da Ação',
          'Problema',
          'Descrição',
          'Objetivos',
          'Itens',
          'Tipo',
          'Orçamento',
          'Início',
          'Conclusão',
          'Indicador',
          'Meta',
          'Observações'
        ]],
        body: rows,
        margin: { left: 40, right: 40 },
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellWidth: 'wrap',
          overflow: 'linebreak',
          valign: 'top'
        },
        headStyles: { fillColor: [74, 104, 133] }
      });

      y = doc.lastAutoTable.finalY + 20;
    }
  });
}


addFooter: function (doc, pageNumber, totalPages, uf, municipio, data) {
  const isLandscape = doc.internal.pageSize.getOrientation() === 'landscape';
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFontSize(8);
  doc.setTextColor(100);

  // Rodapé à esquerda
  doc.text(`UF: ${uf} | Município: ${municipio}`, 40, pageHeight - 30);
  doc.text(`Data de geração: ${data}`, 40, pageHeight - 18);

  // Página à direita
  const pageText = `Página ${pageNumber} de ${totalPages}`;
  const textWidth = doc.getTextWidth(pageText);
  doc.text(pageText, pageWidth - 40 - textWidth, pageHeight - 18);
}
  
};

document.addEventListener('DOMContentLoaded', () => PDFGenerator.init());
