import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useSearchParams
} from "react-router-dom";

import Navbar from "../../components/Nav";

import {
    jobApi,
    resumeApi
} from "../../api/api";

import {
    analyzeJobMatch
} from "../../services/atsService";

import "../../styles/JDMatchAnalyzer.css";


const JDMatchAnalyzer = () => {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    // =====================================================
    // JOB ID FROM URL
    // =====================================================

    const jobIdFromUrl =
        searchParams.get("jobId");


    // =====================================================
    // STATE
    // =====================================================

    const [resumes, setResumes] =
        useState([]);

    const [jobs, setJobs] =
        useState([]);

    const [selectedResume, setSelectedResume] =
        useState("");

    const [selectedJob, setSelectedJob] =
        useState(jobIdFromUrl || "");

    const [loading, setLoading] =
        useState(true);

    const [analyzing, setAnalyzing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [result, setResult] =
        useState(null);


    // =====================================================
    // LOAD RESUMES + JOBS
    // =====================================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setError("");

                const [
                    resumeResponse,
                    jobResponse
                ] = await Promise.all([

                    resumeApi.get("/"),

                    jobApi.get("/")

                ]);


                console.log(
                    "RESUME RESPONSE:",
                    resumeResponse.data
                );

                console.log(
                    "JOB RESPONSE:",
                    jobResponse.data
                );


                // =================================================
                // RESUMES
                // =================================================

                const resumeList =
                    resumeResponse.data?.resumes ||
                    resumeResponse.data?.data ||
                    [];


                // =================================================
                // JOBS
                // =================================================

                const jobList =
                    jobResponse.data?.jobs ||
                    jobResponse.data?.data ||
                    [];


                const safeResumeList =
                    Array.isArray(resumeList)
                        ? resumeList
                        : [];


                const safeJobList =
                    Array.isArray(jobList)
                        ? jobList
                        : [];


                setResumes(
                    safeResumeList
                );

                setJobs(
                    safeJobList
                );


                // =================================================
                // AUTOMATIC JOB SELECTION
                // =================================================

                if (jobIdFromUrl) {

                    const matchingJob =
                        safeJobList.find(
                            (job) =>
                                String(job._id) ===
                                String(jobIdFromUrl)
                        );


                    if (matchingJob) {

                        console.log(
                            "Automatically selected job:",
                            matchingJob.title
                        );

                        setSelectedJob(
                            String(
                                matchingJob._id
                            )
                        );

                    } else {

                        console.warn(
                            "Job from URL not found:",
                            jobIdFromUrl
                        );

                        setSelectedJob("");

                    }

                }

            } catch (error) {

                console.error(
                    "JD Match data loading error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    error.response?.data?.detail ||
                    "Failed to load resumes and jobs"
                );

            } finally {

                setLoading(false);

            }

        };


        loadData();

    }, [jobIdFromUrl]);


    // =====================================================
    // SELECTED RESUME
    // =====================================================

    const selectedResumeData =
        resumes.find(
            (resume) =>
                String(resume._id) ===
                String(selectedResume)
        );


    // =====================================================
    // SELECTED JOB
    // =====================================================

    const selectedJobData =
        jobs.find(
            (job) =>
                String(job._id) ===
                String(selectedJob)
        );


    // =====================================================
    // NORMALIZE AI RESPONSE
    // =====================================================

    const normalizeAnalysis = (response) => {

        console.log(
            "RAW AI RESPONSE:",
            response
        );


        /*
            Supported response formats:

            1.

            {
                success: true,
                data: {
                    score: {},
                    matched_skills: [],
                    missing_skills: []
                }
            }


            2.

            {
                success: true,
                score: {},
                matched_skills: []
            }
        */


        let analysis =
            response?.data ||
            response;


        /*
            Some Axios/service implementations may
            return another nested data object.
        */

        if (
            analysis?.data &&
            typeof analysis.data === "object" &&
            !analysis.score
        ) {

            analysis =
                analysis.data;

        }


        if (
            !analysis ||
            typeof analysis !== "object"
        ) {

            throw new Error(
                "Invalid ATS analysis data"
            );

        }


        /*
            Do not fail immediately if score is missing.

            We normalize it to zero so the frontend
            can display the backend response instead
            of crashing.
        */

        const rawScore =
            analysis.score &&
            typeof analysis.score === "object"
                ? analysis.score
                : {};


        return {

            ...analysis,


            // =================================================
            // SCORE
            // =================================================

            score: {

                ...rawScore,

                final_score:
                    Number(
                        rawScore.final_score ??
                        rawScore.finalScore ??
                        0
                    ),

                skill_score:
                    Number(
                        rawScore.skill_score ??
                        rawScore.skillScore ??
                        0
                    ),

                project_score:
                    Number(
                        rawScore.project_score ??
                        rawScore.projectScore ??
                        0
                    ),

                experience_score:
                    Number(
                        rawScore.experience_score ??
                        rawScore.experienceScore ??
                        0
                    ),

                education_score:
                    Number(
                        rawScore.education_score ??
                        rawScore.educationScore ??
                        0
                    )

            },


            // =================================================
            // MATCHED SKILLS
            // =================================================

            matchedSkills:

                Array.isArray(
                    analysis.matched_skills
                )
                    ? analysis.matched_skills
                    : Array.isArray(
                        analysis.matchedSkills
                    )
                        ? analysis.matchedSkills
                        : [],


            // =================================================
            // MISSING SKILLS
            // =================================================

            missingSkills:

                Array.isArray(
                    analysis.missing_skills
                )
                    ? analysis.missing_skills
                    : Array.isArray(
                        analysis.missingSkills
                    )
                        ? analysis.missingSkills
                        : [],


            // =================================================
            // SEMANTIC MATCHES
            // =================================================

            semanticMatches:

                Array.isArray(
                    analysis.semantic_matches
                )
                    ? analysis.semantic_matches
                    : Array.isArray(
                        analysis.semanticMatches
                    )
                        ? analysis.semanticMatches
                        : [],


            // =================================================
            // PROJECT RELEVANCE
            // =================================================

            projectRelevance:

                Array.isArray(
                    analysis.project_relevance
                )
                    ? analysis.project_relevance
                    : Array.isArray(
                        analysis.projectRelevance
                    )
                        ? analysis.projectRelevance
                        : [],


            // =================================================
            // EXPERIENCE RELEVANCE
            // =================================================

            experienceRelevance:

                Array.isArray(
                    analysis.experience_relevance
                )
                    ? analysis.experience_relevance
                    : Array.isArray(
                        analysis.experienceRelevance
                    )
                        ? analysis.experienceRelevance
                        : [],


            // =================================================
            // STRENGTHS
            // =================================================

            strengths:

                Array.isArray(
                    analysis.strengths
                )
                    ? analysis.strengths
                    : [],


            // =================================================
            // SUGGESTIONS
            // =================================================

            suggestions:

                Array.isArray(
                    analysis.suggestions
                )
                    ? analysis.suggestions
                    : []

        };

    };


    // =====================================================
    // ANALYZE JOB MATCH
    // =====================================================

    const handleAnalyze = async () => {

        if (!selectedResume) {

            setError(
                "Please select a resume"
            );

            return;

        }


        if (!selectedJob) {

            setError(
                "Please select a job"
            );

            return;

        }


        try {

            setAnalyzing(true);

            setError("");

            setResult(null);


            console.log(
                "================================="
            );

            console.log(
                "JD MATCH ANALYZER"
            );

            console.log(
                "Resume ID:",
                selectedResume
            );

            console.log(
                "Job ID:",
                selectedJob
            );

            console.log(
                "================================="
            );


            const response =
                await analyzeJobMatch(
                    selectedResume,
                    selectedJob
                );


            console.log(
                "========== RAW RESPONSE =========="
            );

            console.log(
                response
            );


            // =================================================
            // NORMALIZE
            // =================================================

            const analysis =
                normalizeAnalysis(
                    response
                );


            console.log(
                "========== NORMALIZED ANALYSIS =========="
            );

            console.log(
                analysis
            );


            setResult(
                analysis
            );

        } catch (error) {

            console.error(
                "================================="
            );

            console.error(
                "JD MATCH ERROR"
            );

            console.error(
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "BACKEND RESPONSE:",
                error.response?.data
            );

            console.error(
                "================================="
            );


            setError(

                error.response?.data?.message ||

                error.response?.data?.detail ||

                error.message ||

                "JD match analysis failed"

            );

        } finally {

            setAnalyzing(false);

        }

    };


    // =====================================================
    // SCORE
    // =====================================================

    const score =
        Number(
            result?.score?.final_score || 0
        );


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <>

                <Navbar />

                <main className="jd-match-page">

                    <div className="jd-match-container">

                        <div className="jd-match-loading">

                            Loading JD Match Analyzer...

                        </div>

                    </div>

                </main>

            </>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <>

            <Navbar />


            <main className="jd-match-page">

                <div className="jd-match-container">


                    {/* =========================================
                        HEADER
                    ========================================= */}

                    <header className="jd-match-header">

                        <span>
                            AI CAREER TOOL
                        </span>


                        <h1>
                            Job Match Analyzer
                        </h1>


                        <p>
                            Compare your resume with a job
                            and understand how well your
                            profile matches the role.
                        </p>

                    </header>


                    {/* =========================================
                        SELECTOR CARD
                    ========================================= */}

                    <section className="jd-match-card">


                        {/* =====================================
                            RESUME
                        ===================================== */}

                        <div className="jd-field">

                            <label>
                                Select Resume
                            </label>


                            <select
                                value={selectedResume}
                                onChange={(event) => {

                                    setSelectedResume(
                                        event.target.value
                                    );

                                    setError("");

                                }}
                            >

                                <option value="">
                                    Choose a resume
                                </option>


                                {resumes.map(
                                    (resume) => (

                                        <option
                                            key={resume._id}
                                            value={resume._id}
                                        >

                                            {
                                                resume.fileName ||
                                                "Resume"
                                            }

                                        </option>

                                    )
                                )}

                            </select>


                            {resumes.length === 0 && (

                                <div className="field-help">

                                    <span>
                                        You don't have any
                                        resumes.
                                    </span>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                "/resumes"
                                            )
                                        }
                                    >
                                        Upload Resume
                                    </button>

                                </div>

                            )}

                        </div>


                        {/* =====================================
                            JOB
                        ===================================== */}

                        <div className="jd-field">

                            <label>
                                Job
                            </label>


                            <select
                                value={selectedJob}
                                onChange={(event) => {

                                    setSelectedJob(
                                        event.target.value
                                    );

                                    setError("");

                                }}
                            >

                                <option value="">
                                    Choose a job
                                </option>


                                {jobs.map(
                                    (job) => (

                                        <option
                                            key={job._id}
                                            value={job._id}
                                        >

                                            {
                                                job.title ||
                                                "Job"
                                            }

                                        </option>

                                    )
                                )}

                            </select>


                            {/* =================================
                                AUTOMATIC JOB
                            ================================= */}

                            {selectedJobData && (

                                <div className="automatic-job-info">

                                    <strong>
                                        Job selected
                                    </strong>


                                    <span>
                                        {
                                            selectedJobData.title
                                        }
                                    </span>


                                    {selectedJobData.companyId
                                        ?.companyName && (

                                        <small>

                                            {
                                                selectedJobData
                                                    .companyId
                                                    .companyName
                                            }

                                        </small>

                                    )}

                                </div>

                            )}


                            {jobs.length === 0 && (

                                <div className="field-help">

                                    No jobs available.

                                </div>

                            )}

                        </div>


                        {/* =====================================
                            SELECTION PREVIEW
                        ===================================== */}

                        {(selectedResumeData ||
                            selectedJobData) && (

                            <div className="selection-preview">


                                {selectedResumeData && (

                                    <div>

                                        <span>
                                            RESUME
                                        </span>


                                        <strong>
                                            {
                                                selectedResumeData
                                                    .fileName
                                            }
                                        </strong>

                                    </div>

                                )}


                                {selectedJobData && (

                                    <div>

                                        <span>
                                            JOB
                                        </span>


                                        <strong>
                                            {
                                                selectedJobData
                                                    .title
                                            }
                                        </strong>


                                        {selectedJobData.location && (

                                            <small>
                                                {
                                                    selectedJobData
                                                        .location
                                                }
                                            </small>

                                        )}

                                    </div>

                                )}

                            </div>

                        )}


                        {/* =====================================
                            ERROR
                        ===================================== */}

                        {error && (

                            <div className="jd-match-error">

                                {error}

                            </div>

                        )}


                        {/* =====================================
                            ANALYZE BUTTON
                        ===================================== */}

                        <button
                            type="button"
                            className="jd-analyze-btn"
                            onClick={handleAnalyze}
                            disabled={
                                analyzing ||
                                !selectedResume ||
                                !selectedJob
                            }
                        >

                            {analyzing
                                ? "Analyzing Resume..."
                                : "Analyze Job Match"
                            }

                        </button>

                    </section>


                    {/* =========================================
                        RESULT
                    ========================================= */}

                    {result && (

                        <section className="jd-result">


                            {/* =====================================
                                RESULT HEADER
                            ===================================== */}

                            <div className="jd-result-header">

                                <div>

                                    <span>
                                        ANALYSIS COMPLETE
                                    </span>


                                    <h2>
                                        Your Job Match
                                    </h2>

                                </div>

                            </div>


                            {/* =====================================
                                SCORE
                            ===================================== */}

                            <div className="jd-score-card">

                                <span>
                                    JOB MATCH SCORE
                                </span>


                                <div>

                                    <strong>
                                        {
                                            score.toFixed(1)
                                        }
                                    </strong>


                                    <small>
                                        / 100
                                    </small>

                                </div>

                            </div>


                            {/* =====================================
                                SCORE BREAKDOWN
                            ===================================== */}

                            <div className="jd-result-section">

                                <h3>
                                    Score Breakdown
                                </h3>


                                <div className="jd-score-grid">


                                    <div>

                                        <span>
                                            Skills
                                        </span>


                                        <strong>
                                            {
                                                result.score
                                                    ?.skill_score ??
                                                0
                                            }%
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Projects
                                        </span>


                                        <strong>
                                            {
                                                result.score
                                                    ?.project_score ??
                                                0
                                            }%
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Experience
                                        </span>


                                        <strong>
                                            {
                                                result.score
                                                    ?.experience_score ??
                                                0
                                            }%
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Education
                                        </span>


                                        <strong>
                                            {
                                                result.score
                                                    ?.education_score ??
                                                0
                                            }%
                                        </strong>

                                    </div>

                                </div>

                            </div>


                            {/* =====================================
                                MATCHED SKILLS
                            ===================================== */}

                            <ResultList
                                title="Matched Skills"
                                items={
                                    result.matchedSkills
                                }
                                emptyMessage={
                                    "No matched skills found."
                                }
                                tags
                            />


                            {/* =====================================
                                MISSING SKILLS
                            ===================================== */}

                            <ResultList
                                title="Missing Skills"
                                items={
                                    result.missingSkills
                                }
                                emptyMessage={
                                    "No missing skills found."
                                }
                                tags
                            />


                            {/* =====================================
                                SEMANTIC MATCHES
                            ===================================== */}

                            {result.semanticMatches?.length > 0 && (

                                <ResultList
                                    title="Semantic Matches"
                                    items={
                                        result.semanticMatches
                                    }
                                    emptyMessage={
                                        "No semantic matches found."
                                    }
                                />

                            )}


                            {/* =====================================
                                PROJECT RELEVANCE
                            ===================================== */}

                            <ResultList
                                title="Project Relevance"
                                items={
                                    result.projectRelevance
                                }
                                emptyMessage={
                                    "No project relevance data available."
                                }
                            />


                            {/* =====================================
                                EXPERIENCE RELEVANCE
                            ===================================== */}

                            <ResultList
                                title="Experience Relevance"
                                items={
                                    result.experienceRelevance
                                }
                                emptyMessage={
                                    "No experience relevance data available."
                                }
                            />


                            {/* =====================================
                                STRENGTHS
                            ===================================== */}

                            <ResultList
                                title="Strengths"
                                items={
                                    result.strengths
                                }
                                emptyMessage={
                                    "No strengths available."
                                }
                            />


                            {/* =====================================
                                SUGGESTIONS
                            ===================================== */}

                            <ResultList
                                title="Suggestions"
                                items={
                                    result.suggestions
                                }
                                emptyMessage={
                                    "No suggestions available."
                                }
                                ordered
                            />


                            {/* =====================================
                                ANALYZE AGAIN
                            ===================================== */}

                            <button
                                type="button"
                                className="jd-analyze-again"
                                onClick={() => {

                                    setResult(null);

                                    setError("");

                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth"
                                    });

                                }}
                            >

                                Analyze Another Job

                            </button>


                        </section>

                    )}

                </div>

            </main>

        </>

    );

};


