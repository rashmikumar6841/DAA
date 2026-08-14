import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CaseHeader from "./components/CaseHeader";
import Stepper from "./components/Stepper";
import Intro from "./components/Intro";
import BuildStage from "./components/BuildStage";
import AlgorithmLab from "./components/AlgorithmLab";
import CompareStage from "./components/CompareStage";
import { ACTIVITIES, defaultConstraints } from "./data/activities";
import { solveDay, evaluateUserDay } from "./algorithms/engine";

export default function App() {
  const [stage, setStage] = useState("intro"); // intro | build | lab | compare
  const [constraints, setConstraints] = useState(defaultConstraints());
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [lockedIds, setLockedIds] = useState(null);
  const [whatIfBanner, setWhatIfBanner] = useState(false);

  const solved = useMemo(() => solveDay(ACTIVITIES, constraints), [constraints]);
  const userDay = useMemo(() => {
    const ids = lockedIds || selectedIds;
    return evaluateUserDay(ACTIVITIES.filter((a) => ids.has(a.id)), constraints);
  }, [lockedIds, selectedIds, constraints]);

  const unlocked = ["build"];
  if (lockedIds) unlocked.push("lab", "compare");

  function handleLockIn(chosen) {
    setLockedIds(new Set(chosen.map((a) => a.id)));
    setStage("lab");
  }

  function handleWhatIf(newConstraints) {
    setConstraints(newConstraints);
    setWhatIfBanner(true);
    setStage("lab");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-void">
      <CaseHeader stage={stage.toUpperCase()} />
      {stage !== "intro" && (
        <div className="border-b border-line bg-void/60">
          <div className="max-w-[1400px] mx-auto px-5 py-2.5">
            <Stepper current={stage} onJump={setStage} unlocked={unlocked} />
          </div>
        </div>
      )}

      {whatIfBanner && stage === "lab" && (
        <div className="bg-amber/10 border-b border-amber/30 text-amber text-xs font-mono px-5 py-2 flex items-center justify-between">
          <span>WHAT-IF: constraints changed &mdash; all four algorithms just recomputed against the new budget.</span>
          <button onClick={() => setWhatIfBanner(false)} className="text-amber/70 hover:text-amber focus-ring">
            dismiss
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={stage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          {stage === "intro" && <Intro onStart={() => setStage("build")} />}
          {stage === "build" && (
            <BuildStage
              constraints={constraints}
              setConstraints={setConstraints}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              onLockIn={handleLockIn}
            />
          )}
          {stage === "lab" && lockedIds && <AlgorithmLab solved={solved} constraints={constraints} onContinue={() => setStage("compare")} />}
          {stage === "compare" && lockedIds && (
            <CompareStage userDay={userDay} solved={solved} constraints={constraints} onWhatIf={handleWhatIf} />
          )}
        </motion.div>
      </AnimatePresence>

      <footer className="max-w-[1400px] mx-auto px-5 py-8 text-center text-[11px] font-mono text-ink-faint">
        DAY//0 &mdash; every result on this page is computed live in your browser. no server, no backend, deterministic inputs.
      </footer>
    </div>
  );
}
