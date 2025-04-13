import MainLayout from '@/components/main-layout';
import { MessageHistory } from '@/components/message-history';
import MessageIcon from '@/components/ui/icons/message-icon';

export default function Home() {
  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <MessageIcon className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-xl font-medium">Your messages</h3>
        <p className="mt-2 text-center text-muted-foreground">
          Select a conversation from the sidebar to view your message history
        </p>
      </div>
    </MainLayout>
  );
}
