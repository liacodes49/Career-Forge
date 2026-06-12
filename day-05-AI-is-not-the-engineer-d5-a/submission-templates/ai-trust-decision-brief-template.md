# AI Trust Decision Brief

Student:

Assigned pack:

## 1. Problem Summary

In 4-6 lines, explain the FlashCart production problem and what the AI plan is trying to fix.

## 2. AI Recommendation Decision Table

Classify each recommendation.

Allowed decisions:

- Trust
- Modify
- Block
- Needs Proof

| # | AI Recommendation | Decision | Why | Concrete Failure If Wrong | Safer Action / Evidence Needed |
|---|---|---|---|---|---|
| | | | | | |
| | | | | | |
| | | | | | |
| | | | | | |
| | | | | | |
| | | | | | |

## 3. Most Dangerous Recommendation

Which recommendation is most dangerous?

Why did it sound correct?

What exact failure sequence could it cause?

Write it as a timeline:

```text
First:
Then:
Then:
Production breaks because:
Customer/support impact:
```

What would you do instead?

## 4. Useful But Incomplete Recommendation

Which recommendation had a useful idea?

What was useful?

What was missing before it could be trusted?

How would you modify it?

## 5. One Recommendation Trusted For V1

Which recommendation can be trusted or mostly trusted?

Why is it safe enough?

What boundary must remain true?

## 6. Safer V1 Plan

Describe your safer v1.

Include:

- inventory ownership
- checkout/reservation state
- payment state
- order confirmation rule
- duplicate/retry handling
- expiration/release behavior
- customer/support failure state

## 7. State / Side Effect Protection

Answer directly.

What exact state or side effect must not happen twice?

What exact transition must be protected?

What key, constraint, transaction, state check, or idempotency rule protects it?

What breaks if two requests/events hit this transition at the same time?

## 8. What Not To Build

List scope you are rejecting for v1.

| Not In V1 | Why Not Now | Risk Of Building It Now |
|---|---|---|
| | | |
| | | |
| | | |

## 9. Evidence Needed Before Trust

What proof would you require before implementing or shipping the risky parts?

| Claim | Evidence Needed |
|---|---|
| | |
| | |
| | |

## 10. Final Founder Recommendation

Choose one:

- Use AI plan mostly as-is
- Use modified AI plan
- Block AI plan and replace with safer v1
- Needs more proof before decision

Decision:

Founder update:

```text

```

## 11. Final One-Liner

Complete:

AI sounded correct, but it missed ________, so I changed the design to ________.
