import { useNavigate } from "react-router-dom";

const MeetingsTable = ({ data, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const onView = (id) => {
    navigate(`/meeting/arji/${id}`);
  };
  const onView2 = (id) => {
    navigate(`/meeting/certificate/${id}`);
  };

  return (
    <table className="w-full border">
      <thead className="bg-gray-200">
        <tr>
          <th className="border p-2">Taluka</th>
          <th className="border p-2">District</th>
          <th className="border p-2">Date</th>
          <th className="border p-2">Email</th>
          <th className="border p-2">Name</th>
          <th className="border p-2">Designation</th>
          <th className="border p-2">Mobile</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((m) => (
          <tr key={m.id}>
            <td className="border p-2">{m.taluka}</td>
            <td className="border p-2">{m.district}</td>
            <td className="border p-2">{m.date}</td>
            <td className="border p-2">{m.sarpanchEmail}</td>
            <td className="border p-2">{m.karmchariName}</td>
            <td className="border p-2">{m.designation}</td>
            <td className="border p-2">{m.mobileNumber}</td>
            <td className="border p-2 space-x-2">
              <button
                onClick={() => onView(m.id)}
                className="px-2 py-1 bg-blue-500 text-white rounded"
              >
                Arji
              </button>
              <button
                onClick={() => onView2(m.id)}
                className="px-2 py-1 bg-blue-500 text-white rounded"
              >
                Certificate
              </button>
              <button
                onClick={() => onEdit(m)}
                className="px-2 py-1 bg-yellow-400 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(m.id)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MeetingsTable;
