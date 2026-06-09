'use client';

import { useEffect, useState, useRef } from 'react'; // 👈 useRef 추가

export default function KakaoAuthCallbackPage() {
    const [statusText, setStatusText] = useState('소셜 인증 정보를 검증하고 있습니다...');
    const hasCalled = useRef(false); // 👈 중복 호출 차단막 변수 신설

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (!code) {
            window.location.href = '/';
            return;
        }

        if (hasCalled.current) return;

        const handleLogin = async () => {
            hasCalled.current = true;

            try {
                const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.7.120:5000';

                const response = await fetch(`${BACKEND_URL}/auth/naver/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: code })
                });

                if (!response.ok) {
                    const errorMsg = await response.text();
                    throw new Error(`서버 거부 (${response.status}): ${errorMsg}`);
                }

                const data = await response.json();

                if (data.accessToken) {
                    localStorage.setItem('accessToken', data.accessToken);
                    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
                    localStorage.setItem('user_email', data.email || '');
                    localStorage.setItem('user_nickname', data.nickname || '소셜유저');
                    localStorage.setItem('user_avatar', data.profileImageUrl || 'default');
                    localStorage.setItem('user_role', data.role || 'USER');

                    setStatusText('🎉 인증 성공! 비건 안심 지도로 진입합니다.');
                    setTimeout(() => { window.location.href = '/'; }, 500);
                }
            } catch (err) {
                console.error("🚨 소셜 세션 연동 최종 실패:", err);
                setStatusText('⚠️ 인증 세션 만료 또는 중복 요청 발생. 다시 시도해 주세요.');
                setTimeout(() => { window.location.href = '/'; }, 2500);
            }
        };

        handleLogin();
    }, []);

    return (
        <div className="min-h-screen w-screen bg-white flex flex-col items-center justify-center text-xs font-bold text-green-700 select-none">
            <div className="text-3xl mb-3 animate-spin duration-1000">🌱</div>
            <p className="tracking-tight text-gray-500 animate-pulse">{statusText}</p>
        </div>
    );
}