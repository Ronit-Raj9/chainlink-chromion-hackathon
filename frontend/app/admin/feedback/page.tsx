import { supabase } from "@/lib/supabase"

async function getFeedback() {
  const { data, error } = await supabase.from("feedback").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching feedback:", error)
    return []
  }

  return data
}

export default async function FeedbackPage() {
  const feedback = await getFeedback()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Feedback</h1>
      {feedback.length > 0 ? (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Feedback</th>
              <th className="px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.id}</td>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.email}</td>
                <td className="border px-4 py-2">{item.feedback}</td>
                <td className="border px-4 py-2">{new Date(item.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No feedback available.</p>
      )}
    </div>
  )
}
