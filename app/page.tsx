import Image from "next/image";
import EventList from "@/components/EventList";
import baseUrl from "@/lib/baseUrl";
export default function Home() {
  console.log("Using Webhook Secret:", process.env.STRIPE_WEBHOOK_SECRET);
  return (
    <div>
        <EventList/>
    </div>
  );
}
