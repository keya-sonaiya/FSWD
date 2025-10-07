import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
      <div className="fixed top-4 left-4 z-50">
        <Link to="/">
          <button className="bg-white rounded-full shadow p-2 hover:bg-blue-100 transition">
            <ArrowLeft className="h-6 w-6 text-blue-700" />
          </button>
        </Link>
      </div>
import React, { useState, useEffect } from 'react';

import { BookOpen, Users, DollarSign, TrendingUp, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { apiService } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import type { Course } from '../../lib/supabase';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const InstructorDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; courseId: string | null }>({
    isOpen: false,
    courseId: null,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const coursesData = await apiService.getInstructorCourses();
      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!deleteModal.courseId) return;

    try {
      await apiService.deleteCourse(deleteModal.courseId);
      setCourses(courses.filter(c => c.id !== deleteModal.courseId));
      toast.success('Course deleted successfully');
      setDeleteModal({ isOpen: false, courseId: null });
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete course');
    }
  };

  const toggleCoursePublication = async (courseId: string, currentStatus: boolean) => {
    try {
      const updatedCourse = await apiService.updateCourse(courseId, {
        is_published: !currentStatus,
      });
      setCourses(courses.map(c => c.id === courseId ? { ...c, is_published: !currentStatus } : c));
      toast.success(`Course ${!currentStatus ? 'published' : 'unpublished'} successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update course');
    }
  };

  const totalStudents = courses.reduce((sum, course) => sum + (course.student_count || 0), 0);
  const totalRevenue = courses.reduce((sum, course) => sum + (course.price * (course.student_count || 0)), 0);
  const publishedCourses = courses.filter(c => c.is_published).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {profile?.name}!
            </h1>
            <p className="text-gray-600 mt-2">Manage your courses and track your teaching impact.</p>
          </div>
          <Link to="/instructor/courses/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-lg p-3 mr-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                <p className="text-gray-600 text-sm">Total Courses</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="bg-green-100 rounded-lg p-3 mr-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                <p className="text-gray-600 text-sm">Total Students</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-lg p-3 mr-4">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{publishedCourses}</p>
                <p className="text-gray-600 text-sm">Published</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-lg p-3 mr-4">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(0)}</p>
                <p className="text-gray-600 text-sm">Total Revenue</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Courses Table */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse flex items-center space-x-4 py-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-500 mb-6">Create your first course to start teaching</p>
              <Link to="/instructor/courses/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Course
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={course.image_url || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg'}
                            alt={course.title}
                            className="w-12 h-12 object-cover rounded-lg mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{course.title}</div>
                            <div className="text-sm text-gray-500">{course.level} • {course.category?.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          course.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {course.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.student_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.price > 0 ? `$${course.price}` : 'Free'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link to={`/courses/${course.slug}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to={`/instructor/courses/${course.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCoursePublication(course.id, course.is_published)}
                        >
                          {course.is_published ? 'Unpublish' : 'Publish'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteModal({ isOpen: true, courseId: course.id })}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, courseId: null })}
        title="Delete Course"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this course? This action cannot be undone and will remove all student enrollments.
          </p>
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, courseId: null })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteCourse}>
              Delete Course
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InstructorDashboard;