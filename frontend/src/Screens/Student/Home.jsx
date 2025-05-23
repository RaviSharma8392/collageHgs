import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { FiHome, FiCalendar, FiBook, FiBell, FiLock, FiSearch, FiExternalLink } from "react-icons/fi";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Notice from "../Notice";
import Timetable from "./Timetable";
import Material from "./Material";
import UpdatePasswordLoggedIn from "../../components/UpdatePasswordLoggedIn";
import Profile from "./Profile";
import SearchTopic from "./SearchTopic";

const MENU_ITEMS = [
  { id: "home", label: "Home", icon: <FiHome size={20} />, component: null },
  { id: "timetable", label: "Timetable", icon: <FiCalendar size={20} />, component: Timetable },
  { id: "material", label: "Material", icon: <FiBook size={20} />, component: Material },
  { id: "notice", label: "Notice", icon: <FiBell size={20} />, component: Notice },
  { 
    id: "updatepassword", 
    label: "Update Password", 
    icon: <FiLock size={20} />, 
    component: UpdatePasswordLoggedIn 
  },
  {
    id: "checkresult",
    label: "Check Result",
    icon: <HiOutlineAcademicCap size={20} />,
    type: "external",
    url: "https://kunainital.samarth.edu.in/index.php/site/login",
  },
  { 
    id: "searchtopic", 
    label: "Search Topic", 
    icon: <FiSearch size={20} />, 
    component: SearchTopic 
  },
];

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("Home");
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const dispatch = useDispatch();
  const userToken = localStorage.getItem("userToken");

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      toast.loading("Loading user details...");
      const response = await axiosWrapper.get(`/student/my-details`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.data.success) {
        setProfileData(response.data.data);
        dispatch(setUserData(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error fetching user details");
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [dispatch, userToken]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (selectedMenu === "Home" && profileData) {
      return <Profile profileData={profileData} />;
    }

    const selectedItem = MENU_ITEMS.find(
      (item) => item.label.toLowerCase() === selectedMenu.toLowerCase()
    );

    const Component = selectedItem?.component;
    if (!Component) return null;

    if (selectedItem.id === "searchtopic") {
      return <Component semester={profileData?.semester || ""} />;
    }

    return <Component />;
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white shadow-md transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          {!isSidebarCollapsed && (
            <h1 className="text-xl font-bold text-blue-600">Dashboard</h1>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            {isSidebarCollapsed ? <RiMenuUnfoldLine size={20} /> : <RiMenuFoldLine size={20} />}
          </button>
        </div>
        
        <nav className="p-2">
          <ul className="space-y-1">
            {MENU_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (item.type === "external" && item.url) {
                      window.open(item.url, "_blank");
                    } else {
                      setSelectedMenu(item.label);
                    }
                  }}
                  className={`
                    w-full flex items-center p-3 rounded-lg transition-all
                    ${selectedMenu === item.label 
                      ? 'bg-blue-100 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'}
                  `}
                >
                  <span className="flex-shrink-0">
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && (
                    <span className="ml-3">{item.label}</span>
                  )}
                  {item.type === "external" && !isSidebarCollapsed && (
                    <FiExternalLink className="ml-auto" size={16} />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow rounded-lg p-6 min-h-[300px]">
            {renderContent()}
          </div>
        </div>
      </div>
      
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Home;