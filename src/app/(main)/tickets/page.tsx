import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function TicketsPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">My Tickets</h1>
      <p className="text-muted-foreground">Ini adalah halaman tiket saya yang terproteksi.</p>
    </div>
  )
}
