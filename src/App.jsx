import Emails from "./components/Emails";
import axios from "axios";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function App() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailBody, setEmailBody] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchEmails();
  }, []);

  async function fetchEmails() {
    const response = await axios.get("https://flipkart-email-mock.vercel.app/");
    const emailsWithExtras = response.data.list.map((email) => ({
      ...email,
      isRead: false,
      isFavorite: false,
    }));
    setEmails(emailsWithExtras);
  }

  async function fetchEmailBody(id) {
    const response = await axios.get(
      `https://flipkart-email-mock.vercel.app/?id=${id}`
    );
    setEmailBody(response.data.body);
  }

  const handleEmailClick = (email) => {
    const updatedEmails = emails.map((e) =>
      e.id === email.id ? { ...e, isRead: true } : e
    );
    setEmails(updatedEmails);
    setSelectedEmail(email);
    fetchEmailBody(email.id);
  };

  const toggleFavorite = (id) => {
    const updatedEmails = emails.map((e) =>
      e.id === id ? { ...e, isFavorite: !e.isFavorite } : e
    );
    setEmails(updatedEmails);

    // Update selectedEmail if the toggled email is currently selected
    if (selectedEmail?.id === id) {
      setSelectedEmail((prev) => ({
        ...prev,
        isFavorite: !prev.isFavorite,
      }));
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const applyFilter = () => {
    if (filter === "favorites") return emails.filter((email) => email.isFavorite);
    if (filter === "read") return emails.filter((email) => email.isRead);
    if (filter === "unread") return emails.filter((email) => !email.isRead);
    return emails;
  };

  return (
    <main className="grid grid-cols-1 md:grid-cols-5 h-screen p-4 gap-4">
      {/* Filter Buttons */}
      <div className="col-span-1 md:col-span-5 p-4 bg-theme-background items-center flex gap-1 flex-wrap justify-center md:justify-start">
        <div className="font-medium pl-2">
          <p>Filters By:</p>
        </div>

        <button
          className="px-4 py-2 text-black rounded-full font-medium"
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className="px-3 py-2 text-black rounded-full font-medium"
          onClick={() => setFilter("unread")}
        >
          Unread
        </button>
        <button
          className="px-4 py-2 text-black rounded-full font-medium"
          onClick={() => setFilter("read")}
        >
          Read
        </button>
        <button
          className="px-4 py-2 text-black rounded-full font-medium"
          onClick={() => setFilter("favorites")}
        >
          Favorites
        </button>
      </div>

      {/* Emails List */}
      <div className="col-span-1 md:col-span-2 bg-theme-background overflow-y-auto custom-scrollbar">
        {applyFilter().map((email) => (
          <Emails
            key={email.id}
            from={email.from.name}
            email={email.from.email}
            subject={email.subject}
            preview={email.short_description}
            timestamp={formatTimestamp(email.date)}
            onClick={() => handleEmailClick(email)}
            className={`cursor-pointer p-4 border-b ${email.isRead ? "bg-gray-300" : "bg-white"}`}
          />
        ))}
      </div>

      {/* Email Details */}
      <div className="col-span-1 md:col-span-3 bg-white px-4 md:px-10 py-6 rounded-md">
        {selectedEmail ? (
          <div className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 bg-destructive">
                <AvatarFallback className="bg-theme-accent text-2xl text-theme-readBg">
                  {selectedEmail.from.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{selectedEmail.subject}</h2>
              <button
                className={`absolute lg:w-40 lg:h-10 w-25 text-sm h-12 text-center text-white p-1 font-semibold rounded-3xl right-20 ${selectedEmail.isFavorite ? "bg-red-100" : "bg-theme-accent"}`}
                onClick={() => toggleFavorite(selectedEmail.id)}
              >
                {selectedEmail.isFavorite ? "Unmark Favorite" : "Mark as Favorite"}
              </button>
            </div>
            <p className="pt-4 text-theme-textcolor">
              {selectedEmail.date ? formatTimestamp(selectedEmail.date) : "NA"}
            </p>
            <div className="mt-10 text-theme-textcolor whitespace-pre-wrap">
              {parse(emailBody) || "Loading..."}
            </div>
          </div>
        ) : (
          <p className="flex flex-col text-theme-accent font-normal text-xl h-screen justify-center text-center">
            Select an email to view details
          </p>
        )}
      </div>
    </main>
  );
}
