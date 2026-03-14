export interface Match {
  liga: string;
  data: string;
  hora: string;
  team1_nome: string;
  team2_nome: string;
  team1: number;
  empate: number;
  team2: number;
  value: number;
  value_pct: number;
  best_market: string;
  tip: string;
}

function estimateProbability(o1: number, oX: number, o2: number) {
  const p1 = 1 / o1;
  const pX = 1 / oX;
  const p2 = 1 / o2;
  const overround = p1 + pX + p2;
  return {
    "1": (p1 / overround) * 1.1,
    X: (pX / overround) * 1.1,
    "2": (p2 / overround) * 1.1,
  };
}

function calculateValue(odd: number, prob: number): number {
  return odd * prob - 1;
}

function processMatch(
  liga: string,
  data: string,
  hora: string,
  team1_nome: string,
  team2_nome: string,
  t1: number,
  emp: number,
  t2: number,
  tip = ""
): Match {
  const probs = estimateProbability(t1, emp, t2);
  const v1 = calculateValue(t1, probs["1"]);
  const vX = calculateValue(emp, probs["X"]);
  const v2 = calculateValue(t2, probs["2"]);
  const values: Record<string, number> = { Casa: v1, Empate: vX, Fora: v2 };
  const best_market = Object.entries(values).sort((a, b) => b[1] - a[1])[0][0];
  const maxVal = values[best_market];
  return {
    liga,
    data,
    hora,
    team1_nome,
    team2_nome,
    team1: t1,
    empate: emp,
    team2: t2,
    value: maxVal,
    value_pct: Math.round(maxVal * 1000) / 10,
    best_market,
    tip,
  };
}

