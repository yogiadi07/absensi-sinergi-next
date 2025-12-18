import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

function ensureClient(): SupabaseClient {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) {
    // Return a lazy dummy client that throws only when method is invoked
    _client = new Proxy({} as SupabaseClient, {
      get() {
        return () => {
          throw new Error('supabaseUrl is required.')
        }
      },
    })
    return _client
  }
  _client = createClient(url, anon)
  return _client
}

export const supabaseClient: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    // Avoid initializing on the server during prerender
    if (typeof window === 'undefined') {
      return () => {
        throw new Error('Supabase client is not available during SSR.')
      }
    }
    const client = ensureClient()
    const value = (client as any)[prop]
    return typeof value === 'function' ? value.bind(client) : value
  },
})
