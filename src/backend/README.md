# Backend required for live product

This frontend is now wired to real endpoints and does not rely on mock data.
To make the product actually live, your backend must implement these routes:

## Auth
Frontend uses Supabase Auth access tokens in `Authorization: Bearer <token>`.
Backend must verify the JWT and resolve the user + organization.

## Required endpoints

### Health
- `GET /health`
- Response:
```json
{ "status": "ok", "service": "voiceplatform-api", "version": "1.0.0" }
```

### Dashboard summary
- `GET /dashboard/summary`
- Response:
```json
{
  "organization": { "id": "org_1", "name": "Acme", "slug": "acme", "plan": "pro" },
  "user": { "id": "user_1", "email": "owner@acme.com" },
  "apiKeys": [
    {
      "id": "key_1",
      "name": "Default",
      "key_preview": "vk_live_****abcd",
      "created_at": "2026-01-01T00:00:00Z",
      "last_used_at": null
    }
  ],
  "usage": {
    "minutes_used": 12,
    "minutes_included": 500,
    "sessions_count": 4
  },
  "recentSessions": [
    {
      "id": "sess_1",
      "transcript": "Customer requested a callback.",
      "status": "completed",
      "created_at": "2026-01-01T00:00:00Z"
    }
  ],
  "leads": [
    {
      "id": "lead_1",
      "name": "Jordan Lee",
      "phone": "+15550000000",
      "status": "new",
      "created_at": "2026-01-01T00:00:00Z"
    }
  ]
}
```

### Create API key
- `POST /dashboard/api-keys`
- Request:
```json
{ "name": "Server key" }
```
- Response:
```json
{
  "id": "key_2",
  "name": "Server key",
  "key": "vk_live_secret_full_value",
  "key_preview": "vk_live_****wxyz",
  "created_at": "2026-01-01T00:00:00Z"
}
```

### Create CRM lead
- `POST /dashboard/crm/leads`
- Request:
```json
{ "name": "Jordan Lee", "phone": "+15550000000" }
```
- Response:
```json
{
  "id": "lead_2",
  "name": "Jordan Lee",
  "phone": "+15550000000",
  "status": "new",
  "created_at": "2026-01-01T00:00:00Z"
}
```

### Stripe checkout
- `POST /billing/create-checkout-session`
- Request:
```json
{ "plan": "pro" }
```
- Response:
```json
{ "checkoutUrl": "https://checkout.stripe.com/..." }
```

## Environment variables expected by frontend
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE_URL`
- `VITE_STRIPE_PUBLISHABLE_KEY`
