import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Nav";

import {
    getMyResumes,
    deleteResume,
} from "../../services/resumeService";

import "../../styles/ResumeLibrary.css";

const ResumeLibrary = () => {

    const navigate = useNavigate();

    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {

        loadResumes();

    }, []);

    const loadResumes = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getMyResumes();

            setResumes(
                response.resumes || []
            );

        } catch (error) {

            console.error(
                "Resume library error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load resumes"
            );

        } finally {

            setLoading(false);

        }
    };

    const handleDelete = async (resumeId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this resume?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setDeletingId(resumeId);

            await deleteResume(resumeId);

            setResumes((previous) =>
                previous.filter(
                    (resume) =>
                        resume._id !== resumeId
                )
            );

        } catch (error) {

            console.error(
                "Delete resume error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete resume"
            );

        } finally {

            setDeletingId(null);

        }
    };

    const formatFileSize = (bytes) => {

        if (!bytes) {
            return "0 KB";
        }

        const mb =
            bytes / (1024 * 1024);

        if (mb >= 1) {
            return `${mb.toFixed(2)} MB`;
        }

        return `${(
            bytes / 1024
        ).toFixed(1)} KB`;
    };

    const formatDate = (date) => {

        return new Date(
            date
        ).toLocaleString();
    };

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="resume-library-page">
                    <div className="resume-library-loading">
                        Loading resumes...
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="resume-library-page">

                <div className="resume-library-header">

                    <div>
                        <h1>
                            My Resumes
                        </h1>

                        <p>
                            Manage your uploaded
                            resumes and run ATS analysis.
                        </p>
                    </div>

                    <button
                        className="resume-upload-btn"
                        onClick={() =>
                            navigate("resume")
                        }
                    >
                        Upload Resume
                    </button>

                </div>

                {error && (
                    <div className="resume-error">
                        {error}
                    </div>
                )}

                {!error &&
                    resumes.length === 0 && (

                        <div className="resume-empty">

                            <h2>
                                No resumes yet
                            </h2>

                            <p>
                                Upload your first resume
                                to get started.
                            </p>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/resume"
                                    )
                                }
                            >
                                Upload Resume
                            </button>

                        </div>
                    )}

                {resumes.length > 0 && (

                    <div className="resume-list">

                        {resumes.map(
                            (resume) => (

                                <div
                                    className="resume-card"
                                    key={resume._id}
                                >

                                    <div className="resume-card-info">

                                        <h2>
                                            {resume.fileName}
                                        </h2>

                                        <div className="resume-meta">

                                            <span>
                                                {formatFileSize(
                                                    resume.fileSize
                                                )}
                                            </span>

                                            <span>
                                                {resume.fileType}
                                            </span>

                                            <span>
                                                Uploaded{" "}
                                                {formatDate(
                                                    resume.createdAt
                                                )}
                                            </span>

                                        </div>

                                        <span
                                            className={`resume-status status-${resume.status}`}
                                        >
                                            {resume.status}
                                        </span>

                                    </div>

                                    <div className="resume-card-actions">

                                        <a
                                            href={
                                                resume.fileUrl
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            View
                                        </a>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/ai/ats?resumeId=${resume._id}`
                                                )
                                            }
                                        >
                                            ATS Analyze
                                        </button>

                                        <button
                                            className="delete-resume-btn"
                                            disabled={
                                                deletingId ===
                                                resume._id
                                            }
                                            onClick={() =>
                                                handleDelete(
                                                    resume._id
                                                )
                                            }
                                        >
                                            {deletingId ===
                                            resume._id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}

            </div>
        </>
    );
};

export default ResumeLibrary;