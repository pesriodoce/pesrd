function formatarMesAno(valor) {
  if (!valor || !valor.includes('-')) return '';
  const [ano, mes] = valor.split('-');
  return `${mes}/${ano}`;
}

const PDFGenerator = {
  generatePDF: function () {
    console.log("→ Executando generatePDF");

    if (!this.validateRequiredFields()) {
      console.log("→ Campos obrigatórios não preenchidos");
      return;
    }

    const jsPDF = window.jspdf?.jsPDF;
    if (!jsPDF) {
      alert("Erro: jsPDF não foi carregado corretamente.");
      return;
    }

    const doc = new jsPDF('p', 'pt', 'a4');

    const uf = document.getElementById('uf').value || '';
    const municipio = document.getElementById('municipio-select').value || '';
    const responsavel = document.getElementById('responsavel').value || '';
    const cargo = document.getElementById('cargo').value || '';
    const telefone = document.getElementById('telefone')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const dataGeracao = new Date().toLocaleDateString('pt-BR');

    let y = 60;
    this.addTitle(doc, y);
    y += 40;

    y = this.addFieldSection(doc, y, "Informações Iniciais", [
      { label: "Responsável pelo documento", value: responsavel },
      { label: "Cargo", value: cargo },
      { label: "Telefone", value: telefone },
      { label: "E-mail", value: email },
      { label: "UF", value: uf },
      { label: "Município", value: municipio }
    ]);

    y = this.addFieldSection(doc, y, "Diagnóstico Situacional de Saúde", [
      { label: "Perfil socioeconômico", value: document.getElementById('perfil-socio').value },
      { label: "Perfil epidemiológico", value: document.getElementById('perfil-epidemiologico').value },
      { label: "Estrutura da rede", value: document.getElementById('estrutura-rede').value }
    ], true);

    doc.addPage('a4', 'landscape');
    this.addEixosTable(doc);

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      this.addFooter(doc, i, totalPages, uf, municipio, dataGeracao);
    }

    const nomeArquivo = `plano_${municipio.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.pdf`;
    doc.save(nomeArquivo);
  },

validateRequiredFields: function () {
  // Validação dos campos fixos
  const camposObrigatorios = [
    { id: 'responsavel', msg: 'Preencha o responsável pelo documento!' },
    { id: 'cargo', msg: 'Preencha o cargo!' },
    { id: 'telefone', msg: 'Preencha o telefone!' },
    { id: 'email', msg: 'Preencha o e-mail!' },
    { id: 'uf', msg: 'Selecione a UF!' },
    { id: 'municipio-select', msg: 'Selecione o município!' },
    { id: 'perfil-socio', msg: 'Preencha o perfil socioeconômico!' },
    { id: 'perfil-epidemiologico', msg: 'Preencha o perfil epidemiológico!' },
    { id: 'estrutura-rede', msg: 'Preencha a estrutura da rede de saúde!' }
  ];

  for (const campo of camposObrigatorios) {
    const el = document.getElementById(campo.id);
    if (!el || !el.value.trim()) {
      alert(campo.msg);
      el?.focus();
      return false;
    }
  }

  // Validação das ações criadas
  const camposAcaoObrigatorios = [
    { selector: '.nome-acao', nome: 'Nome da ação' },
    { selector: '.problema', nome: 'Identificação do problema' },
    { selector: '.descricao', nome: 'Descrição da ação' },
    { selector: '.objetivos', nome: 'Objetivos' },
    { selector: '.itens', nome: 'Itens previstos' },
    { selector: '.tipo', nome: 'Tipo da ação' },
    { selector: '.masked-currency', nome: 'Orçamento previsto' },
    { selector: '.inicio', nome: 'Data de início' },
    { selector: '.fim', nome: 'Data de conclusão' },
    { selector: '.indicador', nome: 'Indicador' },
    { selector: '.meta', nome: 'Meta' }
    // Observações não entram aqui
  ];

  const acoes = document.querySelectorAll('.accordion-item');
  for (const acao of acoes) {
    for (const campo of camposAcaoObrigatorios) {
      const el = acao.querySelector(campo.selector);
      if (!el || !el.value.trim()) {
        alert(`Preencha o campo "${campo.nome}" em uma das ações.`);
        el?.focus();
        return false;
      }
    }
  }

  return true;
},

  addTitle: function (doc, y) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text("Plano de Ação - Programa Especial de Saúde do Rio Doce", 60, y);
  },

