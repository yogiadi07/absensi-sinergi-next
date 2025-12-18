import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Lazy initialize the Supabase admin client so that importing this module
// during Next.js build (when env vars may not be injected) does not throw.
let _admin: SupabaseClient | null = null

function ensureAdmin(): SupabaseClient {
  if (_admin) return _admin
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    // Return a lazy dummy client that throws only when a method is invoked.
    _admin = new Proxy({} as SupabaseClient, {
      get() {
        return () => {
          throw new Error('supabaseUrl is required.')
        }
      },
    })
    return _admin
  }
  _admin = createClient(url, key, { auth: { persistSession: false } })
  return _admin
}

// Export a proxy so existing code can keep calling supabaseAdmin.from(...)
export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    // Defer client creation until the returned member is actually invoked.
    return new Proxy(function () {}, {
      apply(_t, _thisArg, argArray) {
        const client = ensureAdmin()
        const fn = (client as any)[prop]
        if (typeof fn !== 'function') return fn
        return fn.apply(client, argArray)
      },
      get(_t, childProp) {
        const client = ensureAdmin()
        const value = (client as any)[prop]?.[childProp as any]
        return typeof value === 'function' ? value.bind((client as any)[prop]) : value
      },
    }) as any
  },
})
