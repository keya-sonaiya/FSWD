
import { supabase } from './supabase';
import type { Course, CourseSection } from './supabase';

export interface CourseFilters {
  search?: string;
  category?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

class ApiService {

    // Section Material Upload
  async uploadSectionMaterial(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `section-materials/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('section-materials')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('section-materials')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
  // Courses
  async getCourses(filters: CourseFilters = {}) {
    let query = supabase
      .from('courses')
      .select(`
        *,
        instructor:profiles!courses_instructor_id_fkey(id, name, avatar_url, bio),
        category:categories(id, name, slug),
        enrollments(id)
      `)
      .eq('is_published', true);

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters.category) {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', filters.category)
        .single();
      
      if (categoryData) {
        query = query.eq('category_id', categoryData.id);
      }
    }

    if (filters.level) {
      query = query.eq('level', filters.level);
    }

    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    // First get the count
    const { count } = await query;
    
    // Then get the data with pagination
    const from = ((filters.page || 1) - 1) * (filters.limit || 12);
    const to = from + (filters.limit || 12) - 1;
    
    const { data, error } = await query
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      courses: data?.map(course => ({
        ...course,
        student_count: course.enrollments?.length || 0,
      })),
      total: count || 0,
    };
  }

  async getCourse(slug: string) {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:profiles!courses_instructor_id_fkey(id, name, avatar_url, bio),
        category:categories(id, name, slug),
        sections:course_sections(id, title, content, order_index),
        enrollments(id, student_id)
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) throw error;

    return {
      ...data,
      student_count: data.enrollments?.length || 0,
      sections: data.sections?.sort((a: CourseSection, b: CourseSection) => a.order_index - b.order_index),
    };
  }

  async getInstructorCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        category:categories(id, name, slug),
        enrollments(id)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(course => ({
      ...course,
      student_count: course.enrollments?.length || 0,
    }));
  }

  async createCourse(courseData: {
    title: string;
    description: string;
    short_description?: string;
    category_id?: string;
    level: string;
    price?: number;
    instructor_id: string;
    image_url?: string;
    preview_video_url?: string;
    tags?: string[];
  }) {
    // Generate slug from title
    const slug = courseData.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    const { data, error } = await supabase
      .from('courses')
      .insert({
        ...courseData,
        slug,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCourse(id: string, updates: Partial<Course>) {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteCourse(id: string) {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Course Sections
  async createCourseSection(sectionData: {
    course_id: string;
    title: string;
    content: string;
    order_index: number;
  }) {
    const { data, error } = await supabase
      .from('course_sections')
      .insert(sectionData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCourseSection(id: string, updates: Partial<CourseSection>) {
    const { data, error } = await supabase
      .from('course_sections')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteCourseSection(id: string) {
    const { error } = await supabase
      .from('course_sections')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Enrollments
  async enrollInCourse(courseId: string) {
    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        course_id: courseId,
        student_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getStudentEnrollments() {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        course:courses(
          id, title, slug, short_description, image_url, level,
          instructor:profiles!courses_instructor_id_fkey(name)
        )
      `)
      .eq('status', 'active')
      .order('enrolled_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getCourseEnrollments(courseId: string) {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        student:profiles!enrollments_student_id_fkey(id, name, avatar_url)
      `)
      .eq('course_id', courseId)
      .order('enrolled_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateEnrollmentProgress(id: string, progress: number) {
    const { data, error } = await supabase
      .from('enrollments')
      .update({ progress })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }

  // File Upload
  async uploadCourseImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `course-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('course-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('course-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
}

export const apiService = new ApiService();