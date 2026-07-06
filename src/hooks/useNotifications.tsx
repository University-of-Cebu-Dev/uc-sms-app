import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Notification } from '@/types'
import { notificationsApi } from '@/services/notifications'
import { useAuth } from '@/hooks/useAuth'

interface NotificationsContextValue {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  refresh: () => Promise<void>
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([])
      return
    }

    setIsLoading(true)
    try {
      const data = await notificationsApi.list()
      setNotifications(data)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const markRead = useCallback(async (id: string) => {
    await notificationsApi.markRead(id)
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    )
  }, [])

  const markAllRead = useCallback(async () => {
    await notificationsApi.markAllRead()
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }, [])

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, isLoading, refresh, markRead, markAllRead }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider')
  return ctx
}
