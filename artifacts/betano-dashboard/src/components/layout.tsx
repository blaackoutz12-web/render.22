import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { 
  Flame, Activity, Radar, ListTree, MessageSquare, 
  Menu, X, TrendingUp, Trophy 
} from "lucide-react";
import { useGetMatchStats } from "@workspace/api-client-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { path: "/bingo", label: "Bingo 5", icon: Flame, color: "text-primary" },
  { path: "/live", label: "Ao Vivo", icon: Activity, color: "text-red-500" },
  { path: "/scanner", label: "Scanner EV+", icon: Radar, color: "text-success" },
  { path: "/odds", label: "Todas as Odds", icon: ListTree, color: "text-blue-400" },
  { path: "/chat", label: "Conselheiro IA", icon: MessageSquare, color: "text-purple-400" },
];

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: stats, isLoading: statsLoading } = useGetMatchStats();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground selection:bg-primary/30">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-xl z-20">
        <div className="p-6 flex items-center gap-3">
          <img 
            src={`${import.meta.env.BASE_URL}images/logo-mark.png`} 
            alt="Betano Pro Logo" 
            className="w-8 h-8 object-contain rounded-lg shadow-lg shadow-primary/20"
          />
          <h1 className="font-display font-bold text-xl tracking-wide bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            BETANO <span className="text-primary">PRO</span>
          </h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
            Menu Principal
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                  ${isActive 
                    ? "bg-primary/10 text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"}
                `}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                  />
                )}
                <item.icon className={`w-5 h-5 ${isActive ? item.color : "opacity-70 group-hover:opacity-100"}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="bg-secondary/50 rounded-xl p-4 border border-border/50 flex items-start gap-3">
            <Trophy className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Assinatura Pro</p>
              <p className="text-xs text-muted-foreground mt-0.5">Ativa até Dez 2025</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-border/40 bg-background/80 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-display font-bold text-lg">BETANO <span className="text-primary">PRO</span></h1>
          </div>

          <div className="hidden md:flex items-center gap-6 overflow-x-auto no-scrollbar">
            {statsLoading ? (
              <div className="flex gap-4 animate-pulse">
                {[1,2,3,4].map(i => <div key={i} className="h-6 w-24 bg-muted rounded-md" />)}
              </div>
            ) : stats ? (
              <>
                <StatBadge label="Total de Jogos" value={stats.total} />
                <StatBadge label="Ao Vivo" value={stats.live} icon={<Activity className="w-3.5 h-3.5 text-red-500 animate-pulse" />} />
                <StatBadge label="EV+ Encontrados" value={stats.ev} icon={<TrendingUp className="w-3.5 h-3.5 text-success" />} valueClass="text-success" />
                <StatBadge label="Ligas Ativas" value={stats.ligas} />
              </>
            ) : null}
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 z-0">
          <div className="max-w-7xl mx-auto min-h-full">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-3/4 max-w-sm bg-card border-r border-border z-50 flex flex-col"
            >
              <div className="p-4 flex items-center justify-between border-b border-border/50">
                <h1 className="font-display font-bold text-xl">BETANO <span className="text-primary">PRO</span></h1>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-muted-foreground hover:text-foreground">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = location === item.path;
                  return (
                    <Link 
                      key={item.path} 
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all
                        ${isActive ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}
                      `}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? item.color : "opacity-70"}`} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatBadge({ label, value, icon, valueClass = "text-foreground" }: { label: string, value: number, icon?: ReactNode, valueClass?: string }) {
  return (
    <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/50 whitespace-nowrap">
      {icon}
      <span className="text-xs font-medium text-muted-foreground">{label}:</span>
      <span className={`text-sm font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}
