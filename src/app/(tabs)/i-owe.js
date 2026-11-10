import { RecordListScreen } from '@/components/record-list';

export default function IOweScreen() {
  return (
    <RecordListScreen
      title="I Owe Them"
      subtitle="Everything you have borrowed and still need to give back."
      filter={(record) => record.type === 'borrowed' && !record.returned}
      emptyTitle="You are all clear"
      emptyBody="Borrowed items and money show up here until you mark them returned."
      showReturn
      addType="borrowed"
    />
  );
}
