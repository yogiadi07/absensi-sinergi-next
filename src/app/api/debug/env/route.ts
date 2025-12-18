import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const clientUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const clientAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const serverRole = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

  // Do NOT return secrets. Only return presence booleans and lengths.
  return NextResponse.json({
    ok: true,
    env: {
      NEXT_PUBLIC_SUPABASE_URL_present: !!clientUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY_present: !!clientAnon,
      SUPABASE_SERVICE_ROLE_KEY_present: !!serverRole,
      NEXT_PUBLIC_SITE_URL_present: !!siteUrl,
      // lengths help verify they are not empty strings at build/runtime
      NEXT_PUBLIC_SUPABASE_URL_len: clientUrl.length,
      NEXT_PUBLIC_SUPABASE_ANON_KEY_len: clientAnon.length,
      SUPABASE_SERVICE_ROLE_KEY_len: serverRole.length,
      NEXT_PUBLIC_SITE_URL_len: siteUrl.length,
    }
  })
}
