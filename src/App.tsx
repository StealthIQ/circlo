
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import ProfilePage from "./pages/ProfilePage";
import QRScannerPage from "./pages/QRScannerPage";
import RewardsPage from "./pages/RewardsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    
    {/* Protected Routes */}
    <Route path="/home" element={
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    } />
    
    <Route path="/profile" element={
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    } />
    
    <Route path="/profile-settings" element={
      <ProtectedRoute>
        <ProfileSettingsPage />
      </ProtectedRoute>
    } />
    
    <Route path="/scan" element={
      <ProtectedRoute>
        <QRScannerPage />
      </ProtectedRoute>
    } />
    
    <Route path="/rewards" element={
      <ProtectedRoute>
        <RewardsPage />
      </ProtectedRoute>
    } />
    
    <Route path="/leaderboard" element={
      <ProtectedRoute>
        <LeaderboardPage />
      </ProtectedRoute>
    } />

    {/* Admin Routes */}
    <Route path="/admin" element={
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    } />
    
    {/* Redirect old routes to new ones */}
    <Route path="/settings" element={<Navigate to="/profile-settings" replace />} />
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
