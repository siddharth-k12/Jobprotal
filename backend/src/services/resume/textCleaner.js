const cleanResumeText = (text) => {
  if (!text) {
    return "";
  }

  let cleaned = text;

  // Normalize line breaks
  cleaned = cleaned.replace(/\r\n/g, "\n");
  cleaned = cleaned.replace(/\r/g, "\n");

  // Remove excessive spaces
  cleaned = cleaned.replace(/[ \t]+/g, " ");

  // Remove excessive blank lines
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  // Remove spaces around new lines
  cleaned = cleaned
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

  return cleaned.trim();
};

const getWordCount = (text) => {
  if (!text) {
    return 0;
  }

  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;
};

module.exports = {
  cleanResumeText,
  getWordCount,
};