import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { hasSupabaseEnv, supabase } from "./lib/supabase";
import { apiFetch } from "./lib/api";
import { hasApiBaseUrl, hasStripeKey } from "./lib/config";
import { stripePromise } from "./lib/stripe";

const ADMIN_PIN = "195151";

type FAQ = { question: string; answer: string };
type AuthMode = "login" | "signup" | "forgot";

type FeatureCard = { title: string; copy: string; badge?: string };
type PricingTier = {
  name: string;
  price: string;
  subtitle: string;
  badge?: string;
  highlight?: boolean;
  features: string[];
  cta: string;
  planCode?: "free" | "pro" | "business";
};

type BackendHealth = {
  status: string;
  service: string;
  version?: string;
  timestamp?: string;
};

type DashboardSummary = {
  organization: { id: string; name: string; slug: string; plan: string };
  user: { id: string; email: string };
  apiKeys: Array<{ id: string; name: string; key_preview: string; created_at: string; last_used_at: string | null }>;
  usage: { minutes_used: number; minutes_included: number | null; sessions_count: number };
  recentSessions: Array<{ id: string; transcript: string; status: string; created_at: string }>;
  leads: Array<{ id: string; name: string; phone: string | null; status: string; created_at: string }>;
};

type CreateCheckoutResponse = { checkoutUrl: string };
type CreateApiKeyResponse = { id: string; name: string; key: string; key_preview: string; created_at: string };
type CreateLeadResponse = { id: string; name: string; phone: string | null; status: string; created_at: string };

const queryClient = new QueryClient();

const navItems = [
  { label: "Platform", to: "/platform" },
  { label: "How it works", to: "/how-it-works" },
  { label: "Pricing", to: "/pricing" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "About", to: "/about" },
  { label: "ROI", to: "/roi" },
  { label: "CRM", to: "/crm" },
  { label: "FAQ", to: "/faq" },
  { label: "Login", to: "/auth" },
];

const platformCards: FeatureCard[] = [
  { title: "Realtime speech intelligence", copy: "Stream audio from browsers, meetings, uploads, and phone calls with endpointing, interim transcripts, and production-minded latency.", badge: "Core platform" },
  { title: "Voice agents", copy: "Run natural call and web voice experiences with interruption handling, guided responses, and measurable automation workflows.", badge: "Automation" },
  { title: "Workflow execution", copy: "Trigger CRM updates, database writes, notifications, and downstream actions through a tool execution layer tied to agent reasoning.", badge: "Action layer" },
  { title: "RAG knowledge layer", copy: "Ground every answer in trusted internal knowledge, help content, pricing rules, and CRM context to improve accuracy and control.", badge: "Accuracy" },
];

const pricingTiers: PricingTier[] = [
  { name: "Free", price: "$0", subtitle: "For evaluation and initial prototypes", badge: "Entry", planCode: "free", features: ["10 voice minutes included", "Basic voice console access", "Single workspace", "Limited session history", "Email authentication"], cta: "Start free" },
  { name: "Pro", price: "$29/mo", subtitle: "For builders shipping production workflows", badge: "Most popular", highlight: true, planCode: "pro", features: ["500 voice minutes included", "API access and API keys", "CRM tools and workflow execution", "Knowledge base retrieval", "Session history and replay", "Stripe billing and usage visibility"], cta: "Choose Pro" },
  { name: "Business", price: "$99/mo", subtitle: "For teams running multi-agent operations", badge: "Scale", planCode: "business", features: ["Unlimited workflows", "Multi-agent orchestration", "Priority inference routing", "Organization controls and team access", "Advanced CRM automation", "Priority support"], cta: "Choose Business" },
];

