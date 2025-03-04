import { useState } from "react";

const EmployeeModal = ({ employee, headers, onClose, onSubmit }) => {
  if (!employee) return null;

  const [selectedValues, setSelectedValues] = useState({
    goldPlusBasmati: "",
    pureBasmati: "",
    goldBasmati: "",
  });

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(selectedValues);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Employee Details</h2>
        <div className="space-y-2">
          {headers.map((header, index) => (
            <p key={index}>
              <strong>{header}:</strong> {employee[index]}
            </p>
          ))}
        </div>

        <div>
          <div className="selector">
            <select
              name="goldPlusBasmati"
              className="border px-5 py-1 mt-2 shadow-lg"
              value={selectedValues.goldPlusBasmati}
              onChange={handleSelectChange}
            >
              <option value="">----- Gold plus Basmati -----</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>

          <div className="selector">
            <select
              name="pureBasmati"
              className="border px-5 py-1 mt-2 shadow-lg"
              value={selectedValues.pureBasmati}
              onChange={handleSelectChange}
            >
              <option value="">----- Pure Basmati -----</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>

          <div className="selector">
            <select
              name="goldBasmati"
              className="border px-5 py-1 mt-2 shadow-lg"
              value={selectedValues.goldBasmati}
              onChange={handleSelectChange}
            >
              <option value="">----- Gold Basmati -----</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button 
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Close
          </button>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
