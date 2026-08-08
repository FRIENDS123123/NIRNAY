import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  FileSearch,
  FolderX,
  Gauge,
  Landmark,
  ListChecks,
  Sparkles,
  UserRound,
} from "lucide-react";
import { getCitizenById } from "@/mock-data/citizens";
import { useInvestigation } from "@/lib/investigations/use-investigations";
import { EvidenceProvider } from "@/components/evidence/EvidenceProvider";
import { EvidenceRefs } from "@/components/evidence/EvidenceRefs";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { DataRow } from "@/components/ui/DataRow";
import { DepartmentChip } from "@/components/ui/DepartmentChip";
import { CaseStatusBadge, PriorityBadge } from "@/components/investigations/CaseBadges";
import { StatusSelect } from "@/components/investigations/StatusSelect";
import { NotesPanel } from "@/components/investigations/NotesPanel";
import { TaskList } from "@/components/investigations/TaskList";
import { CaseActivityTimeline } from "@/components/investigations/CaseActivityTimeline";
import { formatDate, formatDateTime, formatPercent } from "@/lib/format";

const LOAD_DELAY_MS = 260;

/** Titled block used for each of the case detail sections. */
function Block({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: typeof Sparkles;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
          <Icon size={18} aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-semibold text-ink-900">{title}</h2>
          {subtitle && <p className="text-sm text-ink-500">{subtitle}</p>}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

export function InvestigationDetailPage() {
  const { investigationId } = useParams<{ investigationId: string }>();
  const investigation = useInvestigation(investigationId);
  const citizen = investigation ? getCitizenById(investigation.sourceCitizenId) : undefined;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0 });
    const timer = setTimeout(() => setLoading(false), LOAD_DELAY_MS);
    return () => clearTimeout(timer);
  }, [investigationId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Skeleton className="h-4 w-32" />
        <div className="mt-4 flex flex-col gap-6" aria-busy="true">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!investigation) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <EmptyState
          icon={<FolderX size={22} strokeWidth={2} />}
          title="Investigation not found"
          description={`No case matches ID “${investigationId}”. It may have been created in a different browser — cases are stored locally.`}
        />
        <div className="flex justify-center">
          <Link
            to="/investigations"
            className="rounded-lg text-sm font-semibold text-primary-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            Back to investigations
          </Link>
        </div>
      </div>
    );
  }

  const evidence = citizen?.evidence ?? [];
  const summary = citizen?.aiSummary;

  return (
    <EvidenceProvider evidence={evidence}>
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Link
          to="/investigations"
          className="mb-4 inline-flex items-center gap-1.5 rounded text-sm font-medium text-ink-500 transition-colors hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        >
          <ArrowLeft size={15} aria-hidden="true" /> Back to investigations
        </Link>

        <div className="flex flex-col gap-6">
          {/* Case header */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex flex-wrap items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-lg font-bold text-white">
                  {investigation.citizenInitials}
                </span>

                <div className="min-w-0 flex-1 basis-52">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-mono text-lg font-bold tracking-tight text-ink-900">
                      {investigation.id}
                    </h1>
                    <CaseStatusBadge status={investigation.status} />
                    <PriorityBadge priority={investigation.priority} />
                  </div>
                  <p className="mt-1 text-sm font-semibold text-ink-900">
                    {investigation.citizenName}
                    <Link
                      to={`/citizens/${investigation.sourceCitizenId}`}
                      className="ml-2 inline-flex items-center gap-0.5 rounded font-mono text-xs font-medium text-primary-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                    >
                      {investigation.sourceCitizenId}
                      <ArrowUpRight size={11} strokeWidth={2.5} aria-hidden="true" />
                    </Link>
                  </p>
                </div>

                {/* Drops to its own full-width row on narrow screens so the
                    case ID keeps a sensible measure. */}
                <div className="flex w-full shrink-0 flex-wrap items-center justify-between gap-2 sm:w-auto sm:flex-col sm:items-end">
                  <RiskBadge level={investigation.riskLevel} />
                  <StatusSelect investigationId={investigation.id} status={investigation.status} />
                </div>
              </div>

              <div className="mt-4 grid gap-x-8 border-t border-ink-100 pt-3 sm:grid-cols-2">
                <DataRow label="Assigned officer" value={investigation.assignedOfficer} />
                <DataRow label="Risk score" value={`${investigation.riskScore}/100`} />
                <DataRow label="Created" value={formatDateTime(investigation.createdAt)} />
                <DataRow label="Last updated" value={formatDateTime(investigation.updatedAt)} />
              </div>

              <div className="mt-3 rounded-xl border border-ink-100 bg-canvas/50 p-3.5">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-400">
                  Investigation reason
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{investigation.reason}</p>
              </div>
            </Card>
          </motion.div>

          {!citizen && (
            <Card className="border-warning-100 bg-warning-50 p-4">
              <p className="text-sm font-medium text-warning-700">
                The source citizen record {investigation.sourceCitizenId} could not be resolved, so
                the intelligence blocks below are unavailable. Notes, tasks and case history are
                unaffected.
              </p>
            </Card>
          )}

          {summary && citizen && (
            <>
              <Block
                icon={Sparkles}
                title="Executive Summary"
                subtitle="Carried from the Citizen 360 resolution at case creation"
              >
                <p className="text-[15px] leading-relaxed text-ink-700">
                  {summary.executiveSummary}
                </p>
              </Block>

              <div className="grid gap-6 lg:grid-cols-2">
                <Block icon={UserRound} title="Citizen Snapshot">
                  <div className="grid gap-x-8">
                    <DataRow label="Full name" value={citizen.identity.fullName} />
                    <DataRow label="Citizen ID" value={citizen.citizenId} mono />
                    <DataRow label="Date of birth" value={formatDate(citizen.identity.dateOfBirth)} />
                    <DataRow label="Gender" value={citizen.identity.gender} />
                    <DataRow
                      label="Address"
                      value={`${citizen.addressIntel.current.city}, ${citizen.addressIntel.current.state}`}
                    />
                    <DataRow label="Phone" value={citizen.identity.phone} />
                    <DataRow
                      label="Resolution confidence"
                      value={formatPercent(citizen.resolutionConfidence)}
                    />
                  </div>
                </Block>

                <Block icon={Gauge} title="Risk Overview">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-3xl font-bold leading-none text-ink-900">
                        {summary.metrics.riskScore}
                        <span className="text-base font-semibold text-ink-400">/100</span>
                      </p>
                      <p className="mt-1 text-xs text-ink-500">
                        Citizen status: {summary.metrics.citizenStatus}
                      </p>
                    </div>
                    <RiskBadge level={summary.riskLevel} />
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                      style={{ width: `${summary.metrics.riskScore}%` }}
                    />
                  </div>

                  <ul className="mt-4 flex flex-col gap-2.5">
                    {summary.riskRationale.map((finding, i) => (
                      <li key={i} className="text-[13px] leading-relaxed text-ink-700">
                        {finding.text}{" "}
                        <EvidenceRefs
                          ids={finding.evidenceIds}
                          context={finding.text}
                          evidence={evidence}
                        />
                      </li>
                    ))}
                  </ul>
                </Block>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Block icon={FileSearch} title="Evidence Summary">
                  <div className="grid gap-x-8">
                    <DataRow label="Source records" value={String(summary.metrics.evidenceSources)} />
                    <DataRow label="Records analysed" value={String(summary.metrics.recordsAnalysed)} />
                    <DataRow label="Documents linked" value={String(summary.metrics.documentsLinked)} />
                    <DataRow
                      label="AI confidence"
                      value={formatPercent(summary.metrics.aiConfidence)}
                    />
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-ink-500">
                    Every statement in this case links back to a source record. Open any evidence
                    chip to inspect the department, reference number and verification status.
                  </p>
                </Block>

                <Block
                  icon={Landmark}
                  title="Department Coverage"
                  subtitle={`${citizen.linkedDepartments.length} departments correlated`}
                >
                  <ul className="flex flex-col gap-2">
                    {citizen.linkedDepartments.map((department) => (
                      <li key={department} className="flex items-center gap-2.5 text-sm text-ink-700">
                        <DepartmentChip name={department} />
                        {department}
                      </li>
                    ))}
                  </ul>
                </Block>
              </div>
            </>
          )}

          <TaskList investigation={investigation} evidence={evidence} />

          <NotesPanel investigation={investigation} />

          <CaseActivityTimeline activity={investigation.activity} />

          {summary && (
            <Block
              icon={ListChecks}
              title="Recommendations"
              subtitle="Carried from the AI investigation summary · demo synthesis, not live AI"
            >
              <ul className="flex flex-col gap-3">
                {summary.recommendations.map((rec, i) => (
                  <li
                    key={rec.id}
                    className="flex gap-3 border-b border-ink-100 pb-3 last:border-b-0 last:pb-0"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-700">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink-900">{rec.title}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink-600">{rec.detail}</p>
                      <EvidenceRefs
                        ids={rec.evidenceIds}
                        context={rec.title}
                        evidence={evidence}
                        className="mt-2"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </Block>
          )}
        </div>
      </div>
    </EvidenceProvider>
  );
}
