import { useNavigate } from "react-router-dom";
import type { FamilyMember } from "@/mock-data/types";

const WIDTH = 420;
const HEIGHT = 230;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;
const RX = 150;
const RY = 82;

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/**
 * Relationship graph preview — a static SVG projection of the household, not
 * an interactive graph explorer. Members that resolve to their own citizen
 * record are clickable.
 */
export function RelationshipGraph({
  centerInitials,
  centerName,
  members,
}: {
  centerInitials: string;
  centerName: string;
  members: FamilyMember[];
}) {
  const navigate = useNavigate();

  const nodes = members.map((member, i) => {
    const angle = (-90 + (360 / members.length) * i) * (Math.PI / 180);
    return {
      member,
      x: CX + RX * Math.cos(angle),
      y: CY + RY * Math.sin(angle),
    };
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-ink-100 bg-canvas/50 p-2">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full min-w-[360px]"
        role="img"
        aria-label={`Household relationship graph for ${centerName}: ${members
          .map((m) => `${m.name}, ${m.relation}`)
          .join("; ")}`}
      >
        {nodes.map(({ member, x, y }) => (
          <line
            key={`edge-${member.id}`}
            x1={CX}
            y1={CY}
            x2={x}
            y2={y}
            stroke="var(--color-ink-200)"
            strokeWidth={1.5}
            strokeDasharray={member.linkedCitizenId ? undefined : "3 3"}
          />
        ))}

        {nodes.map(({ member, x, y }) => {
          const linked = Boolean(member.linkedCitizenId);
          return (
            <g
              key={member.id}
              className={linked ? "cursor-pointer" : undefined}
              onClick={() => linked && navigate(`/citizens/${member.linkedCitizenId}`)}
              role={linked ? "button" : undefined}
              tabIndex={linked ? 0 : undefined}
              aria-label={linked ? `Open profile for ${member.name}` : undefined}
              onKeyDown={(event) => {
                if (linked && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  navigate(`/citizens/${member.linkedCitizenId}`);
                }
              }}
            >
              <circle
                cx={x}
                cy={y}
                r={21}
                fill={linked ? "var(--color-primary-100)" : "var(--color-surface)"}
                stroke={linked ? "var(--color-primary-300)" : "var(--color-ink-200)"}
                strokeWidth={1.5}
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                className="font-sans"
                fontSize={11}
                fontWeight={700}
                fill={linked ? "var(--color-primary-700)" : "var(--color-ink-500)"}
              >
                {initialsOf(member.name)}
              </text>
              <text
                x={x}
                y={y + 36}
                textAnchor="middle"
                className="font-sans"
                fontSize={9}
                fontWeight={600}
                fill="var(--color-ink-700)"
              >
                {member.name.split(" ")[0]}
              </text>
              <text
                x={x}
                y={y + 46}
                textAnchor="middle"
                className="font-sans"
                fontSize={8}
                fill="var(--color-ink-400)"
              >
                {member.relation}
              </text>
            </g>
          );
        })}

        <circle cx={CX} cy={CY} r={27} fill="var(--color-primary-600)" />
        <text
          x={CX}
          y={CY + 5}
          textAnchor="middle"
          className="font-sans"
          fontSize={13}
          fontWeight={700}
          fill="#ffffff"
        >
          {centerInitials}
        </text>
      </svg>

      <p className="px-1 pb-0.5 pt-1 text-[11px] text-ink-400">
        Solid links resolve to their own citizen record; dashed links exist only as
        declared family entries.
      </p>
    </div>
  );
}
