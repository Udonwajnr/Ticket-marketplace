"use client"
import type React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormItem, FormField, FormMessage, FormLabel, FormDescription } from "@/components/ui/form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { useRef, useState, useTransition } from "react"
import Image from "next/image"
import type { Id } from "@/convex/_generated/dataModel"
import { Calendar, Clock, ImagePlus, Loader2, MapPin, Tag, Ticket, X } from "lucide-react"
import { toast } from "sonner"
import { useStorageUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  eventDate: z
    .date()
    .refine((date) => {
      const now = new Date()
      return date.getTime() > now.getTime()
    }, "Event must be in the future")
    .refine((date) => {
      const now = new Date()
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000)
      const isToday = date.toDateString() === now.toDateString()

      return !isToday || date.getTime() >= oneHourFromNow.getTime()
    }, "Events today must be at least 1 hour from now"),
  price: z.number().min(0, "Price must be 0 or greater"),
  totalTickets: z.number().min(1, "Must have at least 1 ticket"),
})

type FormData = z.infer<typeof formSchema>

interface InitialEvevntData {
  _id: Id<"events">
  name: string
  description: string
  location: string
  eventDate: number
  price: number
  totalTickets: number
  imageStorageId?: Id<"_storage">
}

interface eventFormProps {
  mode: "create" | "edit"
  initialData?: InitialEvevntData
}

function EventForm({ mode, initialData }: eventFormProps) {
  const { user } = useUser()
  const createEvent = useMutation(api.events.create)
  const updateEvent = useMutation(api.events.updateEvent)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const currentImageUrl = useStorageUrl(initialData?.imageStorageId)

  // image uploading
  const imageInput = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl)
  const updateEventImage = useMutation(api.storage.updateEventImage)
  const deleteImage = useMutation(api.storage.deleteImage)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      location: initialData?.location ?? "",
      eventDate: initialData
        ? new Date(initialData.eventDate)
        : (() => {
            const date = new Date()
            date.setHours(date.getHours() + 1, 0, 0, 0) // Set to 1 hour from now
            return date
          })(),
      price: initialData?.price ?? 0,
      totalTickets: initialData?.totalTickets ?? 1,
    },
  })

  async function onSubmit(values: FormData) {
    if (!user?.id) return
    startTransition(async () => {
      try {
        let imageStorageId = null

        // handle image changes
        if (selectedImage) {
          imageStorageId = await handleImageUpload(selectedImage)
        }
        if (mode === "edit" && initialData?.imageStorageId) {
          if (removeCurrentImage || selectedImage) {
            //delete old Image from storage
            await deleteImage({
              storageId: initialData.imageStorageId,
            })
          }
        }
        if (mode === "create") {
          const eventId = await createEvent({
            ...values,
            userId: user.id,
            eventDate: values.eventDate.getTime(),
          })
          if (imageStorageId) {
            await updateEventImage({
              eventId,
              storageId: imageStorageId as Id<"_storage">,
            })
          }

          toast.success("Event created successfully!")
          router.push(`/events/${eventId}`)
        } else {
          if (!initialData) {
            throw new Error("Initial event data is required for updates")
          }

          await updateEvent({
            eventId: initialData._id,
            ...values,
            eventDate: values.eventDate.getTime(),
          })

          if (imageStorageId || removeCurrentImage) {
            await updateEventImage({
              eventId: initialData._id,
              storageId: imageStorageId ? (imageStorageId as Id<"_storage">) : null,
            })
          }
          toast.success("Event updated successfully!")
          router.push(`/events/${initialData._id}`)
        }
      } catch (error) {
        console.error("Failed to handle event", error)
        toast.error("Uh oh! Something went wrong")
      }
    })
  }

  async function handleImageUpload(file: File): Promise<string | null> {
    try {
      const postUrl = await generateUploadUrl()
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      })
      const { storageId } = await result.json()
      return storageId
    } catch (error) {
      console.log("Failed to upload Image", error)
      return null
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const [removeCurrentImage, setRemovedCurrentImage] = useState(false)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Basic Information</h3>
            <p className="text-sm text-gray-500">Provide the essential details about your event</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="Enter event name"
                        className="pl-3 h-10 rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        placeholder="Enter event location"
                        className="pl-9 h-10 rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe your event in detail..."
                    className="min-h-[120px] rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-y"
                  />
                </FormControl>
                <FormDescription>
                  Provide a detailed description to help attendees understand what your event is about.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Date & Time</h3>
            <p className="text-sm text-gray-500">When will your event take place?</p>
          </div>

          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Event Date & Time</FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input
                        type="date"
                        className="pl-9 h-10 rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        onChange={(e) => {
                          const currentValue = field.value || new Date()
                          if (e.target.value) {
                            const [year, month, day] = e.target.value.split("-").map(Number)
                            const newDate = new Date(currentValue)
                            newDate.setFullYear(year, month - 1, day)
                            field.onChange(newDate)
                          }
                        }}
                        value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </FormControl>
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input
                        type="time"
                        className="pl-9 h-10 rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        onChange={(e) => {
                          const currentValue = field.value || new Date()
                          if (e.target.value) {
                            const [hours, minutes] = e.target.value.split(":").map(Number)
                            const newDate = new Date(currentValue)
                            newDate.setHours(hours, minutes, 0, 0)
                            field.onChange(newDate)
                          }
                        }}
                        value={
                          field.value
                            ? `${String(new Date(field.value).getHours()).padStart(2, "0")}:${String(new Date(field.value).getMinutes()).padStart(2, "0")}`
                            : ""
                        }
                      />
                    </FormControl>
                  </div>
                </div>
                <FormDescription>
                  Events must be in the future. If creating an event today, it must be at least 1 hour from now.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Tickets & Pricing</h3>
            <p className="text-sm text-gray-500">Set your ticket price and availability</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per Ticket</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <span className="absolute left-9 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="pl-12 h-10 rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Set to 0 for free events</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalTickets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Tickets Available</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="pl-9 h-10 rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>The maximum number of tickets that can be sold</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Event Image</h3>
            <p className="text-sm text-gray-500">Upload an image to make your event stand out</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            {imagePreview || (!removeCurrentImage && currentImageUrl) ? (
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-md aspect-video bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                  <Image
                    src={imagePreview || currentImageUrl!}
                    alt="Event preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null)
                      setImagePreview(null)
                      setRemovedCurrentImage(true)
                      if (imageInput.current) {
                        imageInput.current.value = ""
                      }
                    }}
                    className="absolute top-2 right-2 bg-white text-gray-700 hover:text-red-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-md border border-gray-200"
                    aria-label="Remove image"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="mt-3 text-sm text-gray-500">Click the X to remove and upload a different image</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <ImagePlus className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-2">Drag and drop an image, or click to browse</p>
                <p className="text-xs text-gray-500 mb-4 text-center max-w-xs">
                  Recommended size: 1200 x 630 pixels. JPG, PNG or GIF.
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={imageInput}
                  className="block w-full max-w-xs text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            )}
          </div>
        </div>

        <div className="pt-6">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg h-12"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{mode === "create" ? "Creating Event..." : "Updating Event"}</span>
              </>
            ) : (
              <span>{mode === "create" ? "Create Event" : "Update Event"}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default EventForm

