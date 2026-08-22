import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { atsApi } from "../../api/api";
import Navbar from "../../components/Nav";
import "../../styles/ATSAnalysisDetails.css";

const ATSAnalysisDetails = () => {

    const { analysisId } = useParams();
    const navigate = useNavigate();

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);


    // =========================================
    // LOAD ANALYSIS
    // =========================================

    useEffect(() => {

        const loadAnalysis = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await atsApi.get(
                    `/history/${analysisId}`
                );

                console.log(
                    "ATS analysis details:",
                    response.data
                );

                setAnalysis(
                    response.data?.data || null
                );

            } catch (error) {

                console.error(
                    "Analysis details error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load analysis"
                );

            } finally {

                setLoading(false);

            }

        };

        if (analysisId) {
            loadAnalysis();
        }

    }, [analysisId]);


    // =========================================
    // DELETE ANALYSIS
    // =========================================

    const handleDelete = async () => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this ATS analysis?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setDeleting(true);
            setError("");

            console.log(
                "Deleting ATS analysis:",
                analysisId
            );

            const response = await atsApi.delete(
                `/history/${analysisId}`
            );

            console.log(
                "Delete response:",
                response.data
            );

            // Go back to history after successful delete
            navigate("/ai/ats/history");

        } catch (error) {

            console.error(
                "Delete ATS analysis error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete ATS analysis"
            );

        } finally {

            setDeleting(false);

        }

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="ats-details-page">

                    <div className="ats-details-loading">
                        Loading analysis...
                    </div>

                </div>
            </>
        );

    }


    // =========================================
    // ERROR
    // =========================================

    if (error || !analysis) {

        return (
            <>
                <Navbar />

                <div className="ats-details-page">

                    <div className="ats-details-error">
                        {error || "Analysis not found"}
                    </div>

                    <button
                        className="back-btn"
                        onClick={() =>
                            navigate("/ai/ats/history")
                        }
                    >
                        ← Back to History
                    </button>

                </div>
            </>
        );

    }


    // =========================================
    // SCORE DATA
    // =========================================

    const score =
        Number(
            analysis.score?.final_score ??
            analysis.score?.finalScore ??
            0
        );

    const skillScore =
        Number(
            analysis.score?.skill_score ??
            analysis.score?.skillScore ??
            0
        );

    const projectScore =
        Number(
            analysis.score?.project_score ??
            analysis.score?.projectScore ??
            0
        );

    const experienceScore =
        Number(
            analysis.score?.experience_score ??
            analysis.score?.experienceScore ??
            0
        );


    // =========================================
    // JOB DATA
    // =========================================

    const job = analysis.jobId;

    const companyName =
        job?.companyId?.companyName ||
        "Company unavailable";

    const jobTitle =
        job?.title ||
        "Job unavailable";

    const jobDescription =
        job?.description ||
        "Job description unavailable.";

    const jobType =
        job?.jobType ||
        "Not specified";

    const location =
        job?.location ||
        "Location not specified";

    const salaryRange =
        job?.salaryRange ||
        "Not specified";


    // =========================================
    // UI
    // =========================================

    return (
        <>
            <Navbar />

            <main className="ats-details-page">

                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <div className="ats-details-header">

                    <button
                        className="back-btn"
                        onClick={() =>
                            navigate("/ai/ats/history")
                        }
                    >
                        ← Back to History
                    </button>

                    <div className="ats-details-title">

                        <h1>
                            ATS Analysis
                        </h1>

                        <p>
                            {analysis.resumeFileName ||
                                "Resume Analysis"}
                        </p>

                    </div>

                </div>


                {/* ================================= */}
                {/* JOB INFORMATION */}
                {/* ================================= */}

                <section className="ats-detail-section ats-job-section">

                    <div className="section-heading">

                        <h2>
                            Job Information
                        </h2>

                    </div>


                    <div className="ats-job-header">

                        <div>

                            <h3>
                                {jobTitle}
                            </h3>

                            <p className="ats-company-name">
                                {companyName}
                            </p>

                        </div>

                    </div>


                    <div className="ats-job-meta">

                        <div className="ats-job-meta-item">

                            <span>
                                Job Type
                            </span>

                            <strong>
                                {jobType}
                            </strong>

                        </div>


                        <div className="ats-job-meta-item">

                            <span>
                                Location
                            </span>

                            <strong>
                                {location}
                            </strong>

                        </div>


                        <div className="ats-job-meta-item">

                            <span>
                                Salary
                            </span>

                            <strong>
                                {salaryRange}
                            </strong>

                        </div>

                    </div>


                    <div className="ats-job-description">

                        <h3>
                            Job Description
                        </h3>

                        <p>
                            {jobDescription}
                        </p>

                    </div>

                </section>


                {/* ================================= */}
                {/* MAIN SCORE */}
                {/* ================================= */}

                <section className="ats-score-section">

                    <div className="big-score">

                        <strong>
                            {score.toFixed(1)}
                        </strong>

                        <span>
                            / 100
                        </span>

                    </div>


                    <div className="ats-score-content">

                        <h2>
                            ATS Match Score
                        </h2>

                        <p>
                            Your resume compatibility with
                            this job based on skills, projects,
                            experience and job requirements.
                        </p>

                    </div>

                </section>


                {/* ================================= */}
                {/* SCORE BREAKDOWN */}
                {/* ================================= */}

                <section className="ats-detail-section">

                    <h2>
                        Score Breakdown
                    </h2>

                    <div className="score-grid">

                        <div className="score-card">

                            <span>
                                Skill Score
                            </span>

                            <strong>
                                {skillScore.toFixed(1)}%
                            </strong>

                        </div>


                        <div className="score-card">

                            <span>
                                Project Score
                            </span>

                            <strong>
                                {projectScore.toFixed(1)}%
                            </strong>

                        </div>


                        <div className="score-card">

                            <span>
                                Experience Score
                            </span>

                            <strong>
                                {experienceScore.toFixed(1)}%
                            </strong>

                        </div>

                    </div>

                </section>


                {/* ================================= */}
                {/* MATCHED SKILLS */}
                {/* ================================= */}

                <section className="ats-detail-section">

                    <h2>
                        Matched Skills
                    </h2>

                    <div className="tag-list">

                        {analysis.matchedSkills?.length > 0 ? (

                            analysis.matchedSkills.map(
                                (skill, index) => (

                                    <span key={index}>
                                        {skill}
                                    </span>

                                )
                            )

                        ) : (

                            <p>
                                No matched skills found.
                            </p>

                        )}

                    </div>

                </section>


                {/* ================================= */}
                {/* MISSING SKILLS */}
                {/* ================================= */}

                <section className="ats-detail-section">

                    <h2>
                        Missing Skills
                    </h2>

                    <div className="tag-list">

                        {analysis.missingSkills?.length > 0 ? (

                            analysis.missingSkills.map(
                                (skill, index) => (

                                    <span key={index}>
                                        {skill}
                                    </span>

                                )
                            )

                        ) : (

                            <p>
                                No missing skills found.
                            </p>

                        )}

                    </div>

                </section>


                {/* ================================= */}
                {/* SEMANTIC MATCHES */}
                {/* ================================= */}

                {analysis.semanticMatches?.length > 0 && (

                    <section className="ats-detail-section">

                        <h2>
                            Semantic Matches
                        </h2>

                        <ul>

                            {analysis.semanticMatches.map(
                                (item, index) => (

                                    <li key={index}>
                                        {item}
                                    </li>

                                )
                            )}

                        </ul>

                    </section>

                )}


                {/* ================================= */}
                {/* PROJECT RELEVANCE */}
                {/* ================================= */}

                <section className="ats-detail-section">

                    <h2>
                        Project Relevance
                    </h2>

                    {analysis.projectRelevance?.length > 0 ? (

                        <ul>

                            {analysis.projectRelevance.map(
                                (item, index) => (

                                    <li key={index}>
                                        {item}
                                    </li>

                                )
                            )}

                        </ul>

                    ) : (

                        <p>
                            No project relevance data available.
                        </p>

                    )}

                </section>


                {/* ================================= */}
                {/* EXPERIENCE RELEVANCE */}
                {/* ================================= */}

                <section className="ats-detail-section">

                    <h2>
                        Experience Relevance
                    </h2>

                    {analysis.experienceRelevance?.length > 0 ? (

                        <ul>

                            {analysis.experienceRelevance.map(
                                (item, index) => (

                                    <li key={index}>
                                        {item}
                                    </li>

                                )
                            )}

                        </ul>

                    ) : (

                        <p>
                            No experience relevance data available.
                        </p>

                    )}

                </section>


                {/* ================================= */}
                {/* STRENGTHS */}
                {/* ================================= */}

                <section className="ats-detail-section">

                    <h2>
                        Strengths
                    </h2>

                    {analysis.strengths?.length > 0 ? (

                        <ul>

                            {analysis.strengths.map(
                                (item, index) => (

                                    <li key={index}>
                                        {item}
                                    </li>

                                )
                            )}

                        </ul>

                    ) : (

                        <p>
                            No strengths available.
                        </p>

                    )}

                </section>


                {/* ================================= */}
                {/* SUGGESTIONS */}
                {/* ================================= */}

                <section className="ats-detail-section">

                    <h2>
                        Resume Improvement Suggestions
                    </h2>

                    {analysis.suggestions?.length > 0 ? (

                        <ol>

                            {analysis.suggestions.map(
                                (item, index) => (

                                    <li key={index}>
                                        {item}
                                    </li>

                                )
                            )}

                        </ol>

                    ) : (

                        <p>
                            No suggestions available.
                        </p>

                    )}

                </section>


                {/* ================================= */}
                {/* DELETE ERROR */}
                {/* ================================= */}

                {error && (

                    <div className="ats-details-error">
                        {error}
                    </div>

                )}


                {/* ================================= */}
                {/* FOOTER ACTIONS */}
                {/* ================================= */}

                <div className="ats-details-footer">

                    <button
                        className="back-btn"
                        onClick={() =>
                            navigate("/ai/ats/history")
                        }
                    >
                        ← Back to ATS History
                    </button>


                    <button
                        className="delete-btn"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting
                            ? "Deleting..."
                            : "Delete Analysis"}
                    </button>

                </div>

            </main>
        </>
    );
};

export default ATSAnalysisDetails;