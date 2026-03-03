import { z } from 'zod';

// ============================================================================
// 1. Métricas e Configurações (Opcionais)
// ============================================================================

export const UsageSchema = z.object({
  prompt_tokens: z.number().int().nonnegative().default(0),
  completion_tokens: z.number().int().nonnegative().default(0),
  total_tokens: z.number().int().nonnegative().default(0),
  cached_tokens: z.number().int().nonnegative().optional(),
});

export const PerformanceSchema = z.object({
  latency_ms: z.number().positive().optional(),
  time_to_first_token_ms: z.number().positive().optional(),
});

/** Configurações usadas na geração (temp, top_p, etc) */
export const SettingsSchema = z.object({
  model_version: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  top_p: z.number().optional(),
  max_tokens: z.number().optional(),
}).catchall(z.any());

/** Probabilidades de tokens (deixe como any por enquanto para não complicar) */
export const LogprobsSchema = z.array(z.any()).optional();

// ============================================================================
// 2. Metadados de Execução
// ============================================================================

export const ExecutionMetadataSchema = z.object({
  model_version: z.string().min(1),
  executedAt: z.date().default(() => new Date()),
  finish_reason: z.enum(['STOP', 'MAX_TOKENS', 'SAFETY', 'RECITATION', 'CONTENT_FILTER', 'OTHER']).optional(),
  requestId: z.string().optional(),
  error: z.string().optional(),
}).catchall(z.any());

// ============================================================================
// 3. Conteúdo (Parts)
// ============================================================================

export const TextPartSchema = z.object({
  type: z.literal('text'),
  text: z.string().min(1),
});

export const InlineDataPartSchema = z.object({
  type: z.literal('inline_data'),
  inlineData: z.object({
    mimeType: z.string().regex(/^[a-z]+\/[a-z0-9\-\+]+$/i),
    data: z.string(),
  }),
});

export const FunctionCallPartSchema = z.object({
  type: z.literal('function_call'),
  functionCall: z.object({
    name: z.string(),
    args: z.record(z.string(), z.any()),
  }),
});

export const FunctionResponsePartSchema = z.object({
  type: z.literal('function_response'),
  functionResponse: z.object({
    name: z.string(),
    response: z.record(z.string(), z.any()),
  }),
});

export const ContentPartSchema = z.discriminatedUnion('type', [
  TextPartSchema,
  InlineDataPartSchema,
  FunctionCallPartSchema,
  FunctionResponsePartSchema,
]);

// ============================================================================
// 4. Schema Unificado do PathNode
// ============================================================================

export const PathNodeSchema = z.object({
  id: z.string().uuid(),
  parent_id: z.string().uuid().nullable(),
  role: z.enum(['user', 'model', 'system', 'assistant', 'tool']),
  parts: z.array(ContentPartSchema),
  
  metadata: ExecutionMetadataSchema,
  
  usage: UsageSchema.optional(),
  performance: PerformanceSchema.optional(),
  settings: SettingsSchema.optional(), 
  logprobs: LogprobsSchema,            
});

export type IPathNode = z.infer<typeof PathNodeSchema>;
export type IContentPart = z.infer<typeof ContentPartSchema>;