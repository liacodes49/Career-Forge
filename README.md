# CareerForge Day 2 V2 - The System Behind The Bug

## Product: Candidate Review Ops Incident

## Core Lesson

Day 1 taught:

> Debug with evidence.

Day 2 teaches:

> Think in consequences.

On Day 1, you investigated a broken system.

On Day 2, you will investigate how one failure spreads across a product system and creates confusing symptoms in multiple places.

## Scenario

A startup hiring team is processing thousands of candidates before a hiring deadline.

The internal Candidate Review Ops Console is showing inconsistent behavior.

Recruiters and operators are reporting:

- recruiter actions not updating correctly
- duplicate shortlist actions
- notification delays
- candidate status mismatch
- dashboard lag
- analytics inconsistency

The founder says:

> "This looks like a notification or recruiter action issue. Fix that first."

Your job is to challenge that assumption with evidence.

## Student Role

You are the engineer asked to diagnose the incident and recommend what to stabilize first.

This is not a coding task.

This is not a system design essay.

This is an incident reasoning challenge.

## Mission

Use the provided evidence to produce a concise incident reasoning brief that proves:

- what likely failed first
- which issues are symptoms vs root cause
- how the failure propagated across the system
- what you would do in the first 15 minutes
- what you would intentionally delay
- what tradeoff you are accepting
- how you verified or rejected AI / founder assumptions

## Provided To Solve The Case

- Student task drop
- System overview
- Architecture map
- Startup context
- Business constraints
- Incident timeline
- Team roles
- Assigned D2-A evidence pack

## Outcome Artifacts You Get

- Failure Propagation Analysis
- Incident Reasoning Brief
- Incident Prioritization Artifact
- Systems Defense Video

## Files Provided

Read the shared scenario package:

- [Student Task Drop](./student-instructions/student-task-drop.md)
- [System Overview](./student-instructions/system-overview.md)
- [Architecture Map](./student-instructions/architecture-map.md)
- [Startup Context](./student-instructions/startup-context.md)
- [Business Constraints](./student-instructions/business-constraints.md)
- [Incident Timeline](./student-instructions/incident-timeline.md)
- [Team Roles](./student-instructions/team-roles.md)

Then read your assigned evidence pack:

- [D2-A Evidence Pack](./variants/D2-A/evidence-pack.md)

Do not assume another student's evidence is your evidence.

## Final Student Submission Pack

Submit only:

1. Incident Reasoning Brief
2. 4-minute System Defense Video
3. Live Founder Viva, if scheduled

Use:

- [Incident Reasoning Brief Template](./submission-templates/incident-reasoning-brief-template.md)
- [Failure Propagation Analysis Template](./submission-templates/failure-propagation-analysis-template.md)
- [Incident Prioritization Artifact Template](./submission-templates/incident-prioritization-artifact-template.md)
- [Defense Video Instructions](./submission-templates/system-defense-video-guide.md)
- [Submission Guide](./student-instructions/submission-guide.md)

## Rules

- Every claim must connect to evidence.
- You must separate root cause from downstream symptoms.
- You must evaluate at least two competing hypotheses.
- You must give confidence level for your origin failure.
- You must explain what to fix first and what to delay.
- You must explain tradeoffs.
- AI is allowed, but AI / founder assumptions must be verified.

## Buzzword Penalty

Architecture buzzwords without evidence reduce your score.

Weak answers:

- "scale database"
- "use microservices"
- "fix queue"
- "add caching"
- "use Kubernetes"

Strong answers explain:

- what evidence supports the diagnosis
- why one symptom is downstream
- what action reduces harm first
- what risk remains after that action

## Pass Standard

Strong Pass:

- identifies the likely origin failure
- uses evidence precisely
- separates symptoms from root cause
- explains propagation clearly
- prioritizes business/user harm
- defends tradeoffs under pressure
- challenges shallow AI/founder assumptions

Revision Required:

- plausible root cause but weak evidence
- decent chain but poor prioritization
- generic AI/system language
- no clear delayed-work reasoning

Incomplete:

- generic architecture essay
- no evidence ownership
- treats first visible symptom as root cause
- cannot defend priorities live

## Day 2 Closing Realization

You should finish Day 2 thinking:

> "A bug is not isolated. One failure can poison an entire product flow."
