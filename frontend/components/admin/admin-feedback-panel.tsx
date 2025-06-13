"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { supabase } from "@/lib/supabase"

interface Feedback {
  id: number
  created_at: string
  email: string
  feedback_text: string
  resolved: boolean
}

const AdminFeedbackPanel = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([])
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    // const supabase = createClient(
    //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    // );

    const { data, error } = await supabase.from("feedback").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching feedback:", error)
    } else {
      setFeedbackList(data as Feedback[])
    }
  }

  const handleResolve = (feedbackId: number) => {
    setSelectedFeedback(feedbackList.find((feedback) => feedback.id === feedbackId) || null)
    setOpenDialog(true)
  }

  const confirmResolve = async () => {
    if (selectedFeedback) {
      // const supabase = createClient(
      //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
      //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      // );

      const { error } = await supabase.from("feedback").update({ resolved: true }).eq("id", selectedFeedback.id)

      if (error) {
        console.error("Error resolving feedback:", error)
      } else {
        fetchFeedback() // Refresh feedback list
      }
    }
    setOpenDialog(false)
    setSelectedFeedback(null)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedFeedback(null)
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Feedback</TableCell>
              <TableCell>Resolved</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbackList.map((feedback) => (
              <TableRow key={feedback.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {new Date(feedback.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{feedback.email}</TableCell>
                <TableCell>{feedback.feedback_text}</TableCell>
                <TableCell>{feedback.resolved ? "Yes" : "No"}</TableCell>
                <TableCell>
                  {!feedback.resolved && (
                    <Button variant="contained" color="primary" onClick={() => handleResolve(feedback.id)}>
                      Resolve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Resolve Feedback?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to mark this feedback as resolved?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmResolve} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AdminFeedbackPanel
