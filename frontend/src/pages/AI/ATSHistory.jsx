import { useEffect, useState } from "react";
import { atsApi } from "../../api/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Nav";
import "../../styles/ATSHistory.css";

const ATSHistory = () => {

    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadHistory = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await atsApi.get("/history");

                console.log(
                    "ATS history:",
                    response.data
                );

                setHistory(
                    response.data.data || []
                );

            } catch (error) {

                console.error(
                    "ATS history error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load ATS history"
                );

            } finally {

                setLoading(false);

            }

        };

        loadHistory();

    }, []);


    const getScore = (analysis) => {

        return (
            analysis.score?.final_score ??
            analysis.score?.finalScore ??
            0
        );

    };


    if (loading) {

        return (
            <>
                <Navbar />

                <div className="ats-history-page">
                    <div className="ats-history-loading">
                        Loading ATS history...
                    </div>
                </div>
            </>
        );

    }


    return (
        <>
            <Navbar />

            <div className="ats-history-page">

                <div className="ats-history-header">

                    <div>
                        <h1>ATS Analysis History</h1>

                        <p>
                            Review your previous resume
                            and job match analyses.
                        </p>
                    </div>

                    <button
                        className="new-ats-btn"
                        onClick={() =>
                            navigate("/ai/ats")
                        }
                    >
                        New ATS Analysis
                    </button>

                </div>


                {error && (

                    <div className="ats-history-error">
                        {error}
                    </div>

                )}


                {!error && history.length === 0 && (

                    <div className="ats-empty">

                        <h2>
                            No ATS analyses yet
                        </h2>

                        <p>
                            Analyze your resume against
                            a job description to see the
                            result here.
                        </p>

                        <button
                            className="new-ats-btn"
                            onClick={() =>
                                navigate("/ai/ats")
                            }
                        >
                            Analyze Resume
                        </button>

                    </div>

                )}


                {history.length > 0 && (

                    <div className="ats-history-list">

                        {history.map((analysis) => {

                            const score =
                                getScore(analysis);

                            return (

                                <div
                                    className="ats-history-card"
                                    key={analysis._id}
                                >

                                    <div className="ats-card-main">

                                        <div>

                                            <h2>
                                                {analysis.resumeFileName ||
                                                    "Resume Analysis"}
                                            </h2>

                                            <p className="ats-job-title">
    {analysis.jobId?.title || "Job unavailable"}
</p>

<p className="ats-company">
    {analysis.jobId?.companyId?.companyName || "Company unavailable"}
</p>

                                            <p className="ats-date">
                                                {new Date(
                                                    analysis.createdAt
                                                ).toLocaleString()}
                                            </p>

                                        </div>


                                        <div
                                            className={`ats-score ${
                                                score >= 80
                                                    ? "score-high"
                                                    : score >= 60
                                                        ? "score-medium"
                                                        : "score-low"
                                            }`}
                                        >

                                            <strong>
                                                {Number(score).toFixed(1)}
                                            </strong>

                                            <span>
                                                / 100
                                            </span>

                                        </div>

                                    </div>


                                    <div className="ats-card-info">

                                        <div>
                                            <span>
                                                Matched Skills
                                            </span>

                                            <strong>
                                                {
                                                    analysis
                                                        .matchedSkills
                                                        ?.length || 0
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Missing Skills
                                            </span>

                                            <strong>
                                                {
                                                    analysis
                                                        .missingSkills
                                                        ?.length || 0
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Suggestions
                                            </span>

                                            <strong>
                                                {
                                                    analysis
                                                        .suggestions
                                                        ?.length || 0
                                                }
                                            </strong>
                                        </div>

                                    </div>


                                    <div className="ats-card-actions">

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/ai/ats/history/${analysis._id}`
                                                )
                                            }
                                        >
                                            View Analysis
                                        </button>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>
        </>
    );

};

export default ATSHistory;