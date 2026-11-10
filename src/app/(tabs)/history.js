import { RecordListScreen } from '@/components/record-list';

export default function HistoryScreen() {
  const returned = (record) => record.returned;
  return (
    <RecordListScreen
      title="History"
      subtitle="Completed lends and borrows, newest return first."
      filter={returned}
      sort={(a, b) => String(b.returnedAt).localeCompare(String(a.returnedAt))}
      emptyTitle="No completed records"
      emptyBody="Mark something as returned and it will move here. Open records stay on the other tabs."
    />
  );
}
