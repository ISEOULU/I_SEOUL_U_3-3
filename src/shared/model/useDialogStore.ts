import { create } from "zustand"

interface DialogState {
  showAddDialog: boolean
  showEditDialog: boolean
  showAddCommentDialog: boolean
  showEditCommentDialog: boolean
  showPostDetailDialog: boolean
  showUserModal: boolean

  setShowAddDialog: (show: boolean) => void
  setShowEditDialog: (show: boolean) => void
  setShowAddCommentDialog: (show: boolean) => void
  setShowEditCommentDialog: (show: boolean) => void
  setShowPostDetailDialog: (show: boolean) => void
  setShowUserModal: (show: boolean) => void
}

export const useDialogStore = create<DialogState>((set) => ({
  showAddDialog: false,
  showEditDialog: false,
  showAddCommentDialog: false,
  showEditCommentDialog: false,
  showPostDetailDialog: false,
  showUserModal: false,

  setShowAddDialog: (show) => set({ showAddDialog: show }),
  setShowEditDialog: (show) => set({ showEditDialog: show }),
  setShowAddCommentDialog: (show) => set({ showAddCommentDialog: show }),
  setShowEditCommentDialog: (show) => set({ showEditCommentDialog: show }),
  setShowPostDetailDialog: (show) => set({ showPostDetailDialog: show }),
  setShowUserModal: (show) => set({ showUserModal: show }),
}))
