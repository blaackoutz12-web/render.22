import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layout & Pages
import { Layout } from "@/components/layout";
import { BingoPage } from "@/pages/bingo";
import { LivePage } from "@/pages/live";
import { ScannerPage } from "@/pages/scanner";
import { OddsPage } from "@/pages/odds";
import { ChatPage } from "@/pages/chat";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 mins
      retry: 1
    }
  }
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/">
          <Redirect to="/bingo" />
        </Route>
        <Route path="/bingo" component={BingoPage} />
        <Route path="/live" component={LivePage} />
        <Route path="/scanner" component={ScannerPage} />
        <Route path="/odds" component={OddsPage} />
        <Route path="/chat" component={ChatPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
