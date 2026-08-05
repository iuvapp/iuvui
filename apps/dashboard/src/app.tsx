import {
  ClerkProvider,
  OrganizationSwitcher,
  Show,
  SignInButton,
  UserButton,
  useAuth,
} from "@clerk/react";
import { Button, Link } from "@heroui/react";
import {
  ArrowUpRightIcon,
  BrandLockup,
  CheckIcon,
  GridIcon,
} from "@iuvui/site-ui";
import { useEffect, useState } from "react";

import * as m from "./paraglide/messages.js";
import { getLocale, setLocale } from "./paraglide/runtime.js";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const navigation = [
  "Overview",
  "Licenses",
  "Registry",
  "Projects",
  "Team",
  "Billing",
  "Tokens",
];

function LanguageToggle() {
  const nextLocale = getLocale() === "en" ? "zh-CN" : "en";

  return (
    <Button
      aria-label={m.common_switch_language()}
      className="language-toggle"
      size="sm"
      variant="ghost"
      onPress={() => void setLocale(nextLocale)}
    >
      {nextLocale === "en" ? "EN" : "ZH"}
    </Button>
  );
}

function ConfigureClerk() {
  return (
    <main className="setup-screen">
      <div className="setup-card">
        <BrandLockup />
        <span className="setup-index">APP / 00</span>
        <h1>Connect Clerk to open the Pro console.</h1>
        <p>
          The dashboard shell is ready. Add the browser publishable key to{" "}
          <code>.env.local</code> and Worker credentials to{" "}
          <code>.dev.vars</code>.
        </p>
        <div className="setup-command">
          <span>VITE_CLERK_PUBLISHABLE_KEY</span>
          <strong>Required</strong>
        </div>
        <Link
          href="https://clerk.com/docs"
          target="_blank"
          rel="noreferrer"
          className="setup-link"
        >
          Open Clerk documentation <ArrowUpRightIcon aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}

function SignedOutScreen() {
  return (
    <main className="signin-screen">
      <div className="signin-aside">
        <BrandLockup inverted />
        <p>Pro Console</p>
        <h1>Your UI system, under control.</h1>
        <ul>
          {[
            "Manage licenses and teams",
            "Access Pro Registry",
            "Issue CLI tokens",
          ].map((item) => (
            <li key={item}>
              <CheckIcon aria-hidden="true" /> {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="signin-panel">
        <span className="setup-index">APP / SIGN IN</span>
        <h2>{m.dashboard_sign_in_title()}</h2>
        <p>{m.dashboard_sign_in_description()}</p>
        <SignInButton mode="modal">
          <Button size="lg" fullWidth>
            {m.dashboard_sign_in_action()}
          </Button>
        </SignInButton>
        <Link href="https://iuvui.com">Return to iuvui.com</Link>
      </div>
    </main>
  );
}

function SessionStatus() {
  const { getToken, orgId } = useAuth();
  const [status, setStatus] = useState<
    "checking" | "connected" | "unavailable"
  >("checking");

  useEffect(() => {
    let active = true;

    async function check() {
      try {
        const token = await getToken();
        const response = await fetch(
          "/api/session",
          token ? { headers: { Authorization: `Bearer ${token}` } } : {},
        );
        if (active) setStatus(response.ok ? "connected" : "unavailable");
      } catch {
        if (active) setStatus("unavailable");
      }
    }

    void check();
    return () => {
      active = false;
    };
  }, [getToken, orgId]);

  return (
    <span className={`session-status is-${status}`}>
      <span />
      {status === "checking"
        ? "Checking API"
        : status === "connected"
          ? "Worker verified"
          : "Worker setup needed"}
    </span>
  );
}

function MetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

function Dashboard() {
  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <Link href="/" aria-label="iuvui dashboard" className="dashboard-brand">
          <BrandLockup inverted />
        </Link>
        <nav aria-label="Dashboard navigation">
          {navigation.map((item, index) => (
            <a
              className={index === 0 ? "is-active" : ""}
              href={`#${item.toLowerCase()}`}
              key={item}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item}
            </a>
          ))}
        </nav>
        <div className="sidebar-foot">
          <SessionStatus />
          <Link href="https://iuvui.com">iuvui.com</Link>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="workspace-label">Current workspace</span>
            <OrganizationSwitcher hidePersonal />
          </div>
          <div className="account-actions">
            <LanguageToggle />
            <Button variant="outline" size="sm">
              Documentation
            </Button>
            <UserButton />
          </div>
        </header>

        <section className="dashboard-content" id="overview">
          <div className="dashboard-title">
            <div>
              <p className="dashboard-eyebrow">Overview / August 2026</p>
              <h1>{m.dashboard_overview_title()}</h1>
            </div>
            <Button>
              Create project <ArrowUpRightIcon aria-hidden="true" />
            </Button>
          </div>

          <div className="metric-grid">
            <MetricCard
              label="Active licenses"
              value="—"
              note="Waiting for entitlement data"
            />
            <MetricCard
              label="Team members"
              value="—"
              note="Synced from Clerk Organization"
            />
            <MetricCard
              label="Registry installs"
              value="—"
              note="Available after CLI connection"
            />
          </div>

          <div className="dashboard-grid">
            <section className="activity-panel">
              <div className="panel-heading">
                <div>
                  <span>System activity</span>
                  <h2>Nothing noisy. Yet.</h2>
                </div>
                <GridIcon aria-hidden="true" />
              </div>
              <div className="empty-state">
                <span className="empty-orbit" />
                <p>
                  Connect the Pro Registry to see installs, releases and team
                  activity here.
                </p>
                <Button variant="secondary" size="sm">
                  View setup guide
                </Button>
              </div>
            </section>

            <aside className="next-panel">
              <span className="panel-number">NEXT / 03</span>
              <h2>Finish your workspace.</h2>
              <ol>
                <li>
                  <CheckIcon aria-hidden="true" />
                  <span>Clerk authentication connected</span>
                </li>
                <li>
                  <span className="step-dot">2</span>
                  <span>Create your first project</span>
                </li>
                <li>
                  <span className="step-dot">3</span>
                  <span>Generate a CLI token</span>
                </li>
              </ol>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}

export function App() {
  if (!publishableKey) return <ConfigureClerk />;

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <Show when="signed-in" fallback={<SignedOutScreen />}>
        <Dashboard />
      </Show>
    </ClerkProvider>
  );
}
