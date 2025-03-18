import { Card } from '@/components/ui/card';
import ChatComponent from '@/components/ChatComponent';

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">AI 상담사와 대화하기</h1>
          <ChatComponent />
        </Card>
      </div>
    </div>
  );
}