const rawMatches: Array<[string, string, string, string, string, number, number, number]> = [
  ["Brasileirão Série A", "Hoje", "AO VIVO", "Grêmio", "Bragantino", 6.6, 1.3, 7.3],
  ["Brasileirão Série A", "14/03", "18:30", "Vitória", "Atlético-MG", 2.62, 3.15, 2.87],
  ["Brasileirão Série A", "14/03", "20:30", "Botafogo-RJ", "Flamengo", 3.95, 3.4, 2.0],
  ["Brasileirão Série A", "15/03", "16:00", "Fluminense", "Athletico-PR", 1.7, 3.8, 5.1],
  ["Brasileirão Série A", "15/03", "16:00", "Santos", "Corinthians", 2.37, 2.92, 3.5],
  ["Brasileirão Série A", "15/03", "16:00", "Internacional", "Bahia", 1.98, 3.55, 3.85],
  ["Brasileirão Série A", "15/03", "18:30", "Coritiba", "Remo", 1.82, 3.55, 4.65],
  ["Brasileirão Série A", "15/03", "18:30", "Palmeiras", "Mirassol", 1.57, 4.4, 5.5],
  ["Brasileirão Série A", "15/03", "20:30", "Cruzeiro", "Vasco da Gama", 1.67, 3.85, 5.2],
  ["Brasileirão Série A", "15/03", "20:30", "Bragantino", "São Paulo", 2.57, 3.2, 2.87],
  ["Copa do Brasil", "Hoje", "AO VIVO", "Barra SC", "América-MG", 7.8, 1.16, 11.25],
  ["Copa do Brasil", "Hoje", "AO VIVO", "Tuna Luso", "Juventude-RS", 8.75, 1.36, 4.3],
  ["Copa do Brasil", "Hoje", "AO VIVO", "Sport Recife", "Anápolis", 5.4, 1.22, 14.0],
  ["Copa Libertadores", "Hoje", "AO VIVO", "Juventud de Las Piedras", "Cerro Porteño", 3.4, 3.2, 2.1],
  ["Champions League", "17/03", "14:45", "FK Bodo/Glimt", "Celtic", 1.57, 4.7, 5.0],
  ["Champions League", "17/03", "17:00", "Bayer Leverkusen", "Atlético Madrid", 1.34, 5.2, 9.25],
  ["Champions League", "17/03", "17:00", "Real Madrid", "Manchester City", 1.5, 4.8, 5.6],
  ["Champions League", "17/03", "17:00", "Paris Saint Germain", "Liverpool", 2.1, 4.05, 3.05],
  ["Champions League", "18/03", "14:45", "Newcastle United", "AC Milan", 1.6, 4.55, 4.9],
  ["Champions League", "18/03", "17:00", "Atalanta", "Benfica", 1.31, 6.0, 8.25],
  ["Champions League", "18/03", "17:00", "Atlético de Madrid", "Borussia Dortmund", 2.45, 3.75, 2.67],
  ["Champions League", "18/03", "17:00", "Galatasaray", "Barcelona", 1.28, 5.9, 10.25],
  ["Europa League", "18/03", "12:30", "Ferencvarosi TC", "Tottenham", 1.5, 4.2, 6.7],
  ["Europa League", "19/03", "14:45", "Nottingham Forest", "Ajax", 2.9, 3.4, 2.45],
  ["Europa League", "19/03", "14:45", "Genk", "Roma", 1.6, 3.9, 5.9],
  ["Europa League", "19/03", "14:45", "Celta de Vigo", "Athletic Bilbao", 2.0, 3.35, 3.95],
  ["Europa League", "19/03", "17:00", "Bologna FC", "Eintracht Frankfurt", 1.87, 3.3, 4.7],
  ["Europa League", "19/03", "17:00", "VfB Stuttgart", "Lyon", 2.1, 3.55, 3.45],
  ["Europa League", "19/03", "17:00", "Lille", "Fiorentina", 1.53, 4.3, 6.0],
  ["Premier League", "14/03", "12:00", "Sunderland", "Brighton & Hove Albion", 3.35, 3.3, 2.25],
  ["Premier League", "14/03", "12:00", "Burnley", "AFC Bournemouth", 4.0, 3.9, 1.85],
  ["Premier League", "14/03", "14:30", "Chelsea", "Newcastle United", 1.83, 4.2, 3.75],
  ["Premier League", "14/03", "14:30", "Arsenal", "Everton", 1.39, 4.5, 9.25],
  ["Premier League", "14/03", "17:00", "West Ham United", "Manchester City", 4.55, 4.05, 1.72],
  ["Premier League", "15/03", "11:00", "Nottingham Forest", "Fulham FC", 2.18, 3.35, 3.45],
  ["Premier League", "15/03", "11:00", "Crystal Palace", "Leeds United", 2.52, 3.2, 2.92],
  ["Premier League", "15/03", "11:00", "Manchester United", "Aston Villa", 1.75, 4.0, 4.45],
  ["Premier League", "15/03", "13:30", "Liverpool", "Tottenham", 1.35, 5.4, 8.0],
  ["Premier League", "16/03", "17:00", "Brentford", "Wolverhampton", 1.57, 4.25, 5.7],
  ["La Liga", "14/03", "10:00", "Girona FC", "Athletic Bilbao", 2.75, 3.25, 2.67],
  ["La Liga", "14/03", "12:15", "Atlético de Madrid", "Getafe CF", 1.6, 3.55, 7.0],
  ["La Liga", "14/03", "14:30", "Real Oviedo", "Valencia", 3.0, 3.05, 2.57],
  ["La Liga", "14/03", "17:00", "Real Madrid", "Elche", 1.33, 5.6, 8.5],
  ["La Liga", "15/03", "10:00", "Mallorca", "Espanyol", 2.35, 3.1, 3.3],
  ["La Liga", "15/03", "12:15", "Barcelona", "Sevilha FC", 1.29, 5.7, 10.25],
  ["La Liga", "15/03", "14:30", "Bétis", "Celta de Vigo", 2.22, 3.25, 3.45],
  ["La Liga", "15/03", "17:00", "Real Sociedad", "Osasuna", 1.9, 3.5, 4.2],
  ["La Liga", "16/03", "17:00", "Rayo Vallecano", "Levante", 1.7, 3.9, 4.9],
  ["Bundesliga", "14/03", "11:30", "Eintracht Frankfurt", "1. FC Heidenheim", 1.55, 4.45, 5.6],
  ["Bundesliga", "14/03", "11:30", "Borussia Dortmund", "Augsburg", 1.45, 4.85, 6.5],
  ["Bundesliga", "14/03", "11:30", "Bayer Leverkusen", "Bayern de Munique", 5.2, 4.65, 1.55],
  ["Bundesliga", "14/03", "11:30", "Hoffenheim", "Wolfsburg", 1.47, 4.85, 6.1],
  ["Bundesliga", "14/03", "14:30", "Hamburgo", "1. FC Köln", 2.12, 3.55, 3.35],
  ["Bundesliga", "15/03", "11:30", "Werder Bremen", "Mainz 05", 2.25, 3.55, 3.1],
  ["Bundesliga", "15/03", "13:30", "Freiburg", "1. FC Union Berlin", 2.15, 3.25, 3.6],
  ["Bundesliga", "15/03", "15:30", "VfB Stuttgart", "RB Leipzig", 2.4, 3.8, 2.72],
  ["Ligue 1", "14/03", "13:00", "PSG", "Marseille", 1.62, 4.2, 5.5],
  ["Ligue 1", "14/03", "15:00", "Lyon", "Monaco", 2.35, 3.3, 3.15],
  ["Ligue 1", "15/03", "13:00", "Lille", "Rennes", 2.05, 3.4, 3.8],
  ["Ligue 1", "15/03", "15:00", "Nice", "Lens", 2.1, 3.35, 3.55],
  ["Serie A (Itália)", "14/03", "14:00", "Inter Milan", "AC Milan", 2.05, 3.65, 3.5],
  ["Serie A (Itália)", "14/03", "17:00", "Juventus", "Napoli", 2.15, 3.55, 3.3],
  ["Serie A (Itália)", "15/03", "12:30", "Roma", "Lazio", 2.3, 3.4, 3.1],
  ["Serie A (Itália)", "15/03", "15:00", "Atalanta", "Fiorentina", 1.95, 3.7, 3.9],
];

