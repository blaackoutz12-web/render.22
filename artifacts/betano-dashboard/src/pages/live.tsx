import { useGetMatches } from "@workspace/api-client-react";
import { MatchCard } from "@/components/match-card";
import { Activity } from "lucide-react";

export function LivePage() {
  const { data, isLoading } = useGetMatches({ view: "live" });

  return (
    <div className="flex flex-col space-y-6 pb-12">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <Activity className="w-8 h-8 text-red-500" />
          Ao Vivo
        </h1>
        <p className="text-muted-foreground mt-1">
          Jogos em andamento rastreados pelo scanner em tempo real.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-56 rounded-2xl bg-card border border-border animate-pulse" />)}
        </div>
      ) : data?.matches?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
          {data.matches.map((match, i) => (
            <MatchCard key={i} match={match} />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border rounded-2xl">
          <Activity className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">Nenhum jogo ao vivo</h3>
          <p className="text-muted-foreground">Não há jogos em andamento sendo rastreados no momento.</p>
        </div>
      )}
    </div>
  );
}
