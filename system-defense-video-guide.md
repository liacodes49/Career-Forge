# Day 2 System Defense Video Guide

Maximum length: 4 minutes.

This is not a presentation.

This is a reasoning defense.

## Required Structure

## 0:00-0:20 - Identity And Variant

State:

- name
- variant ID
- one sentence summary of the incident

## 0:20-0:50 - Founder Assumption

Answer:

- What did the founder assume?
- Was it correct, partially correct, or misleading?

## 0:50-1:40 - Origin Failure Evidence

Show or cite:

- the strongest log evidence
- the strongest metric evidence
- one complaint/dashboard anomaly that could mislead someone

## 1:40-2:30 - Propagation Chain

Explain how the failure moved across the system.

Use clear cause-and-effect language.

Do not list services randomly.

## 2:30-3:20 - First 15-Minute Actions

Explain:

- what you would stabilize first
- why that reduces damage
- what you would intentionally delay

## 3:20-4:00 - AI / Assumption Verification

Explain:

- what AI, founder, or your first instinct suggested
- what evidence confirmed or rejected it
- what changed your mind

## Strong Video Signals

- cites exact evidence
- separates symptom from root cause
- names a rejected hypothesis
- explains tradeoff
- avoids architecture buzzword dumping
- defends what not to fix immediately

## Weak Video Signals

- "I think it is database/queue/cache" with no evidence
- generic "scale the system" answer
- no confidence level
- no rejected hypothesis
- no delayed action
- only repeats the brief
- uses AI-polished language without evidence ownership
