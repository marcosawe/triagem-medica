import IntegrationProcessGemini from '@/connections-llm/core/usecases/gemini/order/gemini.oeder.llms';
import { Router } from 'express';
import { z } from "zod";

const app = Router();

// POST API - Rota para 
export function geminiCoreRequisition(){
  app.post("/:id", (req,_)=>{
    const id = z.uuid().parse(req.params.id)
    IntegrationProcessGemini(id)
  })
}