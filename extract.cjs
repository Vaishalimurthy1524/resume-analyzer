const PDFParser = require('pdf2json');
const fs = require('fs');
const path = process.argv[2];

const parser = new PDFParser();

parser.on("pdfParser_dataError", errData => console.error(errData.parserError));
parser.on("pdfParser_dataReady", pdfData => {
  let text = '';
  const pages = pdfData.Pages || [];
  pages.forEach(page => {
    const texts = page.Texts || [];
    texts.forEach(t => {
      try {
        text += decodeURIComponent(t.R[0].T) + ' ';
      } catch(e) {
        text += t.R[0].T + ' ';
      }
    });
    text += '\n';
  });
  console.log(text);
});

parser.loadPDF(path);
