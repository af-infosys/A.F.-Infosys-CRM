import React, { useState, useEffect } from "react";

import apiPath from "../../isProduction";

// Main App component
const App = () => {
  // App-specific state
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({
    uniqueId: "",
    title: "",
    text: "",
    imageLink: "",
    videoLink: "",
    audioLink: "",
    documentLink: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteCandidateId, setDeleteCandidateId] = useState(null);

  // State for API calls
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch all messages from the backend API
  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${await apiPath()}/api/messages`);
      if (!response.ok) {
        throw new Error("Failed to fetch messages.");
      }
      const data = await response.json();
      // The backend returns an array of message objects, so we can set the state directly
      setMessages(data.data);
    } catch (e) {
      console.error("Error fetching messages:", e);
      setError(
        "Failed to load messages. Please check your network and server connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Call fetchMessages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (editingId) {
        // Update existing message
        const response = await fetch(
          `${await apiPath()}/api/messages/${editingId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update message.");
        }
      } else {
        // Add a new message
        const response = await fetch(`${await apiPath()}/api/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error("Failed to add message.");
        }
      }
      // Re-fetch all messages to update the list
      await fetchMessages();
      setEditingId(null);
    } catch (e) {
      console.error("Submission error:", e);
      setError("Failed to save message. Please try again.");
    } finally {
      setIsLoading(false);
      // Reset form
      setFormData({
        uniqueId: "",
        title: "",
        text: "",
        imageLink: "",
        videoLink: "",
        audioLink: "",
        documentLink: "",
      });
    }
  };

  // Set form data for editing
  const handleEdit = (message) => {
    setEditingId(message.uniqueId); // Use uniqueId for editing
    setFormData({
      uniqueId: message.uniqueId,
      title: message.title,
      text: message.text,
      imageLink: message.imageLink,
      videoLink: message.videoLink,
      audioLink: message.audioLink,
      documentLink: message.documentLink,
    });
  };

  // Handle delete modal
  const handleDeleteClick = (uniqueId) => {
    setDeleteCandidateId(uniqueId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    setShowModal(false);
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${await apiPath()}/api/messages/${deleteCandidateId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete message.");
      }
      // Re-fetch all messages to update the list
      await fetchMessages();
    } catch (e) {
      console.error("Deletion error:", e);
      setError("Failed to delete message. Please try again.");
    } finally {
      setIsLoading(false);
      setDeleteCandidateId(null);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setDeleteCandidateId(null);
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);

    // Format: 23 Aug, 2025
    const datePart = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // Format: 05:00 PM
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${datePart} - ${timePart}`;
  };

  // Custom Modal Component for Delete Confirmation
  const DeleteConfirmationModal = ({ show, onConfirm, onCancel }) => {
    if (!show) return null;
    return (
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
        style={{ zIndex: 9999 }}
      >
        <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Confirm Deletion
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this message format? This action
              cannot be undone.
            </p>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased">
      <DeleteConfirmationModal
        show={showModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 my-8">
          WhatsApp Message Manager
        </h1>

        {/* Form for adding/editing messages */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {editingId ? "Edit Message Format" : "Add New Message Format"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Show unique ID field only in edit mode and make it read-only */}

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title (e.g., 'Welcome Message')
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                placeholder="A unique title for the message"
              />
            </div>
            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700"
              >
                Text Content
              </label>
              <textarea
                id="text"
                name="text"
                value={formData.text}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                placeholder="The text of your message (optional)"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="imageLink"
                className="block text-sm font-medium text-gray-700"
              >
                Image Link
              </label>
              <input
                type="url"
                id="imageLink"
                name="imageLink"
                value={formData.imageLink}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                placeholder="Link to an image (optional)"
              />
            </div>
            <div>
              <label
                htmlFor="videoLink"
                className="block text-sm font-medium text-gray-700"
              >
                Video Link
              </label>
              <input
                type="url"
                id="videoLink"
                name="videoLink"
                value={formData.videoLink}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                placeholder="Link to a video (optional)"
              />
            </div>
            <div>
              <label
                htmlFor="audioLink"
                className="block text-sm font-medium text-gray-700"
              >
                Audio Link
              </label>
              <input
                type="url"
                id="audioLink"
                name="audioLink"
                value={formData.audioLink}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                placeholder="Link to an audio file (optional)"
              />
            </div>
            <div>
              <label
                htmlFor="documentLink"
                className="block text-sm font-medium text-gray-700"
              >
                Document Link
              </label>
              <input
                type="url"
                id="documentLink"
                name="documentLink"
                value={formData.documentLink}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                placeholder="Link to a document (optional)"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-2 rounded-md font-semibold text-white transition-colors duration-200 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isLoading
                ? "Saving..."
                : editingId
                ? "Update Message"
                : "Add Message"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    uniqueId: "",
                    title: "",
                    text: "",
                    imageLink: "",
                    videoLink: "",
                    audioLink: "",
                    documentLink: "",
                  });
                }}
                className="mt-2 w-full px-4 py-2 rounded-md font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel Edit
              </button>
            )}
          </form>
          {error && (
            <div className="mt-4 text-red-600 text-sm text-center">{error}</div>
          )}
        </div>

        {/* Display list of messages */}
        <div className="bg-white p-3 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Saved Message Formats
          </h2>
          {isLoading && !error && (
            <div className="text-center py-8 text-gray-500">
              Loading messages...
            </div>
          )}
          {!isLoading && messages.length === 0 && !error && (
            <div className="text-center py-8 text-gray-500">
              No message formats found. Add one using the form above.
            </div>
          )}
          <ul className="space-y-4">
            {messages.map((msg) => (
              <li
                key={msg.uniqueId}
                className="border border-gray-200 rounded-lg p-4 transition-transform transform hover:scale-[1.01] duration-150 ease-in-out"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-indigo-600">
                      {msg.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {" "}
                      Created At: {formatTimestamp(msg.timestamp)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(msg)}
                      className="text-sm px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(msg.uniqueId)}
                      className="text-sm px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {msg.text && (
                  <p className="text-gray-700 mb-2 whitespace-pre-wrap">
                    <span className="font-semibold">Text:</span> {msg.text}
                  </p>
                )}

                {/* Media Previews */}
                {msg.imageLink && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 truncate mb-1">
                      <span className="font-semibold">Image Link:</span>{" "}
                      {msg.imageLink}
                    </p>
                    <img
                      src={msg.imageLink}
                      alt="Message Preview"
                      className="max-w-xs h-auto rounded-md shadow-sm"
                      style={{ width: "100%" }}
                    />
                  </div>
                )}
                {msg.videoLink && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 truncate mb-1">
                      <span className="font-semibold">Video Link:</span>{" "}
                      {msg.videoLink}
                    </p>
                    <video
                      src={msg.videoLink}
                      controls
                      className="max-w-xs h-auto rounded-md shadow-sm"
                      style={{ width: "100%" }}
                    />
                  </div>
                )}
                {msg.audioLink && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 truncate mb-1">
                      <span className="font-semibold">Audio Link:</span>{" "}
                      {msg.audioLink}
                    </p>
                    <audio
                      src={msg.audioLink}
                      controls
                      className="w-full"
                      style={{ width: "100%" }}
                    />
                  </div>
                )}
                {msg.documentLink && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 truncate mb-1">
                      <span className="font-semibold">Document Link:</span>{" "}
                      {msg.documentLink}
                    </p>

                    <a
                      href={msg.documentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
