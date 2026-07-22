import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateMeeting } from "../../features/meetings/meetingsApi2";
import toGujaratiNumber from "../toGujaratiNumber";

function formatDate(date) {
  // dd/mm/yyyy

  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const MeetingsTable2 = ({ data, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const sendEmail = async (m) => {
    setLoading(true);
    try {
      const finalData = { ...m, sendDate: new Date().toISOString() };
      console.log(finalData);

      const response = await updateMeeting(finalData);

      const result = await response.json();
      console.log(result);

      // 1. Email body ko template literal me define karein
      const emailBody = `પ્રતિ,                                                                                       તારીખ :- ${formatDate(finalData.date)}

શ્રી તાલુકા વિકાસ અધિકારી સાહેબ,

તાલુકા પંચાયત કચેરી - ${finalData.taluka}

જિલ્લો - ${finalData.district} 

ખાસ અગત્યનું PDF File Download કરી આપશ્રી સાહેબના વંચાણે લેવું`;

      // 2. Subject aur Body ko encode karein
      const subject = encodeURIComponent("અગત્યની PDF File");
      const encodedBody = encodeURIComponent(emailBody);

      // 3. mailto link generate karein
      const mailtoLink = `mailto:${finalData.officeEmail}?subject=${subject}&body=${encodedBody}`;

      // 4. Automatically Gmail / Default Email Client open karne ke liye
      window.location.href = mailtoLink;
      // (Agar naye tab me open karna ho toh: window.open(mailtoLink, '_blank'); use karein)

      alert("Email date Saved successfully!");

      // reload
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onView = (id) => {
    navigate(`/yaadi/list/${id}`);
  };

  return (
    <table className="w-full border">
      <thead className="bg-gray-200">
        <tr>
          <th className="border p-2">Sr.No</th>
          <th className="border p-2">Taluka</th>
          <th className="border p-2">District</th>
          <th className="border p-2">Email</th>
          <th className="border p-2">Date</th>
          <th className="border p-2">Name</th>
          <th className="border p-2">Designation</th>
          <th className="border p-2">Mobile</th>
          <th className="border p-2">Send Date</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((m, index) => {
          const date = m.sendDate ? new Date(m.sendDate) : false;
          const dateString = date ? (
            `${formatDate(m.sendDate)} (${date.getHours()}:${date.getMinutes()})`
          ) : (
            <button
              onClick={() => {
                sendEmail(m);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded ml-2"
            >
              {loading ? "Sending..." : "Send Email"}
            </button>
          );
          return (
            <tr key={m.id}>
              <td className="border p-2">{index + 1001}</td>
              <td className="border p-2">{m.taluka}</td>
              <td className="border p-2">{m.district}</td>
              <td className="border p-2" style={{ whiteSpace: "nowrap" }}>
                {m.officeEmail}
              </td>
              <td className="border p-2">{formatDate(m.date)}</td>
              <td className="border p-2">{m.karmchariName}</td>
              <td className="border p-2">{m.designation}</td>
              <td className="border p-2">{m.mobileNumber}</td>
              <td className="border p-2">{dateString}</td>
              <td
                className="border p-2 space-x-2"
                style={{ whiteSpace: "nowrap" }}
              >
                <button
                  onClick={() => onView(m.id)}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Arji
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
          );
        })}
      </tbody>
    </table>
  );
};

export default MeetingsTable2;
