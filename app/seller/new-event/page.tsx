import EventForm from "@/components/EventForm"

export default function NewEvevntPage(){
    return(
        <div className="max-w-3xl mx-auto p-6">
            <div className="bg-whit rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-800 px-6 py-8 text-white">
                        <h2 className="text-2xl font-bold">Create New Event</h2>
                        <p className="text-blue-100 mt-2">
                            List your Event and start selling tickets
                        </p>
                    </div>
                    <div className="p-6">
                        <EventForm mode="create"/>
                    </div>
                </div>
        </div>
    )

}