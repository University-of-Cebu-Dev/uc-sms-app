import { apiRequest } from '@/lib/api'
import type { Notification } from '@/types'

export const notificationsApi = {
  list() {
    return apiRequest<Notification[]>('/notifications')
  },

  unreadCount() {
    return apiRequest<{ count: number }>('/notifications/unread-count')
  },

  markRead(id: string) {
    return apiRequest<void>(`/notifications/${id}/read`, { method: 'PATCH' })
  },

  markAllRead() {
    return apiRequest<void>('/notifications/read-all', { method: 'PATCH' })
  },
}
