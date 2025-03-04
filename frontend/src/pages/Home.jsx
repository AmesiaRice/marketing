import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import EmployeeModal from "../comonents/EmployeeModal"; // Import Modal Component
import UserForm from "../comonents/UserForm"; // Import UserForm Component

const clientId =
  "434880690733-aq7emrn4cggbdram9pi4rg4u84h1thg0.apps.googleusercontent.com";

const Home = () => {
  const [data, setData] = useState([]);
  const [flag, setFlag] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false); // State to manage UserForm visibility
  const [isEditMode, setIsEditMode] = useState(false); // State to manage edit mode
  const [editRowData, setEditRowData] = useState(null); // State to store data of the row being edited
  const searchInputRef = useRef(null); // Create a ref for the search input

  useEffect(() => {
    fetchData();
    searchInputRef.current.focus(); // Focus the search input when the component mounts
  }, []);

  const handleLoginSuccess = async (response) => {
    console.log("Google Login Success:", response);
    try {
      window.location.href = "https://marketing-server-sooty.vercel.app//auth";
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("https://marketing-server-sooty.vercel.app//sheets");
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response && error.response.status === 401) {
        setFlag(true);
      }
    }
  };

  const handleClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const checkAuthStatus = async () => {
    try {
      const res = await axios.get("https://marketing-server-sooty.vercel.app//auth/status");
      return res.data.authenticated;
    } catch (error) {
      console.error("Error checking auth status:", error);
      return false;
    }
  };

  const handleSubmit = async (selectedValues) => {
    console.log("Submitted Employee:", selectedEmployee);
    console.log("Selected Values:", selectedValues);
    handleCloseModal();

    const isAuthenticated = await checkAuthStatus();
    if (!isAuthenticated) {
      console.error("User is not authenticated");
      return;
    }

    try {
      await axios.post("https://marketing-server-sooty.vercel.app//submit", {
        employee: selectedEmployee,
        selections: selectedValues,
      });
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // Filtering the data based on the search term
  const filteredData =
    data.length > 0
      ? data
          .slice(1)
          .filter((row) =>
            row.some(
              (cell) =>
                typeof cell === "string" &&
                cell.toLowerCase().includes(searchTerm)
            )
          )
      : [];

  const handleFormSubmit = () => {
    setIsUserFormOpen(true); // Open the UserForm
  };

  const handleEditClick = (row) => {
    setEditRowData(row);
    setIsEditMode(true);
    setIsUserFormOpen(true); // Open the UserForm for editing
  };

  const handleUserFormSubmit = async (formData) => {
    setIsUserFormOpen(false); // Close the UserForm
    const isAuthenticated = await checkAuthStatus();
    if (!isAuthenticated) {
      console.error("User is not authenticated");
      return;
    }

    try {
      if (isEditMode) {
        // Update existing row
        await axios.post("https://marketing-server-sooty.vercel.app//updateRow", {
          originalRow: editRowData,
          updatedRow: formData,
        });
      } else {
        // Add new row
        await axios.post("https://marketing-server-sooty.vercel.app//submitSameSheet", {
          employee: formData,
        });
      }
      fetchData(); // Refresh data after submission
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setIsEditMode(false);
      setEditRowData(null);
    }
  };

  const handleUserFormClose = () => {
    setIsUserFormOpen(false); // Close the UserForm
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        {flag && (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.log("Login Failed")}
          />
        )}

        {/* Search Input */}
        <div>
          <input
            type="text"
            placeholder="Search..."
            className="p-2 px-5 border  mb-4 w-1/2 mt-8 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            ref={searchInputRef} // Attach the ref to the search input
          />

          <button
            className="bg-red-600 py-2 px-5 text-white"
            onClick={handleFormSubmit}
          >
            {" "}
            Add +{" "}
          </button>
        </div>

        {/* Table */}
        <div  className="w-full overflow-x-auto sm:flex sm:justify-center">
          {filteredData.length > 0 && (
            <table className="mt-4 border-collapse border border-gray-400 ">
              <thead>
                <tr className="bg-gray-200">
                  {data[0].map((header, index) => (
                    <th key={index} className="border border-gray-400 p-2">
                      {header}
                    </th>
                  ))}
                  <th className="border border-gray-400 p-2">Actions</th>{" "}
                  {/* Add Actions column */}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="bg-white border-b cursor-pointer hover:bg-gray-100"
                    onClick={() => handleClick(row)}
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="border border-gray-400 px-12 py-4"
                      >
                        {cell}
                      </td>
                    ))}
                    <td className="border border-gray-400 px-12 py-4">
                      <button
                        className="bg-blue-500 text-white p-2"
                        onClick={() => handleEditClick(row)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Employee Modal */}
        {isModalOpen && (
          <EmployeeModal
            employee={selectedEmployee}
            headers={data[0]}
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
          />
        )}

        {/* User Form */}
        {isUserFormOpen && (
          <UserForm
            headers={data[0]}
            onSubmit={handleUserFormSubmit}
            onClose={handleUserFormClose}
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default Home;
