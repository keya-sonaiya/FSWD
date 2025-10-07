# EduMosaic - Complete Student-Instructor Learning Platform

A modern, full-featured educational platform built with React and Supabase, enabling instructors to create and sell courses while providing students with a comprehensive learning experience.

## 🚀 Features

### For Students
- **Course Discovery**: Browse and filter courses by category, level, and price
- **Enrollment System**: Enroll in courses with one click
- **Progress Tracking**: Monitor learning progress and achievements
- **Personalized Dashboard**: View enrolled courses and recommendations
- **Responsive Design**: Seamless experience across all devices

### For Instructors
- **Course Creation**: Rich course creation tools with sections and media upload
- **Student Management**: View enrolled students and track engagement
- **Revenue Tracking**: Monitor earnings and course performance
- **Content Management**: Edit and update courses anytime
- **Publishing Controls**: Publish/unpublish courses as needed

### For Admins
- **User Management**: Manage users and roles
- **Content Moderation**: Review and moderate course content
- **Analytics Dashboard**: Platform-wide statistics and insights

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Query** for server state management
- **React Hook Form** with Zod validation
- **React Hot Toast** for notifications

### Backend & Database
- **Supabase** for backend services
- **PostgreSQL** database with Row Level Security
- **Supabase Auth** for authentication
- **Supabase Storage** for file uploads
- **Real-time subscriptions** for live updates

### Key Libraries
- `@supabase/supabase-js` - Supabase client
- `@tanstack/react-query` - Server state management
- `react-hook-form` - Form handling
- `@hookform/resolvers` - Form validation
- `zod` - Schema validation
- `lucide-react` - Icons
- `react-hot-toast` - Toast notifications

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd edumosaic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Run the database migration found in `supabase/migrations/`

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

The application uses the following main tables:

### Profiles
- User information extending Supabase Auth
- Roles: student, instructor, admin
- Profile metadata (bio, avatar, approval status)

### Courses
- Course information and metadata
- Instructor relationships
- Publishing status and pricing
- Categories and tags

### Course Sections
- Course curriculum structure
- Ordered sections with content
- Rich text content support

### Enrollments
- Student-course relationships
- Progress tracking
- Enrollment timestamps

### Categories
- Course categorization
- Hierarchical structure support

## 🚀 Deployment

### Frontend (Vercel)

1. **Connect to Vercel**
   ```bash
   npx vercel
   ```

2. **Set environment variables in Vercel dashboard**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

3. **Deploy**
   ```bash
   npx vercel --prod
   ```

### Database (Supabase)

1. **Create Supabase project**
   - Sign up at [supabase.com](https://supabase.com)
   - Create new project
   - Note down project URL and API keys

2. **Run migrations**
   - Use the Supabase dashboard SQL editor
   - Execute the migration files in order

3. **Set up storage**
   - Create storage bucket for course images
   - Configure RLS policies for uploads

## 🧪 Testing

### Demo Users

The platform includes demo users for testing:

**Student Account:**
- Email: `student@demo.com`
- Password: `password123`

**Instructor Account:**
- Email: `instructor@demo.com`
- Password: `password123`

### Test Scenarios

1. **Student Journey**
   - Browse courses without authentication
   - Sign up as a student
   - Enroll in a course
   - Track progress in dashboard

2. **Instructor Journey**
   - Sign up as an instructor
   - Create a new course with sections
   - Upload course image
   - Publish course and view students

## 📋 API Documentation

### Authentication Endpoints

All authentication is handled by Supabase Auth:

- `POST /auth/v1/signup` - User registration
- `POST /auth/v1/token?grant_type=password` - Login
- `POST /auth/v1/logout` - Logout
- `GET /auth/v1/user` - Get current user

### Database API

Supabase provides auto-generated REST API:

- `GET /rest/v1/courses` - List courses
- `POST /rest/v1/courses` - Create course (instructor only)
- `GET /rest/v1/courses?slug=eq.{slug}` - Get course by slug
- `POST /rest/v1/enrollments` - Enroll in course
- `GET /rest/v1/enrollments` - Get user enrollments

### File Upload

- `POST /storage/v1/object/course-images/{filename}` - Upload course image

## 🔒 Security Features

### Authentication
- JWT-based authentication via Supabase Auth
- Secure session management
- Password reset functionality

### Authorization
- Role-based access control (RBAC)
- Row Level Security (RLS) policies
- Protected routes based on user roles

### Data Protection
- Input validation with Zod schemas
- SQL injection prevention through Supabase
- CSRF protection built-in
- Secure file upload handling

## 🎨 UI/UX Features

### Design System
- Consistent color palette and typography
- Reusable UI components
- Responsive grid layouts
- Accessible form controls

### Interactions
- Smooth transitions and animations
- Loading states and skeleton screens
- Toast notifications for feedback
- Modal dialogs for destructive actions

### Accessibility
- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility

## 📱 Responsive Design

The platform is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Key responsive features:
- Collapsible navigation menu
- Flexible grid layouts
- Touch-friendly interactions
- Optimized images and media

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Supabase (if using Supabase CLI)
npx supabase start   # Start local Supabase
npx supabase stop    # Stop local Supabase
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `docs/` folder
- Contact the development team

## 🔄 Future Enhancements

Planned features for future releases:
- Payment integration with Stripe
- Video streaming capabilities
- Real-time chat and discussions
- Advanced analytics dashboard
- Mobile app development
- Multi-language support
- Certificate generation
- Integration with third-party tools

---

Built with ❤️ for educators and learners worldwide.