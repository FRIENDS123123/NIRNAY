import { useNavigate } from "react-router-dom";
import {
  Banknote,
  Building2,
  Car,
  FileStack,
  Fingerprint,
  HandHeart,
  History,
  IdCard,
  MapPinned,
  Users,
  Briefcase,
} from "lucide-react";
import type { Citizen } from "@/mock-data/types";
import { ExpandableCard } from "@/components/ui/ExpandableCard";
import { DataRow } from "@/components/ui/DataRow";
import { Badge } from "@/components/ui/Badge";
const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function statusVariant(status: string): "success" | "warning" | "danger" | "neutral" {
  if (status === "Active" || status === "Verified") return "success";
  if (status === "Unverified" || status === "Under Review" || status === "Inactive") return "warning";
  if (status === "Expired" || status === "Revoked" || status === "Overdue") return "danger";
  return "neutral";
}

export function ProfileSections({ citizen }: { citizen: Citizen }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3">
      <ExpandableCard icon={<Fingerprint size={18} />} title="Identity" summary="Aadhaar, PAN, passport, and licence numbers" defaultOpen>
        <div className="grid gap-x-8 sm:grid-cols-2">
          <DataRow label="Full name" value={citizen.identity.fullName} />
          <DataRow label="Date of birth" value={citizen.identity.dateOfBirth} />
          <DataRow label="Gender" value={citizen.identity.gender} />
          <DataRow label="Aadhaar" value={<span className="font-mono">{citizen.identity.aadhaar}</span>} />
          <DataRow label="PAN" value={<span className="font-mono">{citizen.identity.pan}</span>} />
          {citizen.identity.passport && (
            <DataRow label="Passport" value={<span className="font-mono">{citizen.identity.passport}</span>} />
          )}
          {citizen.identity.drivingLicence && (
            <DataRow label="Driving licence" value={<span className="font-mono">{citizen.identity.drivingLicence}</span>} />
          )}
          <DataRow label="Phone" value={citizen.identity.phone} />
        </div>
      </ExpandableCard>

      <ExpandableCard icon={<MapPinned size={18} />} title="Address" summary={`${citizen.address.city}, ${citizen.address.state}`}>
        <p className="text-sm text-ink-700">
          {citizen.address.line}
          <br />
          {citizen.address.city}, {citizen.address.state} — {citizen.address.pincode}
        </p>
      </ExpandableCard>

      <ExpandableCard icon={<Users size={18} />} title="Family" count={citizen.family.length} summary="Household and dependent records">
        <div className="flex flex-col divide-y divide-ink-100">
          {citizen.family.map((member) => (
            <div key={member.name} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-ink-900">{member.name}</p>
                <p className="text-xs text-ink-500">
                  {member.relation} · {member.age} yrs
                </p>
              </div>
              {member.linkedCitizenId && (
                <button
                  onClick={() => navigate(`/citizens/${member.linkedCitizenId}`)}
                  className="rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 hover:border-primary-300"
                >
                  View profile
                </button>
              )}
            </div>
          ))}
        </div>
      </ExpandableCard>

      <ExpandableCard icon={<Briefcase size={18} />} title="Employment" count={citizen.employment.length} summary="Current and past employment records">
        <div className="flex flex-col divide-y divide-ink-100">
          {citizen.employment.map((job, i) => (
            <div key={i} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-ink-900">{job.role}</p>
                <p className="text-xs text-ink-500">
                  {job.employer} · {job.sector} · since {job.since}
                </p>
              </div>
              <Badge variant={job.status === "Active" ? "success" : "neutral"}>{job.status}</Badge>
            </div>
          ))}
        </div>
      </ExpandableCard>

      <ExpandableCard icon={<Building2 size={18} />} title="Properties" count={citizen.properties.length} summary="Registered land, residential, and commercial assets">
        {citizen.properties.length === 0 ? (
          <p className="text-sm italic text-ink-400">No properties registered under this citizen.</p>
        ) : (
          <div className="flex flex-col divide-y divide-ink-100">
            {citizen.properties.map((p) => (
              <div key={p.id} className="py-2.5 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-ink-900">
                    {p.type} <span className="font-mono text-xs text-ink-400">{p.id}</span>
                  </p>
                  <p className="text-sm font-semibold text-ink-900">{currency.format(p.declaredValue)}</p>
                </div>
                <p className="mt-0.5 text-xs text-ink-500">
                  {p.address} · registered {p.registrationDate}
                </p>
              </div>
            ))}
          </div>
        )}
      </ExpandableCard>

      <ExpandableCard icon={<Car size={18} />} title="Vehicles" count={citizen.vehicles.length} summary="Registered vehicles">
        <div className="flex flex-col divide-y divide-ink-100">
          {citizen.vehicles.map((v) => (
            <div key={v.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-ink-900">{v.type}</p>
                <p className="text-xs text-ink-500">Registered since {v.registeredSince}</p>
              </div>
              <span className="font-mono text-xs text-ink-600">{v.registrationNumber}</span>
            </div>
          ))}
        </div>
      </ExpandableCard>

      <ExpandableCard icon={<FileStack size={18} />} title="Government Documents" count={citizen.documents.length} summary="Issued documents and verification status">
        <div className="flex flex-col divide-y divide-ink-100">
          {citizen.documents.map((d) => (
            <div key={d.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-ink-900">{d.type}</p>
                <p className="text-xs text-ink-500">
                  {d.issuingAuthority} · issued {d.issueDate}
                </p>
              </div>
              <Badge variant={statusVariant(d.status)}>{d.status}</Badge>
            </div>
          ))}
        </div>
      </ExpandableCard>

      <ExpandableCard icon={<HandHeart size={18} />} title="Benefits" count={citizen.benefits.length} summary="Welfare scheme enrollments">
        {citizen.benefits.length === 0 ? (
          <p className="text-sm italic text-ink-400">No welfare scheme enrollments on file.</p>
        ) : (
          <div className="flex flex-col divide-y divide-ink-100">
            {citizen.benefits.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-ink-900">{b.scheme}</p>
                  <p className="text-xs text-ink-500">Enrolled {b.enrollmentDate}</p>
                </div>
                <Badge variant={statusVariant(b.status)}>{b.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </ExpandableCard>

      <ExpandableCard icon={<IdCard size={18} />} title="Licences" count={citizen.licences.length} summary="Driving, professional, and business licences">
        <div className="flex flex-col divide-y divide-ink-100">
          {citizen.licences.map((l) => (
            <div key={l.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-ink-900">{l.type}</p>
                <p className="text-xs text-ink-500">
                  {l.issueDate} → {l.expiryDate}
                </p>
              </div>
              <Badge variant={statusVariant(l.status)}>{l.status}</Badge>
            </div>
          ))}
        </div>
      </ExpandableCard>

      <ExpandableCard icon={<Banknote size={18} />} title="Income" count={citizen.income.length} summary="Declared income and filing status by year">
        <div className="flex flex-col divide-y divide-ink-100">
          {citizen.income.map((inc) => (
            <div key={inc.year} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-ink-900">{inc.year}</p>
                <p className="text-xs text-ink-500">{currency.format(inc.declaredIncome)}</p>
              </div>
              <Badge variant={statusVariant(inc.filingStatus)}>{inc.filingStatus}</Badge>
            </div>
          ))}
        </div>
      </ExpandableCard>

      <ExpandableCard icon={<History size={18} />} title="Timeline" count={citizen.timeline.length} summary="Chronological record of departmental events">
        <ol className="flex flex-col gap-4">
          {citizen.timeline.map((event, i) => (
            <li key={i} className="relative flex gap-3.5 pl-1">
              <span className="mt-1 flex flex-col items-center">
                <span className="h-2 w-2 shrink-0 rounded-full bg-primary-400" />
                {i < citizen.timeline.length - 1 && <span className="mt-1 w-px flex-1 bg-ink-200" />}
              </span>
              <div className="pb-1">
                <p className="text-xs font-medium text-ink-400">{event.date}</p>
                <p className="text-sm font-semibold text-ink-900">{event.title}</p>
                <p className="text-xs text-ink-500">{event.description}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wide text-ink-300">{event.department}</p>
              </div>
            </li>
          ))}
        </ol>
      </ExpandableCard>
    </div>
  );
}
