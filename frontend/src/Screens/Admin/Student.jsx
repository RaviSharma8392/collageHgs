import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import NoData from "../../components/NoData";

const Student = () => {
  // State management
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const userToken = localStorage.getItem("userToken");

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    semester: "",
    branchId: "",
    gender: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    profile: "",
    status: "active",
    bloodGroup: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
  });

  // Search filters
  const [searchParams, setSearchParams] = useState({
    enrollmentNo: "",
    name: "",
    semester: "",
    branch: "",
  });

  // Fetch branches on mount
  useEffect(() => {
    getBranchHandler();
  }, []);

  // API calls
  const getBranchHandler = async () => {
    try {
      toast.loading("Loading branches...");
      const response = await axiosWrapper.get(`/branch`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) {
        setBranches(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching branches");
    } finally {
      toast.dismiss();
    }
  };

  const getAllStudents = async () => {
    try {
      setLoading(true);
      const response = await axiosWrapper.get('/student/all', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) {
        setStudents(response.data.data);
        setHasSearched(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching students");
    } finally {
      setLoading(false);
    }
  };

  const searchStudents = async (e) => {
    e?.preventDefault();
    try {
      setLoading(true);
      const response = await axiosWrapper.post('/student/search', searchParams, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) {
        setStudents(response.data.data);
        setHasSearched(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error searching students");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSubmit = async () => {
    try {
      toast.loading(isEditing ? "Updating Student..." : "Adding Student...");
      
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'emergencyContact') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            formDataToSend.append(`emergencyContact[${subKey}]`, subValue);
          });
        } else {
          formDataToSend.append(key, value);
        }
      });

      if (file) formDataToSend.append('file', file);

      const endpoint = isEditing 
        ? `/student/${selectedStudentId}`
        : '/student/register';
      const method = isEditing ? 'patch' : 'post';

      const response = await axiosWrapper[method](endpoint, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.data.success) {
        toast.success(isEditing 
          ? "Student updated successfully" 
          : `Student created! Default password: student123`);
        resetForm();
        getAllStudents();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error processing request");
    } finally {
      toast.dismiss();
    }
  };

  const deleteStudent = async () => {
    try {
      toast.loading("Deleting student...");
      const response = await axiosWrapper.delete(`/student/${selectedStudentId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) {
        toast.success("Student deleted successfully");
        getAllStudents();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting student");
    } finally {
      setIsDeleteConfirmOpen(false);
      toast.dismiss();
    }
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmergencyContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value }
    }));
  };

  const editStudent = (student) => {
    setFormData({
      firstName: student.firstName || "",
      middleName: student.middleName || "",
      lastName: student.lastName || "",
      phone: student.phone || "",
      semester: student.semester || "",
      branchId: student.branchId?._id || "",
      gender: student.gender || "",
      dob: student.dob?.split("T")[0] || "",
      address: student.address || "",
      city: student.city || "",
      state: student.state || "",
      pincode: student.pincode || "",
      country: student.country || "",
      profile: student.profile || "",
      status: student.status || "active",
      bloodGroup: student.bloodGroup || "",
      emergencyContact: {
        name: student.emergencyContact?.name || "",
        relationship: student.emergencyContact?.relationship || "",
        phone: student.emergencyContact?.phone || "",
      },
    });
    setSelectedStudentId(student._id);
    setIsEditing(true);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      phone: "",
      semester: "",
      branchId: "",
      gender: "",
      dob: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      profile: "",
      status: "active",
      bloodGroup: "",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
    });
    setFile(null);
    setShowAddForm(false);
    setIsEditing(false);
    setSelectedStudentId(null);
  };

  // Render methods
  const renderStudentTable = () => (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {students.map(student => (
            <tr key={student._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <img 
                  src={student.profile ? `${process.env.REACT_APP_MEDIA_LINK}/${student.profile}` : '/default-profile.png'}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">
                  {student.firstName} {student.middleName} {student.lastName}
                </div>
                <div className="text-sm text-gray-500">{student.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {student.enrollmentNo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Semester {student.semester}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {student.branchId?.name || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  student.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {student.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => editStudent(student)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStudentId(student._id);
                      setIsDeleteConfirmOpen(true);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    <MdOutlineDelete size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Heading title="Student Management" />
        <div className="flex space-x-4">
          <CustomButton 
            onClick={getAllStudents}
            variant="secondary"
          >
            Show All Students
          </CustomButton>
          <CustomButton 
            onClick={() => setShowAddForm(true)}
            icon={<IoMdAdd size={20} />}
          >
            Add Student
          </CustomButton>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Search Students</h3>
        <form onSubmit={searchStudents} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment No</label>
            <input
              type="text"
              name="enrollmentNo"
              value={searchParams.enrollmentNo}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter enrollment"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={searchParams.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <select
              name="semester"
              value={searchParams.semester}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <select
              name="branch"
              value={searchParams.branch}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Branches</option>
              {branches.map(branch => (
                <option key={branch._id} value={branch._id}>{branch.name}</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-4 flex justify-end">
            <CustomButton
              type="submit"
              loading={loading}
              className="w-full md:w-auto"
            >
              Search Students
            </CustomButton>
          </div>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : students.length > 0 ? (
        renderStudentTable()
      ) : hasSearched ? (
        <NoData title="No students found matching your criteria" />
      ) : (
        <div className="text-center py-12">
          <img 
            src="/search-illustration.svg" 
            alt="Search students" 
            className="mx-auto h-48 mb-4"
          />
          <h3 className="text-lg font-medium text-gray-900">Search for students</h3>
          <p className="mt-1 text-sm text-gray-500">
            Use the filters above to find specific students or click "Show All Students"
          </p>
        </div>
      )}

      {/* Add/Edit Student Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {isEditing ? "Edit Student" : "Add New Student"}
                </h3>
                <button 
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleStudentSubmit();
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Personal Information</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleFormChange("firstName", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                      <input
                        type="text"
                        value={formData.middleName}
                        onChange={(e) => handleFormChange("middleName", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleFormChange("lastName", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth*</label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => handleFormChange("dob", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender*</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleFormChange("gender", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                      <input
                        type="text"
                        value={formData.bloodGroup}
                        onChange={(e) => handleFormChange("bloodGroup", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. O+"
                      />
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Academic Information</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Semester*</label>
                      <select
                        value={formData.semester}
                        onChange={(e) => handleFormChange("semester", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Semester</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                          <option key={sem} value={sem}>Semester {sem}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Branch*</label>
                      <select
                        value={formData.branchId}
                        onChange={(e) => handleFormChange("branchId", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Branch</option>
                        {branches.map(branch => (
                          <option key={branch._id} value={branch._id}>{branch.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleFormChange("status", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        accept="image/*"
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="font-medium text-gray-900">Contact Information</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleFormChange("phone", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleFormChange("address", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleFormChange("city", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => handleFormChange("state", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode*</label>
                        <input
                          type="text"
                          value={formData.pincode}
                          onChange={(e) => handleFormChange("pincode", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country*</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => handleFormChange("country", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="font-medium text-gray-900">Emergency Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                        <input
                          type="text"
                          value={formData.emergencyContact.name}
                          onChange={(e) => handleEmergencyContactChange("name", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Relationship*</label>
                        <input
                          type="text"
                          value={formData.emergencyContact.relationship}
                          onChange={(e) => handleEmergencyContactChange("relationship", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
                        <input
                          type="tel"
                          value={formData.emergencyContact.phone}
                          onChange={(e) => handleEmergencyContactChange("phone", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                  <CustomButton
                    type="button"
                    onClick={resetForm}
                    variant="secondary"
                  >
                    Cancel
                  </CustomButton>
                  <CustomButton
                    type="submit"
                    loading={loading}
                  >
                    {isEditing ? "Update Student" : "Add Student"}
                  </CustomButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={deleteStudent}
        title="Confirm Student Deletion"
        message="Are you sure you want to delete this student? This action cannot be undone."
      />
    </div>
  );
};

export default Student;