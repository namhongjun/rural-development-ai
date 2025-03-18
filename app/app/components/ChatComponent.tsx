'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Send, Download, Paperclip, Save } from 'lucide-react';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  attachment?: string;
}

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !fileInputRef.current?.files?.length || isLoading) return;

    const newMessage: Message = {
      role: 'user',
      content: input,
    };

    if (fileInputRef.current?.files?.length) {
      const file = fileInputRef.current.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        newMessage.attachment = e.target?.result as string;
        await sendMessage(newMessage);
      };
      reader.readAsDataURL(file);
    } else {
      await sendMessage(newMessage);
    }
  };

  const sendMessage = async (newMessage: Message) => {
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);
    if (fileInputRef.current) fileInputRef.current.value = '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, newMessage] }),
      });

      if (!response.ok) throw new Error('응답에 실패했습니다.');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        alert('파일 크기는 5MB를 초과할 수 없습니다.');
        e.target.value = '';
      }
    }
  };

  const saveChat = () => {
    const chatContent = messages
      .map(msg => `${msg.role === 'user' ? '사용자' : 'AI'}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `chat_${new Date().toISOString().slice(0,10)}.txt`);
  };

  const exportToPDF = async () => {
    if (!chatContainerRef.current) return;

    const canvas = await html2canvas(chatContainerRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`chat_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex justify-end gap-2 mb-4">
        <Button onClick={saveChat} variant="outline" size="sm">
          <Save className="w-4 h-4 mr-2" />
          대화 저장
        </Button>
        <Button onClick={exportToPDF} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          PDF 저장
        </Button>
      </div>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <Card
            key={index}
            className={`p-4 ${
              message.role === 'user' ? 'bg-blue-50 ml-12' : 'bg-gray-50 mr-12'
            }`}
          >
            {message.attachment && (
              <img
                src={message.attachment}
                alt="첨부파일"
                className="max-w-xs mb-2 rounded"
              />
            )}
            <p className="whitespace-pre-wrap">{message.content}</p>
          </Card>
        ))}
        {isLoading && (
          <Card className="p-4 bg-gray-50 mr-12">
            <p>답변을 생성하고 있습니다...</p>
          </Card>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="w-4 h-4" />
        </Button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="질문을 입력해주세요..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
