<<<<<<< HEAD
# 🚀 ResumeScreen AI

> AI-Powered Resume Screening Agent for Intelligent Candidate Evaluation

ResumeScreen AI is an AI-powered Resume Screening Agent that helps recruiters automatically evaluate, score, and rank candidates against a given Job Description (JD). The application extracts relevant information from resumes, compares candidate profiles with job requirements, calculates weighted match scores, and provides transparent recommendations to simplify the hiring process.

---

# 📌 Project Overview

Recruiters often receive hundreds of resumes for a single job posting, making manual screening slow, repetitive, and inconsistent.

ResumeScreen AI automates the initial screening process by:

- Parsing Job Descriptions
- Extracting candidate skills and experience
- Comparing resumes against the JD
- Calculating weighted match scores
- Ranking candidates
- Identifying strengths and missing skills
- Providing recruiter-friendly recommendations

The system is designed to reduce manual effort while maintaining transparent and explainable AI decisions.

---

# ✨ Features

### Job Description Analysis
- Extracts required skills
- Extracts preferred skills
- Detects experience requirements
- Identifies education requirements
- Extracts technical keywords

### Resume Parsing
- Candidate Information
- Skills
- Projects
- Experience
- Education
- Certifications
- Tools & Technologies

### AI Candidate Evaluation
- Skill Matching
- Experience Matching
- Education Matching
- Project Relevance
- Keyword Matching
- Domain Matching
- Weighted Score Calculation

### Candidate Ranking
- Rank all candidates
- Match Score
- Recommendation
- Missing Skills
- Recruiter Explanation

### Dashboard
- Candidate Leaderboard
- Audit Analysis
- Raw JSON Output

---

# 🛠 Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- JavaScript (ES6+)

## AI / NLP
- OpenAI API (or compatible LLM)
- Prompt Engineering
- NLP-based Resume Matching

## Backend
- Node.js (if applicable)

## Development Tools
- VS Code
- Git
- GitHub

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/resume-screening-agent.git
```

Go to the project folder

```bash
cd resume-screening-agent
```

Install dependencies

```bash
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file in the root directory.

Example:

```env
VITE_OPENAI_API_KEY=your_api_key_here
```

If using another provider (Groq, OpenRouter, Anthropic, etc.), update the environment variable accordingly.

> Do **not** commit your `.env` file to GitHub.

---

# ▶️ How to Run

Start the development server:

```bash
npm run dev
```

Open your browser:

```
http://localhost:5173
```

---

# 📥 Sample Input

## Job Description

```
Role:
Senior Full Stack AI Engineer

Required Skills:
Python
React
FastAPI
Docker
AWS
PostgreSQL
LangChain
Vector Database

Experience:
5+ Years
```

---

## Candidate Resume

```
Alex Rivera

Skills:
Python
React
FastAPI
Docker
AWS
PostgreSQL
LangChain

Experience:
6 Years

Projects:
AI Resume Parser
LLM Chatbot
RAG Knowledge Assistant
```

---

# 📤 Sample Output

```json
{
  "candidate": "Alex Rivera",
  "overall_score": 94,
  "recommendation": "Highly Recommended",
  "strengths": [
    "Excellent Python experience",
    "Strong AI project portfolio",
    "Relevant Full Stack background"
  ],
  "missing_skills": [
    "System Design"
  ]
}
```

---

# 📂 Folder Structure

```
resume-screening-agent/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── data/
│   ├── utils/
│   ├── services/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
├── README.md
├── .gitignore
└── .env
```

---

# ⚖️ Scoring Method

Candidates are evaluated using a weighted scoring model.

| Category | Weight |
|-----------|---------|
| Technical Skills | 35% |
| Experience | 25% |
| Projects | 15% |
| Education | 10% |
| Certifications | 5% |
| Keywords | 5% |
| Domain Knowledge | 5% |

Final Match Score = Weighted Average of all evaluation categories.

---

# 📊 Recommendation Levels

| Score | Recommendation |
|--------|----------------|
| 90 - 100 | Highly Recommended |
| 80 - 89 | Recommended |
| 65 - 79 | Consider |
| Below 65 | Not Recommended |

---

# ⚠️ Tradeoffs

During development, several design choices were made to balance implementation time and functionality:

- Uses prompt-based evaluation instead of a fully trained ML model.
- Rule-based weighted scoring is used for transparency.
- Focused on structured resume parsing rather than OCR for scanned documents.
- Current implementation is optimized for technical hiring roles.
- Candidate ranking prioritizes explainability over model complexity.

With more time, advanced semantic matching and vector search could further improve accuracy.

---

# 🚀 Future Improvements

- PDF & DOCX resume parsing
- Resume OCR support
- Embedding-based semantic search
- Vector Database (FAISS/ChromaDB)
- RAG-based resume retrieval
- Multi-language resume support
- Recruiter authentication
- Candidate history tracking
- Interview question generation
- AI-powered candidate summary
- Export to CSV/PDF
- Email shortlisted candidates
- ATS integration
- Analytics dashboard
- Dark/Light mode
- Real-time collaboration


---

# 👩‍💻 Author

**Mehak Harlapur**

GitHub: https://github.com/MehakHarlapur

LinkedIn: https://www.linkedin.com/in/mehakharlapur

---

# 📄 License

This project was developed as part of the **Rooman Technologies – Junior AI Research Associate 24-Hour AI Agent Challenge**.

It is intended for educational and demonstration purposes.
=======
# resume-screening-agent
>>>>>>> a28e235b53d9d410a8e75ef66458bca85b18d969
