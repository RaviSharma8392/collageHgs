import React, { useEffect, useState } from "react";
import { FiDownload, FiExternalLink, FiZoomIn, FiZoomOut, FiX } from "react-icons/fi";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";
import axiosWrapper from "../../utils/AxiosWrapper";
import { toast } from "react-hot-toast";
import { saveAs } from 'file-saver';

const Timetable = () => {
  const [timetable, setTimetable] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const userData = useSelector((state) => state.userData);
  const baseUrl = process.env.REACT_APP_MEDIA_LINK || "https://collagehgs.onrender.com/media";

  useEffect(() => {
    const getTimetable = async () => {
      try {
        setIsLoading(true);
        const response = await axiosWrapper.get(
          `/timetable?semester=${userData.semester}&branch=${userData.branchId?._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );
        if (response.data.success && response.data.data.length > 0) {
          setTimetable(response.data.data[0].link);
        } else {
          setTimetable("");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error fetching timetable"
        );
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    userData && getTimetable();
  }, [userData, userData.branchId, userData.semester]);

  const handleDownload = () => {
    saveAs(`${baseUrl}/${timetable}`, `timetable-sem-${userData.semester}.pdf`);
  };

  const openViewer = () => {
    setIsViewerOpen(true);
    setZoomLevel(1);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <Heading title={`Semester ${userData.semester} Timetable`} />
        
        {timetable && (
          <div className="flex space-x-4 mt-4 md:mt-0">
            <button
              onClick={openViewer}
              className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <FiZoomIn className="mr-2" />
              View Fullscreen
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <FiDownload className="mr-2" />
              Download
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : timetable ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-medium text-gray-700">Timetable Preview</h3>
          </div>
          <div className="p-4 flex justify-center">
            <img
              className="rounded-lg shadow-sm max-w-full h-auto cursor-pointer hover:shadow-md transition-shadow"
              src={`${baseUrl}/${timetable}`}
              alt="timetable"
              onClick={openViewer}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-500">No timetable available for Semester {userData.semester}</p>
        </div>
      )}

      {/* Fullscreen Viewer */}
      {isViewerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col p-4">
          <div className="flex justify-between items-center p-4 bg-black bg-opacity-75">
            <h2 className="text-white text-xl font-medium">
              Semester {userData.semester} Timetable
            </h2>
            <div className="flex space-x-4">
              <button
                onClick={zoomOut}
                className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                disabled={zoomLevel <= 0.5}
              >
                <FiZoomOut size={24} />
              </button>
              <button
                onClick={zoomIn}
                className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                disabled={zoomLevel >= 2}
              >
                <FiZoomIn size={24} />
              </button>
              <button
                onClick={closeViewer}
                className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center items-center overflow-auto p-4">
            <img
              src={`${baseUrl}/${timetable}`}
              alt="timetable"
              className="max-w-full max-h-full"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>
          
          <div className="flex justify-center space-x-4 p-4 bg-black bg-opacity-75">
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiDownload className="mr-2" />
              Download Timetable
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;