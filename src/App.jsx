import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import UserLogin from './pages/User/Auth/Login';
import UserRegister from './pages/User/Auth/Register';
import UserOtpVerification from './pages/User/Auth/OtpVerification';
import ForgotPassword from './pages/User/Auth/ForgotPassword';
import ResetPassword from './pages/User/Auth/ResetPassword';
import UserHome from './pages/User/UserHome';
import BlogPage from './pages/Admin/BlogPage';
import EditBlogPage from './pages/Admin/EditBlogPage';
import EventCMS from './pages/Admin/EventCMS';
import EbookCMS from './pages/Admin/EbookCMS';
import WebInfo from './pages/Admin/WebInfo';
import VideoAdmin from './pages/Admin/VideoAdmin';


import AdminLoginstack from './pages/Stakeholder/Login';
import Videostack from './pages/Stakeholder/VideoAdmin';
import BlogPagestack from './pages/Stakeholder/BlogPage';
import EditBlogPagesstack from './pages/Stakeholder/EditBlogPage';
import EventCMSstack from './pages/Stakeholder/EventCMS';
import EbookCMSstack from './pages/Stakeholder/EbookCMS';
import FeedbackPagestack from './pages/Stakeholder/FeedbackPage';
import PsychologistCMSstack from './pages/Stakeholder/PsychologistCMS';



import FeedbackPage from './pages/Admin/FeedbackPage';
import PsychologistCMS from './pages/Admin/PsychologistCMS';
import NotificationManagement from './pages/Admin/NotificationManagement';
import UserProtectedRoute from './components/UserProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import Blog from './pages/User/Blog';
import BlogDetail from './pages/User/BlogDetail';
import WebInfoPage from './pages/User/WebInfoPage';
import Video from './pages/User/Video';
import VideoDetail from './pages/User/VideoDetail';
import Ebook from './pages/User/Ebook';
import Freq from './pages/User/Freq';
import OurTeam from './pages/User/OurTeam';
import Feedback from './pages/User/Feedback';
import Psychologists from './pages/User/Psychologists';




const App = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/stakeholder/login" element={<AdminLoginstack />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/verify-otp" element={<UserOtpVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Admin Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/blogs" element={<BlogPage />} />
          <Route path="/admin/blogs/:id/edit" element={<EditBlogPage />} />
          <Route path="/admin/event-cms" element={<EventCMS />} />
          <Route path="/admin/ebook" element={<EbookCMS />} />
          <Route path="/admin/webinfo" element={<WebInfo />} />
          <Route path="/admin/video" element={<VideoAdmin />} />
          <Route path="/admin/notifications" element={<NotificationManagement />} />
          <Route path="/admin/feedback" element={<FeedbackPage />} />
          <Route path="/admin/psikolog" element={<PsychologistCMS />} />

          <Route path="/stakholder/blogs" element={<BlogPagestack />} />
          <Route path="/stakholder/blogs/:id/edit" element={<EditBlogPagesstack />} />
          <Route path="/stakholder/event-cms" element={<EventCMSstack />} />
          <Route path="/stakholder/ebook" element={<EbookCMSstack />} />
          <Route path="/stakholder/video" element={<Videostack />} />
          <Route path="/stakholder/feedback" element={<FeedbackPagestack />} />
          <Route path="/stakholder/psikolog" element={<PsychologistCMSstack />} />


        </Route>

        {/* Protected User Routes with Header + Footer */}
        <Route element={<UserProtectedRoute />}>
          <Route path="/user/dashboard" element={<UserHome />} />
          <Route path="/user/blogs" element={<Blog />} />
          <Route path="/user/blogs/:id" element={<BlogDetail />} />
          <Route path="/user/webinfopage" element={<WebInfoPage />} />
          <Route path="/user/videos" element={<Video />} />
          <Route path="/user/videos/:id" element={<VideoDetail />} />
          <Route path="/user/ebooks" element={<Ebook />} />
          <Route path="/user/f&q" element={<Freq />} />
          <Route path="/user/team" element={<OurTeam />} />
          <Route path="/user/feedback" element={<Feedback />} />
          <Route path="/user/infopsikolog" element={<Psychologists />} />




        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
