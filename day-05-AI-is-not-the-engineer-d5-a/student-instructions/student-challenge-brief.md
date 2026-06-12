# Day 5 Student Challenge Brief

## Day 5 - The AI Trust Test

You are the AI Engineering Review Owner for FlashCart.

The founder has a polished AI-generated checkout fix plan. It sounds senior. It uses real engineering language. Some of it is useful.

Some of it can damage production.

## Your Mission

Decide what can be trusted for v1.

You must:

1. read the FlashCart scenario
2. read your assigned AI recommendation pack
3. classify recommendations as `Trust`, `Modify`, `Block`, or `Needs Proof`
4. explain concrete production failures behind unsafe recommendations
5. identify what AI got usefully right
6. define a safer v1 plan
7. state what evidence is needed before trusting risky recommendations
8. defend your judgment in a short video and founder viva

## What This Is Not

This is not an AI hate exercise.

This is not prompt engineering.

This is not a trivia test.

The goal is not to reject AI. The goal is to verify before trust.

## Nuance Requirement

You must demonstrate balanced engineering judgment.

Blanket rejection is weak. Blind trust is weak.

Your submission must identify at least one AI recommendation that is useful enough to trust or mostly trust with a clear boundary. If you reject everything, you must defend why every single recommendation is unsafe as written. Generic "AI can be wrong" reasoning will fail.

## Strong Work

Strong work:

- accepts useful AI ideas with boundaries
- modifies incomplete AI recommendations
- blocks recommendations that cause concrete production failure
- explains exact failure sequences
- separates payment truth from fulfillment truth
- defines idempotency behavior, not just the word
- avoids buzzword architecture
- owns a safer v1 decision
- explains the exact state or side effect that must not happen twice

## Weak Work

Weak work:

- trusts AI because it sounds professional
- rejects every AI recommendation generically
- says "use transactions" without naming protected state
- says "use queue" without explaining duplicate/out-of-order behavior
- says "use Redis" without explaining source of truth
- proposes microservices as a reflex
- gives no customer/support failure behavior
- uses architecture terms without explaining the failure timeline

## Submission

Submit:

1. AI Trust Decision Brief
2. 3-minute AI Judgment Defense Video
3. Live founder viva
