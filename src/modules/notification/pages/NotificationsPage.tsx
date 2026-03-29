import { NotificationList } from '../components/NotificationList';

export default function NotificationsPage() {
  return (
    <div className="px-4 py-5 space-y-4">
      <h1 className="text-xl font-bold">Notificacoes</h1>
      <NotificationList />
    </div>
  );
}
