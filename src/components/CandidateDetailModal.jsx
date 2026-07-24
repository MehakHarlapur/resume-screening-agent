import React from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Award, FileText, Check, HelpCircle, BarChart2, Info } from 'lucide-react';
import CircularProgress from './CircularProgress';

export default function CandidateDetailModal({ candidateResult, onClose }) {
  if (!candidateResult) return null;

  const m = candidateResult.matching;

  const scoreBars = [
    { label: "Technical Skills", weight: "35%", score: m.technical_skill_match, color: "bg-blue-600" },
    { label: "Experience Match", weight: "25%", score: m.experience_match, color: "bg-indigo-600" },
    { label: "Projects Relevance", weight: "15%", score: m.project_match, color: "bg-purple-600" },
    { label: "Education Match", weight: "10%", score: m.education_match, color: "bg-emerald-600" },
    { label: "Certifications", weight: "5%", score: m.certification_match, color: "bg-amber-500" },
    { label: "Keyword Density", weight: "5%", score: m.keyword_match, color: "bg-cyan-600" },
    { label: "Domain Knowledge", weight: "5%", score: m.domain_match, color: "bg-pink-600" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs overflow-y-auto">
      
      <div className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-up">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-base">
              {candidateResult.candidate.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{candidateResult.candidate.name}</h2>
              <p className="text-xs text-gray-500">
                {candidateResult.candidate.email} • {candidateResult.candidate.phone}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Score Ring Card */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Match Relevance</span>
              <CircularProgress score={candidateResult.overall_score} size={72} strokeWidth={7} />
              <span className="text-xs text-gray-600 font-medium mt-2">Weighted 7-Dim Matrix</span>
            </div>

            {/* Recommendation */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recruiter Recommendation</span>
              <div className="my-3">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {candidateResult.recommendation}
                </span>
              </div>
              <span className="text-[11px] text-gray-500">Decision rules applied</span>
            </div>

            {/* Confidence Score */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Data Reliability</span>
              <div className="text-2xl font-bold text-gray-900 my-1">
                {candidateResult.confidence}%
              </div>
              {candidateResult.confidence < 70 ? (
                <span className="text-[10px] text-amber-700 font-medium flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>Reduced confidence (&lt;70%)</span>
                </span>
              ) : (
                <span className="text-[10px] text-emerald-700 font-medium flex items-center space-x-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>High Data Reliability</span>
                </span>
              )}
            </div>

          </div>

          {/* 7-Dimensional Match Breakdown */}
          <div className="bg-gray-50/60 p-4 rounded-xl border border-gray-200 space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              <span>7-Dimensional Weighted Match Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              {scoreBars.map((bar, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-700 font-medium">{bar.label} <span className="text-[10px] text-gray-400">({bar.weight})</span></span>
                    <span className="font-bold text-gray-900">{bar.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${bar.color} transition-all duration-500 rounded-full`} style={{ width: `${bar.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Strengths */}
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-2">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Candidate Strengths</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {candidateResult.strengths.map((st, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-red-50/50 p-4 rounded-xl border border-red-200 space-y-2">
              <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Identified Weaknesses & Gaps</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {candidateResult.weaknesses.map((wk, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Missing Skills Alert */}
          {candidateResult.missing_skills.length > 0 && (
            <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 space-y-1.5">
              <span className="text-xs font-bold text-amber-800 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Explicit Missing Job Requirements</span>
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {candidateResult.missing_skills.map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 text-xs bg-amber-100 text-amber-800 border border-amber-300 rounded font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recruiter Reasoning & Summary */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Transparent Recruiter Reasoning</span>
            </h4>
            <p className="text-xs text-gray-700 leading-relaxed">
              {candidateResult.reasoning}
            </p>
            <div className="pt-2 border-t border-gray-200">
              <span className="text-[11px] font-semibold text-gray-500">Final Summary:</span>
              <p className="text-xs text-gray-800 italic mt-0.5">"{candidateResult.final_summary}"</p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 shadow-2xs transition-all"
          >
            Close Analysis
          </button>
        </div>

      </div>

    </div>
  );
}
