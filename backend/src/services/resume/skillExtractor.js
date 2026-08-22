const SKILLS = [
  // Languages
  "javascript",
  "typescript",
  "python",
  "java",
  "c",
  "c++",
  "c#",
  "php",
  "go",
  "rust",

  // Frontend
  "html",
  "css",
  "react",
  "react.js",
  "next.js",
  "nextjs",
  "redux",
  "redux toolkit",
  "tailwind",
  "bootstrap",
  "vite",
  "webpack",

  // Backend
  "node.js",
  "nodejs",
  "express",
  "express.js",
  "nestjs",
  "spring boot",
  "django",
  "flask",

  // Database
  "mongodb",
  "mysql",
  "postgresql",
  "postgres",
  "redis",
  "firebase",
  "sql",

  // DevOps / Cloud
  "docker",
  "kubernetes",
  "aws",
  "azure",
  "gcp",
  "linux",
  "nginx",
  "ci/cd",
  "github actions",

  // Tools
  "git",
  "github",
  "postman",
  "swagger",

  // AI
  "machine learning",
  "deep learning",
  "artificial intelligence",
  "ai",
  "llm",
  "rag",
  "langchain",
  "openai",
  "tensorflow",
  "pytorch",

  // Architecture / backend concepts
  "rest api",
  "restful api",
  "microservices",
  "socket.io",
  "jwt",
  "oauth",
  "redis",
];

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const extractSkills = (text) => {
  if (!text) {
    return [];
  }

  const normalizedText = text.toLowerCase();

  const foundSkills = new Set();

  for (const skill of SKILLS) {
    const escapedSkill = escapeRegex(skill);

    const regex = new RegExp(
      `(^|[^a-z0-9+#.])${escapedSkill}([^a-z0-9+#.]|$)`,
      "i"
    );

    if (regex.test(normalizedText)) {
      foundSkills.add(skill);
    }
  }

  return [...foundSkills].sort();
};

module.exports = {
  extractSkills,
  SKILLS,
};