const faqItems: FAQ[] = [
  { question: "How do sign-in and account recovery work?", answer: "The app supports Google authentication, email and password login, new account creation, and password reset by email. When Supabase environment variables are configured, these flows run against a real auth backend." },
  { question: "What role does RAG play in the platform?", answer: "RAG retrieves trusted business context before the model answers. That can include policies, SOPs, product information, account notes, pricing logic, and support guidance." },
  { question: "How is ROI evaluated?", answer: "Teams usually measure ROI through reduced support load, lower average handle time, faster lead response, higher agent productivity, improved conversion, and more consistent follow-up." },
  { question: "What does ROE mean here?", answer: "ROE is return on efficiency: how much manual work, delay, and repetition the system removes across support, sales, operations, and customer success workflows." },
  { question: "How does CRM integration help?", answer: "CRM connectivity turns conversations into action: summaries, contact updates, tasks, opportunity notes, ticket creation, lead qualification, and follow-up triggers." },
  { question: "What email setup is recommended?", answer: "Use a transactional email service such as Resend, Postmark, or SendGrid for verification, password reset, onboarding, billing, and alert emails, and configure SPF, DKIM, and DMARC for reliable delivery." },
];

const roiStats = [
  { label: "Lower support cost", value: "20–45%" },
  { label: "Faster response time", value: "< 2 sec" },
  { label: "Productivity improvement", value: "1.5–3x" },
  { label: "Follow-up speed", value: "Immediate" },
];

const crmFlows = [
  "Create or enrich customer records after a call",
  "Attach transcripts and summaries to the timeline",
  "Open support tickets or follow-up tasks automatically",
  "Capture qualification signals and customer intent",
  "Trigger email and SMS follow-up journeys",
  "Sync results into reporting and revenue dashboards",
];

const ragSources = [
  "Knowledge base articles",
  "Internal SOPs and policy documents",
  "Pricing rules and packaging guidance",
  "CRM notes and account history",
  "Product documentation and release notes",
  "Resolved transcript examples",
];

const emailJourneys = [
  { title: "Authentication", points: ["Account verification", "Password reset", "Security alerts", "Welcome and access confirmation"] },
  { title: "Customer lifecycle", points: ["Onboarding steps", "Usage alerts", "Upgrade prompts", "Receipts and billing notices"] },
  { title: "Operations", points: ["Workflow alerts", "CRM sync failures", "Call summaries", "Admin status notifications"] },
];

