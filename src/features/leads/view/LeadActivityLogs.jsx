import { useMemo } from "react";

const ACTIVITY_TYPES = {
  assign:   { label: "Lead assigned",        dotColor: "#185FA5" },
  reassign: { label: "Lead reassigned",      dotColor: "#BA7517" },
  update:   { label: "Lead details updated", dotColor: "#1D9E75" },
  status:   { label: "Status changed",       dotColor: "#A32D2D" },
  comment:  { label: "Comment added",        dotColor: "#888780" },
  created:  { label: "Lead created",         dotColor: "#888780" },
};

const MOCK_ACTIVITIES = [
  {
    id: 1, type: "reassign", date: "2026-04-28", time: "10:42 AM",
    actor: { name: "Ravi Patel", role: "Manager", initials: "RP", color: "#FAEEDA", textColor: "#633806" },
    reason: "Specialist required",
    changes: [{ field: "Assigned staff", oldVal: "Anjali Sharma", newVal: "Kiran Mehta" }],
  },
  {
    id: 2, type: "status", date: "2026-04-28", time: "9:15 AM",
    actor: { name: "Kiran Mehta", role: "Staff", initials: "KM", color: "#E6F1FB", textColor: "#0C447C" },
    changes: [{ field: "Lead status", oldVal: "New", newVal: "In Progress" }],
  },
  {
    id: 3, type: "update", date: "2026-04-27", time: "4:30 PM",
    actor: { name: "Anjali Sharma", role: "Staff", initials: "AS", color: "#E1F5EE", textColor: "#085041" },
    changes: [
      { field: "Loan amount", oldVal: "₹15,00,000", newVal: "₹20,00,000" },
      { field: "Loan tenure", oldVal: "10 years", newVal: "15 years" },
      { field: "Employment type", oldVal: "Salaried", newVal: "Self-employed" },
    ],
  },
  {
    id: 4, type: "comment", date: "2026-04-27", time: "2:10 PM",
    actor: { name: "Anjali Sharma", role: "Staff", initials: "AS", color: "#E1F5EE", textColor: "#085041" },
    comment: "Customer called and requested to increase loan amount. Documents to be submitted by Friday.",
  },
  {
    id: 5, type: "reassign", date: "2026-04-27", time: "11:00 AM",
    actor: { name: "Ravi Patel", role: "Manager", initials: "RP", color: "#FAEEDA", textColor: "#633806" },
    reason: "Staff on leave",
    changes: [{ field: "Assigned staff", oldVal: "Priya Nair", newVal: "Anjali Sharma" }],
  },
  {
    id: 6, type: "update", date: "2026-04-25", time: "3:45 PM",
    actor: { name: "Priya Nair", role: "Staff", initials: "PN", color: "#E6F1FB", textColor: "#0C447C" },
    changes: [
      { field: "Phone number", oldVal: "9876500000", newVal: "9876543210" },
      { field: "Email", oldVal: "old@gmail.com", newVal: "new@gmail.com" },
    ],
  },
  {
    id: 7, type: "status", date: "2026-04-25", time: "10:05 AM",
    actor: { name: "Priya Nair", role: "Staff", initials: "PN", color: "#E6F1FB", textColor: "#0C447C" },
    changes: [{ field: "Lead status", oldVal: "Unassigned", newVal: "New" }],
  },
  {
    id: 8, type: "assign", date: "2026-04-24", time: "9:00 AM",
    actor: { name: "Ravi Patel", role: "Manager", initials: "RP", color: "#FAEEDA", textColor: "#633806" },
    reason: "Manual assignment by manager",
    changes: [{ field: "Assigned to", oldVal: null, newVal: "Priya Nair" }],
  },
  {
    id: 9, type: "created", date: "2026-04-24", time: "8:52 AM",
    actor: { name: "System", role: "", initials: "SY", color: "#F1EFE8", textColor: "#444441" },
    meta: [
      { field: "Lead ID", value: "#LD-2026-00412" },
      { field: "Customer", value: "Suresh Kumar" },
      { field: "Product", value: "Home Loan" },
    ],
    badge: "Source: Web form",
  },
];

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
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function Avatar({ actor }) {
  return (
    <span style={{
      width: 24, height: 24, borderRadius: "50%",
      background: actor.color, color: actor.textColor,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: 9, fontWeight: 600, flexShrink: 0,
    }}>
      {actor.initials}
    </span>
  );
}

