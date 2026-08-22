const axios = require("axios");
const FormData = require("form-data");

const AI_SERVICE_URL =
    process.env.AI_SERVICE_URL ||
    "https://nexthire-ai-service.onrender.com";

const analyzeResumeWithAI = async (
    resumeBuffer,
    filename
) => {

    const formData = new FormData();

    formData.append(
        "file",
        resumeBuffer,
        {
            filename: filename || "resume.pdf",
            contentType: "application/pdf"
        }
    );

    console.log("========== RESUME ATS ==========");
    console.log("Filename:", filename);

    const response = await axios.post(
        `${AI_SERVICE_URL}/ats/analyze-pdf`,
        formData,
        {
            headers: {
                ...formData.getHeaders()
            },

            maxContentLength:
                10 * 1024 * 1024,

            maxBodyLength:
                10 * 1024 * 1024,

            timeout: 120000
        }
    );

    console.log(
        "AI ATS status:",
        response.status
    );

    return response.data;
};

module.exports = {
    analyzeResumeWithAI
};