function AppShell() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPinError, setAdminPinError] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [pinChanged, setPinChanged] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setAuthReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAdminLogin = () => {
    if (adminPin === ADMIN_PIN) {
      setAdminUnlocked(true);
      setAdminPinError(false);
      setAdminPin("");
    } else {
      setAdminPinError(true);
      setTimeout(() => setAdminPinError(false), 2000);
    }
  };

  const handlePinChange = () => {
    if (newPin.length === 6 && /^\d{6}$/.test(newPin)) {
      (window as any).__ADMIN_PIN = newPin;
      setPinChanged(true);
      setNewPin("");
      setTimeout(() => setPinChanged(false), 2000);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(59,130,246,0.18),_transparent_24%),linear-gradient(180deg,_#020617,_#0f172a_55%,_#020617)]" />
          <SiteHeader session={session} setShowAdmin={setShowAdmin} />
          <Routes>
            <Route path="/" element={<HomePage session={session} />} />
            <Route path="/platform" element={<PlatformPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/pricing" element={<PricingPage session={session} />} />
            <Route path="/dashboard" element={<DashboardPage session={session} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/roi" element={<ROIPage />} />
            <Route path="/crm" element={<CRMPage />} />
            <Route path="/auth" element={<AuthPage session={session} authReady={authReady} />} />
          </Routes>
          <SiteFooter />
        </div>

        {showAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => { if (adminUnlocked) { setShowAdmin(false); setAdminUnlocked(false); } }}>
            <div onClick={e => e.stopPropagation()} className="w-full max-w-lg mx-4 rounded-2xl border border-white/10 bg-slate-950 p-8 shadow-2xl">
              {!adminUnlocked ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">🔒</span>
                    <h2 className="text-xl font-semibold text-white">Admin Access</h2>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">Enter 6-digit admin PIN</p>
                  <div className="flex gap-2 mb-4">
                    {[0,1,2,3,4,5].map(i => (
                      <div key={i} className={`w-10 h-12 rounded-lg border flex items-center justify-center text-lg font-mono text-white transition-colors ${adminPin.length > i ? 'border-emerald-500 bg-emerald-500/10' : adminPinError ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-white/5'}`}>
                        {adminPin[i] || ''}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[1,2,3,4,5,6,7,8,9].map(n => (
                      <button key={n} onClick={() => { if (adminPin.length < 6) { setAdminPin(p => p + n); } }} className="h-12 rounded-xl border border-white/10 bg-white/5 text-white text-lg font-semibold hover:bg-white/10 transition-colors">{n}</button>
                    ))}
                    <button onClick={() => setAdminPin('')} className="h-12 rounded-xl border border-white/10 bg-white/5 text-red-400 text-sm font-semibold hover:bg-white/10 transition-colors">Clear</button>
                    <button onClick={() => { if (adminPin.length < 6) { setAdminPin(p => p + '0'); } }} className="h-12 rounded-xl border border-white/10 bg-white/5 text-white text-lg font-semibold hover:bg-white/10 transition-colors">0</button>
                    <button onClick={() => setAdminPin(p => p.slice(0, -1))} className="h-12 rounded-xl border border-white/10 bg-white/5 text-slate-400 text-sm font-semibold hover:bg-white/10 transition-colors">⌫</button>
                  </div>
                  <button onClick={handleAdminLogin} disabled={adminPin.length !== 6} className="w-full h-11 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 disabled:opacity-40 transition-colors">Unlock</button>
                  <button onClick={() => { setShowAdmin(false); setAdminPin(''); }} className="w-full mt-2 h-10 rounded-xl border border-white/10 text-slate-400 text-sm hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">🔒</span>
                    <h2 className="text-xl font-semibold text-white">Admin Panel</h2>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs text-slate-500 mb-1">System</p>
                      <p className="text-sm text-white">VocalizeAI Studio</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs text-slate-500 mb-1">Auth</p>
                      <p className="text-sm text-emerald-400">{session ? session.user.email : 'Not signed in'}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs text-slate-500 mb-1">API Status</p>
                      <p className="text-sm text-white">{hasApiBaseUrl ? 'Configured' : 'Not configured'}</p>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-4 mb-4">
                    <p className="text-sm text-slate-400 mb-3">Change Admin PIN</p>
                    <div className="flex gap-2">
                      <input type="password" maxLength={6} value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="New 6-digit PIN" className="flex-1 h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:border-emerald-500/50" />
                      <button onClick={handlePinChange} disabled={newPin.length !== 6} className="h-10 px-4 rounded-xl bg-emerald-500 text-black text-sm font-semibold hover:bg-emerald-400 disabled:opacity-40 transition-colors">Set</button>
                    </div>
                    {pinChanged && <p className="text-xs text-emerald-400 mt-2">PIN updated for this session</p>}
                  </div>
                  <button onClick={() => { setShowAdmin(false); setAdminUnlocked(false); }} className="w-full h-10 rounded-xl border border-white/10 text-slate-400 text-sm hover:text-white hover:bg-white/5 transition-colors">Close</button>
                </>
              )}
            </div>
          </div>
        )}
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function SiteHeader({ session, setShowAdmin }: { session: Session | null; setShowAdmin: (v: boolean) => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 sm:px-8 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-lg text-emerald-300">🎙️</div>
          <div>
            <p className="text-sm font-semibold text-white">VoicePlatform</p>
            <p className="text-xs text-slate-400">Voice AI infrastructure for real business workflows</p>
          </div>
        </Link>

        <nav className="hidden flex-wrap items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `rounded-full px-4 py-2 text-sm transition ${isActive ? "bg-emerald-400 text-slate-950" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowAdmin(true)} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors" title="Admin">🔒</button>
          <Link to="/auth" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">
            {session ? "Account" : "Sign in"}
          </Link>
          <Link to="/dashboard" className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300">
            Open dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}

function Page({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">
      <section className="mb-12 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">{eyebrow}</p>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="max-w-3xl text-base leading-8 text-slate-300">{subtitle}</p>
      </section>
      <div className="space-y-10">{children}</div>
    </main>
  );
}

function HomePage({ session }: { session: Session | null }) {
  const healthQuery = useQuery({
    queryKey: ["backend-health"],
    queryFn: () => apiFetch<BackendHealth>("/health"),
    enabled: hasApiBaseUrl,
    retry: false,
  });

  return (
    <Page
      eyebrow="Voice AI platform"
      title="Turn conversations into action with streaming speech, agent orchestration, workflow execution, and secure billing."
      subtitle="A production-minded platform for teams that need realtime voice, retrieval, CRM automation, subscription billing, org management, and API access in one system."
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs text-emerald-300">Voice AI SaaS for workflows</div>
          <h2 className="mt-6 text-3xl font-semibold text-white sm:text-4xl">Built for product teams, operators, support, and customer-facing automation.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
            VoicePlatform connects streaming speech, agent reasoning, tool execution, retrieval, CRM actions, API keys,
            authentication, and Stripe-ready monetization into one operating layer.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/pricing" className="rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300">See pricing</Link>
            <Link to="/dashboard" className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">Open dashboard</Link>
            <Link to="/how-it-works" className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">How it works</Link>
          </div>
        </section>

        <section className="grid gap-4">
          <StatusCard title="Authentication" copy={session ? `Signed in as ${session.user.email ?? "user"}` : "Google login, email sign-in, signup, and password reset"} />
          <StatusCard title="Voice pipeline" copy="Streaming speech-to-text, agent routing, tool calls, and text-to-speech" />
          <StatusCard title="Monetization" copy="Stripe subscriptions, plans, org accounts, and API key access" />
          <StatusCard
            title="Backend status"
            copy={!hasApiBaseUrl ? "VITE_API_BASE_URL is not configured." : healthQuery.isSuccess ? `Connected: ${healthQuery.data.service} (${healthQuery.data.status})` : healthQuery.isError ? "API configured but not reachable." : "Checking backend connection..."}
          />
        </section>
      </div>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {platformCards.map((card) => (
          <article key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            {card.badge ? <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">{card.badge}</div> : null}
            <h3 className="mt-4 text-2xl font-semibold text-white">{card.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{card.copy}</p>
          </article>
        ))}
      </section>
    </Page>
  );
}

function StatusCard({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
      <p className="text-sm text-emerald-300">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-300">{copy}</p>
    </div>
  );
}

function PlatformPage() { return <SimpleContentPage eyebrow="Platform" title="Speech, reasoning, tool execution, retrieval, and billing in one operational system." subtitle="The platform is designed around the real execution pipeline: voice in, reasoning and tools in the middle, action and response on the way out." />; }
function HowItWorksPage() { return <SimpleContentPage eyebrow="How it works" title="A realtime voice pipeline that moves from speech to action execution." subtitle="The system captures audio, transcribes it, routes it through agent logic, executes tools, and returns both response text and spoken output." />; }
function AboutPage() { return <SimpleContentPage eyebrow="About" title="Designed for teams that need voice AI to be reliable, explainable, and operational." subtitle="The platform brings together speech infrastructure, retrieval, workflow automation, and account systems in a way that supports real business deployment." />; }

function SimpleContentPage({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <Page eyebrow={eyebrow} title={title} subtitle={subtitle}>
      <section className="grid gap-6 lg:grid-cols-2">
        {platformCards.map((card) => (
          <div key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-7">
            <h3 className="text-2xl font-semibold text-white">{card.title}</h3>
            <p className="mt-4 text-sm leading-8 text-slate-300">{card.copy}</p>
          </div>
        ))}
      </section>
    </Page>
  );
}

function PricingPage({ session }: { session: Session | null }) {
  const checkoutMutation = useMutation({
    mutationFn: async (plan: "pro" | "business") => {
      const result = await apiFetch<CreateCheckoutResponse>("/billing/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ plan }),
      });
      if (stripePromise) {
        const stripe = await stripePromise;
        if (stripe) {
          window.location.href = result.checkoutUrl;
          return result;
        }
      }
      window.location.href = result.checkoutUrl;
      return result;
    },
  });

  return (
    <Page
      eyebrow="Pricing"
      title="Simple pricing for a Voice AI workflow platform."
      subtitle="Start with a free entry point, convert builders with a Pro plan, and move teams to Business when they need broader workflow execution and organization controls."
    >
      {!hasApiBaseUrl || !hasStripeKey ? (
        <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm leading-7 text-amber-100">
          Live checkout requires both <span className="font-semibold">VITE_API_BASE_URL</span> and <span className="font-semibold">VITE_STRIPE_PUBLISHABLE_KEY</span>.
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-3">
        {pricingTiers.map((tier) => (
          <article key={tier.name} className={`rounded-[2rem] border p-8 ${tier.highlight ? "border-emerald-400/40 bg-emerald-400/10 shadow-2xl shadow-emerald-950/20" : "border-white/10 bg-white/5"}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold text-white">{tier.name}</h2>
                <p className="mt-2 text-sm text-slate-300">{tier.subtitle}</p>
              </div>
              {tier.badge ? <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">{tier.badge}</span> : null}
            </div>
            <p className="mt-8 text-5xl font-semibold text-white">{tier.price}</p>
            <div className="mt-8 space-y-3">
              {tier.features.map((feature) => (
                <div key={feature} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm leading-7 text-slate-300">{feature}</div>
              ))}
            </div>
            {tier.planCode === "pro" || tier.planCode === "business" ? (
              <button
                onClick={() => {
                  if (!session) {
                    window.location.href = "/auth";
                    return;
                  }
                  if (tier.planCode === "pro" || tier.planCode === "business") {
                    checkoutMutation.mutate(tier.planCode);
                  }
                }}
                disabled={checkoutMutation.isPending || !hasApiBaseUrl}
                className={`mt-8 inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition ${tier.highlight ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300" : "border border-white/10 bg-white/5 text-white hover:bg-white/10"} disabled:opacity-60`}
              >
                {checkoutMutation.isPending ? "Redirecting..." : tier.cta}
              </button>
            ) : (
              <Link to="/auth" className="mt-8 inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">{tier.cta}</Link>
            )}
          </article>
        ))}
      </section>
    </Page>
  );
}

function DashboardPage({ session }: { session: Session | null }) {
  const [apiKeyName, setApiKeyName] = useState("Default Key");
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [latestSecretKey, setLatestSecretKey] = useState<string | null>(null);

  const summaryQuery = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => apiFetch<DashboardSummary>("/dashboard/summary"),
    enabled: Boolean(session) && hasApiBaseUrl,
  });

  const createKeyMutation = useMutation({
    mutationFn: (name: string) => apiFetch<CreateApiKeyResponse>("/dashboard/api-keys", { method: "POST", body: JSON.stringify({ name }) }),
    onSuccess: (data) => {
      setLatestSecretKey(data.key);
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });

  const createLeadMutation = useMutation({
    mutationFn: () => apiFetch<CreateLeadResponse>("/dashboard/crm/leads", { method: "POST", body: JSON.stringify({ name: leadName, phone: leadPhone || null }) }),
    onSuccess: () => {
      setLeadName("");
      setLeadPhone("");
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });

  if (!session) {
    return (
      <Page eyebrow="Dashboard" title="Sign in to access your workspace." subtitle="The dashboard uses live backend data. Authenticate first to create API keys, view usage, and manage CRM records.">
        <Link to="/auth" className="inline-flex rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300">Sign in</Link>
      </Page>
    );
  }

  return (
    <Page eyebrow="Dashboard" title="Workspace operations, API access, and CRM execution." subtitle="This page is wired for real backend data. It does not invent records when your API is not configured.">
      {!hasApiBaseUrl ? (
        <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm leading-7 text-amber-100">Set <span className="font-semibold">VITE_API_BASE_URL</span> to load live workspace data.</div>
      ) : null}

      {summaryQuery.isLoading ? <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">Loading dashboard...</div> : null}
      {summaryQuery.isError ? <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-6 text-rose-100">{(summaryQuery.error as Error).message}</div> : null}

      {summaryQuery.data ? (
        <>
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Organization" value={summaryQuery.data.organization.name} />
            <MetricCard label="Plan" value={summaryQuery.data.organization.plan.toUpperCase()} />
            <MetricCard label="Minutes used" value={String(summaryQuery.data.usage.minutes_used)} />
            <MetricCard label="Sessions" value={String(summaryQuery.data.usage.sessions_count)} />
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-2xl font-semibold text-white">API keys</h2>
              <div className="mt-6 space-y-3">
                {summaryQuery.data.apiKeys.map((key) => (
                  <div key={key.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <p className="font-semibold text-white">{key.name}</p>
                    <p className="mt-1 text-sm text-slate-300">{key.key_preview}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-3">
                <Input label="New API key name" type="text" placeholder="Server key" value={apiKeyName} onChange={setApiKeyName} />
                <button onClick={() => createKeyMutation.mutate(apiKeyName)} disabled={createKeyMutation.isPending} className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300 disabled:opacity-60">
                  {createKeyMutation.isPending ? "Creating..." : "Create API key"}
                </button>
                {latestSecretKey ? <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">Copy now. This secret is only shown once: <span className="font-mono">{latestSecretKey}</span></div> : null}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-2xl font-semibold text-white">Create CRM lead</h2>
              <div className="mt-6 space-y-3">
                <Input label="Lead name" type="text" placeholder="Jordan Lee" value={leadName} onChange={setLeadName} />
                <Input label="Phone" type="text" placeholder="+1 555 000 0000" value={leadPhone} onChange={setLeadPhone} />
                <button onClick={() => createLeadMutation.mutate()} disabled={createLeadMutation.isPending || !leadName.trim()} className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100 disabled:opacity-60">
                  {createLeadMutation.isPending ? "Saving..." : "Create lead"}
                </button>
              </div>
              <div className="mt-6 space-y-3">
                {summaryQuery.data.leads.map((lead) => (
                  <div key={lead.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-300">
                    <div className="font-semibold text-white">{lead.name}</div>
                    <div>{lead.phone ?? "No phone"}</div>
                    <div className="text-slate-500">{lead.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-2xl font-semibold text-white">Recent sessions</h2>
              <div className="mt-6 space-y-3">
                {summaryQuery.data.recentSessions.map((sessionItem) => (
                  <div key={sessionItem.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <p className="text-sm text-slate-300">{sessionItem.transcript || "No transcript captured"}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">{sessionItem.status}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8">
              <h2 className="text-2xl font-semibold text-white">Live readiness checklist</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                <li>• Auth configured through Supabase</li>
                <li>• Backend API responding</li>
                <li>• Stripe publishable key present</li>
                <li>• API key issuance working</li>
                <li>• CRM lead creation working</li>
              </ul>
            </div>
          </section>
        </>
      ) : null}
    </Page>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function ROIPage() {
  return (
    <Page eyebrow="ROI + ROE" title="Measure platform value in savings, speed, and operational efficiency." subtitle="A strong rollout is not only about AI capability — it is about how much cost, time, and repetitive work the system removes.">
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {roiStats.map((item) => <MetricCard key={item.label} label={item.label} value={item.value} />)}
      </section>
    </Page>
  );
}

function CRMPage() {
  return (
    <Page eyebrow="CRM integration" title="Keep every conversation tied to customer context and follow-up." subtitle="CRM integrations help teams turn spoken interactions into structured actions and account intelligence without extra manual work.">
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">What can be synced</h2>
          <div className="mt-6 space-y-3">{crmFlows.map((flow) => <div key={flow} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm leading-7 text-slate-300">{flow}</div>)}</div>
        </div>
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-8">
          <h2 className="text-2xl font-semibold text-white">Why it matters</h2>
          <p className="mt-4 text-sm leading-8 text-slate-200">When transcripts, summaries, customer signals, and next steps are pushed into the CRM, teams respond faster, keep cleaner records, and create more measurable value from every interaction.</p>
        </div>
      </section>
    </Page>
  );
}

function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <Page eyebrow="FAQ" title="Common questions about the platform, setup, and business impact." subtitle="Use this section to understand how the product works across authentication, retrieval, integrations, pricing, and operational readiness.">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const open = index === openIndex;
            return (
              <button key={item.question} onClick={() => setOpenIndex(index)} className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 text-left">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-white">{item.question}</h3>
                  <span className="text-emerald-300">{open ? "−" : "+"}</span>
                </div>
                {open ? <p className="mt-4 text-sm leading-8 text-slate-300">{item.answer}</p> : null}
              </button>
            );
          })}
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8">
          <h2 className="text-2xl font-semibold text-white">RAG source examples</h2>
          <div className="mt-6 flex flex-wrap gap-3">{ragSources.map((source) => <span key={source} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">{source}</span>)}</div>
        </div>
      </section>
    </Page>
  );
}

function AuthPage({ session, authReady }: { session: Session | null; authReady: boolean }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => session ? "Your account" : mode === "signup" ? "Create your account" : mode === "forgot" ? "Reset your password" : "Sign in to your account", [mode, session]);
  const subtitle = useMemo(() => session ? "You are signed in and ready to continue using the platform." : mode === "signup" ? "Use Google or create an account with your work email." : mode === "forgot" ? "Enter your email and we will send a password reset link." : "Use Google authentication or sign in with your email and password.", [mode, session]);

  const clearNotices = () => { setMessage(null); setError(null); };

  const handleGoogleSignIn = async () => {
    clearNotices();
    if (!supabase) { setError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable Google sign-in."); return; }
    setLoading(true);
    const redirectTo = `${window.location.origin}/auth`;
    const { error: authError } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
    if (authError) setError(authError.message);
    setLoading(false);
  };

  const handleEmailAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearNotices();
    if (!supabase) { setError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable email authentication."); return; }
    setLoading(true);

    if (mode === "forgot") {
      const redirectTo = `${window.location.origin}/auth`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (resetError) setError(resetError.message); else setMessage("Password reset email sent. Please check your inbox.");
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, company }, emailRedirectTo: `${window.location.origin}/auth` } });
      if (signUpError) setError(signUpError.message); else setMessage("Account created. Check your email to verify your address if confirmation is enabled.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) setError(signInError.message); else setMessage("Signed in successfully.");
    setLoading(false);
  };

  const handleSignOut = async () => {
    clearNotices();
    if (!supabase) return;
    setLoading(true);
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) setError(signOutError.message);
    setLoading(false);
  };

  return (
    <Page eyebrow="Authentication" title={title} subtitle={subtitle}>
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
          {!hasSupabaseEnv ? <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-7 text-amber-100">Supabase environment variables are not configured yet. Add <span className="font-semibold">VITE_SUPABASE_URL</span> and <span className="font-semibold">VITE_SUPABASE_ANON_KEY</span> to enable live Google auth, email login, signup, and password reset.</div> : null}
          {session ? (
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
                <p className="text-sm text-slate-400">Signed in as</p>
                <p className="mt-2 text-2xl font-semibold text-white">{session.user.email ?? "Authenticated user"}</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">Provider: {session.user.app_metadata.provider ?? "email"}</p>
              </div>
              <button onClick={handleSignOut} disabled={loading} className="w-full rounded-2xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300 disabled:opacity-60">{loading ? "Signing out..." : "Sign out"}</button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex gap-2 rounded-full border border-white/10 bg-slate-900/70 p-1">
                {[ ["login", "Login"], ["signup", "Sign up"], ["forgot", "Forgot password"] ].map(([value, label]) => (
                  <button key={value} onClick={() => { clearNotices(); setMode(value as AuthMode); }} className={`rounded-full px-4 py-2 text-sm transition ${mode === value ? "bg-emerald-400 text-slate-950" : "text-slate-300 hover:bg-white/5"}`}>{label}</button>
                ))}
              </div>
              <button onClick={handleGoogleSignIn} disabled={loading || !authReady} className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-100 disabled:opacity-60"><span className="text-lg">G</span>{loading ? "Please wait..." : "Continue with Google"}</button>
              <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-[0.25em] text-slate-500"><div className="h-px flex-1 bg-white/10" />or<div className="h-px flex-1 bg-white/10" /></div>
              <form className="space-y-4" onSubmit={handleEmailAuth}>
                {mode === "signup" ? <Input label="Full name" type="text" placeholder="Alex Morgan" value={fullName} onChange={setFullName} /> : null}
                <Input label="Work email" type="email" placeholder="you@company.com" value={email} onChange={setEmail} />
                {mode !== "forgot" ? <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={setPassword} /> : null}
                {mode === "signup" ? <Input label="Company" type="text" placeholder="Acme Inc." value={company} onChange={setCompany} /> : null}
                <button type="submit" disabled={loading || !authReady} className="w-full rounded-2xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300 disabled:opacity-60">{loading ? "Please wait..." : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset email" : "Sign in"}</button>
              </form>
            </>
          )}
          {message ? <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">{message}</div> : null}
          {error ? <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">{error}</div> : null}
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8">
            <h3 className="text-2xl font-semibold text-white">Authentication setup</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              <li>• Enable Google provider in Supabase authentication settings</li>
              <li>• Add your site URL and redirect URL for local and production environments</li>
              <li>• Configure email templates for verification and password reset</li>
              <li>• Use your transactional email domain for reliable delivery</li>
              <li>• Add optional MFA and session controls as your user base grows</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-8">
            <h3 className="text-2xl font-semibold text-white">Email setup</h3>
            <div className="mt-5 space-y-5">{emailJourneys.map((journey) => <div key={journey.title}><p className="text-sm font-semibold text-emerald-200">{journey.title}</p><ul className="mt-2 space-y-2 text-sm leading-7 text-slate-200">{journey.points.map((point) => <li key={point}>• {point}</li>)}</ul></div>)}</div>
          </div>
        </div>
      </section>
    </Page>
  );
}

function Input({ label, type, placeholder, value, onChange }: { label: string; type: string; placeholder: string; value: string; onChange: (value: string) => void }) {
  return <label className="block space-y-2"><span className="text-sm text-slate-300">{label}</span><input type={type} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50" /></label>;
}

function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div>
          <p className="text-lg font-semibold text-white">VoicePlatform</p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Voice AI infrastructure for speech, retrieval, automation, CRM workflows, analytics, subscriptions, and secure account access.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">{navItems.map((item) => <Link key={item.to} to={item.to} className="text-sm text-slate-400 hover:text-white">{item.label}</Link>)}</div>
      </div>
    </footer>
  );
}

export default AppShell;
