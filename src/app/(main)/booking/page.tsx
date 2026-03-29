import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function BookingPage() {
  const session = await auth()
  
  // This is technically already handled by middleware, 
  // but we can add server-side check as fallback/layering.
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Booking Page</h1>
      <p className="text-muted-foreground">Ini adalah halaman booking yang terproteksi.</p>
    </div>
  )
}
