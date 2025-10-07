import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, DollarSign, Play } from 'lucide-react';
import type { Course } from '../../lib/supabase';
import Card from '../ui/Card';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Card hover className="group">
      <Link to={`/courses/${course.slug}`} className="block">
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <div className="relative">
            <img
              src={course.image_url || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg'}
              alt={course.title}
              className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
            />
            {course.preview_video_url && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-white rounded-full p-3">
                  <Play className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
              {course.level}
            </span>
            {course.price > 0 && (
              <div className="flex items-center text-green-600 font-semibold">
                <DollarSign className="h-4 w-4" />
                <span>{course.price}</span>
              </div>
            )}
          </div>
          
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {course.title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-3">
            {course.short_description || course.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{course.student_count || 0} students</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>4.8</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            {course.instructor?.avatar_url ? (
              <img
                src={course.instructor.avatar_url}
                alt={course.instructor.name}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xs font-medium">
                  {course.instructor?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-sm text-gray-600">{course.instructor?.name}</span>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default CourseCard;