import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AnalysisResult {
  branding: {
    paleta: string[];
    tipografia: string;
    efeitos: string[];
  };
  elementos: {
    objetosCentrais: string[];
    tratamentoVisual: string;
  };
  informacoes: {
    headline: string;
    subheadline: string;
    cta: string;
    outrosTextos: string[];
  };
  diagramacao: {
    grid: string;
    alinhamento: string;
    posicionamento: string[];
  };
  materiais: {
    sugestoesRepositorio: string[];
  };
  explicacao_tecnica: string;
}

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        }
      },
      {
        text: `Atue como o motor de análise do repositório layout_reverse_enginee. Sua tarefa é desestruturar artes da Conexão Implantes em dados JSON.

Regras de Extração:

Branding: Identifique os tons de azul e dourado e a tipografia Sans-Serif.

Layout: Mapeie as coordenadas (x, y) e o grid lateral (alinhamento à esquerda).

Assets: Identifique quais implantes estão na imagem e sugira o arquivo correspondente na estrutura do Heverton-web/materials.

Copy: Extraia Headline, Subheadline e CTA separadamente.

Formato de Saída (Obrigatório):
Responda apenas com o JSON estruturado para que a V1 possa interpretá-lo sem erros.`
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          branding: {
            type: Type.OBJECT,
            properties: {
              paleta: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Códigos hexadecimais das cores" },
              tipografia: { type: Type.STRING, description: "Análise da tipografia" },
              efeitos: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Efeitos visuais aplicados" }
            }
          },
          elementos: {
            type: Type.OBJECT,
            properties: {
              objetosCentrais: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Objetos principais na imagem" },
              tratamentoVisual: { type: Type.STRING, description: "Descrição do tratamento visual (nitidez, brilho, desfoque)" }
            }
          },
          informacoes: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING, description: "Título principal" },
              subheadline: { type: Type.STRING, description: "Subtítulo" },
              cta: { type: Type.STRING, description: "Call to Action" },
              outrosTextos: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Outros textos encontrados" }
            }
          },
          diagramacao: {
            type: Type.OBJECT,
            properties: {
              grid: { type: Type.STRING, description: "Descrição do grid utilizado" },
              alinhamento: { type: Type.STRING, description: "Tipo de alinhamento predominante" },
              posicionamento: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Posição espacial dos elementos" }
            }
          },
          materiais: {
            type: Type.OBJECT,
            properties: {
              sugestoesRepositorio: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Sugestões de arquivos do repositório Heverton-web/materials" }
            }
          },
          explicacao_tecnica: {
            type: Type.STRING,
            description: "Explicação técnica de por que o design funciona"
          }
        },
        required: ["branding", "elementos", "informacoes", "diagramacao", "materiais", "explicacao_tecnica"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};
