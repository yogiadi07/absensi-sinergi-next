# File Structure Documentation: Absensi Sinergi Next

Dokumentasi ini menjelaskan struktur file dan folder dalam aplikasi Absensi Sinergi Next, dibagi berdasarkan bagian **Backend** dan **Frontend**, serta setiap halaman (page) yang ada.

## Overview Struktur
- **Framework**: Next.js dengan App Router
- **Frontend**: Halaman-halaman di `src/app/` (React components)
- **Backend**: API routes di `src/app/api/` (Server-side functions)
- **Komponen**: UI components di `src/components/`
- **Utilities**: Library dan helpers di `src/lib/`
- **Styling**: CSS di `src/styles/`

## Frontend (Pages & UI)

### Halaman Utama
- **`src/app/page.tsx`**  
  Halaman landing/home utama aplikasi. Menampilkan overview dan navigasi ke fitur utama.

- **`src/app/scan/page.tsx`**  
  Halaman untuk scan QR code peserta. Menggunakan kamera untuk validasi kehadiran.

### Halaman Admin
- **`src/app/admin/page.tsx`**  
  Dashboard admin untuk mengelola events, participants, dan pengaturan.

- **`src/app/admin/events/page.tsx`**  
  Halaman daftar events. Admin bisa create, edit, delete events.

- **`src/app/admin/events/[id]/page.tsx`**  
  Detail event tertentu. Menampilkan participants, pengaturan event, dan tools untuk kirim email/QR.

- **`src/app/admin/events/[id]/participants/page.tsx`**  
  Daftar participants dalam event. Admin bisa import, export, dan manage peserta.

- **`src/app/admin/events/[id]/scan/page.tsx`**  
  Halaman scan untuk admin, mungkin untuk validasi manual atau monitoring.

- **`src/app/admin/events/[id]/settings/page.tsx`**  
  Pengaturan event seperti nama, tanggal, deskripsi.

- **`src/app/admin/events/new/page.tsx`**  
  Form untuk membuat event baru.

- **`src/app/admin/settings/page.tsx`**  
  Pengaturan global aplikasi, seperti SMTP, WhatsApp API.

### Komponen UI
- **`src/components/Header.tsx`**  
  Header/navbar aplikasi dengan navigasi dan branding.

- **`src/components/ui/`**  
  Folder untuk komponen UI reusable (buttons, forms, dll.).

## Backend (API Routes)

### API Admin
- **`src/app/api/admin/events/route.ts`**  
  GET/POST untuk daftar events. Create new event.

- **`src/app/api/admin/events/[id]/route.ts`**  
  GET/PUT/DELETE untuk event spesifik.

- **`src/app/api/admin/events/[id]/participants/route.ts`**  
  GET/POST untuk participants dalam event. Import dari CSV, dll.

- **`src/app/api/admin/events/[id]/participants/send-email/route.ts`**  
  POST untuk kirim email QR ke participants.

- **`src/app/api/admin/events/[id]/scan/route.ts`**  
  POST untuk validasi scan QR (mark attendance).

- **`src/app/api/admin/events/[id]/export/route.ts`**  
  GET untuk export data participants ke CSV/PDF.

- **`src/app/api/admin/events/[id]/participants/[participantId]/route.ts`**  
  GET/PUT/DELETE untuk participant individual.

### API Umum
- **`src/app/api/scan/route.ts`** (jika ada)  
  Endpoint untuk scan QR dari frontend scan page.

## Utilities & Libraries

### Supabase Integration
- **`src/lib/supabase/`**  
  Folder untuk konfigurasi dan client Supabase.  
  - `server.ts`: Supabase client untuk server-side.  
  - `client.ts`: Supabase client untuk client-side.

### Email & Messaging
- **`src/lib/mailer.ts`**  
  Fungsi untuk kirim email via Gmail SMTP. Menggunakan nodemailer.

- **`src/lib/bulk-mailer.ts`** & **`src/lib/fast-bulk-mailer.ts`**  
  Utilities untuk kirim email massal/bulk.

### Lainnya
- **`src/lib/`**  
  - Berisi utilities lainnya seperti auth, helpers, dll.

- **`src/styles/globals.css`**  
  CSS global untuk styling aplikasi.

- **`src/types/`**  
  TypeScript type definitions.

## Database Schema
- **`supabase/schema.sql`**  
  Schema database Supabase (tables: events, participants, attendance, dll.).

## Catatan Penggunaan
- **Routing**: Menggunakan Next.js App Router, jadi setiap folder di `src/app/` adalah route.
- **Authentication**: Diasumsikan menggunakan Supabase Auth untuk admin access.
- **Deployment**: Deploy ke Vercel, dengan env vars untuk Supabase, Gmail, dll.

Untuk detail kode spesifik, buka file terkait di IDE. Jika ada perubahan struktur, update dokumentasi ini.
