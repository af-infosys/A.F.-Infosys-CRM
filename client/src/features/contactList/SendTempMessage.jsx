import { useEffect, useState } from "react";
import apiPath from "../../isProduction";

const formatTimestamp = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);

  const datePart = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const timePart = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return { date: datePart, time: timePart };
};

const SendTempMessage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${await apiPath()}/api/messages`);
      if (!response.ok) throw new Error("Failed to fetch messages.");

      const data = await response.json();
      const formattedData = data.data.map((msg) => {
        const { date, time } = formatTimestamp(msg.timestamp);
        return { ...msg, formattedDate: date, formattedTime: time };
      });
      setMessages(formattedData);
    } catch (e) {
      console.error("Error fetching messages:", e);
      setError(
        "Failed to load messages. Please check your network and server connection.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  function onSelect(format) {
    const formattedNumber = `91${window.prompt("Enter WhatsApp number:")}`;

    window.open(
      `https://wa.me/${formattedNumber}?text=${encodeURIComponent(
        format.text,
      )}${format.imageLink && `&image=${format.imageLink}`}${
        format.videoLink && `&video=${format.videoLink}`
      }${format.audioLink && `&audio=${format.audioLink}`}${
        format.documentLink && `&document=${format.documentLink}`
      }`,
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 w-full relative">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Select a Message Format
      </h2>

      {isLoading && !error && (
        <p className="text-center text-gray-500">Loading messages...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!isLoading && !error && messages.length === 0 && (
        <p className="text-gray-500 text-center">
          No saved message formats found.
        </p>
      )}

      {!isLoading && !error && messages.length > 0 && (
        <ul className="space-y-4 overflow-y-auto">
          {messages.map((msg) => (
            <li
              key={msg.uniqueId}
              className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-indigo-600">
                    {msg.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Created At: {msg.formattedDate} - {msg.formattedTime}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onSelect(msg); // Pass selected format up
                  }}
                  className="px-3 py-1 text-sm rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors"
                >
                  Select
                </button>
              </div>

              {msg.text && (
                <p className="text-gray-700 mb-2 whitespace-pre-wrap">
                  <span className="font-semibold">Text:</span> {msg.text}
                </p>
              )}

              {/* Media Previews */}
              {msg.imageLink && (
                <img
                  src={msg.imageLink}
                  alt="preview"
                  className="max-w-xs rounded-md mt-2"
                />
              )}
              {msg.videoLink && (
                <video
                  src={msg.videoLink}
                  controls
                  className="max-w-xs mt-2 rounded-md"
                />
              )}
              {msg.audioLink && (
                <audio src={msg.audioLink} controls className="w-full mt-2" />
              )}
              {msg.documentLink && (
                <a
                  href={msg.documentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline block mt-2"
                >
                  View Document
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SendTempMessage;