// =====================================================
// RESULT LIST
// =====================================================

const ResultList = ({
    title,
    items,
    emptyMessage,
    tags = false,
    ordered = false
}) => {

    const list =
        Array.isArray(items)
            ? items
            : [];


    return (

        <div className="jd-result-section">

            <h3>
                {title}
            </h3>


            {list.length === 0 ? (

                <p className="jd-empty">
                    {emptyMessage}
                </p>

            ) : tags ? (

                <div className="jd-tags">

                    {list.map(
                        (item, index) => (

                            <span key={index}>
                                {
                                    typeof item === "object"
                                        ? JSON.stringify(item)
                                        : item
                                }
                            </span>

                        )
                    )}

                </div>

            ) : ordered ? (

                <ol>

                    {list.map(
                        (item, index) => (

                            <li key={index}>
                                {
                                    typeof item === "object"
                                        ? JSON.stringify(item)
                                        : item
                                }
                            </li>

                        )
                    )}

                </ol>

            ) : (

                <ul>

                    {list.map(
                        (item, index) => (

                            <li key={index}>
                                {
                                    typeof item === "object"
                                        ? JSON.stringify(item)
                                        : item
                                }
                            </li>

                        )
                    )}

                </ul>

            )}

        </div>

    );

};


export default JDMatchAnalyzer;