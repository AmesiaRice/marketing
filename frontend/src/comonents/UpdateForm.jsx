import { useState, useEffect } from "react";

const UpdateForm = ({ headers, initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (initialData) {
      const initialFormData = headers.reduce((acc, header, index) => {
        acc[header] = initialData[index] || "";
        return acc;
      }, {});
      setFormData(initialFormData);
    }
  }, [initialData, headers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto pt-60">
      <div className="bg-white p-8 rounded shadow-md w-1/2">
        <h2 className="text-2xl mb-4">Update Employee</h2>
        <form onSubmit={handleSubmit}>
          {headers.map((header, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-700">{header}</label>
              <input
                type="text"
                name={header}
                value={formData[header] || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateForm;
