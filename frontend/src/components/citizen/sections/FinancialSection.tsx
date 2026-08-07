import { Banknote } from "lucide-react";
import type { Citizen, CreditProfile } from "@/mock-data/types";
import { ExpandableCard } from "@/components/ui/ExpandableCard";
import { Badge } from "@/components/ui/Badge";
import { formatCompactCurrency, formatCurrency, formatDate } from "@/lib/format";
import { NoRecords, RecordItem, RecordList, SubHeading } from "./primitives";

const bandVariant = {
  Excellent: "success",
  Good: "success",
  Fair: "warning",
  Poor: "danger",
} as const;

const filingVariant = {
  Filed: "success",
  "Under Review": "warning",
  Overdue: "danger",
} as const;

const loanVariant = { Active: "success", Closed: "neutral", Irregular: "danger" } as const;

/** Credit score rendered on the standard 300–900 bureau scale. */
function CreditScoreMeter({ profile }: { profile: CreditProfile }) {
  const pct = Math.min(100, Math.max(0, ((profile.score - 300) / 600) * 100));

  return (
    <div className="rounded-xl border border-ink-100 bg-canvas/50 p-3.5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-2xl font-bold leading-none text-ink-900">{profile.score}</p>
          <p className="mt-1 text-xs text-ink-500">
            {profile.bureau} · as of {formatDate(profile.asOf)}
          </p>
        </div>
        <Badge variant={bandVariant[profile.band]}>{profile.band}</Badge>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between font-mono text-[10px] text-ink-400">
        <span>300</span>
        <span>900</span>
      </div>
    </div>
  );
}

