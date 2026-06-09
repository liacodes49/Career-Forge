# D2-A Evidence Pack - Database Write Latency

## Variant ID

D2-A

## Founder Message

> Recruiters are saying shortlist actions are delayed and candidates are not getting notifications. This looks like a notification or recruiter action issue. Fix that first.

## Recruiter Complaints

1. "I clicked Shortlist, but the candidate stayed Pending for almost a minute."
2. "I clicked again because I thought the action did not save. Now the candidate appears twice in my shortlist count."
3. "The dashboard says 42 candidates shortlisted, but my review queue shows fewer."
4. "Candidate status changes appear late after refresh."

## Candidate / Support Complaints

1. "I got a shortlisted email, but the portal still says Under Review."
2. "My friend got a status update immediately, but mine came late."
3. "Support cannot tell if my status is final."

## Metrics Snapshot

## Review Traffic

Normal review actions:
- 90 actions/minute

Current review actions:
- 510 actions/minute

## PostgreSQL

Normal candidate status write latency:
- 80ms to 250ms

Current candidate status write latency:
- 3.5s to 7.8s

## Recruiter Action Retry Rate

Normal:
- 1.5%

Current:
- 13.6%

## Duplicate Shortlist Reports

Normal:
- 1-2 reports/hour

Current:
- 39 reports/hour

## Notification Queue

Normal delay:
- 5s to 20s

Current delay:
- 70s to 150s

## Dashboard Lag

Normal:
- under 5 seconds

Current:
- 1min to 4min

## Analytics Mismatch

Shortlist events without matching committed status:
- 16% of current window

## System Logs

```text
[10:01:02] INFO Review traffic spike detected source=hiring_deadline
[10:01:08] INFO POST /candidate/c_2209/shortlist recruiter_id=r_14
[10:01:09] INFO Shortlist action accepted action_temp_id=act_9121
[10:01:10] WARN DB write latency high table=candidate_status duration_ms=5100
[10:01:12] INFO Notification event requested candidate_id=c_2209 status=shortlisted
[10:01:13] WARN Candidate status record not committed yet candidate_id=c_2209
[10:01:14] WARN Recruiter action retry started action_temp_id=act_9121
[10:01:16] ERROR Duplicate shortlist action suspected candidate_id=c_2209 recruiter_id=r_14
[10:01:19] INFO Candidate status committed candidate_id=c_2209 status=shortlisted
[10:01:20] WARN Redis status mismatch candidate_id=c_2209 cache_status=shortlisted db_status=pending_commit
[10:01:22] WARN Notification queue delay: 132 seconds
[10:01:23] WARN Recruiter dashboard sync delayed candidate_id=c_2209
[10:01:29] INFO Analytics event received shortlist_clicked candidate_id=c_2209
[10:01:30] WARN Analytics missing matching candidate_status_committed event candidate_id=c_2209
```

## Dashboard Anomalies

- Shortlist count jumps up before database status catches up.
- Recruiter progress bar lags behind action clicks.
- Candidate status occasionally shows `Pending Commit`.
- Analytics shows more shortlist click events than committed shortlisted candidates.

## Misleading Evidence

- Notification delay is visible and noisy.
- Duplicate shortlist actions look like recruiter double-click behavior.
- Dashboard lag makes the UI look broken.

## Alternate Plausible Hypotheses

1. Notification queue is root cause.
2. Recruiters are double-clicking actions.
3. Dashboard cache is stale.

## Student Reasoning Challenge

Decide whether those hypotheses are root causes or downstream symptoms.
