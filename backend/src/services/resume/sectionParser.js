const SECTION_PATTERNS = {
  summary: [
    "summary",
    "professional summary",
    "profile",
    "objective",
    "career objective",
    "professional profile",
  ],

  skills: [
    "skills",
    "technical skills",
    "core skills",
    "technical expertise",
    "technologies",
    "tech stack",
  ],

  experience: [
    "experience",
    "work experience",
    "professional experience",
    "employment",
    "work history",
  ],

  education: [
    "education",
    "academic background",
    "qualifications",
    "academic qualifications",
  ],

  projects: [
    "projects",
    "personal projects",
    "academic projects",
    "project experience",
  ],
};

const normalizeHeading = (line) => {
  return line
    .toLowerCase()
    .replace(/[:\-|]/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const detectSections = (text) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sections = {
    contact: false,
    summary: false,
    skills: false,
    experience: false,
    education: false,
    projects: false,
  };

  // -----------------------------------------
  // Contact detection
  // -----------------------------------------

  const emailRegex =
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

  const phoneRegex =
    /(?:\+91[\s-]?)?[6-9]\d{9}|\+?\d[\d\s-]{8,14}\d/;

  sections.contact =
    emailRegex.test(text) ||
    phoneRegex.test(text);

  // -----------------------------------------
  // Section detection
  // -----------------------------------------

  for (const line of lines) {
    const heading = normalizeHeading(line);

    for (const [section, patterns] of Object.entries(
      SECTION_PATTERNS
    )) {
      const found = patterns.some(
        (pattern) => heading === pattern
      );

      if (found) {
        sections[section] = true;
      }
    }
  }

  return sections;
};

const extractSections = (text) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const result = {
    summary: "",
    skills: "",
    experience: "",
    education: "",
    projects: "",
  };

  let currentSection = null;

  for (const line of lines) {
    const heading = normalizeHeading(line);

    let detectedSection = null;

    for (const [section, patterns] of Object.entries(
      SECTION_PATTERNS
    )) {
      if (patterns.includes(heading)) {
        detectedSection = section;
        break;
      }
    }

    if (detectedSection) {
      currentSection = detectedSection;
      continue;
    }

    if (currentSection) {
      result[currentSection] += `${line}\n`;
    }
  }

  return result;
};

module.exports = {
  detectSections,
  extractSections,
};