# CareerForge Day 5 - The AI Trust Test

Product: FlashCart - AI-Generated Checkout Fix Review

Role: AI Engineering Review Owner

Core lesson:

> AI output is a proposal. Engineering trust requires verification.

## Why Day 5 Exists

Day 1 taught you to debug systems.

Day 2 taught you to reason about failures.

Day 3 taught you to verify readiness.

Day 4 taught you to reduce ambiguity before wrong execution.

Day 5 asks:

> Can you challenge confident AI recommendations before trusting production decisions?

## Scenario

FlashCart is preparing for a high-traffic product drop.

Past drops caused:

- paid orders for out-of-stock items
- negative inventory
- duplicate webhook processing
- abandoned checkout confusion
- support unable to explain inconsistent order states

Founder message:

> AI gave us a production fix plan. It sounds solid. Can we use this for v1?

Your job is not to hate the AI output. Your job is to decide what can be trusted, what must be modified, what must be blocked, and what still needs proof.

## Student Role

You are the AI Engineering Review Owner.

You own:

- AI recommendation review
- Trust / Modify / Block / Needs Proof classification
- concrete production failure reasoning
- recognition of useful AI ideas
- safer v1 plan
- founder-ready trust recommendation

## Provided To Solve The Case

- Student challenge brief
- FlashCart scenario package
- Assigned D5-A AI recommendation pack
- AI Trust Decision Brief template
- AI Judgment Defense Video guide

## Outcome Artifacts You Get

- AI Trust Decision Brief
- Trust / Modify / Block / Needs Proof classifications
- Safer engineering action plan
- AI Judgment Defense Video

## Materials

Use:

- [Student Challenge Brief](./student-instructions/student-challenge-brief.md)
- [FlashCart Scenario Package](./scenario-assets/flashcart-scenario-package.md)
- [D5-A AI Recommendation Pack](./variants/D5-A/ai-recommendation-pack.md)
- [AI Trust Decision Brief Template](./submission-templates/ai-trust-decision-brief-template.md)
- [AI Judgment Defense Video Guide](./submission-templates/ai-judgment-defense-video-guide.md)

## Submission Pack

Submit only:

1. AI Trust Decision Brief
2. [AI Recommendation Classification Matrix](./submission-templates/ai-recommendation-classification-matrix-template.md)
3. [Safer Engineering Action Plan](./submission-templates/safer-engineering-action-plan-template.md)
4. 3-minute AI Judgment Defense Video
5. Founder viva

No giant audit worksheet. No separate architecture essay. No anti-AI rant.

## Hard Fails

These fail:

> AI sounds right, so use it.

> AI is dangerous, reject everything.

> Use transactions, queues, and Redis for scalability.

Architecture terminology without causal reasoning is weak.

Blanket rejection is not maturity. Strong engineers identify what AI got usefully right, then bound it with evidence.

## Final Standard

Strong Day 5 work sounds like:

> This AI recommendation is partially useful, but unsafe as written because this exact production sequence can fail. I would modify it this way and require this evidence before trusting it.
