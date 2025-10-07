import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export type UserRole = 'student' | 'instructor' | 'admin';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type EnrollmentStatus = 'active' | 'completed' | 'dropped';

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  bio?: string;
  avatar_url?: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  category_id?: string;
  level: CourseLevel;
  price: number;
  image_url?: string;
  preview_video_url?: string;
  instructor_id: string;
  is_published: boolean;
  max_students?: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
  // Relationships
  instructor?: Profile;
  category?: Category;
  sections?: CourseSection[];
  enrollments?: Enrollment[];
  student_count?: number;
}

export interface CourseSection {
  id: string;
  course_id: string;
  title: string;
  content: string;
  order_index: number;
  created_at: string;
  material_url?: string; // PDF material public URL
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  status: EnrollmentStatus;
  progress: number;
  enrolled_at: string;
  completed_at?: string;
  // Relationships
  student?: Profile;
  course?: Course;
}