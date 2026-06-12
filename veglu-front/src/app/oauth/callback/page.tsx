'use client';

import { useEffect, useState } from 'react';

export default function OAuthCallback() {
    const [statusText, setStatusText] = useState('로그인 세션을 확인 중입니다...');

    useEffect(() => {
        // 1. 쿼리 스트링(?accessToken=...) 파싱
        const searchParams = new URLSearchParams(window.location.search);
        let accessToken = searchParams.get('accessToken') || searchParams.get('token');
        let refreshToken = searchParams.get('refreshToken');
        let role = searchParams.get('role');

        // 2. 만약 쿼리 스트링에 토큰이 없다면 해시(#accessToken=...) 파싱 (OAuth2 Implicit Grant 대응)
        if (!accessToken && window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            accessToken = hashParams.get('accessToken') || hashParams.get('token');
            refreshToken = hashParams.get('refreshToken');
            role = hashParams.get('role');
        }

        const handleLoginSuccess = async (token: string) => {
            // LocalStorage에 인증 및 유저 정보 동기화 저장 전, 기존 로그인 잔재 청소
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user_email');
            localStorage.removeItem('user_nickname');
            localStorage.removeItem('user_avatar');
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_bio');

            // 토큰 및 기본 권한 정보 저장
            localStorage.setItem('accessToken', token);
            if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
            if (role) localStorage.setItem('user_role', role);

            // 🚀 백엔드 /user/me API를 통해 실제 유저 메타데이터(이메일, 닉네임, 프로필, bio) 징집 가동
            try {
                const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await fetch(`${BACKEND_URL}/user/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const userData = await response.json();
                    if (userData.email) localStorage.setItem('user_email', userData.email);
                    if (userData.nickname) localStorage.setItem('user_nickname', userData.nickname);
                    if (userData.profileImageUrl) localStorage.setItem('user_avatar', userData.profileImageUrl);
                    if (userData.bio) localStorage.setItem('user_bio', userData.bio);
                }
            } catch (err) {
                console.error('🚨 소셜 로그인 유저 프로필 조회 실패:', err);
            }

            setStatusText('🎉 인증 성공! 비건 안심 지도로 진입합니다.');

            // React/Next.js의 Auth Provider 및 레이아웃 상태 갱신을 위해 window.location.href로 강제 새로고침 리다이렉트
            setTimeout(() => {
                window.location.href = '/';
            }, 500);
        };

        if (accessToken) {
            handleLoginSuccess(accessToken);
        } else {
            setStatusText('⚠️ 인증 토큰을 찾을 수 없습니다. 로그인 페이지로 돌아갑니다.');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        }
    }, []);

    return (
        <div className="min-h-screen w-screen bg-white flex flex-col items-center justify-center text-xs font-bold text-green-700 select-none">
            <div className="text-3xl mb-3 animate-spin duration-1000">🌱</div>
            <p className="tracking-tight text-gray-500 animate-pulse">{statusText}</p>
        </div>
    );
}