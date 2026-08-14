function Stat({ label, value, accent }) {
  return (
    <div className="flex-1 min-w-[100px] border border-line rounded-md bg-panel2 px-3 py-2">
      <div className="text-[10px] font-mono uppercase tracking-wide text-ink-faint">{label}</div>
      <div className={`font-display text-lg mono-tab ${accent ? `text-${accent}` : "text-ink"}`}>{value}</div>
    </div>
  );
}

export default function MetricsStrip({ result, accent }) {
  const { metrics, complexity, joy, isOptimal, gap } = result;
  return (
    <div className="flex flex-wrap gap-2">
      <Stat label="joy score" value={joy} accent={accent} />
      <Stat label="nodes / states" value={metrics.nodesExplored.toLocaleString()} />
      <Stat label="wall clock" value={`${metrics.ms.toFixed(2)}ms`} />
      <Stat label="complexity" value={complexity} />
      <Stat label="vs. optimal" value={isOptimal ? "optimal" : `-${gap}%`} accent={isOptimal ? "cyan" : "rose"} />
    </div>
  );
}
