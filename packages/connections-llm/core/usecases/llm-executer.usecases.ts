import { v4 as uuidv4 } from 'uuid'; // Instale com: npm install uuid @types/uuid
import { ChatGPTAdapter } from "../adapter/chatgpt.adapter";
import { GeminiAdapter } from "../adapter/gemini.adapter";
import { IPathNode, PathNodeSchema } from "../model/content/ipath.core.model.content";
import { DeepSeekAdapter } from '../adapter/deepseak.adapter';

export type LLMProvider = 'gemini' | 'chatgpt' | 'deepseek';

export class LLMExecutor {
  /**
   * Processa a requisição para o provedor selecionado
   * @param provider O provedor de LLM
   * @param history O histórico completo de PathNodes
   */
  static async process(provider: LLMProvider, history: IPathNode[]): Promise<IPathNode> {
    try {
      const adapter = this.getAdapter(provider);
      

      const responseData = await adapter.execute(history);

      if (!responseData.parts || responseData.parts.length === 0) {
        throw new Error(`O provedor ${provider} retornou uma resposta vazia.`);
      }

      const lastNode = history[history.length - 1];

      return PathNodeSchema.parse({
        id: uuidv4(),
        parent_id: lastNode?.id || null,
        role: 'model',
        parts: responseData.parts,
        metadata: {
          ...responseData.metadata,
          executedAt: responseData.metadata?.executedAt || new Date(),
        },
        usage: responseData.usage || { 
          prompt_tokens: 0, 
          completion_tokens: 0, 
          total_tokens: 0 
        }
      });
    } catch (error: any) {
      console.error(`[LLMExecutor Error] - Provider: ${provider}`, error);
      throw new Error(`Falha no processamento LLM: ${error.message}`);
    }
  }


  private static getAdapter(provider: LLMProvider) {
    switch (provider) {
      case 'gemini': return new GeminiAdapter();
      case 'chatgpt': return new ChatGPTAdapter();
      case 'deepseek': return new DeepSeekAdapter();
      default:
        throw new Error(`Provedor de LLM não suportado: ${provider}`);
    }
  }
}