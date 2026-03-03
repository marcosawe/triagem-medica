import { IPathNode } from "../model/content/ipath.core.model.content";

export class ChatGPTAdapter {
  static toApiFormat(nodes: IPathNode[]) {
    return nodes.map(node => {
      // Converte roles do sistema interno para o padrão OpenAI
      let role: 'system' | 'user' | 'assistant' | 'tool' = 'user';
      if (node.role === 'model') role = 'assistant';
      else if (node.role === 'system' || node.role === 'tool') role = node.role;

      // OpenAI geralmente espera 'content' como string ou array de objetos
      const content = node.parts.map(p => {
        if (p.type === 'text') return p.text;
        // Para imagens, a OpenAI usa uma estrutura diferente (url base64)
        return ""; 
      }).join("\n");

      return { role, content };
    });
  }

  async execute(nodes: IPathNode[]): Promise<Partial<IPathNode>> {
    const messages = ChatGPTAdapter.toApiFormat(nodes);
    
    return {
      role: 'model',
      parts: [{ type: 'text', text: "Resposta processada pelo GPT-4o." }],
      metadata: { 
        model_version: 'gpt-4o',
        executedAt: new Date(),
        finish_reason: 'STOP'
      },
    };
  }
}