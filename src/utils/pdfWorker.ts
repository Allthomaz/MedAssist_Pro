import * as pdfjsLib from 'pdfjs-dist';

// Configurar o worker do PDF.js para funcionar com Vite
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export { pdfjsLib };