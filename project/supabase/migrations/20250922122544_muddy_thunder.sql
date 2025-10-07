/*
  # EduMosaic Database Schema

  1. New Tables
    - `profiles` - User profiles with roles (student, instructor, admin)
    - `courses` - Course information and metadata
    - `enrollments` - Student course enrollments
    - `course_sections` - Course syllabus sections
    - `categories` - Course categories

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
    - Secure course management for instructors
    - Student enrollment restrictions

  3. Storage
    - Create bucket for course images
    - Set up upload policies
*/

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type user_role as enum ('student', 'instructor', 'admin');
create type course_level as enum ('beginner', 'intermediate', 'advanced');
create type enrollment_status as enum ('active', 'completed', 'dropped');

-- Create categories table
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  description text,
  created_at timestamptz default now()
);

-- Create profiles table (extends auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  role user_role not null default 'student',
  bio text,
  avatar_url text,
  is_approved boolean default true, -- For instructor approval workflow
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create courses table
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text not null,
  short_description text,
  category_id uuid references categories(id),
  level course_level not null default 'beginner',
  price decimal(10,2) default 0,
  image_url text,
  preview_video_url text,
  instructor_id uuid references profiles(id) not null,
  is_published boolean default false,
  max_students integer,
  tags text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create course sections table
create table if not exists course_sections (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade not null,
  title text not null,
  content text not null,
  order_index integer not null,
  created_at timestamptz default now()
);

-- Create enrollments table
create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id) on delete cascade not null,
  course_id uuid references courses(id) on delete cascade not null,
  status enrollment_status default 'active',
  progress integer default 0 check (progress >= 0 and progress <= 100),
  enrolled_at timestamptz default now(),
  completed_at timestamptz,
  unique(student_id, course_id)
);

-- Enable Row Level Security
alter table categories enable row level security;
alter table profiles enable row level security;
alter table courses enable row level security;
alter table course_sections enable row level security;
alter table enrollments enable row level security;

-- Create storage bucket for course images
insert into storage.buckets (id, name, public) 
values ('course-images', 'course-images', true)
on conflict (id) do nothing;

-- Profiles policies
create policy "Public profiles are viewable by everyone" on profiles
  for select using (true);

create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

-- Categories policies (public read)
create policy "Categories are viewable by everyone" on categories
  for select using (true);

create policy "Only admins can manage categories" on categories
  for all using (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- Courses policies
create policy "Published courses are viewable by everyone" on courses
  for select using (is_published = true or instructor_id = auth.uid());

create policy "Instructors can manage their own courses" on courses
  for all using (instructor_id = auth.uid());

create policy "Admins can manage all courses" on courses
  for all using (
    exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- Course sections policies
create policy "Course sections viewable with course access" on course_sections
  for select using (
    exists (
      select 1 from courses c
      where c.id = course_sections.course_id 
      and (c.is_published = true or c.instructor_id = auth.uid())
    )
  );

create policy "Instructors can manage sections of their courses" on course_sections
  for all using (
    exists (
      select 1 from courses c
      where c.id = course_sections.course_id 
      and c.instructor_id = auth.uid()
    )
  );

-- Enrollments policies
create policy "Students can view their own enrollments" on enrollments
  for select using (student_id = auth.uid());

create policy "Students can enroll in published courses" on enrollments
  for insert with check (
    student_id = auth.uid() 
    and exists (
      select 1 from profiles 
      where id = auth.uid() and role = 'student'
    )
    and exists (
      select 1 from courses 
      where id = course_id and is_published = true
    )
  );

create policy "Students can update their own enrollment progress" on enrollments
  for update using (student_id = auth.uid());

create policy "Instructors can view enrollments for their courses" on enrollments
  for select using (
    exists (
      select 1 from courses c
      where c.id = enrollments.course_id 
      and c.instructor_id = auth.uid()
    )
  );

-- Storage policies
create policy "Course images are publicly accessible" on storage.objects
  for select using (bucket_id = 'course-images');

create policy "Instructors can upload course images" on storage.objects
  for insert with check (
    bucket_id = 'course-images'
    and exists (
      select 1 from profiles 
      where id = auth.uid() and role in ('instructor', 'admin')
    )
  );

-- Insert default categories
insert into categories (name, slug, description) values
  ('Web Development', 'web-development', 'Learn modern web technologies'),
  ('Data Science', 'data-science', 'Master data analysis and machine learning'),
  ('Mobile Development', 'mobile-development', 'Build iOS and Android apps'),
  ('Design', 'design', 'UI/UX and graphic design courses'),
  ('Business', 'business', 'Entrepreneurship and business skills'),
  ('Marketing', 'marketing', 'Digital marketing and growth strategies')
on conflict (slug) do nothing;

-- Create updated_at trigger function
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger handle_profiles_updated_at
  before update on profiles
  for each row execute procedure handle_updated_at();

create trigger handle_courses_updated_at
  before update on courses
  for each row execute procedure handle_updated_at();