export function FinancialSection({ citizen }: { citizen: Citizen }) {
  const f = citizen.financial;
  const irregular = f.loans.filter((l) => l.status === "Irregular").length;
  const latestFiling = f.incomeTax[0];

  return (
    <ExpandableCard
      icon={<Banknote size={18} aria-hidden="true" />}
      title="Financial Intelligence"
      summary={f.incomeRange}
      count={
        f.incomeTax.length +
        f.bankAccounts.length +
        f.loans.length +
        f.mutualFunds.length +
        f.fixedDeposits.length +
        f.insurance.length
      }
      meta={
        irregular > 0 ? (
          <Badge variant="danger">Irregular credit</Badge>
        ) : latestFiling ? (
          <Badge variant={filingVariant[latestFiling.filingStatus]}>
            {latestFiling.filingStatus}
          </Badge>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-5">
        <div className="grid gap-2.5 sm:grid-cols-2">
          <div className="rounded-xl border border-ink-100 bg-canvas/50 p-3.5">
            <SubHeading>Declared income range</SubHeading>
            <p className="mt-1.5 text-sm font-semibold text-ink-900">{f.incomeRange}</p>
            <p className="mt-1 text-xs text-ink-500">
              Based on {f.incomeTax.length} filed assessment year
              {f.incomeTax.length === 1 ? "" : "s"}.
            </p>
          </div>
          <CreditScoreMeter profile={f.creditProfile} />
        </div>

        <div>
          <SubHeading className="mb-1.5">Income tax filings</SubHeading>
          <RecordList>
            {f.incomeTax.map((record) => (
              <RecordItem
                key={record.assessmentYear}
                title={`AY ${record.assessmentYear}`}
                subtitle={
                  <>
                    Declared {formatCurrency(record.declaredIncome)} · tax paid{" "}
                    {formatCurrency(record.taxPaid)}
                    {record.filedOn && ` · filed ${formatDate(record.filedOn)}`}
                  </>
                }
                meta={<Badge variant={filingVariant[record.filingStatus]}>{record.filingStatus}</Badge>}
              />
            ))}
          </RecordList>
        </div>

        <div>
          <SubHeading className="mb-1.5">Bank accounts (masked)</SubHeading>
          <RecordList>
            {f.bankAccounts.map((account) => (
              <RecordItem
                key={account.id}
                title={account.bank}
                subtitle={
                  <>
                    <span className="font-mono">{account.maskedNumber}</span> · {account.type} ·{" "}
                    {account.branch} · opened {formatDate(account.openedOn)}
                  </>
                }
                meta={
                  <Badge variant={account.status === "Active" ? "success" : "neutral"}>
                    {account.status}
                  </Badge>
                }
              />
            ))}
          </RecordList>
        </div>

        <div>
          <SubHeading className="mb-1.5">Loans</SubHeading>
          {f.loans.length === 0 ? (
            <NoRecords>No loan account on file.</NoRecords>
          ) : (
            <RecordList>
              {f.loans.map((loan) => (
                <RecordItem
                  key={loan.id}
                  title={`${loan.type} — ${loan.lender}`}
                  subtitle={
                    <>
                      Sanctioned {formatCompactCurrency(loan.sanctionedAmount)} on{" "}
                      {formatDate(loan.sanctionedOn)} · outstanding{" "}
                      {formatCompactCurrency(loan.outstanding)}
                      {loan.emi > 0 && ` · EMI ${formatCurrency(loan.emi)}`}
                    </>
                  }
                  meta={<Badge variant={loanVariant[loan.status]}>{loan.status}</Badge>}
                />
              ))}
            </RecordList>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <SubHeading className="mb-1.5">Mutual funds</SubHeading>
            {f.mutualFunds.length === 0 ? (
              <NoRecords>No mutual fund holdings.</NoRecords>
            ) : (
              <RecordList>
                {f.mutualFunds.map((fund) => (
                  <RecordItem
                    key={fund.id}
                    title={fund.institution}
                    subtitle={
                      <>
                        <span className="font-mono">{fund.identifier}</span> · since{" "}
                        {formatDate(fund.startedOn)}
                      </>
                    }
                    meta={
                      <span className="text-sm font-semibold text-ink-900">
                        {formatCompactCurrency(fund.value)}
                      </span>
                    }
                  />
                ))}
              </RecordList>
            )}
          </div>

          <div>
            <SubHeading className="mb-1.5">Fixed deposits</SubHeading>
            {f.fixedDeposits.length === 0 ? (
              <NoRecords>No fixed deposits.</NoRecords>
            ) : (
              <RecordList>
                {f.fixedDeposits.map((fd) => (
                  <RecordItem
                    key={fd.id}
                    title={fd.institution}
                    subtitle={
                      <>
                        <span className="font-mono">{fd.identifier}</span>
                        {fd.maturityOn && ` · matures ${formatDate(fd.maturityOn)}`}
                      </>
                    }
                    meta={
                      <span className="text-sm font-semibold text-ink-900">
                        {formatCompactCurrency(fd.value)}
                      </span>
                    }
                  />
                ))}
              </RecordList>
            )}
          </div>
        </div>

        <div>
          <SubHeading className="mb-1.5">Insurance policies</SubHeading>
          {f.insurance.length === 0 ? (
            <NoRecords>No insurance policy on file.</NoRecords>
          ) : (
            <RecordList>
              {f.insurance.map((policy) => (
                <RecordItem
                  key={policy.id}
                  title={`${policy.type} — ${policy.insurer}`}
                  subtitle={
                    <>
                      <span className="font-mono">{policy.policyNumber}</span> · sum assured{" "}
                      {formatCompactCurrency(policy.sumAssured)} · premium{" "}
                      {formatCurrency(policy.annualPremium)}/yr · valid to{" "}
                      {formatDate(policy.validTill)}
                    </>
                  }
                  meta={
                    <Badge variant={policy.status === "Active" ? "success" : "danger"}>
                      {policy.status}
                    </Badge>
                  }
                />
              ))}
            </RecordList>
          )}
        </div>

        <div>
          <SubHeading className="mb-1.5">UPI handles</SubHeading>
          <div className="flex flex-wrap gap-2">
            {f.upiIds.map((upi) => (
              <span
                key={upi.handle}
                className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-canvas/60 px-2.5 py-1.5"
              >
                <span className="font-mono text-xs text-ink-900">{upi.handle}</span>
                <span className="text-[11px] text-ink-400">{upi.linkedBank}</span>
                <Badge variant={upi.status === "Active" ? "success" : "neutral"}>{upi.status}</Badge>
              </span>
            ))}
          </div>
        </div>
      </div>
    </ExpandableCard>
  );
}
