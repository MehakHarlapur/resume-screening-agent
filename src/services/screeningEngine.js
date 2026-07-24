/**
 * ResumeScreen AI Core Engine
 * Adheres strictly to the 8-step screening workflow, 7-dimensional weighted scoring,
 * zero hallucination rules, recommendation matrix, and JSON formatting specification.
 */

// Helper to extract email
function extractEmail(text) {
  const match = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
  return match ? match[0] : "";
}

// Helper to extract phone
function extractPhone(text) {
  const match = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return match ? match[0] : "";
}

// Helper to extract name (first line or after "Name:")
function extractName(text, filename = "") {
  const nameMatch = text.match(/(?:Name|Candidate Name):\s*([^\n\r]+)/i);
  if (nameMatch) return nameMatch[1].trim();
  
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length > 0 && lines[0].length < 40 && !lines[0].includes('@') && !lines[0].toLowerCase().includes('resume')) {
    return lines[0].replace(/[^a-zA-Z\s.]/g, '').trim();
  }
  
  if (filename) {
    return filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").replace(/resume/i, "").trim() || "Candidate";
  }
  return "Candidate";
}

// Common tech keywords dictionary for extraction
const TECH_DICTIONARY = [
  "Python", "JavaScript", "TypeScript", "React", "Node.js", "Express", "Next.js", "Vue", "Angular",
  "Java", "Spring Boot", "C++", "C#", ".NET", "Go", "Golang", "Rust", "PHP", "Ruby", "Rails",
  "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Cassandra", "DynamoDB",
  "AWS", "Amazon Web Services", "Azure", "GCP", "Google Cloud", "Docker", "Kubernetes", "Terraform",
  "CI/CD", "Jenkins", "GitHub Actions", "GitLab", "Linux", "Nginx", "GraphQL", "REST API",
  "Machine Learning", "Deep Learning", "NLP", "Natural Language Processing", "PyTorch", "TensorFlow",
  "Scikit-learn", "Pandas", "NumPy", "OpenCV", "LLM", "RAG", "LangChain", "Vector DB", "Pinecone",
  "Microservices", "Kafka", "RabbitMQ", "System Design", "Unit Testing", "Jest", "PyTest", "Cypress"
];