function LogEntry({ activity }) {
  const config = ACTIVITY_TYPES[activity.type];

  return (
    <div style={{ display: "flex", gap: 14, position: "relative", paddingBottom: 20 }}>
      {/* vertical line */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 12, height: 12, borderRadius: "50%",
          background: config.dotColor,
          border: "2px solid var(--lal-bg)",
          flexShrink: 0, marginTop: 3, zIndex: 1,
        }} />
        <div style={{ flex: 1, width: 1, background: "var(--lal-line)", marginTop: 4 }} />
      </div>

      {/* content */}
      <div style={{ flex: 1, paddingBottom: 4 }}>
        {/* top row: actor + action + time */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 5 }}>
          <Avatar actor={activity.actor} />
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--lal-text)" }}>
            {activity.actor.name}
          </span>
          {activity.actor.role && (
            <span style={{ fontSize: 12, color: "var(--lal-muted)" }}>({activity.actor.role})</span>
          )}
          <span style={{ fontSize: 12, color: "var(--lal-muted)" }}>·</span>
          <span style={{ fontSize: 12, color: "var(--lal-muted)" }}>{config.label}</span>
          <span style={{ fontSize: 11, color: "var(--lal-subtle)", marginLeft: "auto" }}>{activity.time}</span>
        </div>

        {/* reason badge */}
        {activity.reason && (
          <div style={{ marginBottom: 6 }}>
            <span style={{
              fontSize: 11, padding: "2px 8px", borderRadius: 999,
              background: "var(--lal-badge-bg)", color: "var(--lal-badge-text)",
              border: "0.5px solid var(--lal-badge-border)",
            }}>
              Reason: {activity.reason}
            </span>
          </div>
        )}

        {/* field changes */}
        {activity.changes && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {activity.changes.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 12 }}>
                <span style={{ color: "var(--lal-muted)", minWidth: 130, flexShrink: 0 }}>{c.field}</span>
                {c.oldVal && (
                  <>
                    <span style={{
                      background: "#FCEBEB", color: "#791F1F",
                      padding: "1px 7px", borderRadius: 4, fontSize: 11,
                      textDecoration: "line-through",
                    }}>{c.oldVal}</span>
                    <span style={{ color: "var(--lal-subtle)", fontSize: 10 }}>→</span>
                  </>
                )}
                <span style={{
                  background: "#EAF3DE", color: "#27500A",
                  padding: "1px 7px", borderRadius: 4, fontSize: 11,
                }}>{c.newVal}</span>
              </div>
            ))}
          </div>
        )}

        {/* comment */}
        {activity.comment && (
          <div style={{
            fontSize: 12, color: "var(--lal-muted)", fontStyle: "italic",
            borderLeft: "2px solid var(--lal-line)",
            paddingLeft: 10, marginTop: 2, lineHeight: 1.5,
          }}>
            "{activity.comment}"
          </div>
        )}

        {/* meta (created) */}
        {activity.meta && (
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {activity.badge && (
              <span style={{
                fontSize: 11, padding: "1px 8px", borderRadius: 999, marginBottom: 4,
                background: "var(--lal-badge-bg)", color: "var(--lal-badge-text)",
                border: "0.5px solid var(--lal-badge-border)", display: "inline-block",
              }}>{activity.badge}</span>
            )}
            {activity.meta.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, fontSize: 12 }}>
                <span style={{ color: "var(--lal-muted)", minWidth: 80 }}>{m.field}</span>
                <span style={{ color: "var(--lal-text)", fontFamily: "monospace" }}>{m.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LeadActivityLogs({ activities = MOCK_ACTIVITIES }) {
  const grouped = useMemo(() => groupByDate(activities), [activities]);
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div style={{
      "--lal-bg": "#ffffff",
      "--lal-text": "#1a1a1a",
      "--lal-muted": "#666",
      "--lal-subtle": "#aaa",
      "--lal-line": "rgba(0,0,0,0.1)",
      "--lal-badge-bg": "#F1EFE8",
      "--lal-badge-text": "#444441",
      "--lal-badge-border": "rgba(0,0,0,0.08)",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      padding: "4px 0",
    }}>
      {sortedDates.map((date, di) => (
        <div key={date}>
          {/* date divider */}
          <div style={{
            fontSize: 11, color: "var(--lal-subtle)",
            display: "flex", alignItems: "center", gap: 10,
            marginBottom: 14, marginTop: di > 0 ? 4 : 0,
          }}>
            <div style={{ flex: 1, height: "0.5px", background: "var(--lal-line)" }} />
            <span>{formatDateLabel(date)}</span>
            <div style={{ flex: 1, height: "0.5px", background: "var(--lal-line)" }} />
          </div>

          {/* entries */}
          {grouped[date].map((activity, i) => (
            <LogEntry
              key={activity.id}
              activity={activity}
              isLast={i === grouped[date].length - 1 && di === sortedDates.length - 1}
            />
          ))}
        </div>
      ))}
    </div>
  );
}