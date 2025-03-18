import Image from "next/image";
import EventList from "@/components/EventList";
import baseUrl from "@/lib/baseUrl";
export default function Home() {
  console.log(baseUrl)
  return (
    <div>
        <EventList/>
    </div>
  );
}
