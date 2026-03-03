import express from "express"
import { appBackEndRouter } from "./api/llm.routes.api"

const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.urlencoded())
app.use("/api", appBackEndRouter)


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/api`)
})