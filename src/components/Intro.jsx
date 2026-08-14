import { motion } from "framer-motion";

export default function Intro({ onStart }) {
  return (
    <div className="relative min-h-[calc(100vh-53px)] flex items-center justify-center overflow-hidden bg-lab">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-scan opacity-30" />
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent"
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 text-[11px] font-mono text-cyan border border-cyan/30 rounded-full px-3 py-1 mb-7"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse2" /> case file 0001 &middot; open
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl sm:text-7xl font-semibold tracking-tight text-glow"
        >
          Can an algorithm
          <br />
          design a day
          <br />
          you won&rsquo;t <span className="text-cyan">regret</span>?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-7 text-ink-dim text-base sm:text-lg max-w-xl mx-auto font-body"
        >
          You have a fixed amount of time, money and energy — and sixteen ways to spend them.
          Build your day by hand. Then watch four algorithms solve the exact same problem, live:
          every branch, every prune, every reused subproblem.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex items-center justify-center gap-3"
        >
          <button
            onClick={onStart}
            className="group relative font-mono text-sm px-6 py-3 rounded-md bg-cyan text-void font-medium overflow-hidden focus-ring"
          >
            <span className="relative z-10">begin the experiment &rarr;</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left"
        >
          {[
            ["16", "candidate activities"],
            ["3", "constraints: time, money, energy"],
            ["4", "algorithms, one instance"],
            ["1", "optimal answer"],
          ].map(([n, l]) => (
            <div key={l} className="border border-line rounded-md px-3 py-2.5 bg-panel/60">
              <div className="font-display text-xl text-cyan">{n}</div>
              <div className="text-[10.5px] font-mono text-ink-faint uppercase tracking-wide leading-tight mt-0.5">{l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
