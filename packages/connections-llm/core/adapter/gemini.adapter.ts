// src/infrastructure/llm/gemini-mapper.ts

import { Part } from "@google/generative-ai";
import { IContentPart } from "../model/content/content-parte.core.model.content";
import { IPathNode } from "../model/content/ipath.core.model.content";

export class GeminiMapper {
  
  static toGeminiFormat(nodes: IPathNode[]): any[] {
    return nodes.map(node => ({
      role: node.role === 'model' ? 'model' : 'user', // Gemini usa 'model' em vez de 'assistant'
      parts: node.parts.map(part => this.mapPart(part))
    }));
  }

  private static mapPart(part: IContentPart): Part {
    switch (part.type) {
      case 'text':
        return { text: part.text! };
      case 'inline_data':
        return {
          inlineData: {
            mimeType: part.inlineData!.mimeType,
            data: part.inlineData!.data // Base64
          }
        };
      case 'function_call':
        return {
          functionCall: {
            name: part.functionCall!.name,
            args: part.functionCall!.args
          }
        };
      default:
        throw new Error(`Tipo de parte não suportado pelo Gemini: ${part.type}`);
    }
  }
}