import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import UploadSection from './components/UploadSection';
import CandidateRankingTable from './components/CandidateRankingTable';
import CandidateDetailModal from './components/CandidateDetailModal';
import JsonOutputViewer from './components/JsonOutputViewer';
import { parseJobDescription, parseCandidateResume, screenCandidate, rankCandidates } from './services/screeningEngine';
import { SAMPLE_JOB_DESCRIPTIONS, SAMPLE_CANDIDATE_RESUMES } from './data/sampleData';
import { Sparkles, Users, Award, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [jdFile, setJdFile] = useState({ name: 'Senior_FullStack_AI_Engineer.pdf', size: 1024 * 50 });
  const [jdText, setJdText] = useState(SAMPLE_JOB_DESCRIPTIONS[0].text);

  const [resumeFiles, setResumeFiles] = useState(
    SAMPLE_CANDIDATE_RESUMES.map(r => ({ id: r.id, name: r.filename, size: 1024 * 30 }))
  );
  const [candidates, setCandidates] = useState(SAMPLE_CANDIDATE_RESUMES);

  const [isScreening, setIsScreening] = useState(false);
  const [screeningResults, setScreeningResults] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const runScreeningWorkflow = () => {
    if (!jdText.trim() || candidates.length === 0) return;
    
    setIsScreening(true);

    setTimeout(() => {
      const parsedJDData = parseJobDescription(jdText);
      const results = candidates.map(cand => {
        const candidateParsed = parseCandidateResume(cand.text, cand.filename);
        return screenCandidate(parsedJDData, candidateParsed);
      });

      const ranked = rankCandidates(results);
      setScreeningResults(ranked);
      setIsScreening(false);

      if (ranked.length > 0 && ranked[0].overall_score >= 90) {
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.6 }
        });
      }
    }, 500);
  };

  useEffect(() => {
    runScreeningWorkflow();
  }, []);

  const handleLoadDemoData = () => {
    setJdFile({ name: 'Senior_FullStack_AI_Engineer.pdf', size: 1024 * 50 });
    setJdText(SAMPLE_JOB_DESCRIPTIONS[0].text);
    setResumeFiles(SAMPLE_CANDIDATE_RESUMES.map(r => ({ id: r.id, name: r.filename, size: 1024 * 30 })));
    setCandidates(SAMPLE_CANDIDATE_RESUMES);
    setTimeout(() => runScreeningWorkflow(), 100);
  };

  const topScore = screeningResults.length > 0 ? screeningResults[0].overall_score : 0;
  const highlyRecCount = screeningResults.filter(r => r.recommendation === 'Highly Recommended' || r.recommendation === 'Recommended').length;

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans selection:bg-blue-600 selection:text-white pb-16">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPreloadSampleData={handleLoadDemoData}
        isScreening={isScreening}
      />

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Clean Enterprise Banner */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Resume Screening Platform</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              ResumeScreen AI Agent
            </h1>
            <p className="text-xs text-gray-500 max-w-xl">
              Automated objective candidate screening, 7-dimensional weighted scoring, strengths & weaknesses extraction, and recruiter decision reasoning.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-gray-50 px-3.5 py-2 rounded-lg border border-gray-200 text-center min-w-24">
              <span className="text-[10px] text-gray-500 font-semibold uppercase block">Resumes</span>
              <span className="text-base font-bold text-gray-900">{screeningResults.length} Evaluated</span>
            </div>

            <div className="bg-gray-50 px-3.5 py-2 rounded-lg border border-gray-200 text-center min-w-24">
              <span className="text-[10px] text-gray-500 font-semibold uppercase block">Top Score</span>
              <span className="text-base font-bold text-emerald-600">{topScore}%</span>
            </div>

            <div className="bg-gray-50 px-3.5 py-2 rounded-lg border border-gray-200 text-center min-w-24">
              <span className="text-[10px] text-gray-500 font-semibold uppercase block">Qualified</span>
              <span className="text-base font-bold text-blue-600">{highlyRecCount} Candidates</span>
            </div>
          </div>
        </div>

        {/* Tab View Content */}
        {activeTab === 'dashboard' ? (
          <div className="space-y-8">
            
            {/* Enterprise Upload Area */}
            <UploadSection
              jdFile={jdFile}
              setJdFile={setJdFile}
              jdText={jdText}
              setJdText={setJdText}
              resumeFiles={resumeFiles}
              setResumeFiles={setResumeFiles}
              candidates={candidates}
              setCandidates={setCandidates}
              onRunScreening={runScreeningWorkflow}
              isScreening={isScreening}
              onLoadDemoData={handleLoadDemoData}
            />

            {/* Ranked Candidate Cards Leaderboard */}
            {screeningResults.length > 0 && (
              <CandidateRankingTable
                results={screeningResults}
                onSelectCandidate={(cand) => setSelectedCandidate(cand)}
              />
            )}

          </div>
        ) : (
          /* Raw JSON Schema Inspector */
          <JsonOutputViewer screeningResults={screeningResults} />
        )}

      </main>

      {/* Candidate Audit Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          candidateResult={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}

    </div>
  );
}
