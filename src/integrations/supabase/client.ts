import { createClient } from '@supabase/supabase-js';

// جلب الروابط والمفاتيح من بيئة العمل (Cloudflare Variables)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// التحقق من وجود المفاتيح لمنع توقف الموقع
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase configuration. Check your Cloudflare Environment Variables.");
}

// إنشاء وتصدير العميل لاستخدامه في صفحة اللوحة والدخول
export const supabase = createClient(
  supabaseUrl || '', 
  supabaseKey || ''
);
