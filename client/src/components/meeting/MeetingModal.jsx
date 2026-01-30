import { useEffect, useState } from "react";

const emptyForm = {
  id: "",
  taluka: "",
  district: "",
  date: "",
  sarpanchEmail: "",
  karmchariName: "",
  designation: "",
  mobileNumber: "",
};

const MeetingModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm(emptyForm);
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[600px] p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          {form.id ? "Edit Meeting" : "Add Meeting"}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {Object.keys(emptyForm)
            .filter((k) => k !== "id" || form.id)
            .map((key) => {
              return (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                    readOnly={key === "id"}
                    type={key === "date" ? "date" : "text"}
                  />
                </div>
              );
            })}
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={() => onSubmit(form)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingModal;
