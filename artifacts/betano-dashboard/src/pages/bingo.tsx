import { useGetMatches } from "@workspace/api-client-react";
import { MatchCard } from "@/components/match-card";
import { Flame, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

export function BingoPage() {
  const { data, isLoading, isError, refetch, isRefetching } = useGetMatches({ view: "bingo" });

  return (
    <div className="flex flex-col space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold flex items-center gap-3">
            <Flame className="w-8 h-8 text-primary" />
            Bingo 5
          </h1>
          <p className="text-muted-foreground mt-1">
            Top 5 apostas de valor verificadas por IA com o maior expected value.
          </p>
        </div>
        
        <button 
          onClick={() => refetch()}
          disabled={isRefetching}
          className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Atualizar</span>
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-destructive/20 rounded-2xl bg-destructive/5 text-destructive p-8 text-center">
          <div>
            <h3 className="font-bold text-lg mb-2">Falha ao carregar as melhores apostas</h3>
            <p className="text-sm opacity-80 mb-4">Erro ao comunicar com o servidor de análise.</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium">Tentar Novamente</button>
          </div>
        </div>
      ) : data?.matches?.length ? (
        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12"
        >
          {data.matches.slice(0, 5).map((match, i) => (
            <MatchCard key={`${match.liga}-${match.team1_nome}`} match={match} variant="bingo" rank={i + 1} />
          ))}
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
          <Flame className="w-16 h-16 opacity-20 mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">Nenhuma aposta Bingo ativa</h3>
          <p>O scanner ainda não encontrou apostas de alto valor no momento.</p>
        </div>
      )}
    </div>
  );
}
