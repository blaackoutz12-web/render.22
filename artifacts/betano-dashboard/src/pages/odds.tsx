import { useGetMatches, useGetLeagues } from "@workspace/api-client-react";
import { ListTree, Filter, MessageSquare, ShieldAlert, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

function getRisk(match: { best_market: string; team1: number; empate: number; team2: number }) {
  const odd =
    match.best_market === "Casa" ? match.team1
    : match.best_market === "Empate" ? match.empate
    : match.team2;
  return odd >= 2.5 ? "alto" : "baixo";
}

function buildChatMessage(m: {
  team1_nome: string; team2_nome: string; liga: string;
  team1: number; empate: number; team2: number; value_pct: number; best_market: string;
}) {
  return `Analise essa aposta para mim:\n${m.team1_nome} vs ${m.team2_nome} (${m.liga})\nOdds: Casa ${m.team1.toFixed(2)} | Empate ${m.empate.toFixed(2)} | Fora ${m.team2.toFixed(2)}\nMelhor mercado: ${m.best_market} | EV: +${m.value_pct.toFixed(2)}%`;
}

export function OddsPage() {
  const [selectedLeague, setSelectedLeague] = useState<string>("");
  const { data: leaguesData } = useGetLeagues();
  const queryParams = { view: "all" as const, ...(selectedLeague ? { league: selectedLeague } : {}) };
  const { data: matchesData, isLoading } = useGetMatches(queryParams);
  const [, navigate] = useLocation();

  const goToChat = (m: Parameters<typeof buildChatMessage>[0]) => {
    const encoded = encodeURIComponent(buildChatMessage(m));
    navigate(`/chat?match=${encoded}`);
  };

  return (
    <div className="flex flex-col space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <ListTree className="w-8 h-8 text-blue-400" />
            Todas as Odds
          </h1>
          <p className="text-muted-foreground mt-1">
            Base completa de odds coletadas com análise de expected value.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
            >
              <option value="">Todas as Ligas</option>
              {leaguesData?.leagues?.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-secondary/80 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Data/Hora</th>
                <th className="px-6 py-4 font-semibold">Liga</th>
                <th className="px-6 py-4 font-semibold">Jogo</th>
                <th className="px-6 py-4 font-semibold text-center">1 (Casa)</th>
                <th className="px-6 py-4 font-semibold text-center">X (Empate)</th>
                <th className="px-6 py-4 font-semibold text-center">2 (Fora)</th>
                <th className="px-6 py-4 font-semibold text-right">Edge (EV)</th>
                <th className="px-6 py-4 font-semibold text-center">Risco</th>
                <th className="px-6 py-4 font-semibold text-center">IA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-48"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-10 mx-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-10 mx-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-10 mx-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-16 ml-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-20 mx-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-10 mx-auto"></div></td>
                  </tr>
                ))
              ) : matchesData?.matches?.length ? (
                matchesData.matches.map((m, i) => {
                  const risk = getRisk(m);
                  return (
                    <tr key={i} className="hover:bg-secondary/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        {m.data} <br/> <span className={m.hora === 'AO VIVO' ? 'text-red-500 font-bold text-xs' : 'text-xs'}>{m.hora}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-muted-foreground">{m.liga}</td>
                      <td className="px-6 py-4 font-medium">
                        <div className="flex flex-col">
                          <span>{m.team1_nome}</span>
                          <span className="text-muted-foreground text-xs">vs</span>
                          <span>{m.team2_nome}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-center font-mono ${m.best_market === 'Casa' ? 'text-primary font-bold bg-primary/5' : ''}`}>
                        {m.team1.toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 text-center font-mono ${m.best_market === 'Empate' ? 'text-primary font-bold bg-primary/5' : ''}`}>
                        {m.empate.toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 text-center font-mono ${m.best_market === 'Fora' ? 'text-primary font-bold bg-primary/5' : ''}`}>
                        {m.team2.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {m.value_pct > 0 ? (
                          <span className="inline-flex items-center px-2 py-1 rounded bg-success/10 text-success text-xs font-bold">
                            +{m.value_pct.toFixed(2)}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">{m.value_pct.toFixed(2)}%</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {risk === "alto" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20 whitespace-nowrap">
                            <ShieldAlert className="w-3 h-3" />
                            Alto Risco
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-semibold border border-success/20 whitespace-nowrap">
                            <ShieldCheck className="w-3 h-3" />
                            Baixo Risco
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => goToChat(m)}
                          title="Analisar com IA"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold border border-primary/20 transition-colors whitespace-nowrap"
                        >
                          <MessageSquare className="w-3 h-3" />
                          Analisar
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-muted-foreground">
                    Nenhum jogo encontrado para os critérios selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
