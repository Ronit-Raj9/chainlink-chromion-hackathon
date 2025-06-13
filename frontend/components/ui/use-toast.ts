"use client"

// Simplified version adapted for this project
import * as React from "react"

import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

// Simple toast state management
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()
const listeners: Array<(state: ToasterToast[]) => void> = []
let toasts: ToasterToast[] = []

function dispatch(action: any) {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      toasts = [action.toast, ...toasts].slice(0, TOAST_LIMIT)
      break

    case actionTypes.UPDATE_TOAST:
      toasts = toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t))
      break

    case actionTypes.DISMISS_TOAST:
      toasts = toasts.map((t) => (t.id === action.toastId ? { ...t, open: false } : t))
      break

    case actionTypes.REMOVE_TOAST:
      toasts = toasts.filter((t) => t.id !== action.toastId)
      break
  }

  listeners.forEach((listener) => {
    listener(toasts)
  })
}

export function toast({ ...props }: Omit<ToasterToast, "id">) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    })

  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

export function useToast() {
  const [state, setState] = React.useState<ToasterToast[]>(toasts)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        dispatch({ type: actionTypes.DISMISS_TOAST, toastId })
      }
    },
    toasts: state,
  }
}
