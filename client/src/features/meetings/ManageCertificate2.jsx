import React from "react";
import {
  createMeeting,
  deleteMeeting,
  fetchMeetings,
  updateMeeting,
} from "./meetingsApi2";
import MeetingsTable2 from "../../components/meeting/MeetingsTable2";
import MeetingModal2 from "../../components/meeting/MeetingModal2";

const ManageCertificate2 = () => {
  // Arji & Certificate
  const [meetings, setMeetings] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editData, setEditData] = React.useState(null);

  const loadData = async () => {
    const res = await fetchMeetings();
    setMeetings(res.data || []);
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (data) => {
    if (data.id) await updateMeeting(data);
    else await createMeeting(data);

    setModalOpen(false);
    setEditData(null);
    loadData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this meeting?")) return;
    await deleteMeeting(id);
    loadData();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Yaadi Arji</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Add Record
        </button>
      </div>

      <MeetingsTable2
        data={meetings}
        onEdit={(m) => {
          setEditData(m);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <MeetingModal2
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={handleSave}
        initialData={editData}
      />
    </div>
  );
};

export default ManageCertificate2;
// Arji & Certificate
