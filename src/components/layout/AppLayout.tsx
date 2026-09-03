import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { authApi } from "@/api/auth";
import { notificationsApi } from "@/api/notifications";
import { adminApi } from "@/api/admin";
import type { HealthComponent, Notification, User, UserRole } from "@/lib/types";
import { DemoBanner } from "@/components/shared/DemoBanner";
import { GlobalSearch } from "@/components/shared/GlobalSearch";
import {
  Activity,
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  Cpu,
  FileCheck,
  FileSpreadsheet,
  FileText,
  History,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  PieChart,
  Search,
  Settings,
  Shield,
  Sliders,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function AppLayout({ children, title, subtitle, actions }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [healthStatus, setHealthStatus] = useState<HealthComponent[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    authApi.getCurrentUser().then(setCurrentUser);
    notificationsApi.getNotifications().then(setNotifications);
    adminApi.getSystemHealth().then(setHealthStatus);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleRoleChange = async (newRole: UserRole) => {
    const updated = await authApi.setRole(newRole);
    setCurrentUser(updated);
    toast.success(`Role switched to ${newRole.toUpperCase()} (Sandbox mode)`);
  };

  const handleLogout = async () => {
    await authApi.logout();
    toast.info("Logged out of Evaluation Sandbox");
    navigate({ to: "/auth/login" });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllNotifications = async () => {
    await notificationsApi.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const navGroups = [
    {
      title: "OVERVIEW",
      items: [
        { label: "Dashboard", to: "/app/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "UNDERWRITING",
      items: [
        { label: "Applications", to: "/app/applications", icon: FileText },
        { label: "Risk Assessment", to: "/app/risk-assessment", icon: Sparkles },
        { label: "Borrowers", to: "/app/borrowers", icon: Users },
      ],
    },
    {
      title: "PORTFOLIO",
      items: [
        { label: "Portfolio", to: "/app/portfolio", icon: PieChart },
        { label: "Analytics", to: "/app/analytics", icon: BarChart3 },
        { label: "Cohorts", to: "/app/cohorts", icon: Layers },
      ],
    },
    {
      title: "INTELLIGENCE",
      items: [
        { label: "Model Intelligence", to: "/app/model-intelligence", icon: Cpu },
        { label: "Reports", to: "/app/reports", icon: FileSpreadsheet },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { label: "Settings", to: "/app/settings", icon: Settings },
      ],
    },
    ...(currentUser?.role === "admin"
      ? [
          {
            title: "ADMINISTRATION",
            items: [
              { label: "Admin Console", to: "/app/admin", icon: Shield },
              { label: "User Management", to: "/app/admin/users", icon: Users },
              { label: "Risk Rules", to: "/app/admin/risk-rules", icon: Sliders },
              { label: "Audit Log", to: "/app/admin/audit", icon: History },
            ],
          },
        ]
      : []),
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 antialiased font-sans">
      <DemoBanner />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800/80 bg-slate-900/60 backdrop-blur-xl lg:flex">
          {/* Logo & Brand */}
          <div className="flex h-16 items-center gap-3 border-b border-slate-800/80 px-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">TRUSTLINE</span>
                <span className="rounded bg-blue-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-blue-400 border border-blue-500/20">
                  INSIGHT
                </span>
              </div>
              <div className="text-[10px] text-slate-400">Credit Risk Platform</div>
            </div>
          </div>

          {/* Nav groups */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {navGroups.map((group) => (
              <div key={group.title}>
                <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {group.title}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);

                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150",
                          active
                            ? "bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/20 shadow-sm"
                            : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200",
                        )}
                      >
                        <Icon className={cn("h-4 w-4 shrink-0", active ? "text-blue-400" : "text-slate-400")} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* User Persona Profile Footer */}
          <div className="border-t border-slate-800/80 p-3">
            <div className="flex items-center justify-between rounded-lg bg-slate-950/60 p-2.5 border border-slate-800/60">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white text-xs">
                  {currentUser?.name?.slice(0, 2).toUpperCase() || "SK"}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-white truncate">
                    {currentUser?.name || "Dr. Sarah Kimani"}
                  </div>
                  <div className="text-[10px] text-blue-400 capitalize truncate">
                    {currentUser?.role?.replace(/_/g, " ") || "Admin"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative flex w-72 max-w-[80vw] flex-1 flex-col bg-slate-900 border-r border-slate-800 p-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <span className="font-bold text-white">TRUSTLINE</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-6">
                {navGroups.map((group) => (
                  <div key={group.title}>
                    <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {group.title}
                    </div>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium",
                              active
                                ? "bg-blue-600 text-white font-semibold"
                                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Topbar */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-900/40 px-4 backdrop-blur-md sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <h1 className="text-base font-bold text-white sm:text-lg tracking-tight">
                  {title || "Credit Risk Intelligence"}
                </h1>
                {subtitle && <p className="text-xs text-slate-400 hidden sm:block">{subtitle}</p>}
              </div>
            </div>

            {/* Topbar Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {/* Global Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
              >
                <Search className="h-3.5 w-3.5 text-slate-400" />
                <span>Search records...</span>
                <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">⌘K</kbd>
              </button>

              {/* System Health Status Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="hidden sm:inline">Operational</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 bg-slate-900 border-slate-800 text-slate-200 shadow-2xl">
                  <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">System Health & Latency</span>
                    <span className="text-[10px] text-emerald-400 font-mono">100% SLA</span>
                  </div>
                  <div className="p-2 space-y-1 text-xs">
                    {healthStatus.map((c) => (
                      <div key={c.name} className="flex items-center justify-between p-2 rounded hover:bg-slate-800/50">
                        <div>
                          <div className="font-medium text-slate-200">{c.name}</div>
                          <div className="text-[10px] text-slate-400">{c.detail}</div>
                        </div>
                        <span className="font-mono text-[11px] text-slate-400">{c.latencyMs}ms</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Notification Center */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-88 p-0 bg-slate-900 border-slate-800 text-slate-200 shadow-2xl">
                  <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Risk Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllNotifications} className="text-[10px] text-blue-400 hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto p-2 space-y-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "p-2.5 rounded-lg border transition-colors",
                          n.read
                            ? "border-transparent bg-transparent text-slate-400"
                            : "border-slate-800 bg-slate-950/70 text-slate-200",
                        )}
                      >
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className={cn(!n.read && "text-white font-semibold")}>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">Demo</span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-400">{n.body}</p>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* User Sandbox Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 py-1 px-2 text-xs text-slate-200 hover:bg-slate-800 transition-colors">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 font-bold text-[11px] text-white">
                      {currentUser?.name?.slice(0, 1) || "S"}
                    </div>
                    <span className="hidden sm:inline font-medium">{currentUser?.name?.split(" ")[0]}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-slate-900 border-slate-800 text-slate-200 shadow-2xl">
                  <DropdownMenuLabel>
                    <div className="font-semibold text-white">{currentUser?.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{currentUser?.email}</div>
                    <div className="mt-1 text-[10px] font-mono text-blue-400">{currentUser?.organization}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-800" />

                  <DropdownMenuLabel className="text-[10px] uppercase font-bold text-slate-400">
                    Switch Sandbox Role
                  </DropdownMenuLabel>
                  {(["admin", "risk_manager", "analyst", "viewer"] as UserRole[]).map((r) => (
                    <DropdownMenuItem
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className="flex items-center justify-between text-xs cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white"
                    >
                      <span className="capitalize">{r.replace(/_/g, " ")}</span>
                      {currentUser?.role === r && <Check className="h-3.5 w-3.5 text-blue-400" />}
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem
                    onClick={() => navigate({ to: "/" })}
                    className="text-xs cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white"
                  >
                    Public Website
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-xs text-rose-400 cursor-pointer hover:bg-rose-950/30 focus:bg-rose-950/30 focus:text-rose-300"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-2" />
                    Exit Sandbox
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {actions}
            </div>
          </header>

          {/* Page Body */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
            <div className="mx-auto max-w-7xl space-y-6">{children}</div>
          </main>
        </div>
      </div>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