addFieldSection: function (doc, y, titulo, fields, justificar = false) {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(titulo, 60, y);
  y += 20;

  doc.setFontSize(10);

  fields.forEach(field => {
    const label = `${field.label}:`;
    const value = field.value || "Não preenchido";
    const textWidth = doc.getTextWidth(label);
    const valueLines = doc.splitTextToSize(value, 440);

    // Nome do campo em negrito
    doc.setFont('helvetica', 'bold');
    doc.text(label, 60, y);
    y += 14;

    // Valor justificado em fonte normal
    doc.setFont('helvetica', 'normal');
    valueLines.forEach(line => {
      if (y > 780) {
        doc.addPage();
        y = 60;
      }
      doc.text(line, 60, y); // evitar justificar diretamente
      y += 12;
    });

    y += 10;
  });

  return y + 10;
},

  addEixosTable: function (doc) {
    const eixos = document.querySelectorAll('.eixo-dinamico');
    let y = 40;

    eixos.forEach(section => {
      const eixoTitulo = section.querySelector('h2')?.textContent || '';
      const rows1 = [];
      const rows2 = [];

      section.querySelectorAll('.accordion-item').forEach(item => {
        const get = (selector) => item.querySelector(selector)?.value?.trim() || '';

        rows1.push([
          get('.nome-acao'),
          get('.problema'),
          get('.descricao'),
          get('.objetivos'),
          get('.observacoes')
        ]);

        rows2.push([
          get('.nome-acao'),
          get('.itens'),
          get('.tipo'),
          get('.masked-currency'),
          formatarMesAno(get('.inicio')),
          formatarMesAno(get('.fim')),
          get('.indicador'),
          get('.meta')
        ]);
      });

      if (rows1.length) {
        doc.setFontSize(12);
        doc.text(eixoTitulo, 40, y);
        y += 10;

        doc.autoTable({
          startY: y,
          head: [[
            'Nome da Ação', 'Identificação do Problema', 'Descrição da ação',
            'Objetivos', 'Observações'
          ]],
          body: rows1,
          margin: { left: 40, right: 40 },
          theme: 'grid',
          styles: {
            fontSize: 8,
            overflow: 'linebreak',
            valign: 'top'
          },
            columnStyles: {
            0: { cellWidth: 120 },
            1: { cellWidth: 170 },
            2: { cellWidth: 170 },
            3: { cellWidth: 150 },
            4: { cellWidth: 150 }
          },
          headStyles: { fillColor: [74, 104, 133] }
        });

        y = doc.lastAutoTable.finalY + 20;

        doc.autoTable({
          startY: y,
          head: [[
            'Nome da Ação', 'Itens previstos', 'Tipo da ação', 'Orçamento',
            'Data de início', 'Data de conclusão',
            'Indicador', 'Meta'
          ]],
          body: rows2,
          margin: { left: 40, right: 40 },
          theme: 'grid',
          styles: {
            fontSize: 8,
            overflow: 'linebreak',
            valign: 'top'
          },
            columnStyles: {
            0: { cellWidth: 120 },
            1: { cellWidth: 110 },
            2: { cellWidth: 60 },
            3: { cellWidth: 70 },
            4: { cellWidth: 80 },
            5: { cellWidth: 80 },
            6: { cellWidth: 120 },
            7: { cellWidth: 120 }
          },
          headStyles: { fillColor: [74, 104, 133] }
        });

        y = doc.lastAutoTable.finalY + 20;
      }
    });
  },

  addFooter: function (doc, pageNumber, totalPages, uf, municipio, data) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`UF: ${uf} | Município: ${municipio}`, 40, pageHeight - 30);
    doc.text(`Data de geração: ${data}`, 40, pageHeight - 18);

    const pageText = `Página ${pageNumber} de ${totalPages}`;
    const textWidth = doc.getTextWidth(pageText);
    doc.text(pageText, pageWidth - 40 - textWidth, pageHeight - 18);
  }
};

window.addEventListener('load', () => {
  const jsPDFReady = window.jspdf?.jsPDF;
  if (!jsPDFReady) {
    console.error("jsPDF ainda não disponível.");
    return;
  }

  const btn = document.getElementById('generate-pdf');
  if (!btn) {
    console.error("Botão 'generate-pdf' não encontrado.");
    return;
  }

  btn.addEventListener('click', () => {
    console.log("Botão clicado, tentando gerar PDF...");
    PDFGenerator.generatePDF();
  });
});
