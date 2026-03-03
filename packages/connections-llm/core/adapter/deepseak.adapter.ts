import { IPathNode } from "../model/content/ipath.core.model.content";

export class DeepSeekAdapter {
  static toApiFormat(nodes: IPathNode[]) {
    // DeepSeek segue o padrão de Chat Completion da OpenAI
    return nodes.map(node => ({
      role: node.role === 'model' ? 'assistant' : (node.role === 'system' ? 'system' : 'user'),
      content: node.parts
        .filter(p => p.type === 'text')
        .map(p => (p as any).text)
        .join("\n")
    }));
  }

  async execute(nodes: IPathNode[]): Promise<Partial<IPathNode>> {
    const messages = DeepSeekAdapter.toApiFormat(nodes);

    return {
      role: 'model',
      parts: [{ type: 'text', text: "Resposta processada pelo DeepSeek-V3." }],
      metadata: { 
        model_version: 'deepseek-chat',
        executedAt: new Date(),
        finish_reason: 'STOP'
      },
      usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 }
    };
  }
}