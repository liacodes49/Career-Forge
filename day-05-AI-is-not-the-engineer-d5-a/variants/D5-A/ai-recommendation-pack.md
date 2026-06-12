# D5-A AI Recommendation Pack - Inventory Reservation AI Plan

## Assigned Pack

Inventory Reservation AI Plan

## Founder Message

> AI gave us a production fix plan for inventory reservation. It sounds solid. Can we use this for v1?

## AI Recommendation 1 - Check Available Stock Before Payment

Before creating a payment session, query the product row and confirm `available_stock > 0`. If stock is available, create the payment session. This avoids sending customers to payment when the item is unavailable.

Suggested logic:

```pseudo
product = db.products.find(productId)
if product.available_stock <= 0:
  return OUT_OF_STOCK
paymentSession = gateway.createSession(productId, userId)
return paymentSession.url
```

## AI Recommendation 2 - Reserve Inventory When Payment Session Is Created

Create a `checkout_reservations` table and insert a reservation when payment starts. Store `expires_at` so abandoned checkouts can be released later. This gives the backend a clear temporary state before order confirmation.

Suggested fields:

- reservation_id
- user_id
- product_id
- payment_session_id
- status
- expires_at

## AI Recommendation 3 - Deduct Inventory Only After Payment Success

Do not reduce inventory until the payment gateway confirms payment. This prevents abandoned checkouts from blocking stock and ensures only real buyers consume inventory.

Suggested logic:

```pseudo
onPaymentSuccess(event):
  product.stock = product.stock - 1
  order.status = "paid"
```

## AI Recommendation 4 - Expire Reservations Every 15 Minutes

Run a background job every 15 minutes to expire old checkout reservations and release stock. This prevents abandoned checkouts from locking inventory forever.

## AI Recommendation 5 - Cache Available Stock For 60 Seconds

Cache product stock in Redis or memory for 60 seconds during drops. This reduces read load on the database and keeps product pages fast.

## AI Recommendation 6 - Allow Checkout If Cached Stock Shows Available

If cached stock shows availability, let the customer proceed to payment. The backend can reconcile stock after payment if cache was stale.

## AI Confidence Summary

This plan balances correctness and performance. Reservations prevent abandoned checkouts from consuming stock permanently, while caching keeps the drop experience fast. Deducting after payment ensures inventory only changes for real buyers.
