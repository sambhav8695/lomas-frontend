import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FeedbackHub from "./components/FeedbackHub";

import Landing from "./pages/Landing";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OAuthRedirect from "./pages/OAuthRedirect";
import CompleteBirthDetails from "./pages/CompleteBirthDetails";
import Chat from "./pages/Chat";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function AppShell() {
  const location = useLocation();
  const isChatScreen = location.pathname.startsWith("/chat");
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/oauth2/redirect" element={<OAuthRedirect />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/complete-birth-details" element={<CompleteBirthDetails />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isChatScreen && <Footer />}
      {isAuthenticated && <FeedbackHub />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
