import { useMemo } from "react";
import { usePlayer } from "../hooks/usePlayer";
import PlaybackBar from "./PlaybackBar";
import MetricsStrip from "./MetricsStrip";

export default function DPView({ result, constraints }) {
  const { trace, grid } = result;
  const player = usePlayer(trace.length - 1, { initialSpeed: 1.4 });
  const { index } = player;

  const layer = trace[index];
  const prevLayer = index > 0 ? trace[index - 1] : null;
  const maxVal = result.joy || 1;

  const cellW = Math.min(15, Math.floor(440 / (grid.M + 1)));
  const cellH = Math.min(9, Math.floor(360 / (grid.T + 1)));

  const changedMask = useMemo(() => {
    if (!prevLayer) return null;
    const mask = [];
    for (let t = 0; t <= grid.T; t++) {
      const row = [];
      for (let m = 0; m <= grid.M; m++) row.push(layer.grid[t][m] !== prevLayer.grid[t][m]);
      mask.push(row);
    }
    return mask;
  }, [layer, prevLayer, grid.T, grid.M]);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-5">
      <div>
        <p className="text-ink-dim text-sm mb-3 max-w-2xl">
          The table fills once per activity. Each cell <span className="font-mono text-violet">dp[time][money]</span> holds the best joy
          achievable with that much budget left. Most cells stay identical between layers &mdash; that's a{" "}
          <span className="text-cyan">reused subproblem</span>. A cell only changes when this activity genuinely improves it.
        </p>
        <PlaybackBar player={player} length={trace.length - 1} accent="violet" />

        <div className="mt-3 border border-line rounded-lg bg-panel2 p-4 flex flex-col items-center">
          <div className="text-[11px] font-mono text-ink-dim mb-2 self-start">
            {layer.item ? (
              <>
                layer {index} / {grid && trace.length - 1} &middot; considering <span className="text-violet">{layer.item.icon} {layer.item.name}</span>
                {changedMask && (
                  <span className="text-ink-faint">
                    {" "}
                    &middot; {layer.changedCount.toLocaleString()} cells updated / {(grid.T + 1) * (grid.M + 1)} total
                  </span>
                )}
              </>
            ) : (
              <>layer 0 &middot; baseline (no activities considered yet)</>
            )}
          </div>
          <svg width={(grid.M + 1) * cellW + 40} height={(grid.T + 1) * cellH + 20}>
            <g transform="translate(36,4)">
              {layer.grid.map((row, t) =>
                row.map((v, m) => {
                  const intensity = 0.06 + 0.88 * (v / maxVal);
                  const isChanged = changedMask && changedMask[t][m];
                  return (
                    <rect
                      key={`${t}-${m}`}
                      x={m * cellW}
                      y={t * cellH}
                      width={cellW - 1}
                      height={cellH - 1}
                      fill={`rgba(155,140,255,${v === 0 ? 0.05 : intensity})`}
                      stroke={isChanged ? "#6FE7DD" : "none"}
                      strokeWidth={isChanged ? 1 : 0}
                    />
                  );
                })
              )}
              {/* corner marker: full-budget cell = current optimal value */}
              <rect
                x={grid.M * cellW}
                y={grid.T * cellH}
                width={cellW - 1}
                height={cellH - 1}
                fill="none"
                stroke="#F2A65A"
                strokeWidth={1.5}
              />
            </g>
          </svg>
          <div className="flex justify-between w-full mt-1 text-[9px] font-mono text-ink-faint px-9">
            <span>$0</span>
            <span>money &rarr; ${constraints.money}</span>
          </div>
        </div>

        <div className="mt-2 text-[11px] font-mono text-ink-faint">
          grid discretized to {grid.tstep}-minute &times; ${grid.mstep} cells, sliced at full energy budget ({constraints.energy}u) &mdash;{" "}
          <span className="text-amber">amber outline</span> marks the full-budget cell, i.e. today's answer.
        </div>
      </div>

      <div className="space-y-4">
        <div className="border border-line rounded-lg bg-panel p-4">
          <div className="font-mono text-[11px] uppercase tracking-wider text-ink-dim mb-2">table corner value</div>
          <div className="flex items-end justify-between">
            <span className="text-xs text-ink-dim font-mono">dp[t][{index}][T][M]</span>
            <span className="font-display text-2xl text-violet">{layer.grid[grid.T][grid.M]}</span>
          </div>
          <p className="text-[11px] text-ink-faint mt-2 leading-snug">
            This cell is the answer to: "with every item up to #{index} considered, and the full time+money budget available, what's the
            best joy achievable?" It only ever grows or holds steady as more items are considered.
          </p>
        </div>
        <MetricsStrip result={result} accent="violet" />
      </div>
    </div>
  );
}
