import { z } from 'zod';

export const ExecutionMetadataSchema = z.object({
  // Controle de Custos
  usage: z.object({
    prompt_tokens: z.number().int().nonnegative(),
    completion_tokens: z.number().int().nonnegative(),
    total_tokens: z.number().int().nonnegative(),
  }).optional(),

  // Performance
  latency_ms: z.number().positive().optional(),
  
  // Rastreabilidade
  model_version: z.string().optional(), // ex: 'gemini-1.5-pro'
  timestamp: z.string().datetime().default(() => new Date().toISOString()),

  // Estado da Resposta
  finish_reason: z.enum(['STOP', 'MAX_TOKENS', 'SAFETY', 'RECITATION', 'OTHER']).optional(),
  
  // Expansibilidade (Caso a API envie algo novo no futuro)
}).catchall(z.any());

export type IExecutionMetadata = z.infer<typeof ExecutionMetadataSchema>;