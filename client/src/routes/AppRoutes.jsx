import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import LeadDashboard from "../features/leads/LeadDashboard";
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
import AddCall from "../features/contactList/AddCall";
import SummaryReport from "../features/contactList/SummaryReport";
import InvalidNumbers from "../features/contactList/InvalidNumbers";
import RemindersReport from "../features/contactList/RemindersReport";
import SurvayReport from "../features/survay/SurvayReport";
import OrderValuationReport from "../features/orderValuation/orderValuationReport";
import BillView from "../features/bill/BillView";
import IncomeReport from "../features/accounts/income/IncomeReport";
import TelecallerReport from "../features/staff/workStatus/TelecallerReport";
import InterestedList from "../features/contactList/InterestedList";
import Settings from "../features/settings/Settings";
import SurvayorReport from "../features/staff/workStatus/SurvayorReport";
import RecordsReport from "../features/contactList/RecordsReport";
import CustomerHistory from "../features/contactList/CustomerHistory";
import TaxManage from "../features/orderValuation/TaxManage";
import OrderValuationForm from "../features/orderValuation/OrderValuationForm";

import AkarniProjects from "../features/projects/AkarniProject";
import Akarni from "../features/projects/Akarni";

import IndexReport from "../features/survay/IndexReport";
import FinalProjects from "../features/projects/FinalProjects";
import DailyWordReport from "../features/staff/survayor/DailyWordReport";
import SurvayorExpense from "../features/staff/survayor/SurvayorExpense";
import CurrentProjects from "../features/projects/CurrentProjects";
import { useAuth } from "../config/AuthContext";
import AnalyticsReport from "../features/survay/AnalysisReport";
import TaxRegister from "../features/survay/TaxRegister";
import TarijReport from "../features/survay/TarijReport";
import SurvayFormImage from "../features/survay/SurvayFormImage";
import SurvayReportImage from "../features/survay/SurvayReportImage";
import AkarniExcelEdit from "../components/excel/AkarniExcelEdit";
import BillWork from "../features/staff/BillWork";
import NotFound from "../components/NotFound";
import BillerReport from "../features/staff/workStatus/BillerReport";
import SurvayInsertForm from "../components/SurveyInsertForm";

export default function AppRoutes() {
  const { user } = useAuth();

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
              "monitor",
            ]}
          >
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <>
              {user?.role === "owner" ? (
                <AkarniProjects />
              ) : user?.role === "telecaller" ? (
                <ContactListForm />
              ) : (
                <></>
              )}
            </>
          }
        />
        <Route path="/leads/report" element={<LeadDashboard />} />
        <Route path="/leads/form" element={<LeadForm />} />
        <Route path="/leads/edit/:id" element={<LeadEdit />} />

        <Route path="/customers/form" element={<ContactListForm />} />
        <Route path="/customers/form/:id" element={<ContactListForm />} />
        <Route path="/customers/add-call/:id" element={<AddCall />} />
        <Route
          path="/customers/overview"
          element={<ContactListReportOverview />}
        />
        <Route path="/customers/report" element={<ContactListReport />} />
        <Route path="/customers/summary" element={<SummaryReport />} />
        <Route path="/customers/invalids" element={<InvalidNumbers />} />
        <Route path="/customers/reminders" element={<RemindersReport />} />

        <Route
          path="/customers/history/:id"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <CustomerHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers/interested"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <InterestedList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers/total"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <RecordsReport />
            </ProtectedRoute>
          }
        />

        <Route path="/survay">
          <Route index element={<AkarniProjects />} />
          <Route path="manage/:projectId" element={<Akarni />} />

          <Route
            path="akarniReport/:projectId"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <SurvayReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="insert/:projectId"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <SurvayInsertForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="akarniImgReport/:projectId"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <SurvayReportImage />
              </ProtectedRoute>
            }
          />

          <Route
            path="indexReport/:projectId"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <IndexReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="taxRegister/:projectId"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <TaxRegister />
              </ProtectedRoute>
            }
          />

          <Route
            path="tarij/:projectId"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <TarijReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="analysis/:projectId"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <AnalyticsReport />
              </ProtectedRoute>
            }
          />

          <Route path="dailyReport" element={<DailyWordReport />} />
          <Route path="expenseReport" element={<SurvayorExpense />} />
        </Route>

        {/* Order Valuation Routes Start */}
        <Route path="/orderValuation">
          <Route path="form/:projectId" element={<OrderValuationForm />} />

          <Route path="report/:projectId" element={<OrderValuationReport />} />

          <Route path="tax/:projectId" element={<TaxManage />} />
        </Route>
        {/* Order Valuation Routes End */}

        {/* Bill Routes Start */}
        <Route path="bills">
          {/* <Route path="form" element={<BillForm />} /> */}
          <Route path="view" element={<BillView />} />
          {/* <Route path="report" element={<BillReport />} /> */}
        </Route>
        {/* Bill Routes End */}

        {/* Accounts Routes Start */}
        <Route path="accounts">
          <Route path="income" element={<IncomeReport />} />
          {/* <Route path="expense" element={<ExpenseReport />} /> */}
        </Route>
        {/* Accounts Routes End */}

        {/* Projects Routes Start */}
        <Route path="projects">
          {/* <Route path="add" element={<AddProject />} /> */}
          <Route
            path="final"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <FinalProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="current"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <CurrentProjects />
              </ProtectedRoute>
            }
          />
          {/* <Route path="completed" element={<ProtectedRoute allowedRoles={["owner"]}><CompletedProjects /></ProtectedRoute>} /> */}
          {/* <Route path="cancled" element={<ProtectedRoute allowedRoles={["owner"]}><CancledProjects /></ProtectedRoute>} /> */}
        </Route>
        {/* Projects Routes End */}

        {/* Staff Routes Start */}
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
          path="/staff/edit/:id"
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

        <Route
          path="/staff/billwork"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <BillWork />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/telecallerReport"
          element={
            <ProtectedRoute allowedRoles={["owner", "monitor"]}>
              <TelecallerReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/survayorReport"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <SurvayorReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/billerReport"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <BillerReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route path="/excel">
          <Route path="akarni/:projectId" element={<AkarniExcelEdit />} />
        </Route>
      </Route>
      {/* Staff Routes End */}

      <Route path="/login" element={<Login />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
