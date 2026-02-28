import { z } from 'zod';

// ============================================================================
// 1. Schemas de Métricas (Custo, Performance, Configurações, Logprobs)
// ============================================================================

export const UsageSchema = z.object({
  prompt_tokens: z.number().min(4).describe("Tokens enviados no input"),
  completion_tokens: z.number().describe("Tokens gerados pelo modelo"),
  total_tokens: z.number(),
  cached_tokens: z.number().optional().describe("Tokens reaproveitados de cache (reduz custo)"),
});
export type IUsage = z.infer<typeof UsageSchema>;

export const PerformanceSchema = z.object({
  latency_ms: z.number().describe("Tempo total da requisição em milissegundos"),
  time_to_first_token_ms: z.number().optional().describe("Latência inicial (streaming)"),
  tokens_per_second: z.number().optional().describe("Velocidade de geração"),
});
export type IPerformance = z.infer<typeof PerformanceSchema>;

export const SettingsSchema = z.object({
  model_version: z.string().describe("Ex: gpt-4o-2024-05-13 ou gemini-1.5-pro"),
  temperature: z.number().min(0).max(2).optional(),
  top_p: z.number().optional(),
  stop_reason: z.enum(['stop', 'length', 'content_filter', 'tool_calls']).optional(),
});
export type ISettings = z.infer<typeof SettingsSchema>;

export const LogprobsSchema = z.array(z.any()).optional()
  .describe("Probabilidade de escolha de cada token");
export type ILogprobs = z.infer<typeof LogprobsSchema>;

// ============================================================================
// 2. Schemas de Partes da Mensagem (Content Parts)
// ============================================================================

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
    args: z.record(z.string(), z.any()), // objeto com chaves string e valores qualquer
  }),
});
export type IFunctionCallPart = z.infer<typeof FunctionCallPartSchema>;

// --- Resposta de Função (resultado da execução) ---
export const FunctionResponsePartSchema = z.object({
  type: z.literal('function_response'),
  functionResponse: z.object({
    name: z.string().min(1),
    response: z.record(z.string(), z.any()),
  }),
});
export type IFunctionResponsePart = z.infer<typeof FunctionResponsePartSchema>;

// --- União discriminada de todas as partes ---
export const ContentPartSchema = z.discriminatedUnion('type', [
  TextPartSchema,
  InlineDataPartSchema,
  FunctionCallPartSchema,
  FunctionResponsePartSchema,
]);
export type IContentPart = z.infer<typeof ContentPartSchema>;

// ============================================================================
// 3. Metadados de Execução (opcional, pode ser expandido)
// ============================================================================

export const ExecutionMetadataSchema = z.object({
  executedAt: z.date().optional(),
  // Adicione outros campos conforme necessidade, ex:
  // duration_ms: z.number().optional(),
  // error: z.string().optional(),
});
export type IExecutionMetadata = z.infer<typeof ExecutionMetadataSchema>;

// ============================================================================
// 4. Schema Unificado do PathNode
// ============================================================================

export const PathNodeSchema = z.object({
  // Identificação e rastreamento
  id: z.uuid,
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

// ============================================================================
// 5. Interface para Gerenciamento do Path
// ============================================================================

export interface IPath {
  /** Lista de nós na ordem em que foram adicionados */
  nodes: IPathNode[];

  /**
   * Adiciona um novo nó ao path.
   * @param node - Nó sem o campo `id` (que será gerado automaticamente)
   * @returns O nó completo com o `id` gerado
   */
  append(node: Omit<IPathNode, 'id'>): IPathNode;

  /**
   * Cria um novo branch a partir de um nó existente.
   * @param nodeId - ID do nó a partir do qual o fork será criado
   * @returns Uma nova instância de IPath contendo o histórico até o nó especificado
   */
  fork(nodeId: string): IPath;

  /** Retorna todo o histórico de nós (cópia) */
  getHistory(): IPathNode[];

  /** Desfaz a última operação (se possível) */
  undo(): void;

  /**
   * Converte o path para o formato esperado pela API do modelo (ex.: Gemini, OpenAI).
   * Deve ser implementado conforme o adapter específico.
   */
  toApiFormat(): any[];
}