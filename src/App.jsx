import Emails from "./components/Emails"
import axios from "axios"
import { useEffect, useState } from "react"
import parse from 'html-react-parser';
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function App() {

  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailBody, setEmailBody] = useState("");

  useEffect(() => {
    fetchEmails();
  }, [])

  async function fetchEmails() {
    const response = await axios.get("https://flipkart-email-mock.vercel.app/")
    setEmails(response.data.list);
    console.log(response.data.list.date[0])
  }

  async function fetchEmailBody(id) {
    const response = await axios.get(`https://flipkart-email-mock.vercel.app/?id=${id}`);
    setEmailBody(response.data.body);
    console.log(response.data.body);
  }

  // Handle email click
  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    fetchEmailBody(email.id);
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

  return (
    <main className="grid grid-cols-5 h-screen p-4">
      <div className="col-span-2 bg-gray-100 overflow-hidden">
        {emails.map((email) => (
          <Emails
            key={email.id}
            from={email.from.name}
            email={email.from.email}
            subject={email.subject}
            preview={email.short_description}
            timestamp="26/02/2020 10:30am"
            onClick={() => handleEmailClick(email)}
          />
        ))}
      </div>

      {/* Email Details */}
      <div className="col-span-3 p-4">
        {selectedEmail ? (
          <div className="p-10">
            <div className="flex flex-row items-center justify-start gap-3">

              <Avatar className="h-10 w-10 bg-destructive">
                <AvatarFallback className=" bg-theme-accent text-2xl text-theme-readBg">
                  {selectedEmail.from.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{selectedEmail.subject}</h2>
              <button className="absolute bg-theme-accent  w-40 h-21 text-center text-white p-1 font-semibold rounded-3xl right-20">Mark as favorite</button>
            </div>
            <p className=" pt-4 pl-4  text-black">{selectedEmail.date ? formatTimestamp(selectedEmail.date) : "NA"}</p>
            <div className="mt-10 text-gray-800 whitespace-pre-wrap">
              {parse(emailBody) || "Loading..."}
            </div>
          </div>
        ) : (
          <p className="flex flex-col text-theme-accent font-normal text-xl h-screen justify-center text-center">Select an email to view details</p>
        )}
      </div>
    </main >

  )
}