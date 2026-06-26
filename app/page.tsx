"use client"
import React, { useEffect, useState } from "react";
import { ChevronLeft, AlertTriangle } from "lucide-react";

/* ---------------------------------------------------------
   Fonts + tokens
--------------------------------------------------------- */
function Tokens() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
      .elyte-root {
        --ink: #10202E;
        --muted: #5C7080;
        --bg: #F6F7F9;
        --surface: #FFFFFF;
        --border: #E3E7EA;
        --teal: #0E7C7B;
        --teal-soft: #E6F2F1;
        --blue: #2E6F95;
        --blue-soft: #E9F1F6;
        --green: #2F9E68;
        --green-soft: #EAF7F0;
        --red: #C0392B;
        --red-soft: #FBEAE8;
        font-family: 'IBM Plex Sans', sans-serif;
        color: var(--ink);
        background: var(--bg);
      }
      .mono { font-family: 'IBM Plex Mono', monospace; font-weight: 600; }
      .elyte-root input[type="number"] {
        font-family: 'IBM Plex Mono', monospace;
      }
      .elyte-root input[type="number"]::-webkit-outer-spin-button,
      .elyte-root input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none; margin: 0;
      }
      .focus-ring:focus { outline: none; box-shadow: 0 0 0 3px var(--teal-soft); border-color: var(--teal); }
      .tile { transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease; }
      .tile:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(16,32,46,0.08); border-color: var(--teal); }
      .chip-input { transition: background .12s ease; }
      .chip-input:hover { background: var(--teal-soft); }
    `}</style>
  );
}

/* ---------------------------------------------------------
   Primitive components
--------------------------------------------------------- */

interface NumberInputProps {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  unit?: string;
}

function NumberInput({ label, value, onChange, placeholder, unit }: NumberInputProps) {
  return (
    <div className="flex items-center gap-4">
      <label className="w-44 text-sm font-medium" style={{ color: "var(--muted)" }}>{label}</label>
      <div className="flex-1 flex items-center">
        <input
          type="number"
          value={value ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? undefined : Number(v));
          }}
          onKeyDown={(e) => { if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault(); }}
          placeholder={placeholder}
          className="focus-ring flex-1 rounded-lg px-3 py-2 text-sm bg-white"
          style={{ border: "1px solid var(--border)" }}
        />
        {unit && <span className="ml-2 text-xs" style={{ color: "var(--muted)" }}>{unit}</span>}
      </div>
    </div>
  );
}

interface InlineNumberInpuptProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
}

function InlineNumberInpupt({ value, onChange, placeholder }: InlineNumberInpuptProps) {
  const width = Math.max(2, String(value ?? placeholder ?? "").length) + 1.5;
  return (
    <input
      type="number"
      value={value ?? ""}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === "" ? undefined : Number(v));
      }}
      onKeyDown={(e) => { if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault(); }}
      placeholder={placeholder}
      className="chip-input focus-ring mono inline-block text-center rounded px-1 mx-1"
      style={{
        width: `${width}ch`,
        border: "none",
        borderBottom: "1.5px dashed var(--teal)",
        background: "transparent",
        color: "var(--teal)",
      }}
    />
  );
}

function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-lg"
      style={{ background: "var(--red-soft)", borderLeft: "3px solid var(--red)" }}
    >
      <AlertTriangle size={18} style={{ color: "var(--red)", flexShrink: 0, marginTop: 2 }} />
      <p className="text-sm font-medium" style={{ color: "var(--red)" }}>{children}</p>
    </div>
  );
}

function Eyebrow({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "teal" }) {
  const colors: Record<"muted" | "teal", string> = {
    muted: "var(--muted)",
    teal: "var(--teal)",
  };
  return (
    <p
      className="text-xs font-semibold tracking-wide uppercase mb-1"
      style={{ color: colors[tone], letterSpacing: "0.06em" }}
    >
      {children}
    </p>
  );
}

function SectionCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl p-4 bg-white" style={{ border: "1px solid var(--border)" }}>
      {eyebrow && <Eyebrow tone="teal">{eyebrow}</Eyebrow>}
      {title && <h3 className="text-base font-semibold mb-2">{title}</h3>}
      <div className="space-y-2 text-sm leading-relaxed" style={{ color: "var(--ink)" }}>
        {children}
      </div>
    </div>
  );
}

interface StatusPillProps {
  status: { kind: "hypo" | "hyper" | "normal"; label: string };
}

function StatusPill({ status }: StatusPillProps) {
  const map: Record<"hypo" | "hyper" | "normal", { bg: string; fg: string }> = {
    hypo: { bg: "var(--blue-soft)", fg: "var(--blue)" },
    hyper: { bg: "var(--red-soft)", fg: "var(--red)" },
    normal: { bg: "var(--green-soft)", fg: "var(--green)" },
  };
  const s = map[status.kind];
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-semibold mono"
      style={{ background: s.bg, color: s.fg }}
    >
      {status.label}
    </span>
  );
}

/* Reference-range bar, like a lab report */
function RangeBar({
  value,
  lnl,
  unl,
  unitLabel,
}: {
  value: number | undefined;
  lnl: number;
  unl: number;
  unitLabel: string;
}) {
  const range = unl - lnl;
  const domainMin = Math.max(0, lnl - range * 1.4);
  const domainMax = unl + range * 1.4;
  const pct = (x: number) => Math.min(100, Math.max(0, ((x - domainMin) / (domainMax - domainMin)) * 100));
  const hasValue = value !== undefined && !Number.isNaN(value) && value > 0;
  const kind: "hypo" | "hyper" | "normal" = !hasValue ? "normal" : value! < lnl ? "hypo" : value! > unl ? "hyper" : "normal";
  const markerColor = { hypo: "var(--blue)", hyper: "var(--red)", normal: "var(--green)" }[kind];

  return (
    <div>
      <div className="relative h-2.5 rounded-full" style={{ background: "var(--border)" }}>
        <div
          className="absolute top-0 h-2.5 rounded-full"
          style={{
            left: `${pct(lnl)}%`,
            width: `${pct(unl) - pct(lnl)}%`,
            background: "var(--green-soft)",
            border: "1px solid var(--green)",
          }}
        />
        {hasValue && (
          <div
            className="absolute -top-1.5 w-1 h-5 rounded-full"
            style={{ left: `calc(${pct(value)}% - 2px)`, background: markerColor }}
            title={`${value}`}
          />
        )}
      </div>
      <div className="flex justify-between mt-1 text-[11px] mono" style={{ color: "var(--muted)" }}>
        <span>{domainMin.toFixed(1)}</span>
        <span style={{ color: "var(--green)" }}>{lnl}–{unl} {unitLabel}</span>
        <span>{domainMax.toFixed(1)}</span>
      </div>
    </div>
  );
}

/* Periodic-table style selector tile */
interface ElementTileProps {
  symbol: string;
  name: string;
  range: string;
  unitLabel: string;
  color: string;
  disabled?: boolean;
  onClick: () => void;
}

function ElementTile({ symbol, name, range, unitLabel, color, disabled, onClick }: ElementTileProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="tile rounded-xl p-4 flex flex-col items-start text-left bg-white disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ border: `1px solid var(--border)`, borderTop: `3px solid ${color}` }}
    >
      <span className="mono text-2xl font-semibold" style={{ color }}>{symbol}</span>
      <span className="text-sm font-medium mt-1">{name}</span>
      <span className="text-[11px] mono mt-1" style={{ color: "var(--muted)" }}>
        {disabled ? "coming soon" : `${range} ${unitLabel}`}
      </span>
    </button>
  );
}

/* ---------------------------------------------------------
   Potassium
--------------------------------------------------------- */
function Potassium({ value }: { value: number }) {
  const [oralDrugMeq, setoralDrugMeq] = useState<number | undefined>(8);
  const [solDrugMeq, setSolDrugMeq] = useState<number | undefined>(20);
  const [solDrugMl, setSolDrugMl] = useState<number | undefined>(15);
  const [IVKConc, setIVKConc] = useState<number | undefined>(60);
  const [centralIVKConc, setCentralIVKConc] = useState<number | undefined>(20);
  const [KRate, setKRate] = useState<number | undefined>(10);
  const [centralKRate, setCentralKRate] = useState<number | undefined>(20);
  const [isSevere, setIsSevere] = useState(false);

  useEffect(() => {
    if (value > 3 && value < 3.5) setKRate(4);
    else if (value > 2.5 && value <= 3) setKRate(10);
  }, [value]);

  return (
    <div className="space-y-3">
      {value > 5 && value < 8 && (
        <>
          <WarningBox>Consider a 12-lead EKG, especially when K is above 6.</WarningBox>
          <SectionCard>
            <p className="font-medium">Is there an EKG change, or is the patient symptomatic?</p>
            <div className="inline-flex rounded-lg overflow-hidden mt-1" style={{ border: "1px solid var(--border)" }}>
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  onClick={() => setIsSevere(v)}
                  className="px-4 py-1.5 text-sm font-medium"
                  style={isSevere === v
                    ? { background: "var(--teal)", color: "#fff" }
                    : { background: "#fff", color: "var(--ink)" }}
                >
                  {v ? "Yes" : "No"}
                </button>
              ))}
            </div>
            {(isSevere == true || value >= 6.5) &&
              <>
                <p className="font-bold">Hyperkalemic Emergency</p>
                <ul>
                  <li>→ <span className="mono">10% Calcium gluconate 10mL IV over 10 min</span></li>
                  <li>→ <span className="mono">Regular insulin 10u IV with 50% dextrose 50 mL</span></li>
                  <li>→ <span className="mono">Albuterol 20mg / 4mL in NSS NB in 10 min</span></li>
                  <li>
                    → <span className="mono">7.5% NaHCO3 100mL IV</span>
                    <span className="group relative inline-flex ml-1">
                      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-400 text-white text-[10px] cursor-help">
                        ?
                      </span>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white z-10">
                        Consider when metablic acidosis pH &lt; 7.2
                      </span>
                    </span>
                  </li>
                  <li>→ <span className="mono">Kalimate 30g PO</span></li>
                  <li>→ <span className="mono">Furosemide 40mg IV</span></li>
                </ul>
              </>
            }
            {(isSevere == false && value < 6.5) &&
              <>
                <p className="font-bold">Give K removal</p>
                <ul>
                  <li>→ <span className="mono">Kalimate 15g ผสมน้ำ 50m PO BID</span></li>
                </ul>
              </>
            }
          </SectionCard>
        </>
      )}

      {value < 3.5 && value > 3 && Number(oralDrugMeq) > 0 && (
        <SectionCard eyebrow="Mild hypokalemia" title="K 40–80 mEq/day">
          <p className="font-medium">Oral tablet</p>
          <p>
            Concentration
            <InlineNumberInpupt value={Number(oralDrugMeq)} onChange={setoralDrugMeq} placeholder="mEq" />
            mEq / tablet
          </p>
          <p>
            → <span className="mono">{Math.floor(40 / Number(oralDrugMeq))}–{Math.floor(80 / Number(oralDrugMeq))}</span> tablets per day
          </p>
          <div className="h-px my-2" style={{ background: "var(--border)" }} />
          <p className="font-medium">Oral solution</p>
          <p>
            KCl
            <InlineNumberInpupt value={solDrugMeq} onChange={setSolDrugMeq} placeholder="mEq" />
            mEq /
            <InlineNumberInpupt value={solDrugMl} onChange={setSolDrugMl} placeholder="mL" />
            mL
          </p>
          <p>
            → <span className="mono">{Math.floor(40 / Number(solDrugMeq))}–{Math.floor(80 / Number(solDrugMeq))}</span> doses of {solDrugMl} mL per day
          </p>
        </SectionCard>
      )}

      {value <= 3 && value >= 2.5 && Number(oralDrugMeq) > 0 && (
        <SectionCard eyebrow="Moderate hypokalemia" title="K 120 mEq/day">
          <p className="font-medium">Oral tablet</p>
          <p>
            Concentration
            <InlineNumberInpupt value={Number(oralDrugMeq)} onChange={setoralDrugMeq} placeholder="mEq" />
            mEq / tablet
          </p>
          <p>→ <span className="mono">{Math.floor(120 / Number(oralDrugMeq))}</span> tablets per day</p>
          <div className="h-px my-2" style={{ background: "var(--border)" }} />
          <p className="font-medium">Oral solution</p>
          <p>
            KCl
            <InlineNumberInpupt value={solDrugMeq} onChange={setSolDrugMeq} placeholder="mEq" />
            mEq /
            <InlineNumberInpupt value={solDrugMl} onChange={setSolDrugMl} placeholder="mL" />
            mL
          </p>
          <p>→ <span className="mono">{Math.floor(120 / Number(solDrugMeq))}</span> doses of {Number(solDrugMl)} mL per day</p>
          <div className="h-px my-2" style={{ background: "var(--border)" }} />
          <p className="font-medium">IV</p>
          <p>
            5%DN/2 1000 mL + KCl
            <InlineNumberInpupt value={IVKConc} onChange={setIVKConc} placeholder="mEq" />
            mEq → rate <span className="mono">{Math.floor((Number(KRate) * 1000) / Number(IVKConc))}</span> mL/h
          </p>
          <p>
            K infusion rate =
            <InlineNumberInpupt value={KRate} onChange={setKRate} placeholder="" />
            mEq/h
          </p>
        </SectionCard>
      )}
      {value < 2.5 &&
        <SectionCard eyebrow="Severe hypokalemia">
          <div className="h-px my-2" style={{ background: "var(--border)" }} />
          <p className="font-medium">Peripheral IV (max rate 10 mEq/hr)</p>
          <p>
            5%DN/2 1000 mL + KCl
            <InlineNumberInpupt value={IVKConc} onChange={setIVKConc} placeholder="mEq" />
            mEq → rate <span className="mono">{Math.floor((Number(KRate) * 1000) / Number(IVKConc))}</span> mL/h
          </p>
          <p>
            K infusion rate =
            <InlineNumberInpupt value={KRate} onChange={setKRate} placeholder="" />
            mEq/h
          </p>
          <div className="h-px my-2" style={{ background: "var(--border)" }} />
          <p className="font-medium">Central line IV (max rate 20 mEq/hr)</p>
          <p>
            5%DN/2 100 mL + KCl
            <InlineNumberInpupt value={centralIVKConc} onChange={setCentralIVKConc} placeholder="mEq" />
            mEq → rate <span className="mono">{Math.floor((Number(centralKRate) * 100) / Number(centralIVKConc))}</span> mL/h
          </p>
          <p>
            K infusion rate =
            <InlineNumberInpupt value={centralKRate} onChange={setCentralKRate} placeholder="" />
            mEq/h
          </p>
        </SectionCard>
      }

      {value > 0 && KRate !== undefined && KRate >= 20 && (
        <WarningBox>IV K rate should not exceed 20 mmol/hr.</WarningBox>
      )}
      {value > 0 && value < 3.5 && KRate !== undefined && KRate >= 10 && (
        <WarningBox>Monitor EKG when using an IV K rate exceeding 10 mmol/hr.</WarningBox>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   Sodium
--------------------------------------------------------- */
function Sodium({ value }: { value: number }) {
  const [targetNa, setTargetNa] = useState<number | undefined>(undefined);
  const [patient_weight, setPatientWeight] = useState<number | undefined>(undefined);

  const [isAcute, setIsAcute] = useState<boolean | null>(null);

  return (
    <div className="space-y-3">
      <SectionCard>
        <NumberInput
          label="Patient weight"
          value={patient_weight}
          onChange={setPatientWeight}
          placeholder="kg"
          unit="kg"
        />
      </SectionCard>

      {value < 135 && (
        <SectionCard>
          <p className="font-medium mb-1">Onset</p>
          <div className="inline-flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            {[{ v: true, l: "Acute" }, { v: false, l: "Chronic" }].map(({ v, l }) => (
              <button
                key={l}
                onClick={() => setIsAcute(v)}
                className="px-4 py-1.5 text-sm font-medium"
                style={isAcute === v
                  ? { background: "var(--teal)", color: "#fff" }
                  : { background: "#fff", color: "var(--ink)" }}
              >
                {l}
              </button>
            ))}
          </div>
        </SectionCard>
      )}

      {value < 135 && patient_weight !== undefined && isAcute !== null && (
        <SectionCard eyebrow={isAcute ? "Acute / symptomatic" : "Chronic"} title={isAcute ? "Goal: 4–6 mEq/L" : "Goal: 8–10 mEq/L/day"}>
          {isAcute ? (
            <>
              <p>Sodium deficit = <span className="mono">{Math.round(0.6 * patient_weight * 4)}</span> mEq</p>
              <p>3% NaCl 100 mL IV bolus q10min, repeat up to 3 doses</p>
            </>
          ) : (
            <>
              <p>Sodium deficit = <span className="mono">{Math.round(0.6 * patient_weight * 8)}</span> mEq/day</p>
              <p>IV 0.9% NaCl rate = <span className="mono">{Math.round((0.6 * patient_weight * 8 * 1000) / (154 * 24))}</span> mL/hr</p>
            </>
          )}
          {isAcute == false &&
            <>
              <div className="h-px my-2" style={{ background: "var(--border)" }} />
              <h3 className="text-base font-semibold mb-2">If high-risk ODS, Na correction goal: 4-6 mEq/L/day</h3>
              <p>Sodium deficit = <span className="mono">{Math.round(0.6 * patient_weight * 4)}</span> mEq/day</p>
              <p>IV 0.9% NaCl rate = <span className="mono">{Math.round((0.6 * patient_weight * 4 * 1000) / (154 * 24))}</span> mL/hr</p>
            </>
          }
        </SectionCard>
      )}

      {value > 145 && patient_weight && (
        <SectionCard eyebrow="Hypernatremia" title="Target ~8 mEq/L/day lowering">
          <p>
            Target Na
            <InlineNumberInpupt value={targetNa} onChange={setTargetNa} placeholder="mEq" />
          </p>
          {targetNa && (
            <p>Free water deficit = <span className="mono">{Math.round((patient_weight * 0.6) * ((value / targetNa) - 1))}</span> L</p>
          )}
        </SectionCard>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   App
--------------------------------------------------------- */
export default function App() {
  type Electrolyte = "" | "na" | "k" | "ca" | "mg";
  const [state, setState] = useState<Electrolyte>("");
  const [value, setValue] = useState("");

  const database = {
    na: { name: "Sodium", symbol: "Na", lnl: 135, unl: 145, hypo: "Hyponatremia", hyper: "Hypernatremia", color: "var(--teal)" },
    k: { name: "Potassium", symbol: "K", lnl: 3.5, unl: 5, hypo: "Hypokalemia", hyper: "Hyperkalemia", color: "var(--green)" },
    ca: { name: "Calcium", symbol: "Ca", lnl: 8.5, unl: 10.5, hypo: "Hypocalcemia", hyper: "Hypercalcemia", color: "var(--blue)" },
    mg: { name: "Magnesium", symbol: "Mg", lnl: 1.7, unl: 2.2, hypo: "Hypomagnesemia", hyper: "Hypermagnesemia", color: "var(--red)" },
  };

  const numValue = Number(value);
  let statusObj: StatusPillProps["status"] = {
    kind: "normal",
    label: "—",
  };
  if (value !== "" && state) {
    const d = database[state];
    if (numValue < d.lnl) statusObj = { kind: "hypo", label: d.hypo };
    else if (numValue > d.unl) statusObj = { kind: "hyper", label: d.hyper };
    else statusObj = { kind: "normal", label: "Normal" };
  }

  return (
    <div className="elyte-root min-h-screen w-full flex justify-center p-6">
      <Tokens />
      <div className="w-full max-w-md">
        {state === "" ? (
          <div>
            <Eyebrow tone="teal">Porames PocketMed Calculator</Eyebrow>
            <h1 className="text-2xl font-semibold mb-1">Electrolyte Console <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 inset-ring inset-ring-red-600/10">BETA</span></h1>
            <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
              Pick an electrolyte to see correction protocols for the value you enter.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(database) as [Exclude<Electrolyte, "">, typeof database["na"]][])
                .map(([key, d]) => (
                  <ElementTile
                    key={key}
                    symbol={d.symbol}
                    name={d.name}
                    range={`${d.lnl}–${d.unl}`}
                    unitLabel="mEq/L"
                    color={d.color}
                    disabled={key === "ca" || key === "mg"}
                    onClick={() => setState(key)}
                  />
                ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => { setState(""); setValue(""); }}
              className="flex items-center gap-1 text-sm font-medium"
              style={{ color: "var(--muted)" }}
            >
              <ChevronLeft size={16} /> Back
            </button>

            <div className="flex items-center justify-between">
              <div>
                <Eyebrow tone="teal">{database[state].symbol}</Eyebrow>
                <h1 className="text-xl font-semibold">{database[state].name}</h1>
              </div>
              <StatusPill status={statusObj} />
            </div>

            <SectionCard>
              <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>
                Serum {database[state].name.toLowerCase()} (mEq/L)
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value"
                className="focus-ring mono w-full rounded-lg px-3 py-2 text-lg bg-white mb-3"
                style={{ border: "1px solid var(--border)" }}
              />
              <RangeBar
                value={value === "" ? undefined : numValue}
                lnl={database[state].lnl}
                unl={database[state].unl}
                unitLabel="mEq/L"
              />
            </SectionCard>

            {state === "na" && value !== "" && <Sodium value={numValue} />}
            {state === "k" && value !== "" && <Potassium value={numValue} />}
          </div>
        )}
      </div>
    </div>
  );
}