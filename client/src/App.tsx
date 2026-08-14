import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { RouteMeta } from "./components/RouteMeta";
import { StrayEntryGate } from "./components/StrayEntryGate";
import { ThemeProvider } from "./contexts/ThemeContext";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const DistroAtlas = lazy(() => import("@/pages/DistroAtlas"));
const DistroProfile = lazy(() => import("@/pages/DistroProfile"));
const Admin = lazy(() => import("@/pages/Admin"));
const AssistantPage = lazy(() => import("@/pages/Assistant"));
const Benchmark = lazy(() => import("@/pages/Benchmark"));
const Compare = lazy(() => import("@/pages/Compare"));
const GameDetail = lazy(() => import("@/pages/GameDetail"));
const Games = lazy(() => import("@/pages/Games"));
const Home = lazy(() => import("@/pages/Home"));
const WikiPage = lazy(() => import("@/pages/Knowledge").then((module) => ({ default: module.WikiPage })));
const WikiDetailPage = lazy(() => import("@/pages/Knowledge").then((module) => ({ default: module.WikiDetailPage })));
const SetupPage = lazy(() => import("@/pages/Knowledge").then((module) => ({ default: module.SetupPage })));
const SetupDetailPage = lazy(() => import("@/pages/Knowledge").then((module) => ({ default: module.SetupDetailPage })));
const LinuxFixPage = lazy(() => import("@/pages/Knowledge").then((module) => ({ default: module.LinuxFixPage })));
const LinuxFixDetailPage = lazy(() => import("@/pages/Knowledge").then((module) => ({ default: module.LinuxFixDetailPage })));
const NotFound = lazy(() => import("@/pages/NotFound"));
const SearchPage = lazy(() => import("@/pages/Search"));
const Scanner = lazy(() => import("@/pages/Scanner"));
const Status = lazy(() => import("@/pages/Status"));
const WindowsHub = lazy(() => import("@/pages/WindowsHub"));

function Router() {
  return <Suspense fallback={<div className="min-h-screen bg-background"><div className="container py-14"><div className="h-5 w-32 animate-pulse rounded bg-muted" /><div className="mt-5 h-12 max-w-xl animate-pulse rounded bg-muted" /><div className="mt-7 h-72 animate-pulse rounded-2xl bg-muted" /></div></div>}><Switch>
    <Route path="/" component={Home} />
    <Route path="/games" component={Games} />
    <Route path="/games/:slug" component={GameDetail} />
    <Route path="/benchmark" component={Benchmark} />
    <Route path="/compare" component={Compare} />
    <Route path="/windows" component={WindowsHub} />
    <Route path="/assistant" component={AssistantPage} />
    <Route path="/wiki" component={WikiPage} />
    <Route path="/distros/:id" component={DistroProfile} />
    <Route path="/distros" component={DistroAtlas} />
    <Route path="/wiki/:slug" component={WikiDetailPage} />
    <Route path="/setup" component={SetupPage} />
    <Route path="/setup/:slug" component={SetupDetailPage} />
    <Route path="/linuxfix" component={LinuxFixPage} />
    <Route path="/linuxfix/:slug" component={LinuxFixDetailPage} />
    <Route path="/search" component={SearchPage} />
    <Route path="/scanner" component={Scanner} />
    <Route path="/status" component={Status} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/dashboard/:section" component={Dashboard} />
    <Route path="/admin" component={Admin} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch></Suspense>;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark" switchable><TooltipProvider><RouteMeta /><StrayEntryGate><Router /></StrayEntryGate><Toaster /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
