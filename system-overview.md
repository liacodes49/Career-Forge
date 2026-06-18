# System Overview

## Product

Candidate Review Ops Console

## What The System Does

The startup hiring team uses this internal console to process student candidates before an interview shortlist deadline.

Recruiters use the console to:

- load candidate review queues
- mark candidates as reviewed
- shortlist or hold candidates
- trigger candidate status updates
- send notifications
- view review progress dashboards
- export analytics for the hiring lead

## Normal Candidate Review Flow

1. Recruiter opens Candidate Review Ops Console.
2. Frontend calls Backend API.
3. Backend API sends review actions to Candidate Review Service.
4. Candidate Review Service writes status changes to PostgreSQL.
5. Redis stores short-lived candidate status for fast dashboard reads.
6. Notification Queue sends candidate and recruiter notifications.
7. Recruiter Dashboard shows live review progress.
8. Analytics Service records review events and shortlist counts.

## Services

## Frontend Console

Internal recruiter-facing UI for review queue, candidate status, shortlist actions, and dashboard summaries.

## Backend API

Main API layer that receives recruiter actions and routes requests to internal services.

## Candidate Review Service

Owns review actions, candidate status transitions, and shortlist decisions.

## PostgreSQL Database

Source of truth for candidate review records, status transitions, and shortlist state.

## Redis Status Cache

Stores temporary candidate status for fast UI and dashboard reads.

## Notification Queue

Queues email/in-app notifications for candidates, recruiters, and hiring operations.

## Recruiter Dashboard

Shows live review progress, shortlist counts, pending review volume, and status mismatch warnings.

## Analytics Service

Receives review and notification events for hiring deadline reports.

## Important System Truth

The first visible symptom is not always the origin failure.

The student must identify whether recruiter actions, notifications, cache, database, dashboard, or analytics are root cause or downstream effect.
