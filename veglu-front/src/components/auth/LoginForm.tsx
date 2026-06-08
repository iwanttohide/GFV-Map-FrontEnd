'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SocialLogin from './SocialLogin';

interface LoginFormProps {
    setViewMode: (mode: 'LOGIN' | 'SIGNUP' | 'FIND_ID' | 'FIND_PW') => void;
    onClose: () => void;
    onLoginSuccess: () => void;
}

export default function LoginForm({ setViewMode, onClose, onLoginSuccess }: LoginFormProps) {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email.trim() || !password.trim()) {
            setError('이메일과 비밀번호를 모두 입력해 주세요.');
            return;
        }

        setIsLoading(true);

        try {
            // 💡 하드코딩 주소 대신 방금 정비한 .env.local 금고에서 주소를 깨워옵니다.
            const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.7.120:5000';

            const response = await fetch(`${BACKEND_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (!response.ok) {
                setError('이메일 또는 비밀번호가 다릅니다.');
                setIsLoading(false);
                return;
            }

            const data = await response.json();

            // 🛡️ 로그인 목적지 주소의 기본값은 메인 홈(지도)입니다.
            let destinationPath = '/';

            if (data.accessToken) {
                // 1. 보안 인가 토큰 적재
                localStorage.setItem('accessToken', data.accessToken);
                if (data.refreshToken) {
                    localStorage.setItem('refreshToken', data.refreshToken);
                }

                // 2. 유저 이메일 및 프로필 메타 데이터 안전 복구 적재
                const finalSaveEmail = data.email || data.user?.email || email || 'veglu@domain.com';
                const finalNickname = data.nickname || data.user?.nickname || '익명유저';
                const finalAvatar = data.profileImageUrl || data.user?.profileImageUrl || 'default';

                localStorage.setItem('user_email', finalSaveEmail);
                localStorage.setItem('user_nickname', finalNickname);
                localStorage.setItem('user_avatar', finalAvatar);

                const userRole = data.role || data.user?.role || 'USER';
                localStorage.setItem('user_role', userRole); // 금고 보관

                if (userRole === 'ADMIN') {
                    console.log("👮 최고 관리자 로그인을 환영합니다. 관리자 통계실로 워프합니다.");
                    destinationPath = '/admin/dashboard';
                }
                else if (userRole === 'OWNER') {
                    console.log("👨‍🍳 사장님 계정 로그인을 환영합니다. 매장 관리 대시보드로 워프합니다.");
                    destinationPath = '/owner/manage';
                }
                else {
                    console.log("🌱 비건 안심 지도 일반 회원 로그인 성공. 지도를 오픈합니다.");
                    destinationPath = '/';
                }
                // ──────────────────────────────────────────────────────────
            }

            if (onLoginSuccess) {
                onLoginSuccess();
            }

            // 단순 새로고침 강제 이동이 아닌, 권한별로 셋업된 목적지로 스무스하게 다이내믹 포워딩합니다.
            window.location.href = destinationPath;

        } catch (err) {
            setError('서버 연결에 실패했습니다. 네트워크 상태를 확인해 주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full space-y-5 text-xs select-none">
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
                <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-400 block">이메일 주소</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@domain.com"
                        disabled={isLoading}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all font-medium text-gray-800"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-400 block">비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={isLoading}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all text-gray-800"
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl animate-in fade-in duration-150">
                        <p className="text-[11px] font-semibold text-red-600 flex items-center">
                            <span className="mr-1.5">⚠️</span> {error}
                        </p>
                    </div>
                )}

                <div className="pt-1">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.99]"
                    >
                        {isLoading ? '인증 정보 검증 중...' : '비건 안심 지도 로그인'}
                    </button>
                </div>
            </form>

            <div className="flex items-center justify-center space-x-3 text-gray-400 font-medium border-b border-gray-100 pb-4">
                <button type="button" onClick={() => setViewMode('FIND_ID')} className="hover:text-gray-600 transition-colors">아이디 찾기</button>
                <span className="text-gray-200">|</span>
                <button type="button" onClick={() => setViewMode('FIND_PW')} className="hover:text-gray-600 transition-colors">비밀번호 찾기</button>
                <span className="text-gray-200">|</span>
                <button type="button" onClick={() => setViewMode('SIGNUP')} className="text-green-700 font-bold hover:underline">회원가입</button>
            </div>
            <SocialLogin />
        </div>
    );
}