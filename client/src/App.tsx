import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { RouteMeta } from "./components/RouteMeta";
import { StrayEntryGate } from "./components/StrayEntryGate";
import { ProductWorkspace } from "./components/platform/ProductWorkspace";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const DistroAtlas = lazy(() => import("@/pages/DistroAtlas"));
const DistroProfile = lazy(() => import("@/pages/DistroProfile"));
const Admin = lazy(() => import("@/pages/Admin"));
const ApiDocs = lazy(() => import("@/pages/ApiDocs"));
const AssistantPage = lazy(() => import("@/pages/Assistant"));
const Benchmark = lazy(() => import("@/pages/Benchmark"));
const Compare = lazy(() => import("@/pages/Compare"));
const Controllers = lazy(() => import("@/pages/Controllers"));
const Diagnostics = lazy(() => import("@/pages/Diagnostics"));
const Snapshots = lazy(() => import("@/pages/Snapshots"));
const SettingsCenter = lazy(() => import("@/pages/SettingsCenter"));
const SystemGraph = lazy(() => import("@/pages/SystemGraph"));
const SystemTimeline = lazy(() => import("@/pages/SystemTimeline"));
const GamePreflight = lazy(() => import("@/pages/GamePreflight"));
const Regression = lazy(() => import("@/pages/Regression"));
const RecoveryCenter = lazy(() => import("@/pages/RecoveryCenter"));
const LogsCenter = lazy(() => import("@/pages/LogsCenter"));
const NotificationsCenter = lazy(() => import("@/pages/NotificationsCenter"));
const GameDetail = lazy(() => import("@/pages/GameDetail"));
const Games = lazy(() => import("@/pages/Games"));
const Home = lazy(() => import("@/pages/Home"));
const DownloadPage = lazy(() => import("@/pages/Home").then((module) => ({ default: module.DownloadPage })));
const WikiPage = lazy(() => import("@/pages/Knowledge").then((module) => ({ default: module.WikiPage })));
const WikiDetailPage = lazy(() => import("@/pages/Knowledge").then((module) => ({ default: module.WikiDetailPage })));
const SetupPage = lazy(() => import("@/pages/Knowledge").then((module) => ({ default: module.SetupPage })));
const SetupDetailPage = lazy(() => import("@/pages/Knowledge").then((module) => ({ default: module.SetupDetailPage })));
const LinuxFixPage = lazy(() => import("@/pages/Knowledge").then((module) => ({ default: module.LinuxFixPage })));
const LinuxFixDetailPage = lazy(() => import("@/pages/Knowledge").then((module) => ({ default: module.LinuxFixDetailPage })));
const Library = lazy(() => import("@/pages/Library"));
const Moderation = lazy(() => import("@/pages/Moderation"));
const Mods = lazy(() => import("@/pages/Mods"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Performance = lazy(() => import("@/pages/Performance"));
const SearchPage = lazy(() => import("@/pages/Search"));
const Scanner = lazy(() => import("@/pages/Scanner"));
const Status = lazy(() => import("@/pages/Status"));
const Support = lazy(() => import("@/pages/Support"));
const Sync = lazy(() => import("@/pages/Sync"));
const Uninstall = lazy(() => import("@/pages/Uninstall"));
const WindowsHub = lazy(() => import("@/pages/WindowsHub"));

function Router() {
  return <Suspense fallback={<div className="min-h-screen bg-background"><div className="container py-14"><div className="h-5 w-32 animate-pulse rounded bg-muted" /><div className="mt-5 h-12 max-w-xl animate-pulse rounded bg-muted" /><div className="mt-7 h-72 animate-pulse rounded-2xl bg-muted" /></div></div>}><Switch>
    <Route path="/" component={Home} />
    <Route path="/games" component={Games} />
    <Route path="/games/:slug" component={GameDetail} />
    <Route path="/benchmark" component={Benchmark} />
    <Route path="/compare" component={Compare} />
    <Route path="/controllers" component={Controllers} />
    <Route path="/diagnostics" component={Diagnostics} />
    <Route path="/snapshots" component={Snapshots} />
    <Route path="/settings" component={SettingsCenter} />
    <Route path="/system-graph" component={SystemGraph} />
    <Route path="/system-timeline" component={SystemTimeline} />
    <Route path="/preflight" component={GamePreflight} />
    <Route path="/regression" component={Regression} />
    <Route path="/recovery" component={RecoveryCenter} />
    <Route path="/logs" component={LogsCenter} />
    <Route path="/notifications" component={NotificationsCenter} />
    <Route path="/windows" component={WindowsHub} />
    <Route path="/assistant" component={AssistantPage} />
    <Route path="/api/docs" component={ApiDocs} />
    <Route path="/wiki" component={WikiPage} />
    <Route path="/distros/:id" component={DistroProfile} />
    <Route path="/distros" component={DistroAtlas} />
    <Route path="/wiki/:slug" component={WikiDetailPage} />
    <Route path="/setup" component={SetupPage} />
    <Route path="/sync" component={Sync} />
    <Route path="/setup/:slug" component={SetupDetailPage} />
    <Route path="/linuxfix" component={LinuxFixPage} />
    <Route path="/linuxfix/:slug" component={LinuxFixDetailPage} />
    <Route path="/library" component={Library} />
    <Route path="/performance" component={Performance} />
    <Route path="/moderation" component={Moderation} />
    <Route path="/mods" component={Mods} />
    <Route path="/search" component={SearchPage} />
    <Route path="/scanner" component={Scanner} />
    <Route path="/status" component={Status} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/dashboard/:section/:subsection" component={Dashboard} />
    <Route path="/dashboard/:section" component={Dashboard} />
    <Route path="/admin" component={Admin} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch></Suspense>;
}

function App() {
  return <ErrorBoundary><LanguageProvider><ThemeProvider defaultTheme="dark" switchable><TooltipProvider><RouteMeta /><ApplicationSurface /><Toaster /></TooltipProvider></ThemeProvider></LanguageProvider></ErrorBoundary>;
}

function ApplicationSurface() {
  const [location] = useLocation();
  if (location === "/") return <Home />;
  if (location === "/download") return <DownloadPage />;
  if (location === "/uninstall") return <Uninstall />;
  if (location === "/support") return <Support />;
  return <StrayEntryGate><ProductWorkspace><Router /></ProductWorkspace></StrayEntryGate>;
}

export default App;
