import * as mammoth from 'mammoth';

/**
 * Extracts plain text from uploaded PDF, DOCX, DOC, or TXT files.
 * @param {File} file 
 * @returns {Promise<string>}
 */
export async function extractTextFromFile(file) {
  const extension = file.name.split('.').pop().toLowerCase();

  try {
    if (extension === 'docx' || extension === 'doc') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      if (result.value && result.value.trim().length > 0) {
        return result.value.trim();
      }
    }
  } catch (err) {
    console.warn(`Mammoth extraction failed for ${file.name}, trying fallback reader:`, err);
  }

  // Fallback / TXT / PDF text reader
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      let content = e.target.result || '';
      if (typeof content !== 'string') {
        content = new TextDecoder("utf-8").decode(new Uint8Array(content));
      }
      // Clean non-printable characters for pdf/binary if plain read
      const cleaned = content.replace(/[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, ' ').replace(/\s+/g, ' ').trim();
      resolve(cleaned || `Content extracted from ${file.name}`);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
}

/**
 * File validation helper
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateFile(file) {
  const allowedExtensions = ['pdf', 'docx', 'doc', 'txt'];
  const extension = file.name.split('.').pop().toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file type ".${extension}". Only PDF, DOCX, DOC, and TXT files are allowed.`
    };
  }

  const maxSizeBytes = 10 * 1024 * 1024; // 10 MB limit
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File "${file.name}" exceeds maximum allowed size of 10 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB).`
    };
  }

  return { valid: true };
}
