import React from "react";
import MeetingsTable from "../../components/meeting/MeetingsTable";
import MeetingModal from "../../components/meeting/MeetingModal";
import {
  createMeeting,
  deleteMeeting,
  fetchMeetings,
  updateMeeting,
} from "./meetingsApi";

const ManageCertificate = () => {
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
        <h1 className="text-2xl font-bold">Meetings</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Add Meeting
        </button>
      </div>

      <MeetingsTable
        data={meetings}
        onEdit={(m) => {
          setEditData(m);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <MeetingModal
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

export default ManageCertificate;
// Arji & Certificate