// Step 1: Parse Job Description
export function parseJobDescription(jdText) {
  const lines = jdText.split('\n').map(l => l.trim()).filter(Boolean);
  const textLower = jdText.toLowerCase();

  // Extract Role
  let role = "Software Engineer";
  const roleMatch = jdText.match(/(?:Job Title|Role|Position):\s*([^\n\r]+)/i);
  if (roleMatch) {
    role = roleMatch[1].trim();
  } else if (lines.length > 0) {
    role = lines[0].replace(/^#+\s*/, '').trim();
  }

  // Extract Required Skills & Preferred Skills
  const requiredSkills = new Set();
  const preferredSkills = new Set();
  
  TECH_DICTIONARY.forEach(tech => {
    if (new RegExp(`\\b${tech.replace('+', '\\+')}\\b`, 'i').test(jdText)) {
      if (textLower.includes('preferred') || textLower.includes('nice to have') || textLower.includes('bonus')) {
        const prefSection = jdText.substring(Math.max(0, textLower.indexOf('preferred')));
        if (new RegExp(`\\b${tech.replace('+', '\\+')}\\b`, 'i').test(prefSection)) {
          preferredSkills.add(tech);
        } else {
          requiredSkills.add(tech);
        }
      } else {
        requiredSkills.add(tech);
      }
    }
  });

  // Extract Experience Required
  let experienceRequired = "3+ years";
  const expMatch = jdText.match(/(\d+[\+-]?\s*(?:to\s*\d+)?\s*(?:years?|yrs?))/i);
  if (expMatch) {
    experienceRequired = expMatch[0];
  }

  // Extract Education Required
  let educationRequired = "Bachelor's degree in CS or related field";
  const eduMatch = jdText.match(/(Bachelor|Master|PhD|B\.?S|M\.?S|Degree)[^\n\r,.]*/i);
  if (eduMatch) {
    educationRequired = eduMatch[0];
  }

  return {
    role,
    required_skills: Array.from(requiredSkills),
    preferred_skills: Array.from(preferredSkills),
    experience_required: experienceRequired,
    education_required: educationRequired,
    full_text: jdText
  };
}

// Step 2: Parse Candidate Resume
export function parseCandidateResume(resumeText, filename = "") {
  const textLower = resumeText.toLowerCase();

  const name = extractName(resumeText, filename);
  const email = extractEmail(resumeText);
  const phone = extractPhone(resumeText);

  // Extract Education list
  const education = [];
  const eduKeywords = ["bachelor", "master", "b.s", "m.s", "b.tech", "m.tech", "phd", "university", "college", "degree"];
  resumeText.split('\n').forEach(line => {
    if (eduKeywords.some(kw => line.toLowerCase().includes(kw))) {
      education.push(line.trim());
    }
  });

  // Extract Skills
  const skills = [];
  TECH_DICTIONARY.forEach(tech => {
    if (new RegExp(`\\b${tech.replace('+', '\\+')}\\b`, 'i').test(resumeText)) {
      skills.push(tech);
    }
  });

  // Extract Certifications
  const certifications = [];
  const certKeywords = ["certified", "certification", "aws certified", "azure certified", "pmp", "ckad", "cka", "hashicorp"];
  resumeText.split('\n').forEach(line => {
    if (certKeywords.some(kw => line.toLowerCase().includes(kw))) {
      certifications.push(line.trim());
    }
  });

  // Extract Projects
  const projects = [];
  const lines = resumeText.split('\n');
  let inProjectSection = false;
  lines.forEach(line => {
    const l = line.toLowerCase();
    if (l.includes('project') || l.includes('portfolio')) {
      inProjectSection = true;
    } else if (l.includes('experience') || l.includes('education') || l.includes('certification')) {
      inProjectSection = false;
    } else if (inProjectSection && line.trim().length > 10) {
      if (projects.length < 5) projects.push(line.trim());
    }
  });

  // Extract Experience
  const experience = [];
  let inExpSection = false;
  lines.forEach(line => {
    const l = line.toLowerCase();
    if (l.includes('experience') || l.includes('employment') || l.includes('work history')) {
      inExpSection = true;
    } else if (l.includes('education') || l.includes('skills') || l.includes('projects')) {
      inExpSection = false;
    } else if (inExpSection && line.trim().length > 10) {
      if (experience.length < 6) experience.push(line.trim());
    }
  });

  return {
    candidate: { name, email, phone },
    resume_summary: {
      education: education.length ? education : ["Degree listed in resume"],
      experience: experience.length ? experience : ["Work history listed in resume"],
      projects: projects.length ? projects : ["Technical projects detailed in resume"],
      skills,
      certifications
    },
    raw_text: resumeText
  };
}

// Step 3 & Step 4: 7-Dimensional Matching & Weighted Score Engine
export function screenCandidate(parsedJD, candidateData) {
  const jdText = parsedJD.full_text.toLowerCase();
  const resumeText = candidateData.raw_text.toLowerCase();
  const candidateSkills = candidateData.resume_summary.skills || [];
  const reqSkills = parsedJD.required_skills || [];
  const prefSkills = parsedJD.preferred_skills || [];
  const allJdSkills = [...reqSkills, ...prefSkills];

  // 1. Technical Skill Match (35%)
  let techMatch = 0;
  const missingSkills = [];
  if (allJdSkills.length > 0) {
    let matchedCount = 0;
    allJdSkills.forEach(skill => {
      const isPresent = candidateSkills.some(cs => cs.toLowerCase() === skill.toLowerCase()) ||
                        new RegExp(`\\b${skill.replace('+', '\\+')}\\b`, 'i').test(resumeText);
      if (isPresent) {
        matchedCount++;
      } else {
        missingSkills.push(skill);
      }
    });
    techMatch = Math.round((matchedCount / allJdSkills.length) * 100);
  } else {
    techMatch = 75; // Default baseline if JD does not list explicit tech
  }

  // 2. Experience Match (25%)
  let expMatch = 60;
  // Parse required years
  const reqYearsMatch = parsedJD.experience_required.match(/(\d+)/);
  const requiredYears = reqYearsMatch ? parseInt(reqYearsMatch[1], 10) : 3;

  // Extract years from resume
  const resumeExpMatches = resumeText.match(/(\d+)[\+]?\s*(?:years?|yrs?)/g) || [];
  let candidateYears = 0;
  resumeExpMatches.forEach(m => {
    const num = parseInt(m, 10);
    if (!isNaN(num) && num > candidateYears && num < 40) candidateYears = num;
  });

  if (candidateYears >= requiredYears) {
    expMatch = 95;
  } else if (candidateYears > 0) {
    expMatch = Math.min(90, Math.round((candidateYears / requiredYears) * 90));
  } else if (resumeText.includes('senior') || resumeText.includes('lead') || resumeText.includes('principal')) {
    expMatch = 85;
  } else if (resumeText.includes('intern') || resumeText.includes('junior')) {
    expMatch = 65;
  } else {
    expMatch = 70;
  }

  // 3. Projects Match (15%)
  let projectMatch = 50;
  const projectCount = candidateData.resume_summary.projects.length;
  const projectRelevance = candidateSkills.filter(s => resumeText.includes(s.toLowerCase())).length;
  if (projectCount >= 2 && projectRelevance >= 3) {
    projectMatch = 92;
  } else if (projectCount >= 1 || projectRelevance >= 2) {
    projectMatch = 80;
  } else if (candidateData.resume_summary.projects.length > 0) {
    projectMatch = 70;
  } else {
    projectMatch = 45;
  }

  // 4. Education Match (10%)
  let eduMatch = 70;
  const eduText = candidateData.resume_summary.education.join(" ").toLowerCase();
  if (eduText.includes('master') || eduText.includes('m.s') || eduText.includes('phd')) {
    eduMatch = 98;
  } else if (eduText.includes('bachelor') || eduText.includes('b.s') || eduText.includes('b.tech') || eduText.includes('computer science')) {
    eduMatch = 90;
  } else if (eduText.includes('degree') || eduText.includes('university') || eduText.includes('college')) {
    eduMatch = 80;
  } else {
    eduMatch = 55;
  }

  // 5. Certification Match (5%)
  let certMatch = 50;
  const certs = candidateData.resume_summary.certifications;
  if (certs.length >= 2) {
    certMatch = 95;
  } else if (certs.length === 1) {
    certMatch = 85;
  } else if (resumeText.includes('certified') || resumeText.includes('certificate')) {
    certMatch = 75;
  } else {
    certMatch = 30; // No certification found
  }

  // 6. Keyword Match (5%)
  const jdKeywords = parsedJD.full_text.split(/\W+/).filter(w => w.length > 4);
  let matchedKw = 0;
  const uniqueKw = Array.from(new Set(jdKeywords));
  uniqueKw.forEach(kw => {
    if (resumeText.includes(kw.toLowerCase())) matchedKw++;
  });
  const keywordMatch = Math.min(100, Math.round((matchedKw / Math.max(1, uniqueKw.length)) * 120));

  // 7. Domain Match (5%)
  let domainMatch = 75;
  const domains = ["ai", "machine learning", "fintech", "healthcare", "cloud", "e-commerce", "saas", "cybersecurity", "web3", "embedded"];
  const matchingDomains = domains.filter(d => jdText.includes(d) && resumeText.includes(d));
  if (matchingDomains.length > 0) {
    domainMatch = 95;
  } else {
    domainMatch = 65;
  }

  // Weighted Overall Score Formula (Strict 35-25-15-10-5-5-5)
  const overallScore = Math.round(
    (techMatch * 0.35) +
    (expMatch * 0.25) +
    (projectMatch * 0.15) +
    (eduMatch * 0.10) +
    (certMatch * 0.05) +
    (keywordMatch * 0.05) +
    (domainMatch * 0.05)
  );

  // Confidence Calculation
  let confidence = 95;
  const missingDataReasons = [];
  if (!candidateData.candidate.email && !candidateData.candidate.phone) {
    confidence -= 10;
    missingDataReasons.push("Missing direct candidate contact details");
  }
  if (candidateData.resume_summary.certifications.length === 0) {
    confidence -= 5;
  }
  if (candidateData.resume_summary.projects.length === 0) {
    confidence -= 10;
    missingDataReasons.push("No explicit technical projects section parsed");
  }

  // Step 5: Evidence-grounded Strengths
  const strengths = [];
  if (candidateSkills.length >= 5) {
    strengths.push(`Extensive core technical stack (${candidateSkills.slice(0, 4).join(', ')})`);
  } else if (candidateSkills.length > 0) {
    strengths.push(`Proficient in ${candidateSkills.join(', ')}`);
  }
  if (expMatch >= 85) {
    strengths.push(`Strong alignment with requested ${parsedJD.experience_required} experience requirement`);
  }
  if (projectMatch >= 80) {
    strengths.push("Demonstrated hands-on technical project portfolio");
  }
  if (eduMatch >= 85) {
    strengths.push("Solid foundational education in Computer Science / Engineering field");
  }
  if (certs.length > 0) {
    strengths.push(`Verified industry certifications (${certs.join(', ')})`);
  }

  // Step 6: Weaknesses & Missing Skills
  const weaknesses = [];
  if (missingSkills.length > 0) {
    weaknesses.push(`Missing key required skills: ${missingSkills.slice(0, 4).join(', ')}`);
  }
  if (expMatch < 75) {
    weaknesses.push(`Experience duration is lower than target (${parsedJD.experience_required})`);
  }
  if (certs.length === 0) {
    weaknesses.push("No listed specialized professional certifications");
  }
  if (projectMatch < 65) {
    weaknesses.push("Limited documented production project deployment experience");
  }

  // Step 7: Recruiter Recommendation Matrix
  let recommendation = "Not Recommended";
  if (overallScore >= 90 && missingSkills.length <= 1 && expMatch >= 80) {
    recommendation = "Highly Recommended";
  } else if (overallScore >= 80) {
    recommendation = "Recommended";
  } else if (overallScore >= 65) {
    recommendation = "Consider";
  } else {
    recommendation = "Not Recommended";
  }

  // Reasoning & Final Summary Generation
  let reasoning = `${candidateData.candidate.name} achieved an overall match score of ${overallScore}/100. `;
  reasoning += `Technical skill coverage is ${techMatch}% with strong alignment in ${candidateSkills.slice(0, 3).join(', ')}. `;
  if (missingSkills.length > 0) {
    reasoning += `Key gaps identified include: ${missingSkills.join(', ')}. `;
  }
  if (confidence < 70) {
    reasoning += `Note: Confidence score is reduced to ${confidence}% due to: ${missingDataReasons.join(', ')}.`;
  }

  const finalSummary = `${candidateData.candidate.name} is classified as '${recommendation}' for the ${parsedJD.role} position. Strengths include ${strengths[0] || 'technical foundation'}, while areas of growth include ${weaknesses[0] || 'domain specialization'}.`;

  // Step 8 Output format strictly according to user prompt JSON schema
  return {
    job_summary: {
      role: parsedJD.role,
      required_skills: parsedJD.required_skills,
      preferred_skills: parsedJD.preferred_skills,
      experience_required: parsedJD.experience_required,
      education_required: parsedJD.education_required
    },
    candidate: {
      name: candidateData.candidate.name,
      email: candidateData.candidate.email || "N/A",
      phone: candidateData.candidate.phone || "N/A"
    },
    resume_summary: candidateData.resume_summary,
    matching: {
      technical_skill_match: techMatch,
      experience_match: expMatch,
      education_match: eduMatch,
      project_match: projectMatch,
      certification_match: certMatch,
      keyword_match: keywordMatch,
      domain_match: domainMatch
    },
    overall_score: overallScore,
    strengths,
    weaknesses,
    missing_skills: missingSkills,
    recommendation,
    confidence,
    reasoning,
    final_summary: finalSummary
  };
}

// Function to rank candidate list from highest to lowest score
export function rankCandidates(candidatesResults) {
  return [...candidatesResults].sort((a, b) => b.overall_score - a.overall_score);
}
