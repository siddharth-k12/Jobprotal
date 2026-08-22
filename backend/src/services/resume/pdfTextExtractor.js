const pdfParse = require("pdf-parse");

const extractPdfText = async (buffer) => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error("Invalid PDF buffer");
  }

  const data = await pdfParse(buffer);

  return {
    text: data.text || "",
    pages: data.n || 0,
    info: data.info || {},
  };
};

module.exports = extractPdfText;