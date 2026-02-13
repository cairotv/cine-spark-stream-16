-- تمكين UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- جدول الملفات الشخصية (يمتد من auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "المستخدم يرى ملفه فقط" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "المستخدم يحدث ملفه فقط" ON profiles FOR UPDATE USING (auth.uid() = id);

-- جدول الأفلام
CREATE TABLE movies (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  arabic_title TEXT,
  overview TEXT,
  ai_summary TEXT,
  rating_color TEXT DEFAULT 'yellow',
  genres JSONB,
  release_date DATE,
  poster_path TEXT,
  backdrop_path TEXT,
  custom_embed_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "الجميع يرى الأفلام" ON movies FOR SELECT USING (true);
CREATE POLICY "فقط المشرف يعدل الأفلام" ON movies FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
CREATE POLICY "فقط المشرف يضيف أفلاماً" ON movies FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- جدول المسلسلات
CREATE TABLE tv_series (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  arabic_name TEXT,
  overview TEXT,
  ai_summary TEXT,
  rating_color TEXT DEFAULT 'yellow',
  genres JSONB,
  first_air_date DATE,
  poster_path TEXT,
  backdrop_path TEXT,
  custom_embed_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE tv_series ENABLE ROW LEVEL SECURITY;
CREATE POLICY "الجميع يرى المسلسلات" ON tv_series FOR SELECT USING (true);
CREATE POLICY "فقط المشرف يعدل المسلسلات" ON tv_series FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
CREATE POLICY "فقط المشرف يضيف مسلسلات" ON tv_series FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- جدول المواسم
CREATE TABLE seasons (
  id BIGINT PRIMARY KEY,
  series_id BIGINT REFERENCES tv_series(id) ON DELETE CASCADE,
  season_number INTEGER NOT NULL,
  name TEXT,
  overview TEXT,
  poster_path TEXT,
  air_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(series_id, season_number)
);
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "الجميع يرى المواسم" ON seasons FOR SELECT USING (true);

-- جدول الحلقات
CREATE TABLE episodes (
  id BIGINT PRIMARY KEY,
  season_id BIGINT REFERENCES seasons(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  name TEXT,
  overview TEXT,
  still_path TEXT,
  air_date DATE,
  embed_urls JSONB,
  download_links JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(season_id, episode_number)
);
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "الجميع يرى الحلقات" ON episodes FOR SELECT USING (true);

-- جدول المفضلة
CREATE TABLE watchlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id BIGINT NOT NULL,
  content_type TEXT CHECK (content_type IN ('movie', 'tv')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_id, content_type)
);
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "المستخدم يدير مفضلته" ON watchlist FOR ALL USING (auth.uid() = user_id);

-- جدول متابعة المشاهدة
CREATE TABLE continue_watching (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id BIGINT NOT NULL,
  content_type TEXT CHECK (content_type IN ('movie', 'tv')),
  season_number INTEGER,
  episode_number INTEGER,
  progress_seconds INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_id, content_type, season_number, episode_number)
);
ALTER TABLE continue_watching ENABLE ROW LEVEL SECURITY;
CREATE POLICY "المستخدم يدير متابعاته" ON continue_watching FOR ALL USING (auth.uid() = user_id);

-- جدول سجل المشاهدة
CREATE TABLE history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id BIGINT NOT NULL,
  content_type TEXT CHECK (content_type IN ('movie', 'tv')),
  season_number INTEGER,
  episode_number INTEGER,
  watched_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "المستخدم يرى سجله" ON history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "المستخدم يضيف لسجله" ON history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- إنشاء حساب المشرف (يتم بعد إنشاء المستخدم عبر Supabase Auth)
-- سنقوم بإنشاء دالة أو استخدام Supabase Dashboard يدوياً
-- لكن سنضيف شرطاً: عند تسجيل المستخدم بالبريد admin@cinma.online يصبح مشرفاً
-- يمكن تنفيذ هذا عبر trigger لاحقاً.