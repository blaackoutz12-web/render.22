import { Router, type IRouter } from "express";
import {
  allMatches,
  getBingoMatches,
  getLiveMatches,
  getScannerMatches,
  getStats,
  getLeagues,
} from "../data/matches.js";

const router: IRouter = Router();

router.get("/matches", (req, res) => {
  const { view, league } = req.query as { view?: string; league?: string };

  let matches = allMatches;

  if (view === "bingo") {
    matches = getBingoMatches();
  } else if (view === "live") {
    matches = getLiveMatches();
  } else if (view === "scanner") {
    matches = getScannerMatches();
  }

  if (league && league !== "all") {
    matches = matches.filter((m) => m.liga === league);
  }

  res.json({ matches, total: matches.length });
});

router.get("/matches/stats", (_req, res) => {
  res.json(getStats());
});

router.get("/matches/leagues", (_req, res) => {
  res.json({ leagues: getLeagues() });
});

export default router;
