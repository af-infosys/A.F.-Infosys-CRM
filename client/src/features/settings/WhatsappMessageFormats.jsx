import React, { useState } from "react";

const WhatsappMessageFormats = () => {
  // App-specific state. Data is now managed in memory.
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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission (add or update)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      // Update existing message in the in-memory array
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === editingId ? { ...formData, id: editingId } : msg
        )
      );
      setEditingId(null);
    } else {
      // Add a new message with a new unique ID
      const newId = crypto.randomUUID();
      const newUniqueId = crypto.randomUUID();
      const newEntry = {
        ...formData,
        id: newId,
        uniqueId: newUniqueId,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, newEntry]);
    }

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
  };

  // Set form data for editing
  const handleEdit = (message) => {
    setEditingId(message.id);
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

  // Delete a message
  const handleDelete = (id) => {
    // NOTE: For better UX, use a custom modal instead of window.confirm
    if (
      window.confirm("Are you sure you want to delete this message format?")
    ) {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== id)
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans antialiased">
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
            {editingId && (
              <div>
                <label
                  htmlFor="uniqueId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Unique ID
                </label>
                <input
                  type="text"
                  id="uniqueId"
                  name="uniqueId"
                  value={formData.uniqueId}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-gray-200 cursor-not-allowed"
                />
              </div>
            )}
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
                placeholder="Unique ID or Title for the message"
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
              className={`w-full px-4 py-2 rounded-md font-semibold text-white transition-colors duration-200 bg-indigo-600 hover:bg-indigo-700`}
            >
              {editingId ? "Update Message" : "Add Message"}
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
        </div>

        {/* Display list of messages */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Saved Message Formats
          </h2>
          {messages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No message formats found. Add one using the form above.
            </div>
          )}
          <ul className="space-y-4">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className="border border-gray-200 rounded-lg p-4 transition-transform transform hover:scale-[1.01] duration-150 ease-in-out"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-indigo-600">
                      {msg.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Unique ID: {msg.uniqueId}
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
                      onClick={() => handleDelete(msg.id)}
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
                    />
                  </div>
                )}
                {msg.audioLink && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 truncate mb-1">
                      <span className="font-semibold">Audio Link:</span>{" "}
                      {msg.audioLink}
                    </p>
                    <audio src={msg.audioLink} controls className="w-full" />
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

export default WhatsappMessageFormats;
