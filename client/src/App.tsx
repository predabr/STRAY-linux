import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import Admin from "@/pages/Admin";
import AssistantPage from "@/pages/Assistant";
import Benchmark from "@/pages/Benchmark";
import GameDetail from "@/pages/GameDetail";
import Games from "@/pages/Games";
import Home from "@/pages/Home";
import { LinuxFixDetailPage, LinuxFixPage, SetupDetailPage, SetupPage, WikiDetailPage, WikiPage } from "@/pages/Knowledge";
import NotFound from "@/pages/NotFound";
import SearchPage from "@/pages/Search";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/games" component={Games} />
    <Route path="/games/:slug" component={GameDetail} />
    <Route path="/benchmark" component={Benchmark} />
    <Route path="/assistant" component={AssistantPage} />
    <Route path="/wiki" component={WikiPage} />
    <Route path="/wiki/:slug" component={WikiDetailPage} />
    <Route path="/setup" component={SetupPage} />
    <Route path="/setup/:slug" component={SetupDetailPage} />
    <Route path="/linuxfix" component={LinuxFixPage} />
    <Route path="/linuxfix/:slug" component={LinuxFixDetailPage} />
    <Route path="/search" component={SearchPage} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/dashboard/:section" component={Dashboard} />
    <Route path="/admin" component={Admin} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark" switchable><TooltipProvider><Router /><Toaster /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
