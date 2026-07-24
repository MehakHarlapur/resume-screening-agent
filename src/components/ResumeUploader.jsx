import React, { useState } from 'react';
import { FileUp, UserPlus, Trash2, FileText, Play, CheckCircle, Users, Upload } from 'lucide-react';
import { SAMPLE_CANDIDATE_RESUMES } from '../data/sampleData';

export default function ResumeUploader({ candidates, setCandidates, onRunScreening, isScreening }) {
  const [newResumeText, setNewResumeText] = useState('');
  const [newCandidateName, setNewCandidateName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddCandidate = () => {
    if (!newResumeText.trim()) return;
    const filename = newCandidateName ? `${newCandidateName.replace(/\s+/g, '_')}_Resume.txt` : `Candidate_${candidates.length + 1}.txt`;
    setCandidates([
      ...candidates,
      {
        id: `res-custom-${Date.now()}`,
        filename,
        text: newResumeText
      }
    ]);
    setNewResumeText('');
    setNewCandidateName('');
    setShowAddForm(false);
  };

  const handleRemoveCandidate = (id) => {
    setCandidates(candidates.filter(c => c.id !== id));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        setCandidates(prev => [
          ...prev,
          {
            id: `res-file-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            filename: file.name,
            text
          }
        ]);
      };
      reader.readAsText(file);
    });
  };

  const handleAddPresetCandidates = () => {
    setCandidates(SAMPLE_CANDIDATE_RESUMES);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-gray-800 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-100">Step 2: Candidate Resumes Queue ({candidates.length})</h2>
            <p className="text-xs text-gray-400">Add candidate resumes for objective screening & ranking</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleAddPresetCandidates}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-300 bg-gray-900 hover:bg-gray-800 border border-gray-700 transition-all"
          >
            + Load 4 Demo Resumes
          </button>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-indigo-300 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800 transition-all flex items-center space-x-1"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Paste Resume</span>
          </button>
        </div>
      </div>

      {/* File Drag and Drop / Upload Button */}
      <div className="relative border-2 border-dashed border-gray-800 hover:border-indigo-500/50 rounded-xl p-4 text-center transition-all bg-gray-950/40">
        <input
          type="file"
          multiple
          accept=".txt,.md,.text"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center space-y-1.5">
          <Upload className="w-6 h-6 text-gray-400" />
          <p className="text-xs font-medium text-gray-300">
            Drag & drop candidate resume text files (.txt) or <span className="text-indigo-400">browse files</span>
          </p>
          <p className="text-[10px] text-gray-400">Batch processing supported</p>
        </div>
      </div>

      {/* Paste Resume Form Modal/Drawer */}
      {showAddForm && (
        <div className="bg-gray-900/90 rounded-xl p-4 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-200">Paste Candidate Resume Content</span>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-xs text-gray-400 hover:text-gray-200"
            >
              Cancel
            </button>
          </div>

          <input
            type="text"
            placeholder="Candidate Name (Optional)..."
            value={newCandidateName}
            onChange={(e) => setNewCandidateName(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />

          <textarea
            rows={5}
            value={newResumeText}
            onChange={(e) => setNewResumeText(e.target.value)}
            placeholder="Paste full resume text here..."
            className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-xs text-gray-200 font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-y"
          />

          <div className="flex justify-end space-x-2">
            <button
              onClick={handleAddCandidate}
              disabled={!newResumeText.trim()}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-md shadow-indigo-600/20"
            >
              Add Candidate to Queue
            </button>
          </div>
        </div>
      )}

      {/* Candidates List */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {candidates.length === 0 ? (
          <div className="text-center py-6 border border-gray-800/50 rounded-xl bg-gray-950/30">
            <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No candidate resumes added yet</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Click "Load 4 Demo Resumes" above for instant benchmark testing</p>
          </div>
        ) : (
          candidates.map((cand, idx) => (
            <div
              key={cand.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-gray-900/70 border border-gray-800/80 hover:border-gray-700 transition-all"
            >
              <div className="flex items-center space-x-2.5 truncate">
                <span className="w-5 h-5 rounded-full bg-gray-800 text-[10px] font-bold text-gray-300 flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-medium text-gray-200 truncate">{cand.filename}</p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {cand.text.length} characters • {cand.text.split(/\s+/).length} words
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleRemoveCandidate(cand.id)}
                className="text-gray-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/30 transition-all"
                title="Remove Candidate"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Action Button: Execute 8-Step Resume Screening */}
      <div className="pt-2">
        <button
          onClick={onRunScreening}
          disabled={isScreening || candidates.length === 0}
          className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 disabled:opacity-50 transition-all active:scale-[0.99]"
        >
          {isScreening ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Resumes & Calculating Scores...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Execute 8-Step AI Resume Screening ({candidates.length} Candidates)</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
