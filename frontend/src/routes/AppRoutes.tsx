import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/layouts/MainLayout';

// Auth
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

// Doctors
import DoctorListPage from '@/pages/doctors/DoctorListPage';
import DoctorDetailPage from '@/pages/doctors/DoctorDetailPage';
import DoctorProfileUpdatePage from '@/pages/doctors/DoctorProfileUpdatePage';

// Appointments
import BookAppointmentPage from '@/pages/appointments/BookAppointmentPage';
import MyAppointmentsPage from '@/pages/appointments/MyAppointmentsPage';
import DoctorAppointmentsPage from '@/pages/appointments/DoctorAppointmentsPage';

// Prescriptions
import CreatePrescriptionPage from '@/pages/prescriptions/CreatePrescriptionPage';
import MyPrescriptionsPage from '@/pages/prescriptions/MyPrescriptionsPage';

// Payments
import PaymentPage from '@/pages/payments/PaymentPage';
import PaymentHistoryPage from '@/pages/payments/PaymentHistoryPage';

// Dashboard
import PatientDashboardPage from '@/pages/dashboard/PatientDashboardPage';
import DoctorDashboardPage from '@/pages/dashboard/DoctorDashboardPage';

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) return <Navigate to={user.role === 'DOCTOR' ? '/doctor/dashboard' : '/dashboard'} replace />;
  return <>{children}</>;
}

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'PATIENT' | 'DOCTOR' }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Guest */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Protected */}
      <Route element={<MainLayout />}>
        {/* Root redirect */}
        <Route path="/" element={
          user
            ? <Navigate to={user.role === 'DOCTOR' ? '/doctor/dashboard' : '/dashboard'} replace />
            : <Navigate to="/login" replace />
        } />

        {/* Shared */}
        <Route path="/doctors" element={<ProtectedRoute><DoctorListPage /></ProtectedRoute>} />
        <Route path="/doctors/:id" element={<ProtectedRoute><DoctorDetailPage /></ProtectedRoute>} />

        {/* PATIENT */}
        <Route path="/dashboard" element={<ProtectedRoute role="PATIENT"><PatientDashboardPage /></ProtectedRoute>} />
        <Route path="/book/:doctorId" element={<ProtectedRoute role="PATIENT"><BookAppointmentPage /></ProtectedRoute>} />
        <Route path="/my-appointments" element={<ProtectedRoute role="PATIENT"><MyAppointmentsPage /></ProtectedRoute>} />
        <Route path="/my-prescriptions" element={<ProtectedRoute role="PATIENT"><MyPrescriptionsPage /></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute role="PATIENT"><PaymentPage /></ProtectedRoute>} />
        <Route path="/payments/history" element={<ProtectedRoute role="PATIENT"><PaymentHistoryPage /></ProtectedRoute>} />

        {/* DOCTOR */}
        <Route path="/doctor/dashboard" element={<ProtectedRoute role="DOCTOR"><DoctorDashboardPage /></ProtectedRoute>} />
        <Route path="/doctor/appointments" element={<ProtectedRoute role="DOCTOR"><DoctorAppointmentsPage /></ProtectedRoute>} />
        <Route path="/doctor/profile" element={<ProtectedRoute role="DOCTOR"><DoctorProfileUpdatePage /></ProtectedRoute>} />
        <Route path="/doctor/prescriptions/create" element={<ProtectedRoute role="DOCTOR"><CreatePrescriptionPage /></ProtectedRoute>} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
