# HireSignal Scenario Package

## Startup Context

HireSignal is preparing a recruiter pilot.

The product helps recruiters review candidates, run AI resume analysis, see scores/signals, and update candidate status.

After readiness checks, the founder wants one more change before the pilot.

## Founder Urgency

Founder message:

> Recruiters need to override AI scores and manually shortlist candidates before the pilot. Add it quickly.

The founder is not trying to be careless. They are under pressure and compressing the requirement into one sentence.

That is exactly why the request is dangerous.

## Recruiter Pressure

Recruiters want control because:

- AI score may miss context
- some candidates are referred by hiring managers
- pilot users do not want to feel trapped by automation
- manual shortlist is expected in real recruiting workflows

## Engineering Concerns

Engineering is worried about:

- who is allowed to override
- whether a reason is required
- whether the override should be logged
- whether candidate fairness is affected
- whether the dashboard will show AI score vs manual decision clearly
- whether this can be built safely before the pilot

## Business Constraints

- No big redesign before the pilot.
- No full admin permissions system.
- No complex audit dashboard.
- Minimal safe v1 is acceptable.
- Blocking is acceptable if risk is not clarified.
- Conditional proceed is acceptable if scope and risk are explicit.

## Conflicting Stakeholder Signals

Founder:

> We need this quickly so the recruiter feels in control.

Recruiter:

> I need to shortlist a candidate even if the AI score is low.

Engineering:

> If we let anyone override anything without a reason, we may create trust and audit problems.

Candidate fairness concern:

> Manual override can be useful, but unexplained override can look arbitrary.

## AI-Generated Unsafe Recommendation

AI suggests:

> Build a full recruiter override management module with role-based permissions, approval workflow, audit dashboard, candidate notification system, bulk override support, and analytics.

This sounds professional. It is unsafe for the current context.

Your job is to decide what is minimal, safe, and clear enough for the pilot.
