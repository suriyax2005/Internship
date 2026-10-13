import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      import.meta.env.VITE_BACKEND_URL ||
      window.location.origin;
    const newSocket = io(socketUrl, {
      auth: { token: activeToken },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Socket.IO connected:', newSocket.id);
    });

    newSocket.on('ticket:created', (data) => {
      const notification = {
        id: Date.now() + Math.random(),
        type: 'maintenance',
        title: 'New Maintenance Request',
        message: `Ticket "${data.title}" was submitted (${data.priority} priority).`,
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((c) => c + 1);
      toast.success(`🔧 New Ticket: ${data.title}`, {
        duration: 4000,
        position: 'top-right',
      });
    });

    newSocket.on('ticket:updated', (data) => {
      const notification = {
        id: Date.now() + Math.random(),
        type: 'maintenance',
        title: 'Maintenance Ticket Updated',
        message: `Ticket "${data.title}" status changed to ${data.status}.`,
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((c) => c + 1);
      toast(`🛠️ Ticket Updated: ${data.title} is now ${data.status}`, {
        duration: 4000,
        position: 'top-right',
      });
    });

    newSocket.on('payment:created', (data) => {
      const notification = {
        id: Date.now() + Math.random(),
        type: 'payment',
        title: 'New Rent Invoice Generated',
        message: `Payment of $${data.amount} is due on ${new Date(data.dueDate).toLocaleDateString()}.`,
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((c) => c + 1);
      toast.success(`💳 Rent Due: $${data.amount}`, {
        duration: 4000,
        position: 'top-right',
      });
    });

    newSocket.on('payment:updated', (data) => {
      const notification = {
        id: Date.now() + Math.random(),
        type: 'payment',
        title: 'Payment Status Updated',
        message: `Payment of $${data.amount} status is now ${data.paymentStatus}.`,
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((c) => c + 1);
      if (data.paymentStatus === 'PAID') {
        toast.success(`✅ Payment of $${data.amount} received!`, {
          duration: 4000,
          position: 'top-right',
        });
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, token]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        unreadCount,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext) || {};
};
