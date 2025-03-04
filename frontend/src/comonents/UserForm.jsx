import React, { useState } from 'react';

const UserForm = ({ headers, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e, header) => {
    setFormData({
      ...formData,
      [header]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-xl mb-4">Add New User</h2>
        <form onSubmit={handleSubmit}>
          {headers.map((header, index) => (
            <div key={index} className="mb-2">
              <label className="block mb-1">{header}</label>
              <input
                type="text"
                className="p-2 border w-full px-20"
                value={formData[header] || ''}
                onChange={(e) => handleChange(e, header)}
              />
            </div>
          ))}
          <div className="flex justify-end mt-4">
            <button type="button" className="mr-2 p-2 bg-gray-300" onClick={onClose}>Cancel</button>
            <button type="submit" className="p-2 bg-blue-500 text-white">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
