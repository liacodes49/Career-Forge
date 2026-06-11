# D4-A Evidence Pack - Override Permission Ambiguity

## Assigned Packet

Override Permission Ambiguity

## Founder Message

> Recruiters need to override AI scores and manually shortlist candidates before the pilot. Add it quickly.

## Recruiter Message

> Sometimes the AI score is too strict. If I know a candidate is worth reviewing, I need a way to shortlist them manually.

## Engineering Note

> Manual override changes trust behavior. If anyone can override without a reason, we will not know why AI was bypassed.

## Ambiguous Requirement

"Recruiters can override AI scores."

Unclear:

- who is allowed to override
- whether override can happen for any candidate
- whether override reason is mandatory
- whether override should be logged
- whether AI score should remain visible

## Stakeholder Conflict

- Founder wants speed.
- Recruiter wants control.
- Engineering wants audit safety.
- Candidate fairness requires explanation.

## Incomplete Information

You do not know:

- whether all recruiters have the same permissions
- whether a manager approval exists
- whether reason text is required for pilot
- whether override is reversible

## AI Recommendation Trap

AI suggests:

> Build a complete override permissions module with admin roles, approval queues, audit dashboard, override analytics, bulk override, and notification triggers.

Why this is risky:

- too broad for pilot
- hides the key ambiguity behind feature volume
- may delay the demo
- does not answer whether v1 override is safe

## Misleading Assumptions

- "Manual override means anyone can shortlist anyone."
- "If a recruiter asks for control, no reason is needed."
- "Audit logging can wait."
- "A full role system is required before any safe v1 exists."
