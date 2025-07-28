import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import LeadDashboard from "../features/leads/LeadDashboard";
import OrderValuation from "../features/orders/OrderValuation";
import LeadForm from "../features/leads/LeadForm";
import LeadEdit from "../features/leads/LeadEdit";

import ProtectedRoute from "./ProtectedRoute";
import Login from "../features/staff/Login";
import Staff from "../features/staff/Staff";
import AddStaff from "../features/staff/AddStaff";
import Work from "../features/staff/Work";
import ContactListForm from "../features/contactList/ContactListForm";
import ContactListReport from "../features/contactList/ContactListReport";
import ContactListReportOverview from "../features/contactList/ContactListReportOverview";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute
            allowedRoles={[
              "owner",
              "accountant",
              "operator",
              "surveyor",
              "telecaller",
            ]}
          >
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ContactListForm />} />
        <Route path="/leads/report" element={<LeadDashboard />} />
        <Route path="/leads/form" element={<LeadForm />} />
        <Route path="/leads/edit/:id" element={<LeadEdit />} />

        <Route path="/customers/form" element={<ContactListForm />} />
        <Route path="/customers/form/:id" element={<ContactListForm />} />
        <Route path="/customers/report" element={<ContactListReport />} />
        <Route
          path="/customers/overview"
          element={<ContactListReportOverview />}
        />
        <Route path="/orders" element={<OrderValuation />} />

        <Route
          path="/staff/manage"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <Staff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/add"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <AddStaff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/work"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <Work />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
