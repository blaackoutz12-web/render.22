import { useGetMatches } from "@workspace/api-client-react";
import { MatchCard } from "@/components/match-card";
import { Radar } from "lucide-react";

export function ScannerPage() {
  const { data, isLoading } = useGetMatches({ view: "scanner" });

  return (
    <div className="flex flex-col space-y-6 pb-12">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <Radar className="w-8 h-8 text-success" />
          Scanner EV+
        </h1>
        <p className="text-muted-foreground mt-1">
          Todos os jogos identificados com Expected Value positivo matematicamente.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-56 rounded-2xl bg-card border border-border animate-pulse" />)}
        </div>
      ) : data?.matches?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
          {data.matches.map((match, i) => (
            <MatchCard key={i} match={match} />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border rounded-2xl">
          <Radar className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">Nenhuma oportunidade EV+</h3>
          <p className="text-muted-foreground">O algoritmo não encontrou vantagens nas odds atuais.</p>
        </div>
      )}
    </div>
  );
}
