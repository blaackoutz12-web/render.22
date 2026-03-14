import { Router, type IRouter } from "express";
import { getBingoMatches } from "../data/matches.js";

const router: IRouter = Router();

const OPENROUTER_KEY = process.env["OPENROUTER_KEY"] || "";

router.post("/chat", async (req, res) => {
  const { message } = req.body as { message?: string };

  if (!message) {
    res.status(400).json({ response: "Message is required." });
    return;
  }

  const topMatches = getBingoMatches()
    .slice(0, 3)
    .map((m) => `${m.team1_nome} vs ${m.team2_nome} (Odds: ${m.team1}/${m.empate}/${m.team2}, Melhor aposta: ${m.best_market}, EV: +${m.value_pct}%)`)
    .join("; ");

  const context = topMatches || "Sem dados de partidas no momento.";

  if (!OPENROUTER_KEY) {
    const fallbackResponses: Record<string, string> = {
      default: `Como especialista em análise de odds, posso dizer que o value bet mais importante é identificar quando a odd real é maior que a probabilidade implícita. Com base nos dados atuais: ${context}`,
    };
    res.json({ response: fallbackResponses.default });
    return;
  }

  try {
    const prompt = `Você é um especialista em análise de apostas esportivas. 
Contexto atual - Top 3 jogos com melhor expected value: ${context}

Usuário pergunta: ${message}

Responda de forma concisa, direta e útil em português. Máximo 3 parágrafos.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (response.ok) {
      const data = (await response.json()) as {
        choices: Array<{ message: { content: string } }>;
      };
      const aiResponse = data.choices?.[0]?.message?.content;
      res.json({ response: aiResponse || "Não foi possível obter resposta da IA." });
    } else {
      res.json({
        response: `Análise baseada nos dados: Os melhores jogos de hoje por expected value são: ${context}. Foque nos mercados com EV positivo acima de 15%.`,
      });
    }
  } catch {
    res.json({
      response: `Análise atual: ${context}. Recomendo focar nas apostas com maior EV percentual.`,
    });
  }
});

export default router;
