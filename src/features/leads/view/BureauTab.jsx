import { useEffect, useRef } from "react";

// ── Main component ──────────────────────────────────────
export function BureauTab({ bureau, onFetch, onRefresh }) {
    // bureau = null → empty state
    // bureau = { score, fetchedAt, scoreBand, eligibleLenders, reportValidDays } → fetched state
    return (
        <div className="flex flex-col gap-3">
            <div className="bg-white border border-gray-200 rounded-2xl px-7 py-6">
                <div className="flex items-center justify-between mb-5">
                    <SectionTitle>Bureau report — CIBIL</SectionTitle>
                    {bureau && (
                        <button onClick={onRefresh}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50">
                            <RefreshIcon /> Refresh
                        </button>
                    )}
                </div>

                {bureau ? (
                    <FetchedState bureau={bureau} />
                ) : (
                    <EmptyState onFetch={onFetch} />
                )}
            </div>
        </div>
    );
}

// ── Fetched state ────────────────────────────────────────
function FetchedState({ bureau }) {
    const { score = 781, fetchedAt, scoreBand = "Excellent",
        eligibleLenders = "5 of 5", reportValidDays = 30 } = bureau;

    const MIN = 300, MAX = 900;
    const pct = (score - MIN) / (MAX - MIN);           // 0–1
    const circumference = 2 * Math.PI * 46;
    const ringRef = useRef(null);

    useEffect(() => {
        if (!ringRef.current) return;
        const dash = pct * circumference;
        requestAnimationFrame(() => {
            ringRef.current.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)";
            ringRef.current.setAttribute("stroke-dasharray", `${dash} ${circumference}`);
            ringRef.current.setAttribute("stroke-dashoffset", "0");
        });
    }, [score]);

    const bandColor = scoreBandColor(scoreBand);

    return (
        <>
            {/* Gauge row */}
            <div className="flex items-center gap-8 mb-6">

                {/* Ring */}
                <div className="relative w-28 h-28 flex-shrink-0">
                    <svg viewBox="0 0 110 110" className="w-full h-full">
                        <circle cx="55" cy="55" r="46" fill="none" stroke="#F0FDF4" strokeWidth="10" />
                        <circle cx="55" cy="55" r="46" fill="none" stroke="#E5E7EB" strokeWidth="10"
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset="0" transform="rotate(-90 55 55)" style={{ opacity: 0.3 }} />
                        <circle ref={ringRef} cx="55" cy="55" r="46" fill="none"
                            stroke={bandColor.ring} strokeWidth="10"
                            strokeDasharray={`0 ${circumference}`}
                            strokeDashoffset="0" strokeLinecap="round" transform="rotate(-90 55 55)" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-extrabold leading-none" style={{ color: bandColor.ring }}>
                            {score}
                        </span>
                        <span className="text-[9px] font-bold tracking-widest uppercase mt-1" style={{ color: bandColor.ring }}>
                            {scoreBand}
                        </span>
                    </div>
                </div>

                {/* Gradient bar */}
                <div className="flex-1">
                    <div className="flex justify-between text-[11px] text-gray-400 font-medium mb-2">
                        <span>300 — Poor</span>
                        <span>900 — Excellent</span>
                    </div>
                    <div className="relative h-3.5 rounded-full mb-1.5"
                        style={{ background: "linear-gradient(to right,#EF4444,#F97316,#FBBF24,#A3E635,#22C55E,#3B82F6)" }}>
                        <div className="absolute top-1/2 translate-y-0.4  w-7 h-7 rounded-full bg-white border-[3px] shadow-sm"
                            style={{ left: `${pct * 100}%`, transform: "translate(-50%,-50%)", borderColor: bandColor.ring, boxShadow: `0 0 0 3px ${bandColor.ring}33` }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-400 font-medium">
                        <span>Very Low</span><span>Fair</span><span>Good</span><span>Excellent</span>
                    </div>
                    {fetchedAt && (
                        <p className="text-[11px] text-gray-400 font-mono mt-2">Fetched {fetchedAt}</p>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Score band", value: scoreBand, green: true },
                    { label: "Eligible lenders", value: eligibleLenders },
                    { label: "Report valid", value: `${reportValidDays} days` },
                ].map((s) => (
                    <div key={s.label} className="px-5 py-4 border rounded-md bg-[#eefcfc] border-gray-300">
                        <div className={`text-[17px] font-bold ${s.green ? "text-green-700" : "text-gray-900"}`}>
                            {s.value}
                        </div>
                        <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mt-1">
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

// ── Empty state ──────────────────────────────────────────
function EmptyState({ onFetch }) {
    return (
        <div className="flex flex-col items-center py-10">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="#2563EB" strokeWidth="1.6" />
                    <path d="M12 8v4M12 16h.01" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
            </div>
            <h3 className="text-[15px] font-bold text-gray-900 mb-1.5">No bureau report fetched</h3>
            <p className="text-sm text-gray-400 text-center mb-5 leading-relaxed">
                CIBIL score hasn't been pulled for this lead yet.<br />
                Fetch the report to check credit eligibility.
            </p>
            <button onClick={onFetch}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">
                <RefreshIcon white /> Fetch bureau report
            </button>
        </div>
    );
}

// ── Helpers ──────────────────────────────────────────────
function scoreBandColor(band) {
    const map = {
        Excellent: { ring: "#15803D" },
        Good: { ring: "#22C55E" },
        Fair: { ring: "#FBBF24" },
        Poor: { ring: "#EF4444" },
    };
    return map[band] ?? map.Excellent;
}

function SectionTitle({ children }) {
    return (
        <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-blue-600">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="4" width="14" height="10" rx="2" stroke="#2563EB" strokeWidth="1.5" />
                <path d="M5 4V3a3 3 0 016 0v1" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {children}
        </div>
    );
}

const RefreshIcon = ({ white }) => (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <path d="M13.5 8A5.5 5.5 0 112.5 5.5" stroke={white ? "#fff" : "#374151"} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M2.5 2v3.5H6" stroke={white ? "#fff" : "#374151"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);