import { useState } from "react";
import Navbar from "../../components/Nav";
import { atsApi } from "../../api/api";
import "../../styles/ATSAnalyzer.css";

const ATSAnalyzer = () => {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);


    const handleFileChange = (event) => {

        const selectedFile =
            event.target.files?.[0];

        setError("");
        setResult(null);

        if (!selectedFile) {
            setFile(null);
            return;
        }


        // PDF validation
        if (
            selectedFile.type !== "application/pdf" &&
            !selectedFile.name
                .toLowerCase()
                .endsWith(".pdf")
        ) {

            setFile(null);

            setError(
                "Only PDF files are allowed."
            );

            event.target.value = "";

            return;
        }


        // 10 MB validation
        if (
            selectedFile.size >
            10 * 1024 * 1024
        ) {

            setFile(null);

            setError(
                "Resume must be smaller than 10 MB."
            );

            event.target.value = "";

            return;
        }


        console.log(
            "Selected resume:",
            selectedFile
        );


        setFile(selectedFile);
    };


    const handleAnalyze = async () => {

        if (!file) {

            setError(
                "Please upload a PDF resume first."
            );

            return;
        }


        try {

            setLoading(true);
            setError("");
            setResult(null);


            const formData =
                new FormData();


            formData.append(
                "resume",
                file
            );


            console.log(
                "========== ATS REQUEST =========="
            );

            console.log(
                "File:",
                file.name
            );

            console.log(
                "Type:",
                file.type
            );

            console.log(
                "Size:",
                file.size
            );


            // Debug FormData
            for (
                const [key, value]
                of formData.entries()
            ) {

                console.log(
                    "FormData:",
                    key,
                    value
                );
            }


            const response =
                await atsApi.post(
                    "/analyze",
                    formData
                );


            console.log(
                "ATS RESPONSE:",
                response.data
            );


            setResult(
                response.data.data
            );


        } catch (error) {

            console.error(
                "ATS ANALYSIS ERROR:",
                error
            );


            console.error(
                "STATUS:",
                error.response?.status
            );


            console.error(
                "RESPONSE:",
                error.response?.data
            );


            setError(
                error.response?.data?.message ||
                "Failed to analyze resume."
            );


        } finally {

            setLoading(false);
        }
    };


    return (
        <>
            <Navbar />

            <main className="ats-analyzer-page">

                <div className="ats-analyzer-container">

                    <div className="ats-analyzer-header">

                        <h1>
                            Resume ATS Analyzer
                        </h1>

                        <p>
                            Upload your resume PDF
                            and check its ATS score.
                        </p>

                    </div>


                    {/* UPLOAD */}

                    <div className="ats-upload-card">

                        <label
                            htmlFor="resume-upload"
                            className="ats-upload-box"
                        >

                            <div className="upload-icon">
                                📄
                            </div>

                            <h2>
                                Upload Resume
                            </h2>

                            <p>
                                Select your resume PDF
                            </p>

                            <span>
                                PDF only · Max 10 MB
                            </span>

                        </label>


                        <input
                            id="resume-upload"
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={
                                handleFileChange
                            }
                            hidden
                        />


                        {/* SELECTED FILE */}

                        {file && (

                            <div className="selected-resume">

                                <div>

                                    <strong>
                                        {file.name}
                                    </strong>

                                    <p>
                                        {(
                                            file.size /
                                            1024 /
                                            1024
                                        ).toFixed(2)}
                                        {" "}MB
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setFile(null);
                                        setResult(null);
                                        setError("");
                                    }}
                                >
                                    Remove
                                </button>

                            </div>

                        )}


                        {/* ERROR */}

                        {error && (

                            <div className="ats-error">
                                {error}
                            </div>

                        )}


                        {/* ANALYZE */}

                        <button
                            type="button"
                            className="ats-analyze-btn"
                            disabled={
                                !file ||
                                loading
                            }
                            onClick={
                                handleAnalyze
                            }
                        >

                            {loading
                                ? "Analyzing Resume..."
                                : "Analyze Resume"
                            }

                        </button>

                    </div>


                    {/* RESULT */}

                    {result && (

                        <div className="ats-result">

                            <h2>
                                ATS Analysis
                            </h2>


                            {/* SCORE */}

                            <div className="ats-score-card">

                                <span>
                                    ATS Score
                                </span>

                                <strong>
                                    {Number(
                                        result.score?.final_score ??
                                        0
                                    ).toFixed(1)}
                                </strong>

                                <small>
                                    / 100
                                </small>

                            </div>


                            {/* SKILLS */}

                            <section className="ats-result-section">

                                <h3>
                                    Detected Skills
                                </h3>

                                {result.skills?.length > 0 ? (

                                    <div className="ats-tags">

                                        {result.skills.map(
                                            (skill, index) => (

                                                <span
                                                    key={index}
                                                >
                                                    {skill}
                                                </span>

                                            )
                                        )}

                                    </div>

                                ) : (

                                    <p>
                                        No technical skills
                                        detected.
                                    </p>

                                )}

                            </section>


                            {/* SECTIONS */}

                            <section className="ats-result-section">

                                <h3>
                                    Resume Sections
                                </h3>

                                <div className="ats-sections">

                                    {Object.entries(
                                        result.sections || {}
                                    ).map(
                                        ([name, exists]) => (

                                            <div
                                                key={name}
                                                className={
                                                    exists
                                                        ? "section-found"
                                                        : "section-missing"
                                                }
                                            >

                                                <span>
                                                    {exists
                                                        ? "✓"
                                                        : "✕"}
                                                </span>

                                                <strong>
                                                    {name}
                                                </strong>

                                            </div>

                                        )
                                    )}

                                </div>

                            </section>


                            {/* ISSUES */}

                            <section className="ats-result-section">

                                <h3>
                                    Issues
                                </h3>

                                {result.issues?.length > 0 ? (

                                    <ul>

                                        {result.issues.map(
                                            (issue, index) => (

                                                <li key={index}>
                                                    {issue}
                                                </li>

                                            )
                                        )}

                                    </ul>

                                ) : (

                                    <p>
                                        No major issues detected.
                                    </p>

                                )}

                            </section>


                            {/* SUGGESTIONS */}

                            <section className="ats-result-section">

                                <h3>
                                    Recommendations
                                </h3>

                                {result.suggestions?.length > 0 ? (

                                    <ol>

                                        {result.suggestions.map(
                                            (suggestion, index) => (

                                                <li key={index}>
                                                    {suggestion}
                                                </li>

                                            )
                                        )}

                                    </ol>

                                ) : (

                                    <p>
                                        No recommendations.
                                    </p>

                                )}

                            </section>

                        </div>

                    )}

                </div>

            </main>
        </>
    );
};


export default ATSAnalyzer;