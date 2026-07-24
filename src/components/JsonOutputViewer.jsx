import React, { useState } from 'react';
import { Code2, Copy, Download, Check, FileJson } from 'lucide-react';

export default function JsonOutputViewer({ screeningResults }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!screeningResults || screeningResults.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200 text-center space-y-3 shadow-xs">
        <FileJson className="w-12 h-12 text-gray-400 mx-auto" />
        <h3 className="text-base font-semibold text-gray-900">No JSON Output Generated Yet</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Execute the 8-Step Resume Screening workflow above to generate strictly formatted JSON output.
        </p>
      </div>
    );
  }

  const selectedJson = screeningResults[selectedIndex];
  const formattedJsonString = JSON.stringify(selectedJson, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([formattedJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_screening_${selectedJson.candidate.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs space-y-4">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-3">
        
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
              <span>Strict JSON Output Schema</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                Valid JSON Only
              </span>
            </h2>
            <p className="text-xs text-gray-500">Conforms strictly to the prompt output specification</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          
          {screeningResults.length > 1 && (
            <select
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
              className="bg-white text-xs text-gray-800 border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-2xs"
            >
              {screeningResults.map((r, idx) => (
                <option key={idx} value={idx}>
                  Candidate #{idx + 1}: {r.candidate.name} ({r.overall_score} pts)
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 transition-all flex items-center space-x-1.5 shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
            <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 border border-blue-600 transition-all flex items-center space-x-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .json</span>
          </button>

        </div>

      </div>

      {/* JSON Code Viewer Container */}
      <div className="relative bg-slate-900 rounded-xl border border-slate-800 p-4 font-mono text-xs text-slate-100 overflow-x-auto max-h-[600px]">
        <pre className="whitespace-pre-wrap break-words leading-relaxed">
          <code>{formattedJsonString}</code>
        </pre>
      </div>

    </div>
  );
}
