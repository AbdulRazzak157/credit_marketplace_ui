import { useMemo } from "react";

const ACTIVITY_TYPES = {
  Assignment: { label: "Lead assigned", dotClass: "bg-blue-600", pillClass: "bg-blue-50 text-blue-800 ring-blue-200" },
  Bureau: { label: "Lead assigned", dotClass: "bg-blue-600", pillClass: "bg-blue-50 text-blue-800 ring-blue-200" },
  Reassignment: { label: "Lead reassigned", dotClass: "bg-amber-500", pillClass: "bg-amber-50 text-amber-800 ring-amber-200" },
  Update: { label: "Details updated", dotClass: "bg-emerald-500", pillClass: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  Capturing: { label: "Status changed", dotClass: "bg-rose-500", pillClass: "bg-rose-50 text-rose-800 ring-rose-200" },
  // Bureau: { label: "Comment added", dotClass: "bg-slate-400", pillClass: "bg-slate-100 text-slate-600 ring-slate-200" },
  created: { label: "Lead created", dotClass: "bg-slate-400", pillClass: "bg-slate-100 text-slate-600 ring-slate-200" },
};

// const MOCK_ACTIVITIES = [
//   {
//     id: 1, type: "reassign", date: "2026-04-28", time: "10:42 AM",
//     actor: { name: "Ravi Patel", role: "Manager", initials: "RP", bg: "bg-amber-100", text: "text-amber-800" },
//     log: "Specialist required",
//     changes: [{ field: "Assigned staff", oldVal: "Anjali Sharma", newVal: "Kiran Mehta" }],
//   },
//   {
//     id: 2, type: "status", date: "2026-04-28", time: "9:15 AM",
//     actor: { name: "Kiran Mehta", role: "Staff", initials: "KM", bg: "bg-blue-100", text: "text-blue-800" },
//     log: "Staff on leave",
//     changes: [{ field: "Lead status", oldVal: "New", newVal: "In Progress" }],
//   },
//   {
//     id: 3, type: "update", date: "2026-04-27", time: "4:30 PM",
//     actor: { name: "Anjali Sharma", role: "Staff", initials: "AS", bg: "bg-emerald-100", text: "text-emerald-800" },
//     log: "Staff on leave",
//     changes: [
//       { field: "Loan amount", oldVal: "₹15,00,000", newVal: "₹20,00,000" },
//       { field: "Loan tenure", oldVal: "10 years", newVal: "15 years" },
//       { field: "Employment type", oldVal: "Salaried", newVal: "Self-employed" },
//     ],
//   },
//   {
//     id: 4, type: "comment", date: "2026-04-27", time: "2:10 PM",
//     actor: { name: "Anjali Sharma", role: "Staff", initials: "AS", bg: "bg-emerald-100", text: "text-emerald-800" },
//     comment: "Customer called and requested to increase loan amount. Documents to be submitted by Friday.",
//   },
//   {
//     id: 5, type: "reassign", date: "2026-04-27", time: "11:00 AM",
//     actor: { name: "Ravi Patel", role: "Manager", initials: "RP", bg: "bg-amber-100", text: "text-amber-800" },
//     reason: "Staff on leave",
//     changes: [{ field: "Assigned staff", oldVal: "Priya Nair", newVal: "Anjali Sharma" }],
//   },
//   {
//     id: 6, type: "update", date: "2026-04-25", time: "3:45 PM",
//     actor: { name: "Priya Nair", role: "Staff", initials: "PN", bg: "bg-violet-100", text: "text-violet-800" },
//     changes: [
//       { field: "Phone number", oldVal: "9876500000", newVal: "9876543210" },
//       { field: "Email", oldVal: "old@gmail.com", newVal: "new@gmail.com" },
//     ],
//   },
//   {
//     id: 7, type: "status", date: "2026-04-25", time: "10:05 AM",
//     actor: { name: "Priya Nair", role: "Staff", initials: "PN", bg: "bg-violet-100", text: "text-violet-800" },
//     changes: [{ field: "Lead status", oldVal: "Unassigned", newVal: "New" }],
//   },
//   {
//     id: 8, type: "assign", date: "2026-04-24", time: "9:00 AM",
//     actor: { name: "Ravi Patel", role: "Manager", initials: "RP", bg: "bg-amber-100", text: "text-amber-800" },
//     reason: "Manual assignment by manager",
//     changes: [{ field: "Assigned to", oldVal: null, newVal: "Priya Nair" }],
//   },
//   {
//     id: 9, type: "created", date: "2026-04-24", time: "8:52 AM",
//     actor: { name: "System", role: "", initials: "SY", bg: "bg-slate-100", text: "text-slate-600" },
//     meta: [
//       { field: "Lead ID", value: "#LD-2026-00412" },
//       { field: "Customer", value: "Suresh Kumar" },
//       { field: "Product", value: "Home Loan" },
//     ],
//     badge: "Source: Web form",
//   },
// ];

const ROLE_COLORS = {
  STAFF: { bg: "bg-amber-100", text: "text-amber-800" },
  MANAGER: { bg: "bg-blue-100", text: "text-blue-800" },
  // : { bg: "bg-emerald-100", text: "text-emerald-800" },
  SYSTEM: { bg: "bg-slate-100", text: "text-slate-600" },
};
function groupByDate(activities) {
  return activities.reduce((acc, a) => {
    if (!acc[a.date]) acc[a.date] = [];
    acc[a.date].push(a);
    return acc;
  }, {});
}

function formatDateLabel(dateStr) {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function Avatar({ actor }) {
  const colors = ROLE_COLORS[actor?.role]
  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-semibold flex-shrink-0 ${colors?.bg} ${colors?.text}`}>
      {actor.initials}
    </span>
  );
}

function ValueChip({ value, variant }) {
  if (variant === "old") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 line-through decoration-rose-400">
        {value}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700">
      {value}
    </span>
  );
}

function LogEntry({ activity, isLast }) {
  const config = ACTIVITY_TYPES[activity.type];

  return (
    <div className="flex gap-3 relative">
      {/* timeline spine */}
      <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
        <div className={`w-2.5 h-2.5 rounded-full ring-2 ring-white flex-shrink-0 z-10 ${config?.dotClass}`} />
        {!isLast && <div className="w-px flex-1 bg-slate-200 mt-1" />}
      </div>

      {/* card */}
      <div className={`flex-1 min-w-0 bg-white border border-slate-100 rounded-xl px-4 py-3 hover:border-slate-200 hover:shadow-sm transition-all duration-150 ${!isLast ? "mb-3" : ""}`}>
        {/* top row */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <Avatar actor={activity.actor} />
          <span className="text-[13px] font-semibold text-slate-800">{activity.actor.name}</span>
          {activity.actor.role && (
            <span className="text-slate-400">(<span className="text-[10px] text-slate-400">{activity.actor.role}</span>)</span>
          )}
          <span className="text-slate-300 text-[11px]">·</span>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ring-1 ${config?.pillClass}`}>
            {activity?.type}
          </span>
          <span className="text-[11px] text-slate-400 ml-auto tabular-nums">{activity.time}</span>
        </div>

        {/* reason */}
        {activity.log && (
          <div className="my-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
              {activity.log}
            </span>
          </div>
        )}

        {/* field changes */}
        {activity.changes && (
          <div className="flex flex-col gap-1.5">
            {activity.changes.map((c, i) => (
              <div key={i} className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-400 w-32 flex-shrink-0">{c.field}</span>
                {c.oldVal && (
                  <>
                    <ValueChip value={c.oldVal} variant="old" />
                    <span className="text-slate-300 text-[10px]">→</span>
                  </>
                )}
                <ValueChip value={c.newVal} variant="new" />
              </div>
            ))}
          </div>
        )}

        {/* comment */}
        {/* {activity.comment && (
          <blockquote className="text-[12px] text-slate-500 italic border-l-2 border-slate-200 pl-3 mt-1 leading-relaxed">
            "{activity.comment}"
          </blockquote>
        )} */}

        {/* meta (created) */}
        {/* {activity.meta && (
          <div className="flex flex-col gap-1">
            {activity.badge && (
              <span className="inline-flex items-center text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5 mb-1 w-fit">
                {activity.badge}
              </span>
            )}
            {activity.meta.map((m, i) => (
              <div key={i} className="flex gap-3 text-[12px]">
                <span className="text-slate-400 w-20 flex-shrink-0">{m.field}</span>
                <span className="text-slate-700 font-mono">{m.value}</span>
              </div>
            ))}
          </div>
        )} */}
      </div>
    </div>
  );
}

function DateSeparator({ label }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-[10px] font-medium text-gray-500 tracking-wide uppercase whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

export default function LeadActivityLogs({ activities  }) {
  const grouped = useMemo(() => groupByDate(activities), [activities]);
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
  const totalEvents = activities.length;

  return (
    <div className="flex justify-center w-full min-h-screen py-8 px-4">
      <div className="w-full max-w-2xl ">
        {/* header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 tracking-wide uppercase">Audit Trail</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Complete activity history</p>
          </div>
          <span className="text-[11px] font-medium text-blue-700 bg-blue-50 ring-1 ring-blue-200 px-2.5 py-1 rounded-full">
            {totalEvents} events
          </span>
        </div>

        {/* timeline */}
        <div>
          {sortedDates.map((date, di) => {
            const entries = grouped[date];
            return (
              <div key={date}>
                <DateSeparator label={formatDateLabel(date)} />
                {entries.map((activity, i) => {
                  const isLastEntry =
                    i === entries.length - 1 && di === sortedDates.length - 1;
                  return (
                    <LogEntry
                      key={activity.id}
                      activity={activity}
                      isLast={isLastEntry}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}