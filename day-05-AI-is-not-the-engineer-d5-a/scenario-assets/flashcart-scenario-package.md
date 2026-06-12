# FlashCart Scenario Package

## Startup Context

FlashCart is a D2C commerce startup that runs limited-time product drops.

During a drop, thousands of customers may try to buy the same SKU within minutes. Some SKUs have only 100-300 units.

## Previous Production Incidents

The last two drops created serious trust problems:

- inventory went negative during peak checkout
- two customers paid for the last unit
- payment webhooks were processed more than once
- abandoned checkouts made stock look inconsistent
- support could not explain whether an order was reserved, paid, expired, or failed
- founders had to publicly apologize for cancellations after payment

## Founder Pressure

Founder message:

> AI gave us a production fix plan. It sounds solid. Can we use this for v1?

The next drop is close. The founder wants a safer v1, not a six-month platform rewrite.

## Business Stakes

FlashCart must avoid:

- charging customers for unavailable items
- confirming orders twice
- letting inventory go negative
- locking inventory forever after abandoned checkout
- giving support no explanation
- adding architecture the small backend team cannot operate

## Current Simplified Flow

```text
Customer clicks Buy Now
-> backend creates payment session
-> customer completes gateway payment
-> gateway sends webhook
-> backend creates order
-> inventory is reduced
```

## Constraints

- relational database is available
- small backend team
- one-week v1 target
- payment gateway can send duplicate, delayed, or out-of-order events
- customers refresh and retry checkout
- queues are allowed only if justified
- caches are allowed only if they do not become checkout truth
- no full microservices rewrite

## Non-Negotiable Product Behavior

- never confirm an order unless inventory is actually available
- never reduce inventory twice for the same paid checkout
- expired or abandoned checkout must release inventory
- payment webhook handling must be idempotent
- customers and support need clear failure states
