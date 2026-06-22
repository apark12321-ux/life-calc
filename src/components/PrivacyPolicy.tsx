import React from 'react';
import { Clock, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <article className="bg-white rounded-2xl shadow-xs border border-slate-100 p-5 md:p-8 space-y-6 text-slate-700 leading-relaxed font-sans">
      <header className="border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Shield className="w-6 h-6" /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">개인정보처리방침</h1>
            <p className="text-sm text-slate-500 mt-1">생활계산기 천국의 개인정보 처리 기준을 안내합니다.</p>
          </div>
        </div>
      </header>

      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm">
        <div className="flex items-center gap-2 font-black text-slate-900"><Clock className="w-4 h-4 text-slate-500" /> 최종 갱신일: 2026년 6월 22일</div>
        <p className="mt-2">본 사이트는 회원가입 없이 이용할 수 있으며, 계산기 입력값을 별도 회원정보로 저장하지 않습니다.</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-black text-slate-900">수집하는 정보</h2>
        <p>생활계산기 천국은 기본 계산 기능 제공을 위해 이름, 주민등록번호, 연락처 같은 민감한 개인정보 입력을 요구하지 않습니다. 사용자가 계산기에 입력한 값은 계산 결과를 표시하기 위한 목적으로만 사용됩니다.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-black text-slate-900">쿠키와 광고</h2>
        <p>사이트 이용 통계 확인, 보안, 맞춤형 광고 제공을 위해 쿠키가 사용될 수 있습니다. Google을 포함한 제3자 광고 사업자는 사용자의 이전 방문 기록을 바탕으로 광고를 게재할 수 있습니다.</p>
        <p>맞춤 광고 설정은 Google 광고 설정 페이지에서 변경할 수 있습니다.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-black text-slate-900">문의</h2>
        <p>개인정보처리방침에 관한 문의는 문의 페이지에 안내된 이메일로 보내주세요.</p>
      </section>
    </article>
  );
}
