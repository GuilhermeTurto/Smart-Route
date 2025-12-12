import { GoogleGenAI } from "@google/genai";
import { GenerationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Prospecção de Clientes
 */
export const findProspects = async (
  businessType: string,
  location: string,
  count: number
): Promise<GenerationResult> => {
  
  const prompt = `
    Atue como um especialista em inteligência comercial e logística de vendas.
    
    Tarefa:
    1. Pesquise por aproximadamente ${count} estabelecimentos do tipo "${businessType}" altamente avaliados em ou perto de "${location}".
    2. Forneça uma lista detalhada desses prospects. Para cada um, inclua:
       - **Nome do Negócio**
       - **Endereço Completo** (se disponível)
       - **Telefone** (se disponível)
       - **Gancho de Vendas:** Uma frase curta e personalizada para abordar este cliente específico (ex: mencionar o tipo de serviço, popularidade, etc).
    
    Formate a saída claramente usando Markdown. Use títulos para separar os itens.
    Priorize dados reais do Google Maps.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        systemInstruction: "Você é um assistente de vendas brasileiro, prestativo e profissional. Priorize precisão usando dados do Google Maps.",
      },
    });

    return {
      text: response.text || "Nenhum detalhe encontrado.",
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Otimização de Rotas (Lista Manual)
 */
export const optimizeRoute = async (
  addresses: string[]
): Promise<GenerationResult> => {

  const addressList = addresses.map((addr, i) => `${i + 1}. ${addr}`).join('\n');

  const prompt = `
    Atue como um motor de roteirização logística.
    
    Entrada (Endereços fora de ordem):
    ${addressList}
    
    Tarefa:
    1. Identifique e normalize a localização exata de cada endereço fornecido.
    2. Organize os endereços na ordem de visita mais eficiente (Rota Otimizada).
    3. Gere APENAS uma lista numerada final, sem nenhum texto introdutório, explicativo ou conclusivo.
    
    Formato de Saída Obrigatório (Markdown):
    N. **Endereço Normalizado (ou Nome do Local)** - [Abrir no Maps](https://www.google.com/maps/search/?api=1&query=ENDERECO_URL_ENCODED)
    
    Exemplo:
    1. **Av. Paulista, 1000 - Bela Vista** - [Abrir no Maps](https://www.google.com/maps/search/?api=1&query=Av.+Paulista%2C+1000)
    
    Regras Críticas:
    - NÃO inclua "Passo a passo".
    - NÃO inclua análises de distância.
    - NÃO inclua nenhum texto além da lista numerada.
    - O parâmetro 'query' na URL deve estar devidamente codificado (URL Encoded) para funcionar ao clicar.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }], 
        systemInstruction: "Você é um roteirizador estritamente objetivo. Apenas retorne a lista formatada conforme solicitado.",
      },
    });

    return {
      text: response.text || "Não foi possível calcular a rota.",
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };

  } catch (error) {
    console.error("Gemini API Error (Route):", error);
    throw error;
  }
};