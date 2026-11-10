import { RecordListScreen } from '@/components/record-list';

export default function TheyOweScreen() {
  return (
    <RecordListScreen
      title="They Owe Me"
      subtitle="Everything you have lent that has not been returned."
      filter={(record) => record.type === 'lent' && !record.returned}
      emptyTitle="Nobody is holding your stuff"
      emptyBody="When you lend an item or money, it stays here until you mark it returned."
      showReturn
      addType="lent"
    />
  );
}
