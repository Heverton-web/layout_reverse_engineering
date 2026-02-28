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
        text: `Você é um Engenheiro de Visão Computacional especializado em Design Gráfico e Engenharia Reversa de Layouts para a indústria de implantes dentários. Sua função é receber uma imagem de referência e desestruturá-la em parâmetros técnicos que permitam a edição e replicação fiel do processo criativo.

Diretrizes de Análise:
1. Branding: Identifique a paleta de cores dominante (Background, Texto, Destaques) e extraia os códigos Hexadecimais aproximados. Analise a tipografia (Sans-Serif, hierarquia de pesos) e efeitos (ex: gradiente dourado metálico).
2. Elementos: Identifique os objetos centrais (ex: implantes de titânio). Descreva o tratamento visual (nitidez, brilho especular, desfoque de profundidade).
3. Informações: Realize o OCR de todos os textos, separando-os por função (Headline, Subheadline, CTA).
4. Diagramação: Mapeie a posição espacial e a escala de cada elemento. Determine o tipo de alinhamento.
5. Materiais: Compare os elementos detectados com a estrutura do repositório Heverton-web/materials. Sugira quais arquivos (logos, renders de implantes) devem ser usados para substituir os da referência.
6. Explicação Técnica: Forneça uma breve explicação técnica de por que o design original funciona (ex: uso de cores análogas ou contraste de valor).`
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
