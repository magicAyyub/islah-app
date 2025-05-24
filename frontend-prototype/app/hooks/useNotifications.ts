import { useState } from 'react';
import { Notification, AdminAlert } from '../types/dashboard';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: "Nouveau paiement reçu", time: "Il y a 2 heures", read: false },
    { id: 2, title: "Demande d'accès en attente", time: "Il y a 3 heures", read: false },
    { id: 3, title: "Rappel: Réunion demain", time: "Il y a 5 heures", read: true },
  ]);

  const [adminAlert, setAdminAlert] = useState<AdminAlert>({
    show: true,
    message: "Veuillez mettre à jour vos coordonnées avant le 30 octobre.",
  });

  const handleNotificationClick = (id: string | number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const dismissAlert = () => {
    setAdminAlert((prev) => ({ ...prev, show: false }));
  };

  return {
    notifications,
    adminAlert,
    handleNotificationClick,
    dismissAlert,
  };
}; 