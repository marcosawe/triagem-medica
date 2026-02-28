import { GeminiMapper } from "@/connections-llm/core/adapter/gemini.adapter";
import { z } from "zod";

const UuidSchema = z.uuid();

export default function IntegrationProcessGemini(id: string, parentID: string){
  const parsedId = UuidSchema.parse(id);
  const parentIDs = UuidSchema.parse(parentID);

  GeminiMapper.toGeminiFormat([
    {
      id: parsedId,
      parent_id: null,
      role: "user",
      parts: []
    }
  ]);

  GeminiMapper.
}