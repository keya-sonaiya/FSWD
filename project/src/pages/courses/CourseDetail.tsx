
import { ArrowLeft } from 'lucide-react';
      <div className="fixed top-4 left-4 z-50">
        <Link to="/">
          <button className="bg-white rounded-full shadow p-2 hover:bg-blue-100 transition">
            <ArrowLeft className="h-6 w-6 text-blue-700" />
          </button>
        </Link>
      </div>
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Users, Star, DollarSign, BookOpen, Play, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import type { Course } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import VideoPlayer from '../../components/ui/VideoPlayer';

const CourseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchCourse();
    }
  }, [slug]);

  const fetchCourse = async () => {
    try {
      const courseData = await apiService.getCourse(slug!);
      setCourse(courseData);
      
      // Check if user is enrolled
      if (user && courseData.enrollments) {
        setIsEnrolled(courseData.enrollments.some((e: any) => e.student_id === user.id));
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Course not found');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please sign in to enroll in this course');
      navigate('/auth/signin');
      return;
    }

    if (profile?.role !== 'student') {
      toast.error('Only students can enroll in courses');
      return;
    }

    try {
      setEnrolling(true);
      await apiService.enrollInCourse(course!.id);
      setIsEnrolled(true);
      toast.success('Successfully enrolled in the course!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
          <Link to="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to courses
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-600 rounded-full">
                  {course.level}
                </span>
                {course.category && (
                  <span className="text-blue-200">{course.category.name}</span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {course.title}
              </h1>
              
              <p className="text-xl text-blue-100 mb-6">
                {course.short_description}
              </p>
              
              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center space-x-1">
                  <Users className="h-5 w-5" />
                  <span>{course.student_count} students</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span>4.8 (120 reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-5 w-5" />
                  <span>8 weeks</span>
                </div>
              </div>
            </div>
            
            <div className="lg:flex lg:justify-end">
              {course.preview_video_url ? (
                <div className="w-full max-w-sm">
                  <VideoPlayer
                    url={course.preview_video_url}
                    title={`${course.title} Preview`}
                    className="h-64 shadow-lg"
                  />
                </div>
              ) : (
                <img
                  src={course.image_url || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg'}
                  alt={course.title}
                  className="w-full max-w-sm rounded-lg shadow-lg"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2">
            {/* Course Description */}
            <Card className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">{course.description}</p>
              </div>
            </Card>

            {/* Course Syllabus */}
            {course.sections && course.sections.length > 0 && (
              <Card className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
                <div className="space-y-4">
                  {course.sections.map((section, index) => (
                    <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">
                          {index + 1}. {section.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Play className="h-4 w-4 mr-1" />
                          <span>Video</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{section.content}</p>
                      {section.material_url && (
                        <a
                          href={section.material_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-3 px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
                        >
                          📄 Download PDF Material
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Instructor Info */}
            {course.instructor && (
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Instructor</h2>
                <div className="flex items-start space-x-4">
                  {course.instructor.avatar_url ? (
                    <img
                      src={course.instructor.avatar_url}
                      alt={course.instructor.name}
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-xl font-medium">
                        {course.instructor.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{course.instructor.name}</h3>
                    <p className="text-gray-600 mt-1">{course.instructor.bio || 'Expert instructor with years of experience in the field.'}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Enrollment Card */}
          <div>
            <div className="sticky top-8">
              <Card>
                <div className="text-center mb-6">
                  {course.price > 0 ? (
                    <div className="flex items-center justify-center">
                      <DollarSign className="h-8 w-8 text-green-600" />
                      <span className="text-3xl font-bold text-gray-900">{course.price}</span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-green-600">Free</span>
                  )}
                </div>

                {isEnrolled ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center text-green-600 mb-4">
                      <Check className="h-6 w-6 mr-2" />
                      <span className="font-medium">You're enrolled!</span>
                    </div>
                    <Link to="/student/dashboard">
                      <Button className="w-full mb-4">
                        Go to Dashboard
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button
                    onClick={handleEnroll}
                    loading={enrolling}
                    className="w-full mb-4"
                    size="lg"
                  >
                    Enroll Now
                  </Button>
                )}

                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Level:</span>
                    <span className="font-medium">{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Students:</span>
                    <span className="font-medium">{course.student_count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">8 weeks</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Certificate:</span>
                    <span className="font-medium">Yes</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">This course includes:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>Lifetime access</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>Mobile and TV access</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>Direct instructor access</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;