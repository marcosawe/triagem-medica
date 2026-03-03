import { z } from 'zod';
import { UsageSchema, PerformanceSchema, LogprobsSchema, SettingsSchema } from './ipath.core.model.content';

// --- Texto Puro ---
export const TextPartSchema = z.object({
  type: z.literal('text'),
  text: z.string().min(1).describe("Conteúdo textual"),
});
export type ITextPart = z.infer<typeof TextPartSchema>;

// --- Dados Inline (imagem/arquivo) ---
export const InlineDataPartSchema = z.object({
  type: z.literal('inline_data'),
  inlineData: z.object({
    mimeType: z.string().refine(
      (val) => /^[a-z]+\/[a-z0-9\-\+]+$/i.test(val),
      "Formato MIME inválido"
    ),
    data: z.string().refine(
      (val) => /^[A-Za-z0-9+/]+=*$/.test(val),
      "Base64 inválido"
    ),
  }),
});
export type IInlineDataPart = z.infer<typeof InlineDataPartSchema>;

// --- Chamada de Função (solicitação do modelo) ---
export const FunctionCallPartSchema = z.object({
  type: z.literal('function_call'),
  functionCall: z.object({
    name: z.string().min(1),
    args: z.record(z.string(), z.any()), // explícito
  }),
});
export type IFunctionCallPart = z.infer<typeof FunctionCallPartSchema>;

// --- Resposta de Função (resultado da execução) ---
export const FunctionResponsePartSchema = z.object({
  type: z.literal('function_response'),
  functionResponse: z.object({
    name: z.string().min(1),
    response: z.record(z.string(), z.any()), // explícito
  }),
});
export type IFunctionResponsePart = z.infer<typeof FunctionResponsePartSchema>;

// --- União discriminada ---
export const ContentPartSchema = z.discriminatedUnion('type', [
  TextPartSchema,
  InlineDataPartSchema,
  FunctionCallPartSchema,
  FunctionResponsePartSchema,
]);
export type IContentPart = z.infer<typeof ContentPartSchema>;

// --- Defina ou importe ExecutionMetadataSchema ---
// Exemplo mínimo (substitua pela definição real):
export const ExecutionMetadataSchema = z.object({
  timestamp: z.date().optional(),
  // ... outros campos
});
export type IExecutionMetadata = z.infer<typeof ExecutionMetadataSchema>;

// --- Path Node Schema ---
export const PathNodeSchema = z.object({
  // Identificação e rastreamento
  id: z.string().uuid(),
  parent_id: z.string().uuid().nullable(),

  // Dados da mensagem
  role: z.enum(['user', 'model', 'system', 'tool']),
  parts: z.array(ContentPartSchema),

  // Metadados de execução (opcionais)
  metadata: ExecutionMetadataSchema.optional(),

  // Métricas de consumo e performance (opcionais)
  usage: UsageSchema.optional(),
  performance: PerformanceSchema.optional(),
  settings: SettingsSchema.optional(),
  logprobs: LogprobsSchema,
});

export type IPathNode = z.infer<typeof PathNodeSchema>;