import { resumeApi } from "../api/api";

export const getMyResumes = async () => {
    const response = await resumeApi.get("/");
    return response.data;
};

export const deleteResume = async (resumeId) => {
    const response = await resumeApi.delete(
        `/${resumeId}`
    );

    return response.data;
};