const BINGO_TIPS: Record<string, string> = {
  "West Ham United vs Manchester City": "Manchester City exibe dominância fora de casa. Apostar em City (Fora) com odd 1.72 representa bom valor dado o histórico recente.",
  "Botafogo-RJ vs Flamengo": "Clássico com Flamengo em boa fase. Odd 2.0 para Fora apresenta valor positivo considerando o desempenho dos visitantes.",
  "Chelsea vs Newcastle United": "Chelsea joga em casa mas Newcastle tem mostrado solidez. Odds equilibradas favorecem Newcastle como aposta de valor.",
  "Arsenal vs Everton": "Arsenal em grande forma em casa. Odd 1.39 pode parecer baixa, mas o valor real confirma apostar em Arsenal.",
  "Burnley vs AFC Bournemouth": "Burnley tem odds infladas em casa. Bournemouth em boa forma e odd 1.85 representa valor.",
};

export const allMatches: Match[] = rawMatches.map(([liga, data, hora, t1n, t2n, t1, emp, t2]) => {
  const key = `${t1n} vs ${t2n}`;
  const tip = BINGO_TIPS[key] || "";
  return processMatch(liga, data, hora, t1n, t2n, t1, emp, t2, tip);
});

export function getBingoMatches(): Match[] {
  const safe = allMatches.filter((m) => {
    try {
      const oddVal =
        m.best_market === "Casa"
          ? m.team1
          : m.best_market === "Empate"
            ? m.empate
            : m.team2;
      return oddVal < 12.0 && m.value > 0;
    } catch {
      return false;
    }
  });
  return safe.sort((a, b) => b.value - a.value).slice(0, 5);
}

export function getLiveMatches(): Match[] {
  return allMatches.filter((m) => m.hora === "AO VIVO");
}

export function getScannerMatches(): Match[] {
  return allMatches.filter((m) => m.value > 0.05).sort((a, b) => b.value - a.value);
}

export function getStats() {
  const live = allMatches.filter((m) => m.hora === "AO VIVO").length;
  const ev = allMatches.filter((m) => m.value > 0.05).length;
  const leagues = new Set(allMatches.map((m) => m.liga)).size;
  return {
    total: allMatches.length,
    live,
    ev,
    ligas: leagues,
  };
}

export function getLeagues(): string[] {
  return Array.from(new Set(allMatches.map((m) => m.liga))).sort();
}
