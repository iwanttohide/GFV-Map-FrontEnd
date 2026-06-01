'use client';

import React, { useState } from 'react';
import { AuthViewMode } from './AuthModal';
import SocialLogin from './SocialLogin';

interface LoginFormProps {
    setViewMode: (mode: AuthViewMode) => void;
    onClose: () => void;
}

export default function LoginForm({ setViewMode, onClose }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }
        console.log('로그인 시도 데이터:', { email, password });
        alert('로그인 성공! 메인화면(F-MAP-001)으로 이동합니다.');
        onClose();
    };

    return (
        <div>
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">로고</h1>
                <p className="text-xs text-gray-400 mt-1">소개 텍스트를 입력하는 공간입니다.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        placeholder="이메일 또는 아이디"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                {error && <p className="text-xs text-red-500 font-medium">⚠️ {error}</p>}

                <button
                    type="submit"
                    className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl text-sm transition-all"
                >
                    로그인하기
                </button>
            </form>

            {/* 공통 소셜 로그인 배치 */}
            <SocialLogin />

            {/* 하단 스위칭 링크 영역 */}
            <div className="flex justify-center items-center space-x-3 text-xs text-gray-400 mt-6">
                <button onClick={() => setViewMode('FIND_ID')} className="hover:underline hover:text-gray-600">아이디 찾기</button>
                <span>|</span>
                <button onClick={() => setViewMode('FIND_PW')} className="hover:underline hover:text-gray-600">비밀번호 찾기</button>
                <span>|</span>
                <button onClick={() => setViewMode('SIGNUP')} className="hover:underline text-gray-900 font-bold">회원가입</button>
            </div>
        </div>
    );
}