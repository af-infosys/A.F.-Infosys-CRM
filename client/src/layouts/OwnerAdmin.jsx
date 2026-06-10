import React, { useEffect, useState } from "react";
import {
  ClipboardList,
  CheckCircle,
  PlayCircle,
  Archive,
  XCircle,
  Mail,
  Users,
  UserPlus,
  ExternalLink,
  Share2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiPath from "../isProduction";
import { toast } from "react-toastify";
import axios from "axios";

// Reusable Quick Link Card Component
const QuickLinkCard = ({ title, icon: Icon, count, bgColor, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow duration-200"
  >
    <div className={`p-3 rounded-lg text-white ${bgColor}`}>
      <Icon size={24} />
    </div>
    <div className="ml-4">
      <h4 className="text-gray-600 text-sm font-medium">{title}</h4>
      {count !== undefined && (
        <span className="text-2xl font-bold text-gray-800">{count}</span>
      )}
    </div>
  </div>
);

// Categorized Section Wrapper
const CategorySection = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {children}
    </div>
  </div>
);

const OwnerAdmin = () => {
  const navigation = useNavigate();

  // Mock function for navigation
  const handleNavigation = (path) => {
    navigation(path);
  };

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const apps = [
    {
      name: "Survey App (Online)",
      url: "https://survay-form-app.netlify.app/",
    },
    {
      name: "Biller App",
      url: "https://af-biller.netlify.app/",
    },
  ];

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const data = await axios.get(`${await apiPath()}/api/work`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(data);
      setProjects(data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const url = await apiPath();
      const res = await fetch(`${url}/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();

      const usersWithWork = data.map((user) => ({
        ...user,
        work: user.work || { gaam: "", taluka: "", district: "" },
      }));
      setUsers(usersWithWork);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("સ્ટાફ ડેટા લાવવામાં નિષ્ફળ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const handleShare = async (app) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: app.name,
          text: `${app.name}`,
          url: app.url,
        });
      } else {
        await navigator.clipboard.writeText(app.url);
        alert(`${app.name} link copied`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">DASHBOARD</h1>
          <p className="text-gray-500 mt-1">A.F. Infosys - Smart Management</p>
        </header>

        {/* 1. Orders Category */}
        <CategorySection title="Orders & Projects">
          <QuickLinkCard
            title="Create Order"
            // count={"8"}
            icon={ClipboardList}
            bgColor="bg-blue-500"
            onClick={() => handleNavigation("/services/new")}
          />

          <QuickLinkCard
            title="Manage Order"
            // count={"8"}
            icon={ClipboardList}
            bgColor="bg-blue-500"
            onClick={() => handleNavigation("/services/manage")}
          />

          <QuickLinkCard
            title="All Orders"
            count={projects?.length || 0}
            icon={ClipboardList}
            bgColor="bg-blue-500"
            onClick={() => handleNavigation("/staff/work")}
          />
          <QuickLinkCard
            title="1. Final Orders (Deals)"
            count={
              projects?.filter((project) => {
                return !project?.other?.status;
              })?.length || 0
            }
            icon={CheckCircle}
            bgColor="bg-indigo-500"
            onClick={() => handleNavigation("/projects/first")}
          />
          <QuickLinkCard
            title="2. Current Orders"
            count={
              projects?.filter((project) => {
                return project?.other?.status === "working";
              })?.length || 0
            }
            icon={PlayCircle}
            bgColor="bg-amber-500"
            onClick={() => handleNavigation("/projects/current")}
          />
          <QuickLinkCard
            title="3. Completed Orders"
            count={
              projects?.filter((project) => {
                return project?.other?.status === "completed";
              })?.length || 0
            }
            icon={Archive}
            bgColor="bg-emerald-500"
            onClick={() => handleNavigation("/projects/final")}
          />
          <QuickLinkCard
            title="4. Canceled Orders"
            count={
              projects?.filter((project) => {
                return project?.other?.status === "cancelled";
              })?.length || 0
            }
            icon={XCircle}
            bgColor="bg-red-500"
            onClick={() => handleNavigation("/projects/cancled")}
          />
        </CategorySection>

        {/* 2. Communications Category */}
        <CategorySection title="Communications">
          <QuickLinkCard
            title="Add Customer"
            icon={UserPlus}
            bgColor="bg-teal-500"
            onClick={() => handleNavigation("/customers/add")}
          />

          <QuickLinkCard
            title="Meeting & Arji Letters"
            icon={Mail}
            bgColor="bg-purple-500"
            onClick={() => handleNavigation("/meeting/manage")}
          />

          <QuickLinkCard
            title="Whatsapp Messages"
            icon={Mail}
            bgColor="bg-green-500"
            onClick={() => handleNavigation("/whatsapp/temp")}
          />
        </CategorySection>

        {/* 3. Staff Management Category */}
        <CategorySection title="Staff & Personnel">
          <QuickLinkCard
            title="Manage Staff"
            count={users?.length || 0}
            icon={Users}
            bgColor="bg-cyan-500"
            onClick={() => handleNavigation("/staff/manage")}
          />
          <QuickLinkCard
            title="Add Staff"
            icon={UserPlus}
            bgColor="bg-teal-500"
            onClick={() => handleNavigation("/staff/add")}
          />
        </CategorySection>

        <div className="w-full flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
            Other Platforms
          </h3>

          <div className="gap-4 flex">
            {apps.map((app) => (
              <div
                key={app.id}
                className="
              group
              rounded-2xl
              border border-slate-200
              bg-white/80
              backdrop-blur-sm
              p-5
              shadow-sm
              transition-all
              duration-300
              hover:shadow-lg
              hover:-translate-y-1
            "
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {app.name}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      {app.subtitle}
                    </p>
                  </div>

                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    🚀
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                  flex-1
                  flex items-center justify-center gap-2
                  rounded-xl
                  bg-slate-900
                  px-4 py-3
                  text-white
                  font-medium
                  transition
                  hover:bg-slate-800
                "
                  >
                    Open
                    <ExternalLink size={16} />
                  </a>

                  <button
                    onClick={() => handleShare(app)}
                    className="
                  px-4 py-3
                  rounded-xl
                  border border-slate-200
                  bg-white
                  transition
                  hover:bg-slate-50
                  flex items-center justify-center
                "
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerAdmin;
