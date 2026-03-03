import { LLMExecutor, LLMProvider } from "@packages/connections-llm/core/usecases/llm-executer.usecases";
import { Router } from "express";

const router = Router()

export function appBackEndRouter(){
// apps/backend/web/routes/llms/chat.ts
router.post('/v1/chat/:provider', async (req, res) => {
  const { provider } = req.params; // 'gemini', 'chatgpt' etc
  const { nodes } = req.body;     // Array de IPathNode vindo do front

  const responseNode = await LLMExecutor.process(provider as LLMProvider, nodes);
  
  return res.status(200).json(responseNode);
});
}