import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiMoon, FiSun } from "react-icons/fi";
import { useBookVerse } from "../context/BookVerseContext";

export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function BookVerseShell({
  children,
  mode = "reading",
  darkMode,
  setDarkMode,
  title = "BookVerse",
  subtitle,
  compact = false,
}) {
  const { currentUser, isAdmin, isAuthenticated } = useBookVerse();
  const isCompetition = mode === "competition" || darkMode;

  const navLinks = [
    { label: "Library", to: "/search" },
    { label: "Journeys", to: "/competitions" },
    { label: "Circles", to: "/groups" },
    { label: "Identities", to: "/personas" },
    ...(isAuthenticated ? [{ label: "Dashboard", to: "/profile" }] : []),
    { label: "Settings", to: "/settings" },
    ...(isAdmin ? [{ label: "Admin", to: "/admin" }] : []),
  ];

  return (
    <div
      className={cx(
        "relative min-h-screen overflow-hidden",
        isCompetition
          ? "bg-[linear-gradient(180deg,#141614_0%,#10120f_100%)] text-[#f0e3d2]"
          : "bg-[linear-gradient(180deg,#f4efe6_0%,#efe8dc_100%)] text-[#1f1c18]"
      )}
    >
      <div className={cx("bookverse-orb -left-20 top-10 h-56 w-56", isCompetition ? "bg-[#d8bf9a]/10" : "bg-[#c4a071]/20")} />
      <div className={cx("bookverse-orb -right-16 top-24 h-64 w-64", isCompetition ? "bg-[#8aa691]/12" : "bg-[#2e4a3f]/12")} />
      <div className="bookverse-grid absolute inset-0 opacity-35" />

      <nav
        className={cx(
          "sticky top-0 z-50 border-b backdrop-blur-xl",
          isCompetition
            ? "border-[#d4bb9a]/15 bg-[#151714]/86 text-[#f0e3d2]"
            : "border-[#2d2820]/10 bg-[#f7f2ea]/90 text-[#1f1c18]"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Logo dark={isCompetition} subtitle={subtitle} title={title} />
              {subtitle ? (
                <p className={cx("mt-0.5 text-[11px] uppercase tracking-[0.2em]", isCompetition ? "text-[#baa98f]" : "text-[#776b5d]")}>{subtitle}</p>
              ) : null}
            </div>

            <div className={cx("hidden items-center gap-1 xl:flex", isCompetition ? "text-[#e6d6c3]" : "text-[#2a241d]")}>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cx(
                    "rounded-full px-3 py-2 text-sm transition",
                    isCompetition ? "hover:bg-[#e8d7bf]/10" : "hover:bg-[#1f1c18]/7"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {currentUser ? (
                <div
                  className={cx(
                    "hidden rounded-full border px-3 py-1.5 text-sm md:inline-flex",
                    isCompetition ? "border-[#d4bb9a]/18 bg-[#f2dec1]/8 text-[#f2e5d5]" : "border-[#2d2820]/12 bg-white/60 text-[#2a241d]"
                  )}
                >
                  {currentUser.full_name || currentUser.name}
                </div>
              ) : (
                <>
                  <Link to="/login" className={cx("hidden rounded-full px-3 py-2 text-sm md:inline-flex", isCompetition ? "text-[#f2e7d9]" : "text-[#2d2820]")}>
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={cx(
                      "bookverse-button rounded-full px-4 py-2 text-sm font-semibold",
                      isCompetition ? "bg-[#efe1cf] text-black" : "bg-[#2e4a3f] text-white"
                    )}
                  >
                    Register
                  </Link>
                </>
              )}

              {setDarkMode ? (
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={cx(
                    "bookverse-button inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm",
                    isCompetition ? "border-[#d4bb9a]/20 bg-[#f0deca]/8 text-[#f2e6d7]" : "border-[#2d2820]/12 bg-white/72 text-[#2a241d]"
                  )}
                >
                  {darkMode ? <FiSun /> : <FiMoon />}
                  Atmosphere
                </button>
              ) : null}
            </div>
          </div>

          <div className={cx("mt-3 flex gap-2 overflow-x-auto pb-1 xl:hidden", isCompetition ? "text-[#e6d6c3]" : "text-[#2d2820]")}>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cx(
                  "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.14em] sm:text-sm sm:tracking-normal",
                  isCompetition ? "border-[#d4bb9a]/20 bg-[#f2dfc4]/7" : "border-[#2d2820]/12 bg-white/72"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className={cx("bookverse-page-enter relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", compact ? "pb-12" : "pb-20")}>{children}</main>
      <Footer dark={isCompetition} />
    </div>
  );
}

export function Logo({ title = "BookVerse", dark = false, subtitle }) {
  return (
    <Link to="/" className="inline-flex items-center gap-3">
      <span
        className={cx(
          "grid h-10 w-10 place-items-center rounded-2xl border text-sm font-semibold shadow-sm",
          dark ? "border-[#d4bb9a]/22 bg-[#efe1cd]/8 text-[#f1ddbf]" : "border-[#2d2820]/12 bg-white/70 text-[#2e4a3f]"
        )}
      >
        BV
      </span>
      <span>
        <span className={cx("font-display block text-[1.75rem] leading-none", dark ? "text-[#f1dfc7]" : "text-[#1f1c18]")}>{title}</span>
        {!subtitle ? (
          <span className={cx("block text-[10px] uppercase tracking-[0.22em]", dark ? "text-[#b8a78f]" : "text-[#786b5a]")}>Luminous Reading Sanctuary</span>
        ) : null}
      </span>
    </Link>
  );
}

export function Footer({ dark = false }) {
  return (
    <footer className={cx("relative border-t", dark ? "border-[#d4bb9a]/14 bg-[#191714] text-[#e9dccb]" : "border-[#2d2820]/14 bg-[#221d18] text-[#e9dccb]")}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_18%,rgba(196,160,113,0.2),transparent_32%),radial-gradient(circle_at_82%_86%,rgba(138,166,145,0.16),transparent_34%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <Logo dark subtitle="" />
          <p className="mt-4 max-w-md text-sm leading-7 text-[#cfbea7]">
            Built for readers who value depth, reflection, and the slow reward of finishing meaningful books.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#bda98d]">Navigate</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-[#e3d4bf]">
            <a href="/#about-bookverse" className="transition hover:opacity-80">About</a>
            <Link to="/search" className="transition hover:opacity-80">Library</Link>
            <Link to="/groups" className="transition hover:opacity-80">Circles</Link>
            <Link to="/competitions" className="transition hover:opacity-80">Journeys</Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#bda98d]">Contact</p>
          <div className="mt-4 space-y-2 text-sm text-[#e3d4bf]">
            <a href="mailto:hello@bookverse.app" className="transition hover:opacity-80">hello@bookverse.app</a>
            <a href="https://instagram.com/bookverse" target="_blank" rel="noreferrer" className="block transition hover:opacity-80">Instagram</a>
            <p className="pt-2 text-xs text-[#a89478]">© BookVerse</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Surface({ children, className = "", tone = "warm" }) {
  return (
    <div
      className={cx(
        "rounded-[1.75rem] border backdrop-blur-sm",
        tone === "dark"
          ? "border-[#d4bb9a]/16 bg-[rgba(28,29,27,0.9)] text-[#f0e3d2] shadow-[0_20px_44px_rgba(0,0,0,0.34)]"
          : "border-[#2d2820]/10 bg-[rgba(255,251,245,0.88)] text-[#1f1c18] shadow-[0_18px_40px_rgba(33,27,20,0.11)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Pill({ children, className = "", tone = "warm" }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
        tone === "dark"
          ? "border-[#d4bb9a]/24 bg-[#f2dec4]/8 text-[#e9d6bc]"
          : "border-[#2d2820]/12 bg-white/70 text-[#5b4d3f]",
        className
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, description, action, align = "left", dark = false }) {
  return (
    <div className={cx("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", align === "center" && "items-center text-center md:flex-col")}>
      <div className={cx(align === "center" && "max-w-3xl")}>
        {eyebrow ? (
          <p className={cx("text-[11px] font-semibold uppercase tracking-[0.22em]", dark ? "text-[#c8b59c]" : "text-[#7b6e5f]")}>{eyebrow}</p>
        ) : null}
        <h2 className={cx("font-display mt-2 text-[2rem] leading-[1.1] sm:text-[2.5rem]", dark ? "text-[#f3e7d7]" : "text-[#1f1c18]")}>{title}</h2>
        {description ? <p className={cx("mt-3 max-w-2xl text-sm leading-7 sm:text-base", dark ? "text-[#c8b9a6]" : "text-[#685f53]")}>{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function PrimaryButton({ children, to, className = "", tone = "warm", ...props }) {
  const styles = cx(
    "bookverse-button inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold",
    tone === "dark"
      ? "border border-[#dcc39c]/25 bg-[#efe1cd] text-[#211d17] hover:bg-[#f3e8d9]"
      : "border border-transparent bg-[#2e4a3f] text-[#f4ece1] hover:bg-[#35584a]"
  );

  if (to) {
    return (
      <Link to={to} className={cx(styles, className)} {...props}>
        {children}
      </Link>
    );
  }

  return <button className={cx(styles, className)} {...props}>{children}</button>;
}

export function SecondaryButton({ children, to, className = "", tone = "warm", ...props }) {
  const styles = cx(
    "bookverse-button inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold",
    tone === "dark"
      ? "border-[#d4bb9a]/24 bg-[#f2dec4]/7 text-[#f0e2ce] hover:bg-[#f2dec4]/12"
      : "border-[#2d2820]/12 bg-white/72 text-[#2b251d] hover:bg-white"
  );

  if (to) {
    return (
      <Link to={to} className={cx(styles, className)} {...props}>
        {children}
      </Link>
    );
  }

  return <button className={cx(styles, className)} {...props}>{children}</button>;
}

export function StatTile({ label, value, detail, dark = false }) {
  return (
    <Surface tone={dark ? "dark" : "warm"} className="p-5">
      <p className={cx("text-[11px] font-semibold uppercase tracking-[0.18em]", dark ? "text-[#bda78a]" : "text-[#7b6e5f]")}>{label}</p>
      <p className={cx("mt-3 text-3xl font-bold", dark ? "text-[#f2e5d3]" : "text-[#1f1c18]")}>{value}</p>
      {detail ? <p className={cx("mt-2 text-sm", dark ? "text-[#c7b9a6]" : "text-[#685f53]")}>{detail}</p> : null}
    </Surface>
  );
}

export function ProgressBar({ value, max, dark = false }) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className={cx("h-2.5 overflow-hidden rounded-full", dark ? "bg-[#f2dfc6]/14" : "bg-[#d8c7b2]/45")}>
      <div
        className={cx(
          "h-full rounded-full",
          dark ? "bg-[linear-gradient(90deg,#dcc39c,#8aa691)]" : "bg-[linear-gradient(90deg,#c4a071,#2e4a3f)]"
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export function BookCard({ book, dark = false, compact = false, index = 0 }) {
  return (
    <Link to={`/book/${book.id}`} state={{ book }} className="bookverse-stagger block" style={{ animationDelay: `${index * 60}ms` }}>
      <Surface tone={dark ? "dark" : "warm"} className={cx("bookverse-book-card group h-full overflow-hidden p-3", compact ? "rounded-3xl" : "")}> 
        <div className={cx("relative overflow-hidden rounded-[1.35rem]", compact ? "aspect-3/4" : "aspect-4/5")}>
          <div className={cx("absolute inset-0", dark ? "bg-[linear-gradient(145deg,#3a322a,#1d1a16)]" : "bg-[linear-gradient(145deg,#d6c2a3,#8f6e4d)]")} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_45%)]" />
          <div className="absolute inset-x-4 top-4 rounded-full border border-white/28 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/85">
            {book.genre}
          </div>
          <div className="absolute inset-x-4 bottom-4 text-[#fff7ec]">
            <p className="font-display text-2xl leading-tight">{book.title}</p>
            <p className="mt-1.5 text-sm text-white/76">{book.author}</p>
          </div>
        </div>

        <div className="px-1 pb-1 pt-4">
          <div className="flex items-center justify-between gap-2">
            <p className={cx("text-sm font-semibold", dark ? "text-[#e6d8c5]" : "text-[#4f4336]")}>{book.rating.toFixed(1)} rating</p>
            <Pill tone={dark ? "dark" : "warm"}>+{book.xp} XP</Pill>
          </div>
          {!compact ? <p className={cx("mt-3 text-sm leading-6", dark ? "text-[#c7b7a2]" : "text-[#695f53]")}>{book.blurb}</p> : null}
        </div>
      </Surface>
    </Link>
  );
}

export function TimelineItem({ label, value, dark = false }) {
  return (
    <div className="relative pl-5">
      <div className={cx("absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full", dark ? "bg-[#dcc39c]" : "bg-[#2e4a3f]")} />
      <p className={cx("text-[11px] font-semibold uppercase tracking-[0.17em]", dark ? "text-[#bda78a]" : "text-[#7b6e5f]")}>{label}</p>
      <p className={cx("mt-1 text-sm font-semibold", dark ? "text-[#f0e2cf]" : "text-[#2c261e]")}>{value}</p>
    </div>
  );
}

export function InlineLink({ to, children, dark = false }) {
  return (
    <Link to={to} className={cx("inline-flex items-center gap-2 text-sm font-semibold", dark ? "text-[#e9d6bc]" : "text-[#2e4a3f]")}>
      {children}
      <FiArrowRight />
    </Link>
  );
}

export function LoadingPulse({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-[#2d2820]/10 bg-white/70 px-4 py-4 text-sm text-[#6b6053] dark:border-[#d4bb9a]/16 dark:bg-[#282823] dark:text-[#c7b8a5]">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#2e4a3f] dark:bg-[#dcc39c]" />
      {label}
    </div>
  );
}

export function RevealOnScroll({ children, className = "", delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cx("bookverse-reveal", visible && "is-visible", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
