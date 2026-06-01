'use client';

import React, { useState } from 'react';
import { AuthViewMode } from './AuthModal';

interface SignUpFormProps {
    setViewMode: (mode: AuthViewMode) => void;
}

export default function SignUpForm({ setViewMode }: SignUpFormProps) {
    const [formData, setFormData] = useState({
        email: '', phone: '', nickname: '', password: '', confirmPassword: '', bio: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignUpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }
        console.log('회원가입 요청 데이터:', formData);
        alert('회원가입이 완료되었습니다! 로그인 화면으로 돌아갑니다.');
        setViewMode('LOGIN');
    };

    return (
        <div>
            <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-gray-900">회원가입</h1>
                <p className="text-xs text-gray-400 mt-1">안심 지도 서비스의 회원이 되어보세요.</p>
            </div>

            <form onSubmit={handleSignUpSubmit} className="space-y-3">
                {/* 아이디/이메일 */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">아이디(이메일)</label>
                    <input type="email" name="email" required onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm" placeholder="example@email.com" />
                </div>
                {/* 전화번호 */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">전화번호</label>
                    <input type="text" name="phone" required onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm" placeholder="010-0000-0000" />
                </div>
                {/* 닉네임 */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">닉네임</label>
                    <input type="text" name="nickname" required onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm" placeholder="닉네임을 입력하세요" />
                </div>
                {/* 비밀번호 */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">비밀번호</label>
                    <input type="password" name="password" required onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm" placeholder="비밀번호 입력" />
                </div>
                {/* 비밀번호 확인 */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">비밀번호 확인</label>
                    <input type="password" name="confirmPassword" required onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm" placeholder="비밀번호 재입력" />
                </div>

                {/* 프로필 사진 컴포넌트 자리 */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">프로필 사진</label>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-400">사진</div>
                        <input type="file" accept="image/*" className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-gray-100 hover:file:bg-gray-200" />
                    </div>
                </div>

                {/* 자기소개 */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">자기소개</label>
                    <textarea name="bio" rows={2} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm resize-none" placeholder="한 줄 자기소개를 입력하세요" />
                </div>

                {error && <p className="text-xs text-red-500 font-medium">⚠️ {error}</p>}

                <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm mt-2 transition-colors">
                    회원가입 완료
                </button>
            </form>

            <div className="text-center mt-4">
                <button onClick={() => setViewMode('LOGIN')} className="text-xs text-gray-400 hover:underline">
                    이미 계정이 있으신가요? 로그인으로 가기
                </button>
            </div>
        </div>
    );
}