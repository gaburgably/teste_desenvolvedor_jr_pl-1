import { Router, Request, Response } from "express";
import { TasksRepository } from "../repositories/tasksRepository";

const router = Router();
const tasksRepository = new TasksRepository();
const SUPPORTED_LANGS = ['pt', 'en', 'es'];

// POST: Cria uma tarefa e solicita resumo ao serviço Python
router.post("/", async (req: Request, res: Response) => {
  try {
    const { text, lang } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Campo "text" é obrigatório.' });
    }
    if (!lang || !SUPPORTED_LANGS.includes(lang)) {
      return res.status(400).json({ error: 'Language not supported.' });
    }

    // Cria a "tarefa"
    const task = tasksRepository.createTask(text, lang);

    // Chamada do serviço Python
    const pythonRes = await fetch('http://localhost:8000/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang }),
    });

    // Checa se o serviço retornou um erro
    if (!pythonRes.ok) {
      const errorBody = await pythonRes.text();
      console.error(`Python API error: ${pythonRes.status} ${pythonRes.statusText}`);
      console.error(`Python API body: ${errorBody}`);
      return res.status(500).json({
        error: "Erro ao gerar resumo do texto.",
        details: errorBody
      });
    }

    // Deve solicitar o resumo do texto ao serviço Python
    const summaryData = await pythonRes.json();
    const summary = summaryData.summary || summaryData;

    // Atualiza a tarefa com o resumo
    tasksRepository.updateTask(task.id, summary);

    return res.status(201).json({
      message: "Tarefa criada com sucesso!",
      task: tasksRepository.getTaskById(task.id),
    });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return res
      .status(500)
      .json({ error: "Ocorreu um erro ao criar a tarefa." });
  }
});

// GET: Lista todas as tarefas
router.get("/", (req, res) => {
  const tasks = tasksRepository.getAllTasks();
  return res.json(tasks);
});


// GET /tasks/:id retorna tarefa específica por ID
router.get("/:id", (req: Request, res: Response) => {
  const task = tasksRepository.getTaskById(Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Tarefa não encontrada.' });
  return res.json(task);
});

// DELETE /tasks/:id deleta tarefa por ID
router.delete("/:id", (req: Request, res: Response) => {
  const deleted = tasksRepository.deleteTask(Number(req.params.id));
  if (!deleted) return res.status(404).json({ error: 'Tarefa não encontrada.' });
  return res.status(204).send();
});

export default router;
