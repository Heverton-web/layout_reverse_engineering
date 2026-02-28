import React, { useState } from 'react';
import { AnalysisResult } from '../services/gemini';
import { Palette, Type, Layers, AlignLeft, Box, Lightbulb, CheckCircle2, Code } from 'lucide-react';

interface AnalysisResultsProps {
  result: AnalysisResult | null;
}

type TabType = 'branding' | 'elementos' | 'informacoes' | 'diagramacao' | 'materiais' | 'json';

export function AnalysisResults({ result }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('branding');

  if (!result) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-text-secondary border border-border rounded-xl bg-panel p-8">
        <Box size={48} className="mb-4 opacity-20" />
        <p className="text-sm font-mono text-center max-w-xs">
          Aguardando input de imagem para iniciar a engenharia reversa do layout.
        </p>
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'branding', label: 'Branding', icon: <Palette size={16} /> },
    { id: 'elementos', label: 'Elementos', icon: <Layers size={16} /> },
    { id: 'informacoes', label: 'Informações', icon: <Type size={16} /> },
    { id: 'diagramacao', label: 'Diagramação', icon: <AlignLeft size={16} /> },
    { id: 'materiais', label: 'Materiais', icon: <Box size={16} /> },
    { id: 'json', label: 'JSON Raw', icon: <Code size={16} /> },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-panel border border-border rounded-xl overflow-hidden">
      {/* Tabs Header */}
      <div className="flex overflow-x-auto border-b border-border bg-bg-dark scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-xs font-mono uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-accent border-b-2 border-accent bg-panel'
                : 'text-text-secondary hover:text-white hover:bg-panel/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'branding' && (
          <div className="space-y-8">
            <Section title="Paleta de Cores">
              <div className="flex flex-wrap gap-4">
                {result.branding.paleta.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-bg-dark p-2 rounded-lg border border-border pr-4">
                    <div 
                      className="w-8 h-8 rounded-md border border-border shadow-inner" 
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-mono text-sm">{color}</span>
                  </div>
                ))}
              </div>
            </Section>
            
            <Section title="Tipografia">
              <p className="text-sm leading-relaxed">{result.branding.tipografia}</p>
            </Section>

            <Section title="Efeitos Visuais">
              <ul className="space-y-2">
                {result.branding.efeitos.map((efeito, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 size={16} className="text-accent mt-0.5 shrink-0" />
                    <span>{efeito}</span>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        )}

        {activeTab === 'elementos' && (
          <div className="space-y-8">
            <Section title="Objetos Centrais">
              <ul className="space-y-2">
                {result.elementos.objetosCentrais.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </Section>
            
            <Section title="Tratamento Visual">
              <p className="text-sm leading-relaxed">{result.elementos.tratamentoVisual}</p>
            </Section>
          </div>
        )}

        {activeTab === 'informacoes' && (
          <div className="space-y-6">
            <DataRow label="Headline" value={result.informacoes.headline} />
            <DataRow label="Subheadline" value={result.informacoes.subheadline} />
            <DataRow label="Call to Action" value={result.informacoes.cta} />
            
            {result.informacoes.outrosTextos.length > 0 && (
              <Section title="Outros Textos">
                <ul className="space-y-2">
                  {result.informacoes.outrosTextos.map((texto, idx) => (
                    <li key={idx} className="text-sm text-text-secondary font-mono p-3 bg-bg-dark rounded border border-border">
                      "{texto}"
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>
        )}

        {activeTab === 'diagramacao' && (
          <div className="space-y-8">
            <DataRow label="Grid Estrutural" value={result.diagramacao.grid} />
            <DataRow label="Alinhamento" value={result.diagramacao.alinhamento} />
            
            <Section title="Posicionamento Espacial">
              <div className="grid grid-cols-1 gap-2">
                {result.diagramacao.posicionamento.map((pos, idx) => (
                  <div key={idx} className="text-sm font-mono p-3 bg-bg-dark rounded border border-border border-l-2 border-l-accent">
                    {pos}
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {activeTab === 'materiais' && (
          <div className="space-y-6">
            <Section title="Mapeamento de Repositório (Heverton-web/materials)">
              <div className="space-y-3">
                {result.materiais.sugestoesRepositorio.map((sugestao, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-bg-dark rounded-lg border border-border">
                    <Box size={18} className="text-text-secondary shrink-0 mt-0.5" />
                    <span className="text-sm font-mono text-blue-300">{sugestao}</span>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {activeTab === 'json' && (
          <div className="h-full">
            <Section title="JSON Estruturado Bruto">
              <div className="bg-bg-dark p-4 rounded-lg border border-border overflow-x-auto">
                <pre className="text-xs font-mono text-green-400">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </Section>
          </div>
        )}
      </div>

      {/* Technical Explanation Footer */}
      <div className="border-t border-border bg-[#1a1a1a] p-6">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={16} className="text-yellow-500" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-yellow-500">Análise Técnica do Design</h3>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-yellow-500/30 pl-4">
          {result.explicacao_tecnica}
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-4">{title}</h3>
      {children}
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1 border-b border-border pb-4">
      <span className="text-xs font-mono text-text-secondary uppercase tracking-widest">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
