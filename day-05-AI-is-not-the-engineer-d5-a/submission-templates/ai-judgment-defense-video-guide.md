# 3-Minute AI Judgment Defense Video

Maximum length: 3 minutes.

This is not a report reading. This is your engineering trust defense.

## Required Structure

### 0:00-0:30 - Decision

State:

- assigned pack
- final recommendation to founder
- one-sentence reason

### 0:30-1:20 - Most Dangerous AI Recommendation

Explain:

- which recommendation was most dangerous
- why it sounded correct
- why a junior engineer might trust it

### 1:20-2:05 - Concrete Failure

Explain the exact production failure it could cause.

Avoid vague words like "scalability issue." Name the sequence.

Use timeline language:

```text
First...
Then...
Then production breaks because...
The customer/support impact is...
```

### 2:05-2:40 - Safer Alternative

Explain what you would do instead and what evidence you need before trust.

### 2:40-3:00 - What AI Got Right

Name one useful AI idea and how you would safely bound it.

## Strong Video

- defends judgment with causal reasoning
- accepts at least one useful AI idea
- names concrete production failure
- explains safer v1 clearly
- avoids jargon theater

## Weak Video

- says AI is wrong generally
- rejects everything
- trusts AI because it sounds confident
- uses terms like queue, Redis, transaction, microservices without explaining why
- cannot name the failure sequence
