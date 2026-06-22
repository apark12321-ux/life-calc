import React from 'react';
import { Mail, MessageCircle, AlertTriangle } from 'lucide-react';

export default function ContactPage() {
  return (
    <article className="bg-white rounded-2xl shadow-xs border border-slate-100 p-5 md:p-8 space-y-6 text-slate-700 leading-relaxed font-sans">
      <header className="border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><MessageCircle className="w-6 h-6" /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">문의하기</h1>
            <p className="text-sm text-slate-500 mt-1">오류 제보나 문의 사항이 있으면 아래 연락처로 보내주세요.</p>
          </div>
        </div>
      </header>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2"><Mail className="w-5 h-5 text-blue-600" /> 이메일 문의</h2>
          <p className="mt-3 text-sm">계산식 오류, 잘못된 문구, 추가했으면 하는 계산기 제안은 이메일로 보내주세요.</p>
          <a href="mailto:apark12321@gmail.com" className="inline-flex mt-4 min-h-11 items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-700 transition">apark12321@gmail.com</a>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-600" /> 문의 전 확인</h2>
          <ul className="mt-3 space-y-2 text-sm list-disc pl-5">
            <li>계산 결과는 입력값을 기준으로 한 참고용입니다.</li>
            <li>세금, 보험료, 대출 조건은 적용 시점과 개인 조건에 따라 달라질 수 있습니다.</li>
            <li>신고, 계약, 납부 전에는 공식 기관 또는 전문가 확인이 필요합니다.</li>
          </ul>
        </div>
      </section>
    </article>
  );
}
