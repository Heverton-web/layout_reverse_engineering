import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (base64: string, mimeType: string, dataUrl: string) => void;
  isLoading: boolean;
}

export function ImageUploader({ onImageSelect, isLoading }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, envie apenas imagens.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);
      
      // Extract base64 and mime type
      const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        onImageSelect(matches[2], matches[1], dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-mono text-text-secondary uppercase tracking-widest">Input de Referência</h2>
        {previewUrl && !isLoading && (
          <button 
            onClick={clearImage}
            className="text-xs text-text-secondary hover:text-white flex items-center gap-1 transition-colors"
          >
            <X size={14} /> Limpar
          </button>
        )}
      </div>

      {!previewUrl ? (
        <div 
          className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-colors ${
            dragActive ? 'border-accent bg-accent/5' : 'border-border hover:border-text-secondary/50 bg-panel'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-full bg-bg-dark flex items-center justify-center mb-4 border border-border">
            <Upload className="text-text-secondary" size={24} />
          </div>
          <p className="text-sm font-medium mb-1">Arraste uma imagem ou clique</p>
          <p className="text-xs text-text-secondary font-mono">PNG, JPG, WEBP até 10MB</p>
        </div>
      ) : (
        <div className="flex-1 relative rounded-xl overflow-hidden bg-panel border border-border flex items-center justify-center group">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className={`max-w-full max-h-full object-contain ${isLoading ? 'opacity-50 blur-sm' : ''} transition-all duration-300`}
            referrerPolicy="no-referrer"
          />
          
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-dark/50 backdrop-blur-sm">
              <Loader2 className="animate-spin text-accent mb-4" size={32} />
              <div className="text-xs font-mono text-accent tracking-widest uppercase animate-pulse">
                Processando Visão Computacional...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
