import { atsApi } from "../api/api";

export const analyzeJobMatch = async (
    resumeId,
    jobId
) => {

    const formData = new FormData();

    formData.append(
        "resumeId",
        String(resumeId)
    );

    formData.append(
        "jobId",
        String(jobId)
    );

    console.log(
        "========== JD MATCH REQUEST =========="
    );

    console.log(
        "Resume ID:",
        resumeId
    );

    console.log(
        "Job ID:",
        jobId
    );

    try {

        const response =
            await atsApi.post(
                "/job-match",
                formData
            );

        console.log(
            "========== JD MATCH RESPONSE =========="
        );

        console.log(
            response.data
        );

        return response.data;

    } catch (error) {

        console.error(
            "========== JD MATCH ERROR =========="
        );

        console.error(
            "Status:",
            error.response?.status
        );

        console.error(
            "Response:",
            error.response?.data
        );

        throw error;

    }

};