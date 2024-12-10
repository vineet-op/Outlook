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
      weekday: "long",
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
    <main className="grid grid-cols-5 h-screen p-4">
      {/* Filter Buttons */}
      <div className="col-span-5 p-4 bg-theme-background items-center flex gap-1">

        <div className="font-medium pl-2">
          <p>Filters By:</p>
        </div>

        <button
          className="px-4 py-2 pl-10  text-black rounded-full font-medium"
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className="px-3 py-2  text-black rounded-full font-medium"
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
          className="px-4 py-2  text-black rounded-full font-medium"
          onClick={() => setFilter("favorites")}
        >
          Favorites
        </button>
      </div>

      {/* Emails List */}
      <div className="col-span-2 bg-theme-background overflow-y-auto custom-scrollbar">
        {applyFilter().map((email) => (
          <Emails
            key={email.id}
            from={email.from.name}
            email={email.from.email}
            subject={email.subject}
            preview={email.short_description}
            timestamp={formatTimestamp(email.date)}
            onClick={() => handleEmailClick(email)}
            className={`cursor-pointer p-4 border-b ${email.isRead ? "bg-gray-300" : "bg-white"
              }`}
          />
        ))}
      </div>

      {/* Email Details */}
      <div className="col-span-3 mt-4  bg-white px-10 w-full  rounded-full">
        {selectedEmail ? (
          <div className="p-10">
            <div className="flex flex-row items-center justify-start gap-3">
              <Avatar className="h-10 w-10 bg-destructive">
                <AvatarFallback className="bg-theme-accent text-2xl text-theme-readBg">
                  {selectedEmail.from.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{selectedEmail.subject}</h2>
              <button
                className={`absolute w-40 h-10 text-center text-white p-1 font-semibold rounded-3xl right-20 ${selectedEmail.isFavorite ? "bg-red-100" : "bg-theme-accent"}`}
                onClick={() => toggleFavorite(selectedEmail.id)}
              >
                {selectedEmail.isFavorite ? "Unmark Favorite" : "Mark as Favorite"}
              </button>
            </div>
            <p className="pt-4 pl-4 text-black">
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
