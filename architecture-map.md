# Architecture Map

## Normal Flow

```text
Recruiter
  |
  v
Frontend Console
  |
  v
Backend API
  |
  v
Candidate Review Service
  |
  +--> PostgreSQL candidate_review_records
  |
  +--> Redis Status Cache
  |
  +--> Notification Queue
  |
  +--> Analytics Service
          |
          v
Hiring Report Dashboard
```

## Live Dashboard Reads

```text
Recruiter Dashboard
  |
  +--> Redis Status Cache
  |
  +--> PostgreSQL fallback
  |
  +--> Analytics aggregate counts
```

## Candidate Notification Flow

```text
Candidate Review Service
  |
  v
Notification Queue
  |
  v
Email / In-App Notification
```

## Failure Reasoning Reminder

When evidence conflicts, ask:

- Which component failed first?
- Which components only reacted to stale, late, missing, or duplicated state?
- Which symptoms hurt candidates?
- Which symptoms hurt recruiters?
- Which symptoms hurt reporting but can wait?
