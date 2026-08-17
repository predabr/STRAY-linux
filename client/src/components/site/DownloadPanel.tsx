import { LinuxInstallerPanel } from "./LinuxInstallerPanel";
import { WindowsDownloadCard } from "./WindowsDownloadCard";

export function DownloadPanel() { return <div className="mt-10 grid gap-4 lg:grid-cols-[.73fr_1.27fr]"><WindowsDownloadCard /><LinuxInstallerPanel /></div>; }
