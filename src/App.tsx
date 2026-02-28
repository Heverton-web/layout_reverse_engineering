import React, { useState } from 'react';
import { ScanLine, Activity } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResults } from './components/AnalysisResults';
import { analyzeImage, AnalysisResult } from './services/gemini';

export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleImageSelect = async (base64: string, mimeType: string) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeImage(base64, mimeType);
      setResult(analysis);
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Ocorreu um erro ao analisar a imagem. Verifique o console para mais detalhes.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-panel px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bg-dark border border-border flex items-center justify-center">
            <ScanLine className="text-accent" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Layout Reverse Engineering</h1>
            <p className="text-xs font-mono text-text-secondary uppercase tracking-wider">Dental Implant Industry</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-mono text-text-secondary">
          <Activity size={14} className={isAnalyzing ? "text-accent animate-pulse" : ""} />
          <span>{isAnalyzing ? "PROCESSANDO..." : "SISTEMA PRONTO"}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto w-full">
        {/* Left Column - Input */}
        <section className="lg:col-span-5 xl:col-span-4 flex flex-col h-[calc(100vh-8rem)]">
          <ImageUploader onImageSelect={handleImageSelect} isLoading={isAnalyzing} />
        </section>

        {/* Right Column - Output */}
        <section className="lg:col-span-7 xl:col-span-8 flex flex-col h-[calc(100vh-8rem)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-mono text-text-secondary uppercase tracking-widest">Parâmetros Extraídos</h2>
          </div>
          <AnalysisResults result={result} />
        </section>
      </main>
    </div>
  );
}
