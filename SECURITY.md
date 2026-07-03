# Security

- Admin panel is protected by a 6-digit PIN (changeable in-app or via `ADMIN_PIN` constant)
- API keys stored in `localStorage` under `vocalizeai_frontier_keys` — never sent anywhere except the cloud provider endpoints you configure
- No telemetry, analytics, or external tracking
- Supabase and Stripe credentials are environment-controlled and gitignored
- All browser APIs (microphone, speech) require explicit user permission

## Reporting

Open an issue for any security concerns.
