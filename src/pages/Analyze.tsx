import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Loader2, X, CheckCircle2, AlertCircle } from "lucide-react";
import { extractTextFromPDF } from "../lib/pdfParser";
import { parseResumeText } from "../lib/parser";
import { analyzeResume } from "../lib/analyzer";
import type { AnalysisResult } from "../types";

export default function Analyze() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState("");

  const handleFile = useCallback((f: File) => {
    setError(null);
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB");
      return;
    }
    setFile(f);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleAnalyze = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      setProgress("Extracting text from PDF...");
      const text = await extractTextFromPDF(file);

      if (!text.trim()) {
        throw new Error("Could not extract text from the PDF. Please ensure the PDF contains selectable text.");
      }

      setProgress("Parsing resume structure...");
      await new Promise((r) => setTimeout(r, 500));
      const parsed = parseResumeText(text);

      setProgress("Running AI analysis...");
      await new Promise((r) => setTimeout(r, 800));
      const result: AnalysisResult = analyzeResume(parsed);

      setProgress("Finalizing results...");
      await new Promise((r) => setTimeout(r, 300));

      sessionStorage.setItem("analysisResult", JSON.stringify(result));
      navigate("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during analysis");
    } finally {
      setIsProcessing(false);
      setProgress("");
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Upload Your Resume</h1>
          <p className="mt-3 text-gray-400">
            Upload your PDF resume and get instant AI-powered feedback
          </p>
        </div>

        {/* Upload Area */}
        <div
          className={`mt-12 rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
            isDragOver
              ? "border-primary-400 bg-primary-500/10"
              : file
                ? "border-green-500/50 bg-green-500/5"
                : "border-white/10 bg-white/[0.02] hover:border-white/20"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary-400" />
              <p className="text-lg font-medium">{progress}</p>
              <div className="h-2 w-64 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
              </div>
            </div>
          ) : file ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <p className="text-lg font-medium">{file.name}</p>
                <p className="text-sm text-gray-400">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setError(null);
                }}
                className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/20"
              >
                <X className="h-4 w-4" />
                Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  Drag & drop your resume here
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  or click to browse
                </p>
              </div>
              <label className="cursor-pointer rounded-lg bg-white/10 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/20">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
                Select PDF File
              </label>
              <p className="text-xs text-gray-500">PDF only, up to 10MB</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {file && !isProcessing && (
          <button
            onClick={handleAnalyze}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-primary-600/25 transition-all hover:shadow-2xl"
          >
            <FileText className="h-5 w-5" />
            Analyze Resume
          </button>
        )}

        {/* Tips */}
        <div className="mt-12 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h3 className="text-lg font-semibold">Tips for Best Results</h3>
          <ul className="mt-4 space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-400" />
              Use a text-based PDF (not scanned images) for accurate text extraction
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-400" />
              Ensure your resume has clear section headers (Experience, Education, Skills)
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-400" />
              Include contact information, work experience, education, and skills
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-400" />
              One-page resumes work best, but multi-page resumes are also supported
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
