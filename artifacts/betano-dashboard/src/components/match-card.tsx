import { motion } from "framer-motion";
import { Sparkles, Trophy, ChevronRight, Activity } from "lucide-react";
import type { Match } from "@workspace/api-client-react";

interface MatchCardProps {
  match: Match;
  variant?: "default" | "bingo";
  rank?: number;
}

export function MatchCard({ match, variant = "default", rank }: MatchCardProps) {
  const isBingo = variant === "bingo";
  const isLive = match.hora === "AO VIVO";
  const isEvPositive = match.value_pct > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`
        group relative rounded-2xl overflow-hidden bg-card border
        transition-all duration-300 shadow-xl
        ${isBingo 
          ? "border-primary/30 hover:border-primary/60 shadow-primary/5" 
          : "border-border/60 hover:border-border hover:shadow-black/50"}
      `}
    >
      {/* Decorative Gradient Background for Bingo Cards */}
      {isBingo && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none" />
      )}

      {/* Rank Indicator (Bingo only) */}
      {isBingo && rank && (
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden rounded-tr-2xl z-10">
          <div className="absolute top-[8px] right-[-24px] w-[80px] rotate-45 bg-primary py-1 text-center font-display font-bold text-primary-foreground text-sm shadow-md shadow-primary/20">
            #{rank}
          </div>
        </div>
      )}

      <div className="p-5 relative z-10">
        
        {/* Header: League & Badges */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 opacity-70" />
              {match.liga}
            </span>
            <span className="text-xs text-muted-foreground/70">
              {match.data} {match.hora && match.hora !== "AO VIVO" && `• ${match.hora}`}
            </span>
          </div>
          
          <div className="flex flex-col items-end gap-2 shrink-0">
            {isLive && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest border border-red-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Ao Vivo
              </span>
            )}
            {isEvPositive && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-success/15 text-success text-xs font-bold border border-success/20">
                +{match.value_pct.toFixed(2)}% EV
              </span>
            )}
          </div>
        </div>

        {/* Teams */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-lg leading-tight truncate pr-4">{match.team1_nome}</h3>
            <span className="text-sm font-medium text-muted-foreground w-6 text-center">vs</span>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-lg leading-tight truncate pr-4">{match.team2_nome}</h3>
          </div>
        </div>

        {/* Odds Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <OddsBox label="1" value={match.team1} isRecommended={match.best_market === "Casa"} />
          <OddsBox label="X" value={match.empate} isRecommended={match.best_market === "Empate"} />
          <OddsBox label="2" value={match.team2} isRecommended={match.best_market === "Fora"} />
        </div>

        {/* AI Tip Section */}
        {match.tip && (
          <div className={`
            mt-auto rounded-xl p-3 text-sm flex items-start gap-3
            ${isBingo ? "bg-primary/5 border border-primary/20" : "bg-secondary border border-border/50"}
          `}>
            <Sparkles className={`w-4 h-4 shrink-0 mt-0.5 ${isBingo ? "text-primary" : "text-muted-foreground"}`} />
            <p className={`${isBingo ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              {match.tip}
            </p>
          </div>
        )}
        
      </div>
    </motion.div>
  );
}

function OddsBox({ label, value, isRecommended }: { label: string, value: number, isRecommended: boolean }) {
  return (
    <div className={`
      flex flex-col items-center justify-center p-2 rounded-lg border transition-all
      ${isRecommended 
        ? "bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(244,114,33,0.15)] scale-[1.02]" 
        : "bg-secondary border-transparent hover:border-border"}
    `}>
      <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isRecommended ? "text-primary" : "text-muted-foreground"}`}>
        {label}
      </span>
      <span className={`font-display font-bold text-base ${isRecommended ? "text-primary" : "text-foreground"}`}>
        {value.toFixed(2)}
      </span>
    </div>
  );
}
