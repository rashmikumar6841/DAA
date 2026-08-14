import { useMemo, useRef, useEffect } from "react";
import { usePlayer } from "../hooks/usePlayer";
import { buildTree } from "../algorithms/treeLayout";
import PlaybackBar from "./PlaybackBar";
import MetricsStrip from "./MetricsStrip";

const TYPE_COLOR = {
  include: "#6FE7DD",
  exclude: "#525860",
  prune: "#F2A65A",
  "bound-prune": "#F27A7A",
  leaf: "#9B8CFF",
};

export default function TreeView({ result, items, accent = "cyan" }) {
  const { trace } = result;
  const layout = useMemo(() => buildTree(trace), [trace]);
  const player = usePlayer(trace.length, { initialSpeed: 24 });
  const { index } = player;
  const scrollRef = useRef(null);

  const spacingX = 11;
  const spacingY = 32;
  const width = Math.max(600, layout.leafCount * spacingX + 60);
  const height = (layout.maxDepth + 2) * spacingY + 20;

  const bestSoFar = useMemo(() => {
    let best = 0;
    const arr = [];
    trace.forEach((n) => {
      if (n.type === "leaf" && n.value > best) best = n.value;
      arr.push(best);
    });
    return arr;
  }, [trace]);

  const currentEvt = trace[Math.max(0, index - 1)];
  const currentBest = bestSoFar[Math.max(0, index - 1)] ?? 0;

  useEffect(() => {
    if (!scrollRef.current || !currentEvt) return;
    const node = layout.nodes.find((n) => n.id === currentEvt.id);
    if (!node) return;
    const targetX = node.x * spacingX;
    const el = scrollRef.current;
    const cw = el.clientWidth;
    el.scrollTo({ left: Math.max(0, targetX - cw / 2), behavior: "auto" });
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-5">
      <div>
        <p className="text-ink-dim text-sm mb-3 max-w-2xl">
          Each node is a decision: <span className="text-cyan">include</span> or <span className="text-ink-dim">exclude</span> the next
          activity. {result.algorithm === "bnb" ? (
            <>A branch is cut with a <span className="text-rose">bound-prune</span> the instant its optimistic ceiling can no longer beat the current best.</>
          ) : (
            <>A branch is cut with a <span className="text-amber">prune</span> only when it becomes physically infeasible.</>
          )}
        </p>
        <PlaybackBar player={player} length={trace.length} accent={accent} />

        {result.traceTruncated && (
          <div className="mt-2 text-[11px] font-mono text-ink-faint border border-line rounded px-2 py-1.5">
            showing the first {trace.length.toLocaleString()} recorded node-events for smooth playback &mdash; the search itself explored{" "}
            <span className="text-ink-dim">{result.metrics.nodesExplored.toLocaleString()}</span> nodes total to find the true optimum
            (metrics panel reflects the full run).
          </div>
        )}

        <div ref={scrollRef} className="mt-3 border border-line rounded-lg bg-panel2 overflow-x-auto overflow-y-hidden">
          <svg width={width} height={height} className="block">
            <g transform="translate(30,10)">
              {layout.edges.map((e) => {
                const visible = e.order < index;
                return (
                  <line
                    key={`${e.from.id}-${e.to.id}`}
                    x1={e.from.x * spacingX}
                    y1={e.from.depth < 0 ? 0 : (e.from.depth + 1) * spacingY}
                    x2={e.to.x * spacingX}
                    y2={(e.to.depth + 1) * spacingY}
                    stroke={visible ? TYPE_COLOR[e.to.type] || "#242A33" : "#1A1F26"}
                    strokeWidth={visible ? 1 : 0.6}
                    opacity={visible ? 0.55 : 0.25}
                  />
                );
              })}
              {layout.nodes.map((n) => {
                const visible = n.order < index;
                const isCurrent = n.order === index - 1;
                const color = TYPE_COLOR[n.type] || "#525860";
                const r = n.type === "leaf" ? (n.isNewBest ? 4.2 : 2.6) : isCurrent ? 4 : 3;
                return (
                  <circle
                    key={n.id}
                    cx={n.x * spacingX}
                    cy={(n.depth + 1) * spacingY}
                    r={r}
                    fill={visible ? color : "#171B21"}
                    stroke={isCurrent ? "#fff" : "none"}
                    strokeWidth={isCurrent ? 1 : 0}
                    opacity={visible ? (n.type === "exclude" ? 0.55 : 0.95) : 0.4}
                    style={{ transition: "opacity 120ms linear" }}
                  />
                );
              })}
            </g>
          </svg>
        </div>

        <div className="mt-3 flex flex-wrap gap-3 text-[10px] font-mono text-ink-faint">
          {Object.entries(TYPE_COLOR).map(([k, c]) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: c }} /> {k}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="border border-line rounded-lg bg-panel p-4">
          <div className="font-mono text-[11px] uppercase tracking-wider text-ink-dim mb-2">case note</div>
          {currentEvt ? (
            <div className="text-sm space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">{currentEvt.item?.icon ?? "\u2022"}</span>
                <span className="font-medium">{currentEvt.item?.name ?? "root"}</span>
              </div>
              <div className="font-mono text-[11px] text-ink-dim">
                depth {currentEvt.depth} &middot; type <span style={{ color: TYPE_COLOR[currentEvt.type] }}>{currentEvt.type}</span>
              </div>
              {"bound" in currentEvt && currentEvt.bound !== undefined && (
                <div className="font-mono text-[11px] text-ink-dim">
                  bound &le; <span className="text-rose">{currentEvt.bound.toFixed(1)}</span>
                </div>
              )}
              {currentEvt.type === "prune" && <div className="font-mono text-[11px] text-amber">infeasible: not enough {currentEvt.reason}</div>}
              {currentEvt.value !== undefined && (
                <div className="font-mono text-[11px] text-ink-dim">
                  path value <span className="text-ink">{currentEvt.value}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-ink-faint text-xs font-mono">press play to begin the search</div>
          )}
          <div className="flex items-end justify-between border-t border-line mt-3 pt-3">
            <span className="text-xs text-ink-dim font-mono">best found so far</span>
            <span className={`font-display text-2xl text-${accent}`}>{currentBest}</span>
          </div>
        </div>
        <MetricsStrip result={result} accent={accent} />
      </div>
    </div>
  );
}
