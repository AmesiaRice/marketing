import { useState } from "react";

const EmployeeModal = ({ employee, headers, onClose, onSubmit }) => {
  if (!employee) return null;

  const [selectedValues, setSelectedValues] = useState({
    saifcoExcel4: "",
    saifcoExcel20: "",
    saifcoWattanSe4: "",
    saifcoWattanSe20: "",
    saifcoSuper4: "",
    saifcoGold4: "",
    saifcoAmber4: "",
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

  const data =[];
  for (let i = 1; i <= 20; i++) {
     data.push(i);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-auto pt-44">
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
              name="saifcoExcel4"
              className="border px-5 py-1 mt-2 shadow-lg"
              value={selectedValues.saifcoExcel4}
              onChange={handleSelectChange}
            >
              <option value="">----- Saifco Excel (4 × 5 KG) -----</option>
              {
                data.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))
              }
            </select>
          </div>

          <div className="selector">
            <select
              name="saifcoExcel20"
              className="border px-5 py-1 mt-2 shadow-lg"
              value={selectedValues.saifcoExcel20}
              onChange={handleSelectChange}
            >
              <option value="">----- Saifco Excel (20 × 1 KG) -----</option>
              {
                data.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))
              }
            </select>
          </div>

          <div className="selector">
            <select
              name="saifcoWattanSe4"
              className="border px-5 py-1 mt-2 shadow-lg"
              value={selectedValues.saifcoWattanSe4}
              onChange={handleSelectChange}
            >
              <option value="">----- Saifco Wattan Se ( 4  × 5 KG) -----</option>
              {
                data.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))
              }
            </select>
          </div>

          <div className="selector">
            <select
              name="saifcoWattanSe20"
              className="border px-5 py-1 mt-2 shadow-lg"
              value={selectedValues.saifcoWattanSe20}
              onChange={handleSelectChange}
            >
              <option value="">----- Saifco Wattan Se ( 20   × 1 KG) -----</option>
              {
                data.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))
              }
            </select>
          </div>

          <div className="selector">
            <select
              name="saifcoSuper4"
              className="border px-5 py-1 mt-2 shadow-lg"
              value={selectedValues.saifcoSuper4}
              onChange={handleSelectChange}
            >
              <option value="">----- Saifco Super ( 4  ×  5 KG) -----</option>
              {
                data.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))
              }
            </select>
          </div>

          <div className="selector">
            <select
              name="saifcoGold4"
              className="border px-5 py-1 mt-2 shadow-lg"
              value={selectedValues.saifcoGold4}
              onChange={handleSelectChange}
            >
              <option value="">----- Saifco Gold ( 4  ×  5 KG) -----</option>
              {
                data.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))
              }
            </select>
          </div>

          <div className="selector">
            <select
              name="saifcoAmber4"
              className="border px-5 py-1 mt-2 shadow-lg"
              value={selectedValues.saifcoAmber4}
              onChange={handleSelectChange}
            >
              <option value="">----- Saifco Amber ( 4  ×  5 KG) -----</option>
               {
                data.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))
              }
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
