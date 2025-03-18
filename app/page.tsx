import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import FAQ from '@/components/FAQ';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          일반농산어촌개발사업 지침 안내
        </h1>
        <Card className="p-6 mb-8">
          <p className="text-lg text-gray-700 mb-4">
            일반농산어촌개발사업에 대해 궁금하신 점이 있으신가요?
            AI 도우미가 지침서를 기반으로 상세히 답변해드립니다.
          </p>
          <div className="flex justify-center">
            <Link href="/chat">
              <Button className="text-lg px-8 py-6">
                AI 상담 시작하기
              </Button>
            </Link>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">주요 기능</h2>
            <ul className="space-y-2">
              <li>• 사업 지침 관련 실시간 질의응답</li>
              <li>• 지원 자격 및 요건 확인</li>
              <li>• 사업비 지원 기준 안내</li>
              <li>• 추진 절차 및 방법 설명</li>
            </ul>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">이용 방법</h2>
            <ul className="space-y-2">
              <li>1. 상담 시작하기 버튼 클릭</li>
              <li>2. 궁금하신 내용을 자유롭게 질문</li>
              <li>3. AI가 지침서를 기반으로 답변 제공</li>
              <li>4. 추가 질문으로 더 자세한 내용 확인</li>
            </ul>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">자주 묻는 질문</h2>
          <FAQ />
        </Card>
      </div>
    </div>
  );
}
