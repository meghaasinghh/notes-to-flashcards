import { createWorker } from "tesseract.js";
import path from "path";

export async function extractTextFromImage(imageUrl: string): Promise<string> {
  const worker = await createWorker("eng", 1, {
    workerPath: path.join(
      process.cwd(),
      "node_modules/tesseract.js/src/worker-script/node/index.js"
    ),
  });

  try {
    const { data } = await worker.recognize(imageUrl);
    return data.text;
  } finally {
    await worker.terminate();
  }
}