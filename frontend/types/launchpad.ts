export interface Participant {
  id: string
  name: string
  status: "ready" | "preparing"
  avatar: string
}
