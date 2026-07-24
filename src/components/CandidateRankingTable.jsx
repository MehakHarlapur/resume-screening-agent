import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Eye, Mail, Phone, Briefcase, Award } from 'lucide-react';
import CircularProgress from './CircularProgress';

export default function CandidateRankingTable({ results, onSelectCandidate }) {

  const getRecommendationBadge = (recommendation) => {
    switch (recommendation) {
      case 'Highly Recommended':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Highly Recommended</span>
          </span>
        );
      case 'Recommended':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Recommended</span>
          </span>
        );
      case 'Consider':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Consider</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Not Recommended</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {results.map((res, rankIdx) => {
        const skillsList = res.resume_summary.skills || [];
        
        return (
          <div
            key={rankIdx}
            className="ats-card ats-card-hover rounded-xl p-5 bg-white border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            {/* Left: Rank & Candidate Details */}
            <div className="flex items-start space-x-4">
              
              {/* Rank Badge */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border ${
                  rankIdx === 0 ? 'bg-amber-50 border-amber-300 text-amber-700' :
                  rankIdx === 1 ? 'bg-slate-100 border-slate-300 text-slate-700' :
                  rankIdx === 2 ? 'bg-amber-100/60 border-amber-200 text-amber-800' :
                  'bg-gray-50 border-gray-200 text-gray-500'
                }`}>
                  #{rankIdx + 1}
                </div>
                {rankIdx === 0 && <span className="text-[10px] font-semibold text-amber-700 mt-1">Top Match</span>}
              </div>

              {/* Name, Role, Contacts */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900">{res.candidate.name}</h3>
                  {getRecommendationBadge(res.recommendation)}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>{res.candidate.email}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{res.candidate.phone}</span>
                  </span>
                </div>

                {/* Compact Modern Skill Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                  {skillsList.slice(0, 6).map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {skillsList.length > 6 && (
                    <span className="text-[10px] text-gray-400 font-medium">
                      +{skillsList.length - 6} more
                    </span>
                  )}
                </div>

                {/* Strengths & Missing Skills summary */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {res.strengths.slice(0, 1).map((st, i) => (
                    <span key={i} className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      ✓ {st}
                    </span>
                  ))}
                  {res.missing_skills.length > 0 && (
                    <span className="text-[11px] text-red-700 font-medium bg-red-50 px-2 py-0.5 rounded border border-red-100">
                      ⚠ Missing {res.missing_skills.slice(0, 2).join(', ')}
                    </span>
                  )}
                </div>

              </div>

            </div>

            {/* Right: Circular Score Indicator & Audit Button */}
            <div className="flex items-center justify-between md:justify-end space-x-6 border-t md:border-t-0 border-gray-100 pt-3 md:pt-0">
              
              {/* Circular Match Score Ring */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <CircularProgress score={res.overall_score} size={64} strokeWidth={6} />
              </div>

              {/* View Audit Analysis Button (Secondary White) */}
              <button
                onClick={() => onSelectCandidate(res)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 shadow-2xs transition-all flex items-center space-x-1.5 hover:border-gray-400 shrink-0"
              >
                <Eye className="w-4 h-4 text-blue-600" />
                <span>Audit Analysis</span>
              </button>

            </div>

          </div>
        );
      })}
    </div>
  );
}
