import { IPathNode, IContentPart } from "../model/content/ipath.core.model.content";

export class GeminiAdapter {
  static toApiFormat(nodes: IPathNode[]) {
    // Filtra 'system' para o formato específico do Gemini ou mapeia para 'user' dependendo da versão
    return nodes.map(node => ({
      role: node.role === 'model' ? 'model' : 'user',
      parts: node.parts.map(part => {
        if (part.type === 'text') return { text: part.text };
        if (part.type === 'inline_data') return { inlineData: part.inlineData };
        if (part.type === 'function_call') return { functionCall: part.functionCall };
        if (part.type === 'function_response') return { functionResponse: part.functionResponse };
        return { text: "" };
      })
    }));
  }

  async execute(nodes: IPathNode[]): Promise<Partial<IPathNode>> {
    const contents = GeminiAdapter.toApiFormat(nodes);
    
    // Simulação de chamada: aqui você usaria @google/generative-ai
    return {
      role: 'model',
      parts: [{ type: 'text', text: "Resposta processada pelo Gemini 1.5 Pro." }],
      metadata: { 
        model_version: 'gemini-1.5-pro',
        executedAt: new Date(),
        finish_reason: 'STOP'
      }
    };
  }
}