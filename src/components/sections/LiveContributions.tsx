import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  GitCommit,
  GitBranch,
  Flame,
  Calendar,
  ArrowUpRight,
  Activity,
  Code2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { CountUp } from '@/components/ui/CountUp';
import { fadeUp, stagger, scaleIn } from '@/lib/motion';
import type {
  ContributionDay,
  ContributionStats,
  GitHubEventItem,
} from '@/lib/github';
import {
  fetchLiveContributions,
  fetchLiveEvents,
  calculateStreakStats,
  FALLBACK_CONTRIBUTION_DATA,
  FALLBACK_EVENTS,
} from '@/lib/github';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function LiveContributions() {
  const { ref: sectionRef, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  const [contributions, setContributions] = useState<ContributionDay[]>(
    FALLBACK_CONTRIBUTION_DATA.contributions
  );
  const [events, setEvents] = useState<GitHubEventItem[]>(FALLBACK_EVENTS);
  const [stats, setStats] = useState<ContributionStats>(() =>
    calculateStreakStats(FALLBACK_CONTRIBUTION_DATA.contributions)
  );
  const [isLiveSynced, setIsLiveSynced] = useState(false);
  const [statsImgError, setStatsImgError] = useState(false);
  const [langsImgError, setLangsImgError] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
    showBelow: boolean;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch live contributions & activity on mount
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [contribData, eventData] = await Promise.all([
          fetchLiveContributions(),
          fetchLiveEvents(),
        ]);

        if (mounted) {
          if (contribData?.contributions?.length) {
            setContributions(contribData.contributions);
            setStats(calculateStreakStats(contribData.contributions));
          }
          if (eventData?.length) {
            setEvents(eventData);
          }
          setIsLiveSynced(true);
        }
      } catch (e) {
        console.warn('Failed to hydrate live GitHub metrics:', e);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  // Group 365 days into 52/53 columns (weeks), each containing 7 days
  const { weeks, monthLabels } = useMemo(() => {
    if (!contributions || contributions.length === 0) {
      return { weeks: [], monthLabels: [] };
    }

    const weeksList: (ContributionDay | null)[][] = [];
    const months: { label: string; weekIndex: number }[] = [];

    let currentWeek: (ContributionDay | null)[] = [];
    let lastMonth = -1;

    // Pad first week so days align with day of week (0 = Sunday, 6 = Saturday)
    const firstDate = new Date(contributions[0].date);
    const startDayOfWeek = firstDate.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push(null);
    }

    for (let i = 0; i < contributions.length; i++) {
      const item = contributions[i];
      const d = new Date(item.date);
      const m = d.getMonth();

      // Track where each new month appears
      if (m !== lastMonth) {
        months.push({
          label: MONTH_NAMES[m],
          weekIndex: weeksList.length,
        });
        lastMonth = m;
      }

      currentWeek.push(item);

      if (currentWeek.length === 7) {
        weeksList.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeksList.push(currentWeek);
    }

    return { weeks: weeksList, monthLabels: months };
  }, [contributions]);

  // Color mapping based on intensity level
  const getLevelClasses = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-[#00E5FF]/25 border-[#00E5FF]/40 hover:bg-[#00E5FF]/40';
      case 2:
        return 'bg-[#00E5FF]/50 border-[#00E5FF]/60 hover:bg-[#00E5FF]/70';
      case 3:
        return 'bg-[#00E5FF]/80 border-[#00E5FF]/90 hover:bg-[#00E5FF]';
      case 4:
        return 'bg-[#00E5FF] border-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.7)] hover:shadow-[0_0_12px_rgba(0,229,255,0.9)]';
      case 0:
      default:
        return 'bg-[#141418] border-[#24242c] hover:border-[#383844]';
    }
  };

  return (
    <section
      id="about-contributions"
      aria-labelledby="live-contributions-heading"
      ref={sectionRef}
      className="py-24 md:py-32 border-b border-border relative overflow-hidden"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 850px' }}
    >
      {/* Subtle ambient cyan glow behind section */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan/5 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col gap-12"
        >
          {/* ── Section Header ── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <motion.div variants={fadeUp}>
                <SectionLabel>Activity // Neural Uplink</SectionLabel>
              </motion.div>
              <motion.h2
                id="live-contributions-heading"
                variants={fadeUp}
                className="font-display italic text-heading"
                style={{ fontSize: 'clamp(28px, 4vw, 56px)', lineHeight: '0.92' }}
              >
                Live Contributions.
              </motion.h2>
              <motion.p variants={fadeUp} className="font-ui text-sm text-body max-w-[560px] leading-relaxed">
                Autonomous multi-agent platforms, bare-metal kernels, and zero-cost systems.
                Empirical GitHub activity and real-time shipping cadence across repositories.
              </motion.p>
            </div>

            {/* Live Sync Status Beacon */}
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <a
                href="https://github.com/HardikBhaskar2010"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface border border-border hover:border-cyan/50 transition-all duration-300 shadow-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan" />
                </span>
                <span className="font-mono text-xs text-heading group-hover:text-cyan transition-colors">
                  {isLiveSynced ? 'LIVE UPLINK ACTIVE' : 'CONNECTING API...'}
                </span>
                <ArrowUpRight size={13} className="text-muted group-hover:text-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </motion.div>
          </div>

          {/* ── Metric Highlights Strip ── */}
          <motion.div
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {/* Total Contributions */}
            <motion.div
              variants={scaleIn}
              className="bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-border/80 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-muted">
                  <span className="font-ui text-[10px] uppercase tracking-widest text-tagText">Past 12 Months</span>
                  <Calendar size={15} className="text-cyan/70" />
                </div>
                <div className="py-2">
                  <CountUp
                    to={stats.totalContributions}
                    suffix="+"
                    className="font-display italic text-3xl md:text-4xl text-heading leading-none inline-block"
                  />
                </div>
              </div>
              <p className="font-ui text-xs text-body mt-1">Total GitHub contributions</p>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>

            {/* Current Streak */}
            <motion.div
              variants={scaleIn}
              className="bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-border/80 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-muted">
                  <span className="font-ui text-[10px] uppercase tracking-widest text-tagText">Active Run</span>
                  <Flame size={15} className="text-[#F59E0B]" />
                </div>
                <div className="py-2">
                  <CountUp
                    to={stats.currentStreak}
                    suffix=" days"
                    className="font-display italic text-3xl md:text-4xl text-heading leading-none inline-block"
                  />
                </div>
              </div>
              <p className="font-ui text-xs text-body mt-1">Current shipping streak</p>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F59E0B]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>

            {/* Longest Streak */}
            <motion.div
              variants={scaleIn}
              className="bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-border/80 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-muted">
                  <span className="font-ui text-[10px] uppercase tracking-widest text-tagText">Peak Cadence</span>
                  <Sparkles size={15} className="text-[#A855F7]" />
                </div>
                <div className="py-2">
                  <CountUp
                    to={stats.longestStreak}
                    suffix=" days"
                    className="font-display italic text-3xl md:text-4xl text-heading leading-none inline-block"
                  />
                </div>
              </div>
              <p className="font-ui text-xs text-body mt-1">Longest unbroken streak</p>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#A855F7]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>

            {/* Active Days / Cadence */}
            <motion.div
              variants={scaleIn}
              className="bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-border/80 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-muted">
                  <span className="font-ui text-[10px] uppercase tracking-widest text-tagText">Consistency</span>
                  <Activity size={15} className="text-[#10B981]" />
                </div>
                <div className="py-2">
                  <CountUp
                    to={stats.activeRate}
                    suffix="%"
                    className="font-display italic text-3xl md:text-4xl text-heading leading-none inline-block"
                  />
                </div>
              </div>
              <p className="font-ui text-xs text-body mt-1">{stats.activeDays} active commit days</p>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#10B981]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          </motion.div>

          {/* ── Interactive 365-Day Heatmap Card ── */}
          <motion.div
            variants={scaleIn}
            className="bg-surface border border-border rounded-2xl p-6 md:p-8 flex flex-col gap-6 relative"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-bg border border-border flex items-center justify-center text-cyan">
                  <Code2 size={16} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-heading text-sm md:text-base">
                    52-Week Contribution Matrix
                  </h3>
                  <p className="font-ui text-xs text-muted">
                    Rolling 365-day commit velocity for @HardikBhaskar2010 · Public & Private
                  </p>
                </div>
              </div>

              {/* Heatmap Legend */}
              <div className="flex items-center gap-2 font-ui text-[11px] text-muted self-end sm:self-auto">
                <span>Less</span>
                <div className="flex gap-1 items-center">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#141418] border border-[#24242c]" />
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#00E5FF]/25 border border-[#00E5FF]/40" />
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#00E5FF]/50 border border-[#00E5FF]/60" />
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#00E5FF]/80 border border-[#00E5FF]/90" />
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#00E5FF] border border-[#00E5FF]" />
                </div>
                <span>More</span>
              </div>
            </div>

            {/* Heatmap Grid centered inside card with horizontal scroll on mobile */}
            <div
              ref={containerRef}
              className="relative overflow-x-auto pb-4 pt-10 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent flex justify-center"
              style={{ minHeight: 180 }}
            >
              <div className="w-fit mx-auto min-w-[760px] flex flex-col gap-2">
                {/* Month Labels Row */}
                <div className="w-full text-[11px] font-mono text-muted relative h-4 select-none">
                  {monthLabels.map((m, idx) => (
                    <span
                      key={`${m.label}-${idx}`}
                      className="absolute"
                      style={{ left: `${m.weekIndex * 14 + 32}px` }}
                    >
                      {m.label}
                    </span>
                  ))}
                </div>

                {/* Grid container with weekday labels */}
                <div className="flex gap-2 items-start">
                  {/* Weekday indicators (Mon, Wed, Fri) */}
                  <div className="w-6 flex flex-col gap-[3px] text-[10px] font-mono text-muted/70 pt-[2px] pr-1 select-none flex-shrink-0">
                    <span className="h-[12px] leading-[12px]" />
                    <span className="h-[12px] leading-[12px]">Mon</span>
                    <span className="h-[12px] leading-[12px]" />
                    <span className="h-[12px] leading-[12px]">Wed</span>
                    <span className="h-[12px] leading-[12px]" />
                    <span className="h-[12px] leading-[12px]">Fri</span>
                    <span className="h-[12px] leading-[12px]" />
                  </div>

                  {/* Columns (Weeks) */}
                  <div className="flex gap-[3px]">
                    {weeks.map((week, weekIdx) => (
                      <div key={weekIdx} className="flex flex-col gap-[3px]">
                        {week.map((day, dayIdx) => {
                          if (!day) {
                            return (
                              <div
                                key={dayIdx}
                                className="w-[11px] h-[11px] rounded-[2px] bg-transparent pointer-events-none"
                              />
                            );
                          }

                          return (
                            <button
                              key={day.date}
                              type="button"
                              aria-label={`${day.count} contributions on ${day.date}`}
                              onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const parentRect = containerRef.current?.getBoundingClientRect() || {
                                  left: 0,
                                  top: 0,
                                };
                                const relY = rect.top - parentRect.top;
                                const showBelow = relY < 50;
                                setActiveTooltip({
                                  date: day.date,
                                  count: day.count,
                                  x: rect.left - parentRect.left + rect.width / 2,
                                  y: showBelow ? rect.bottom - parentRect.top + 10 : relY - 10,
                                  showBelow,
                                });
                              }}
                              onMouseLeave={() => setActiveTooltip(null)}
                              className={`w-[11px] h-[11px] rounded-[2px] border transition-all duration-150 cursor-pointer ${getLevelClasses(
                                day.level
                              )}`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive Tooltip */}
              <AnimatePresence>
                {activeTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: activeTooltip.showBelow ? -4 : 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: activeTooltip.showBelow ? -4 : 4, scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                    style={{
                      left: activeTooltip.x,
                      top: activeTooltip.y,
                      transform: activeTooltip.showBelow
                        ? 'translate(-50%, 0%)'
                        : 'translate(-50%, -100%)',
                    }}
                    className="absolute pointer-events-none z-50 px-3.5 py-2 rounded-xl bg-[#0c0c10]/95 border border-cyan/60 shadow-[0_8px_30px_rgba(0,0,0,0.85)] backdrop-blur-xl flex flex-col items-center gap-1 whitespace-nowrap min-w-max"
                  >
                    <p className="font-ui font-semibold text-xs text-heading whitespace-nowrap leading-none flex items-center gap-1.5">
                      <span className="text-cyan font-mono font-bold text-sm">{activeTooltip.count}</span>
                      <span>{activeTooltip.count === 1 ? 'contribution' : 'contributions'}</span>
                    </p>
                    <p className="font-mono text-[10px] text-muted whitespace-nowrap leading-none">
                      {new Date(activeTooltip.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Two-Column Bottom Hub: Live Events & Luna Stats ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (7 cols): Live Commit & Event Stream */}
            <motion.div
              variants={scaleIn}
              className="lg:col-span-7 bg-surface border border-border rounded-2xl p-6 md:p-8 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-bg border border-border flex items-center justify-center text-[#A855F7]">
                    <GitCommit size={16} />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-heading text-sm md:text-base">
                      Recent Activity Stream
                    </h3>
                    <p className="font-ui text-xs text-muted">
                      Aggregated repository activity & commit stream
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted bg-tag px-2.5 py-1 rounded-full border border-border">
                    PUBLIC & PRIVATE
                  </span>
                  <span className="font-mono text-[10px] text-cyan/80 bg-cyan/10 border border-cyan/20 px-2.5 py-1 rounded-full">
                    LIVE FEED
                  </span>
                </div>
              </div>

              {/* Event List: One Line per Repository showing total commits */}
              <div className="flex flex-col divide-y divide-border/40">
                {events.slice(0, 4).map((ev) => (
                  <div
                    key={ev.repoName}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col gap-2 group"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0 flex-wrap sm:flex-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan flex-shrink-0" />
                        <a
                          href={ev.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-heading font-semibold text-sm text-heading hover:text-cyan transition-colors"
                        >
                          {ev.shortName}
                        </a>
                        <span className="font-mono text-xs text-cyan font-medium bg-cyan/10 border border-cyan/30 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                          {ev.commitCount} {ev.commitCount === 1 ? 'commit' : 'commits'}
                        </span>
                        {ev.refName && (
                          <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-muted bg-tag px-2 py-0.5 rounded border border-border flex-shrink-0">
                            <GitBranch size={10} />
                            {ev.refName}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs text-muted flex-shrink-0">
                        {ev.relativeTime}
                      </span>
                    </div>

                    <p className="font-ui text-xs text-body pl-4 border-l border-border/80 line-clamp-2 leading-relaxed">
                      Latest: {ev.message}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-border/50">
                <a
                  href="https://github.com/HardikBhaskar2010?tab=repositories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-ui text-xs text-cyan hover:text-white transition-colors group"
                >
                  Explore all repositories & commits
                  <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </motion.div>

            {/* Right Column (5 cols): Luna GitHub Readme Stats Integration */}
            <motion.div
              variants={scaleIn}
              className="lg:col-span-5 flex flex-col gap-6"
            >
              {/* GitHub Stats Card from custom service */}
              <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4 group">
                <div className="flex items-center justify-between">
                  <h3 className="font-ui text-[10px] uppercase tracking-widest text-tagText flex items-center gap-1.5 font-semibold">
                    <Layers size={12} className="text-cyan" />
                    Verified GitHub Metrics
                  </h3>
                  <a
                    href="https://github-readme-stats-luna.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] text-muted hover:text-cyan transition-colors"
                  >
                    luna.vercel.app
                  </a>
                </div>

                {/* Embedded Themed SVG Stats Card with Zero-CLS Container */}
                <div className="w-full rounded-xl overflow-hidden bg-[#0a0a0c] border border-border/60 flex items-center justify-center p-2 min-h-[195px] aspect-[467/195]">
                  {!statsImgError ? (
                    <img
                      src="https://github-readme-stats-luna.vercel.app/api?username=HardikBhaskar2010&show_icons=true&include_all_commits=true&count_private=true&bg_color=0a0a0c&text_color=8A8A93&title_color=00E5FF&icon_color=00E5FF&border_color=262626&border_radius=14"
                      alt="Hardik Bhaskar GitHub commit statistics, streaks, and PR metrics"
                      width={467}
                      height={195}
                      loading="lazy"
                      decoding="async"
                      onError={() => setStatsImgError(true)}
                      className="w-full h-auto object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col justify-center items-center p-4 text-center gap-2">
                      <span className="font-mono text-cyan text-sm font-bold">1,867+ VERIFIED COMMITS</span>
                      <span className="font-ui text-xs text-muted">A+ Architecture Velocity · 100% Repository Delivery</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Most Used Languages Card with Zero-CLS Container */}
              <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4">
                <h3 className="font-ui text-[10px] uppercase tracking-widest text-tagText flex items-center gap-1.5 font-semibold">
                  <Code2 size={12} className="text-[#A855F7]" />
                  Core Language Distribution
                </h3>

                <div className="w-full rounded-xl overflow-hidden bg-[#0a0a0c] border border-border/60 flex items-center justify-center p-2 min-h-[140px] aspect-[300/140]">
                  {!langsImgError ? (
                    <img
                      src="https://github-readme-stats-luna.vercel.app/api/top-langs/?username=HardikBhaskar2010&layout=compact&bg_color=0a0a0c&text_color=8A8A93&title_color=00E5FF&border_color=262626&border_radius=14"
                      alt="Hardik Bhaskar primary programming languages distribution"
                      width={300}
                      height={140}
                      loading="lazy"
                      decoding="async"
                      onError={() => setLangsImgError(true)}
                      className="w-full h-auto object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-wrap justify-center items-center gap-3 p-3">
                      <span className="font-mono text-xs text-heading px-2.5 py-1 rounded bg-[#141418] border border-border">Rust</span>
                      <span className="font-mono text-xs text-heading px-2.5 py-1 rounded bg-[#141418] border border-border">TypeScript</span>
                      <span className="font-mono text-xs text-heading px-2.5 py-1 rounded bg-[#141418] border border-border">C / C++</span>
                      <span className="font-mono text-xs text-heading px-2.5 py-1 rounded bg-[#141418] border border-border">Python</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
