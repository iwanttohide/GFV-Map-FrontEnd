'use client';

import { useEffect, useState } from 'react';

export default function KakaoAuthCallbackPage() {
    const [statusText, setStatusText] = useState('로그인 데이터를 처리 중입니다...');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (!code) {
            window.location.href = '/';
            return;
        }

        const handleLogin = async () => {
            try {
                const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.7.120:5000';

                // 1. 백엔드에 코드 전달
                const response = await fetch(`${BACKEND_URL}/auth/kakao/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: code })
                });

                if (!response.ok) throw new Error('로그인 실패');

                // 2. 백엔드에서 반환한 JSON 데이터 수신
                const data = await response.json();
                console.log("백엔드 응답 데이터:", data);

                // 3. 토큰 및 유저 정보 저장 (중요!)
                if (data.accessToken) {
                    localStorage.setItem('accessToken', data.accessToken);
                    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);

                    // 유저 정보 저장 (백엔드 TokenResponseDto 구조에 맞춤)
                    localStorage.setItem('user_email', data.email);
                    localStorage.setItem('user_nickname', data.nickname);

                    setStatusText('로그인 성공! 메인으로 이동합니다.');

                    // 4. 메인 페이지로 이동
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 500);
                }
            } catch (err) {
                setStatusText('로그인 처리 중 오류 발생');
                setTimeout(() => window.location.href = '/', 2000);
            }
        };

        handleLogin();
    }, []);

    return <div>{statusText}</div>;
}