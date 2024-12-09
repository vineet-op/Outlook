import Emails from "./components/Emails"
import axios from "axios"
import { useEffect, useState } from "react"


export default function App() {

  const [datas, SetDatas] = useState([])

  useEffect(() => {

    getData()

  }, [])

  async function getData() {
    const response = await axios.get("https://flipkart-email-mock.vercel.app/")
    SetDatas(response.data.list)
    console.log(response.data.list);
  }


  return (

    <main className="grid grid-cols-2">
      <div className="flex flex-col items-center col-span-1 justify-center mx-auto p-5">
        {datas.map((data) => (
          <Emails
            key={data.id}
            from={data.from.name}
            email={data.from.email}
            subject={data.subject}
            preview={data.short_description}
            timestamp="26/02/2020 10:30am"
          />
        ))}
      </div>
      <div className="h-full bg-red-300 p-5">
        Hello
      </div>
    </main>

  )
}