import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2, Trash2, AlertCircle, Play, FileUp, X } from 'lucide-react';
import { extractTextFromFile, validateFile } from '../utils/fileExtractor';

export default function UploadSection({
  jdFile,
  setJdFile,
  jdText,
  setJdText,
  resumeFiles,
  setResumeFiles,
  candidates,
  setCandidates,
  onRunScreening,
  isScreening
}) {
  const jdInputRef = useRef(null);
  const resumesInputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDraggingJd, setIsDraggingJd] = useState(false);
  const [isDraggingResumes, setIsDraggingResumes] = useState(false);

  const triggerError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  // --- JOB DESCRIPTION UPLOAD HANDLERS ---
  const handleJdUpload = async (file) => {
    if (!file) return;
    const validation = validateFile(file);
    if (!validation.valid) {
      triggerError(validation.error);
      return;
    }

    try {
      const extractedText = await extractTextFromFile(file);
      setJdFile({ name: file.name, size: file.size });
      setJdText(extractedText);
      setErrorMessage(null);
    } catch (err) {
      triggerError(`Failed to read Job Description file "${file.name}".`);
    }
  };

  const handleJdInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleJdUpload(e.target.files[0]);
    }
    e.target.value = '';
  };

  const handleJdDrop = (e) => {
    e.preventDefault();
    setIsDraggingJd(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleJdUpload(e.target.files[0]);
    }
  };

  const handleRemoveJd = () => {
    setJdFile(null);
    setJdText('');
  };

  // --- CANDIDATE RESUMES UPLOAD HANDLERS ---
  const handleResumesUpload = async (filesArray) => {
    if (!filesArray || filesArray.length === 0) return;

    if (candidates.length + filesArray.length > 20) {
      triggerError("Maximum limit of 20 candidate resumes exceeded.");
      return;
    }

    const newCandidates = [...candidates];
    const newFiles = [...resumeFiles];
    let addedCount = 0;

    for (const file of filesArray) {
      const validation = validateFile(file);
      if (!validation.valid) {
        triggerError(validation.error);
        continue;
      }

      if (newFiles.some(f => f.name === file.name)) {
        triggerError(`File "${file.name}" has already been uploaded.`);
        continue;
      }

      try {
        const text = await extractTextFromFile(file);
        const fileId = `res-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        newFiles.push({ id: fileId, name: file.name, size: file.size });
        newCandidates.push({
          id: fileId,
          filename: file.name,
          text
        });
        addedCount++;
      } catch (err) {
        triggerError(`Error reading file "${file.name}".`);
      }
    }

    if (addedCount > 0) {
      setResumeFiles(newFiles);
      setCandidates(newCandidates);
      setErrorMessage(null);
    }
  };

  const handleResumesInputChange = (e) => {
    if (e.target.files) {
      handleResumesUpload(Array.from(e.target.files));
    }
    e.target.value = '';
  };

  const handleResumesDrop = (e) => {
    e.preventDefault();
    setIsDraggingResumes(false);
    if (e.target.files || e.dataTransfer.files) {
      handleResumesUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleRemoveResume = (id) => {
    setResumeFiles(resumeFiles.filter(f => f.id !== id));
    setCandidates(candidates.filter(c => c.id !== id));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      
      {/* Toast Notification Banner */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-red-800 shadow-sm">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Enterprise Upload Card */}
      <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-6">
        
        {/* Title & Subtitle */}
        <div className="text-center space-y-1 border-b border-gray-100 pb-5">
          <h2 className="text-xl font-bold text-gray-900 flex items-center justify-center space-x-2">
            <FileUp className="w-5 h-5 text-blue-600" />
            <span>Upload Job Description & Candidate Resumes</span>
          </h2>
          <p className="text-xs text-gray-500">
            Upload one Job Description and one or more candidate resumes (PDF, DOCX, TXT).
          </p>
        </div>

        {/* Upload Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* UPLOAD JOB DESCRIPTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Job Description</span>
              </span>
              <span className="text-[10px] text-gray-400">PDF, DOCX, TXT</span>
            </div>

            <input
              type="file"
              ref={jdInputRef}
              onChange={handleJdInputChange}
              accept=".pdf,.doc,.docx,.txt"
              hidden
            />

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDraggingJd(true); }}
              onDragLeave={() => setIsDraggingJd(false)}
              onDrop={handleJdDrop}
              onClick={() => jdInputRef.current && jdInputRef.current.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDraggingJd
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-gray-200 hover:border-blue-400 bg-gray-50/50 hover:bg-white'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                  <Upload className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    jdInputRef.current && jdInputRef.current.click();
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm"
                >
                  Upload JD
                </button>
                <p className="text-[11px] text-gray-500">or drag & drop Job Description file</p>
              </div>
            </div>

            {/* Display Selected JD File */}
            {jdFile ? (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50/60 border border-blue-200 text-xs">
                <div className="flex items-center space-x-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold text-blue-900 truncate">{jdFile.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveJd}
                  className="text-gray-400 hover:text-red-600 p-1 transition-all"
                  title="Remove Job Description"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 italic text-center">No Job Description uploaded</p>
            )}
          </div>

          {/* UPLOAD CANDIDATE RESUMES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Candidate Resumes</span>
              </span>
              <span className="text-[10px] text-gray-400">Multiple files enabled</span>
            </div>

            <input
              type="file"
              ref={resumesInputRef}
              onChange={handleResumesInputChange}
              accept=".pdf,.doc,.docx,.txt"
              multiple
              hidden
            />

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDraggingResumes(true); }}
              onDragLeave={() => setIsDraggingResumes(false)}
              onDrop={handleResumesDrop}
              onClick={() => resumesInputRef.current && resumesInputRef.current.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDraggingResumes
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : 'border-gray-200 hover:border-emerald-400 bg-gray-50/50 hover:bg-white'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Upload className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    resumesInputRef.current && resumesInputRef.current.click();
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-sm"
                >
                  Upload Resume(s)
                </button>
                <p className="text-[11px] text-gray-500">or drag & drop multiple resume files</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-gray-500">Selected Candidate Resumes:</span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {candidates.length} {candidates.length === 1 ? 'resume' : 'resumes'} selected
              </span>
            </div>

          </div>

        </div>

        {/* DISPLAY SELECTED FILES AS CHIPS */}
        {(jdFile || resumeFiles.length > 0) && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2.5">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Selected Files Overview
            </h3>

            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
              {jdFile && (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs font-medium text-blue-900 shadow-2xs">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span className="truncate max-w-[200px]">{jdFile.name}</span>
                  <button onClick={handleRemoveJd} className="text-gray-400 hover:text-red-600 p-0.5 ml-1">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}

              {resumeFiles.map((resFile) => (
                <div key={resFile.id} className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-800 shadow-2xs">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="truncate max-w-[200px]">{resFile.name}</span>
                  <button onClick={() => handleRemoveResume(resFile.id)} className="text-gray-400 hover:text-red-600 p-0.5 ml-1">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXECUTE AI SCREENING BUTTON */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onRunScreening}
            disabled={isScreening || !jdText || candidates.length === 0}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 transition-all active:scale-[0.99]"
          >
            {isScreening ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Screening Resumes & Calculating Scores...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Execute AI Resume Screening ({candidates.length} {candidates.length === 1 ? 'Candidate' : 'Candidates'})</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
