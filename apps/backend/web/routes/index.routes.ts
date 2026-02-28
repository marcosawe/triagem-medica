import express, {Express} from "express"
import { geminiCoreRequisition } from "./llms/gemini.web.routes.llms"

const app: Express = express()

app.post("/api/gemini", geminiCoreRequisition)