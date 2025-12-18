"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    )
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.replace('/admin/login')
        return
      }
      setEmail(data.session.user.email ?? null)
      setLoading(false)
    })
  }, [router])

  const signOut = async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    )
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  if (loading) return <div>Memuat…</div>

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard Admin</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">{email}</div>
          <button onClick={signOut} className="rounded bg-gray-200 px-3 py-1 text-sm">Keluar</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/events" className="rounded border bg-white p-4 hover:shadow">
          <div className="font-medium">Kelola Event</div>
          <div className="text-sm text-gray-600">Buat, ubah, aktif/nonaktif</div>
        </Link>
        <Link href="/admin/tools/import" className="rounded border bg-white p-4 hover:shadow">
          <div className="font-medium">Import Peserta (CSV)</div>
          <div className="text-sm text-gray-600">Tambahkan peserta secara massal</div>
        </Link>
        <Link href="/admin/tools/export" className="rounded border bg-white p-4 hover:shadow">
          <div className="font-medium">Export Kehadiran</div>
          <div className="text-sm text-gray-600">Unduh CSV log kehadiran</div>
        </Link>
      </div>

      <div className="text-sm text-gray-500">Halaman admin lainnya akan menyusul.</div>
    </main>
  )
}
