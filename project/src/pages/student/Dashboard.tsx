
import { ArrowLeft } from 'lucide-react';
      <div className="fixed top-4 left-4 z-50">
        <Link to="/">
          <button className="bg-white rounded-full shadow p-2 hover:bg-blue-100 transition">
            <ArrowLeft className="h-6 w-6 text-blue-700" />
          </button>
        </Link>
      </div>
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, TrendingUp, Play } from 'lucide-react';
import { apiService } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import type { Enrollment } from '../../lib/supabase';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const StudentDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const enrollmentsData = await apiService.getStudentEnrollments();
      setEnrollments(enrollmentsData || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const completedCourses = enrollments.filter(e => e.progress === 100).length;
  const inProgressCourses = enrollments.filter(e => e.progress > 0 && e.progress < 100).length;
  const totalHours = enrollments.length * 8; // Assuming 8 hours per course

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.name}!
          </h1>
          <p className="text-gray-600 mt-2">Track your learning progress and continue your journey.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-lg p-3 mr-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
                <p className="text-gray-600 text-sm">Enrolled Courses</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="bg-green-100 rounded-lg p-3 mr-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{completedCourses}</p>
                <p className="text-gray-600 text-sm">Completed</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-lg p-3 mr-4">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{inProgressCourses}</p>
                <p className="text-gray-600 text-sm">In Progress</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-lg p-3 mr-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalHours}h</p>
                <p className="text-gray-600 text-sm">Learning Time</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Enrolled Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
              <Link to="/courses">
                <Button variant="outline">Browse More Courses</Button>
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : enrollments.length === 0 ? (
              <Card className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                <p className="text-gray-500 mb-6">Start learning by enrolling in your first course</p>
                <Link to="/courses">
                  <Button>Explore Courses</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment) => (
                  <Card key={enrollment.id} hover className="group">
                    <div className="flex items-center space-x-4">
                      <img
                        src={enrollment.course?.image_url || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg'}
                        alt={enrollment.course?.title}
                        className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {enrollment.course?.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          by {enrollment.course?.instructor?.name}
                        </p>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{enrollment.progress}%</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link to={`/courses/${enrollment.course?.slug}`}>
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4 mr-1" />
                            Continue
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Completed "Introduction to React"</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Started "Advanced JavaScript"</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Enrolled in "Web Design Basics"</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Award className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">First Course Complete</p>
                    <p className="text-xs text-gray-500">Completed your first course</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Learning Streak</p>
                    <p className="text-xs text-gray-500">5 days in a row</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recommended Courses */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Recommended for You</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg"
                    alt="Course"
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Python for Beginners</p>
                    <p className="text-xs text-gray-500">4.8 ★ • 1,234 students</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg"
                    alt="Course"
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Data Science Fundamentals</p>
                    <p className="text-xs text-gray-500">4.9 ★ • 856 students</p>
                  </div>
                </div>
              </div>
              <Link to="/courses" className="block mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  View All Courses
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;