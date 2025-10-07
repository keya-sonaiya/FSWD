import { Link } from 'react-router-dom';
      <div className="fixed top-4 left-4 z-50">
        <Link to="/">
          <button className="bg-white rounded-full shadow p-2 hover:bg-blue-100 transition">
            <ArrowLeft className="h-6 w-6 text-blue-700" />
          </button>
        </Link>
      </div>
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Upload, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import type { Category } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  short_description: z.string().optional(),
  category_id: z.string().min(1, 'Category is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  price: z.number().min(0, 'Price must be 0 or greater'),
  preview_video_url: z.string().optional(),
  tags: z.string().optional(),
  sections: z.array(z.object({
    title: z.string().min(1, 'Section title is required'),
    content: z.string().min(1, 'Section content is required'),
    material: z.any().optional(), // PDF file
  })),
});

type CourseFormData = z.infer<typeof courseSchema>;

const CreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      sections: [{ title: '', content: '' }],
      price: 0,
      level: 'beginner',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sections',
  });

  // Handle PDF upload for each section
  const handleMaterialChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(`sections.${index}.material`, file);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await apiService.getCategories();
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CourseFormData) => {
    try {
      setLoading(true);

      if (!user?.id) {
        toast.error('You must be logged in to create a course');
        return;
      }

      let imageUrl = '';
      if (imageFile) {
        imageUrl = await apiService.uploadCourseImage(imageFile);
      }

      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()) : [];

      const courseData = {
        title: data.title,
        description: data.description,
        short_description: data.short_description || '',
        category_id: data.category_id,
        level: data.level,
        price: data.price,
        instructor_id: user.id,
        image_url: imageUrl,
        preview_video_url: data.preview_video_url || '',
        tags,
      };

      const course = await apiService.createCourse(courseData);

      // Create course sections
      for (let i = 0; i < data.sections.length; i++) {
        const section = data.sections[i];
        await apiService.createCourseSection({
          course_id: course.id,
          title: section.title,
          content: section.content,
          order_index: i,
        });
      }

      toast.success('Course created successfully!');
      navigate('/instructor/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/instructor/dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-600 mt-2">Share your knowledge with eager learners around the world.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Course Title"
                  {...register('title')}
                  error={errors.title?.message}
                  placeholder="e.g., Complete React.js Developer Course"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  {...register('category_id')}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.category_id ? 'border-red-300' : ''
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  {...register('level')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <Input
                  label="Price ($)"
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  error={errors.price?.message}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Input
                  label="Tags (comma separated)"
                  {...register('tags')}
                  placeholder="React, JavaScript, Frontend"
                />
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Description</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <textarea
                  {...register('short_description')}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="A brief summary of your course (displayed on course cards)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description
                </label>
                <textarea
                  {...register('description')}
                  rows={6}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? 'border-red-300' : ''
                  }`}
                  placeholder="Detailed course description, learning outcomes, prerequisites..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <Input
                  label="Preview Video URL (optional)"
                  {...register('preview_video_url')}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>
          </Card>

          {/* Course Image */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Image</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Thumbnail
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Course Sections */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Course Curriculum</h2>
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ title: '', content: '' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>

            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Section {index + 1}</h3>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <Input
                      label="Section Title"
                      {...register(`sections.${index}.title`)}
                      error={errors.sections?.[index]?.title?.message}
                      placeholder="e.g., Introduction to React Hooks"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section Content
                      </label>
                      <textarea
                        {...register(`sections.${index}.content`)}
                        rows={4}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.sections?.[index]?.content ? 'border-red-300' : ''
                        }`}
                        placeholder="Describe what students will learn in this section..."
                      />
                      {errors.sections?.[index]?.content && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.sections[index]?.content?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PDF Material (optional)
                      </label>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={e => handleMaterialChange(e, index)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Upload a PDF for students to download with this section.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/instructor/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} size="lg">
              Create Course
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;