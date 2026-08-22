const calculateAtsScore = ({
  sections,
  skills,
  wordCount,
  text,
}) => {
  let score = 0;

  const breakdown = {
    contact: 0,
    summary: 0,
    skills: 0,
    experience: 0,
    education: 0,
    projects: 0,
    formatting: 0,
  };

  // -----------------------------------------
  // Contact - 15 points
  // -----------------------------------------

  if (sections.contact) {
    breakdown.contact = 15;
    score += 15;
  }

  // -----------------------------------------
  // Summary - 10 points
  // -----------------------------------------

  if (sections.summary) {
    breakdown.summary = 10;
    score += 10;
  }

  // -----------------------------------------
  // Skills - 20 points
  // -----------------------------------------

  if (sections.skills) {
    breakdown.skills += 10;
  }

  if (skills.length >= 5) {
    breakdown.skills += 5;
  }

  if (skills.length >= 10) {
    breakdown.skills += 5;
  }

  score += breakdown.skills;

  // -----------------------------------------
  // Experience - 20 points
  // -----------------------------------------

  if (sections.experience) {
    breakdown.experience = 20;
    score += 20;
  }

  // -----------------------------------------
  // Education - 10 points
  // -----------------------------------------

  if (sections.education) {
    breakdown.education = 10;
    score += 10;
  }

  // -----------------------------------------
  // Projects - 15 points
  // -----------------------------------------

  if (sections.projects) {
    breakdown.projects = 15;
    score += 15;
  }

  // -----------------------------------------
  // Formatting / content quality - 10
  // -----------------------------------------

  if (wordCount >= 250 && wordCount <= 1200) {
    breakdown.formatting += 5;
  }

  // Avoid extremely short resume text
  if (text.length >= 1000) {
    breakdown.formatting += 5;
  }

  score += breakdown.formatting;

  return {
    score: Math.min(score, 100),
    breakdown,
  };
};

const generateSuggestions = ({
  sections,
  skills,
  wordCount,
}) => {
  const suggestions = [];

  if (!sections.contact) {
    suggestions.push(
      "Add a clear email address and phone number."
    );
  }

  if (!sections.summary) {
    suggestions.push(
      "Add a concise professional summary tailored to your target role."
    );
  }

  if (!sections.skills) {
    suggestions.push(
      "Add a dedicated technical skills section."
    );
  }

  if (skills.length < 5) {
    suggestions.push(
      "Add more relevant technical skills that match your target role."
    );
  }

  if (!sections.experience) {
    suggestions.push(
      "Add work experience, internship experience, or relevant professional experience."
    );
  }

  if (!sections.education) {
    suggestions.push(
      "Add your education details."
    );
  }

  if (!sections.projects) {
    suggestions.push(
      "Add relevant projects and describe your technical contribution."
    );
  }

  if (wordCount < 250) {
    suggestions.push(
      "The resume appears too short. Add relevant project, experience, and achievement details."
    );
  }

  if (wordCount > 1200) {
    suggestions.push(
      "The resume is quite long. Remove repetitive or low-value content."
    );
  }

  if (suggestions.length === 0) {
    suggestions.push(
      "Resume structure is strong. Tailor keywords and achievements to each job description."
    );
  }

  return suggestions;
};

const getMissingSections = (sections) => {
  const sectionLabels = {
    contact: "Contact information",
    summary: "Professional summary",
    skills: "Skills",
    experience: "Experience",
    education: "Education",
    projects: "Projects",
  };

  return Object.entries(sectionLabels)
    .filter(([key]) => !sections[key])
    .map(([, label]) => label);
};

module.exports = {
  calculateAtsScore,
  generateSuggestions,
  getMissingSections,
};