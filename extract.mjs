import * as pdfjsLib from "pdfjs-dist";

async function extract() {
  const data = new Uint8Array(await Bun.file(process.argv[2]).arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    for (const item of content.items) {
      if ("str" in item) process.stdout.write(item.str + " ");
    }
    process.stdout.write("\n");
  }
}

extract();
