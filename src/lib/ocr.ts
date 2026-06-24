import { createWorker } from "tesseract.js";
import path from "path";
// @ts-expect-error - legacy build has no types
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { createCanvas } from "canvas";

const workerPath = path.join(
  process.cwd(),
  "node_modules/tesseract.js/src/worker-script/node/index.js"
);

export async function extractTextFromImage(imageUrl: string): Promise<string> {
  const worker = await createWorker("eng", 1, { workerPath });

  try {
    const { data } = await worker.recognize(imageUrl);
    return data.text;
  } finally {
    await worker.terminate();
  }
}

export async function extractTextFromPdf(pdfUrl: string): Promise<string> {
  const response = await fetch(pdfUrl);
  const arrayBuffer = await response.arrayBuffer();
  const pdfData = new Uint8Array(arrayBuffer);

  const loadingTask = pdfjsLib.getDocument({ data: pdfData });
  const pdfDocument = await loadingTask.promise;

  const worker = await createWorker("eng", 1, { workerPath });
  let fullText = "";

  try {
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2 });

      const canvas = createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext("2d");

      await page.render({
        canvasContext: context as unknown as CanvasRenderingContext2D,
        viewport,
      }).promise;

      const imageBuffer = canvas.toBuffer("image/png");
      const { data } = await worker.recognize(imageBuffer);
      fullText += data.text + "\n\n";
    }
  } finally {
    await worker.terminate();
  }

  return fullText.trim();
}