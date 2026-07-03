export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
};

export const hasApiBaseUrl = Boolean(env.apiBaseUrl);
export const hasStripeKey = Boolean(env.stripePublishableKey);
