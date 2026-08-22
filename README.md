# NextHire - AI-Powered Job Portal

NextHire is a full-stack job portal that connects candidates and recruiters through a modern MERN-based platform with AI-powered resume and job matching features.

## Features

### Candidate Features

- User registration and authentication
- Candidate profile management
- Education and experience management
- Browse available jobs
- Search jobs by keyword and location
- Apply for jobs
- Select an existing resume while applying
- Upload a new resume while applying
- Track applied jobs
- View application status
- Resume management
- Resume ATS Analyzer
- AI-powered Resume vs Job Description matching

### Recruiter Features

- Recruiter authentication
- Company management
- Create jobs
- Update jobs
- Close job applications
- View applicants
- View candidate resumes
- Update application status
- Shortlist candidates
- Reject candidates
- Mark candidates as hired

### AI Features

NextHire contains a separate Python FastAPI AI service.

#### Resume ATS Analyzer

Candidate uploads a PDF resume and receives an ATS analysis based on:

- ATS score
- Resume sections
- Detectable technical skills
- Resume formatting
- Missing sections
- Resume improvement suggestions
- Text statistics

#### AI Job Matcher

Candidate can compare a resume against a job description.

The AI matching system analyzes:

- Overall match score
- Required skill matching
- Missing skills
- Project relevance
- Experience relevance
- Education
- Semantic matching
- Strengths
- Suggestions

## Architecture

The project uses three main applications:

```text
                    NextHire
                       |
          +------------+------------+
          |                         |
      Frontend                   Backend
       React                  Node + Express
          |                         |
          |                    MongoDB
          |                         |
          +------------+------------+
                       |
                  AI Service
                    FastAPI
                       |
              Resume / JD Analysis