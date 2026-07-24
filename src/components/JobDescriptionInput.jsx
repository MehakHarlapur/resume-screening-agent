import React from 'react';
import { FileCode, Sparkles, CheckCircle2, Briefcase, GraduationCap, Clock, ListFilter } from 'lucide-react';
import { SAMPLE_JOB_DESCRIPTIONS } from '../data/sampleData';

export default function JobDescriptionInput({ jdText, setJdText, parsedJD }) {
  
  const handleSelectTemplate = (id) => {
    const found = SAMPLE_JOB_DESCRIPTIONS.find(j => j.id === id);
    if (found) setJdText(found.text);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-gray-800 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-100">Step 1: Job Description (JD)</h2>
            <p className="text-xs text-gray-400">Define requirements, skills, experience, and domain</p>
          </div>
        </div>

        {/* Template Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400 hidden sm:inline">Preset Roles:</span>
          <select
            onChange={(e) => handleSelectTemplate(e.target.value)}
            defaultValue=""
            className="bg-gray-900 text-xs text-gray-200 border border-gray-700 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="" disabled>Select Job Template...</option>
            {SAMPLE_JOB_DESCRIPTIONS.map(jd => (
              <option key={jd.id} value={jd.id}>{jd.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* JD Text Input */}
      <div>
        <textarea
          rows={7}
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste full Job Description here (include Title, Required Skills, Preferred Skills, Experience, Education)..."
          className="w-full bg-gray-950/80 border border-gray-800 rounded-xl p-3.5 text-xs text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all font-mono leading-relaxed resize-y"
        />
      </div>

      {/* Parsed Attributes Preview */}
      {parsedJD && (
        <div className="bg-gray-900/60 rounded-xl p-3.5 border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Extracted JD Metadata (Step 1 Parsing)</span>
            </span>
            <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
              {parsedJD.required_skills.length + parsedJD.preferred_skills.length} Technical Keywords Found
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
            <div className="flex items-center space-x-2 bg-gray-950/50 p-2 rounded-lg border border-gray-800/60">
              <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="truncate">
                <p className="text-[10px] text-gray-400">Target Role</p>
                <p className="font-medium text-gray-200 truncate">{parsedJD.role}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-gray-950/50 p-2 rounded-lg border border-gray-800/60">
              <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="truncate">
                <p className="text-[10px] text-gray-400">Exp Required</p>
                <p className="font-medium text-gray-200 truncate">{parsedJD.experience_required}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-gray-950/50 p-2 rounded-lg border border-gray-800/60">
              <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="truncate">
                <p className="text-[10px] text-gray-400">Education Target</p>
                <p className="font-medium text-gray-200 truncate">{parsedJD.education_required}</p>
              </div>
            </div>
          </div>

          {/* Skill Badges */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium text-gray-400">Required Skills Detected:</p>
            <div className="flex flex-wrap gap-1.5">
              {parsedJD.required_skills.length > 0 ? (
                parsedJD.required_skills.map((skill, idx) => (
                  <span key={idx} className="px-2 py-0.5 text-[11px] font-medium bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 rounded-md">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-gray-400 italic">No explicit tech keywords parsed yet</span>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
