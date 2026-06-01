'use client';

import React, { useState } from 'react';
import { AuthViewMode } from './AuthModal';

interface FindAccountFormProps {
    mode: 'ID' | 'PW';
    setViewMode: (mode: AuthViewMode) => void;
}

export default function FindAccountForm({ mode, setViewMode }: FindAccountFormProps) {
    const [step, setStep] = useState(1); // 1: 정보입력/인증발송, 2: 결과인증완료
    const [inputVal, setInputVal] = useState('');
    const [code, setCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);

    const handleSendCode = () => {
        if (!inputVal) return alert('정보를 입력해 주세요.');
        setIsCodeSent(true);
        alert('인증번호가 발송되었습니다. (가상 제한시간 3:00 적용)');
    };

    const handleVerifySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!code) return alert('인증번호를 입력해주세요.');
        setStep(2); // 다음 스냅샷 화면으로 스위칭
    };

    return (
        <div>
            <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-gray-900">
                    {mode === 'ID' ? '아이디 찾기' : '비밀번호 재설정'}
                </h1>
                <p className="text-xs text-gray-400 mt-1">인증을 위해 정보를 입력해주세요.</p>
            </div>

            {step === 1 ? (
                <form onSubmit={handleVerifySubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            {mode === 'ID' ? '이메일 또는 전화번호' : '아이디(이메일)'}
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={inputVal}
                                onChange={(e) => setInputVal(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm"
                                placeholder="정보 입력"
                            />
                            <button type="button" onClick={handleSendCode} className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl text-xs font-medium transition-colors">
                                발송
                            </button>
                        </div>
                    </div>

                    {isCodeSent && (
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">인증번호 입력</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm pr-12"
                                    placeholder="6자리 숫자"
                                />
                                <span className="absolute right-3 top-2.5 text-xs text-red-500 font-mono">03:00</span>
                            </div>
                        </div>
                    )}

                    <button type="submit" className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl text-sm transition-all">
                        인증 확인
                    </button>
                </form>
            ) : (
                /* 2단계: 인증 성공 이후 노출 화면 조각 */
                <div className="text-center space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-700">
                        {mode === 'ID' ? (
                            <p>귀하의 아이디는 <strong className="text-blue-600">user***@email.com</strong> 입니다.</p>
                        ) : (
                            <div className="space-y-3 text-left">
                                <input type="password" placeholder="새 비밀번호 입력" className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm" />
                                <input type="password" placeholder="새 비밀번호 확인" className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm" />
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setViewMode('LOGIN')}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-colors"
                    >
                        {mode === 'ID' ? '로그인 화면으로 돌아가기' : '비밀번호 변경 완료'}
                    </button>
                </div>
            )}

            {step === 1 && (
                <div className="text-center mt-4">
                    <button onClick={() => setViewMode('LOGIN')} className="text-xs text-gray-400 hover:underline">
                        취소하고 로그인으로 가기
                    </button>
                </div>
            )}
        </div>
    );
}