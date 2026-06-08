'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

export default function SocialAuthCallbackPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const [statusText, setStatusText] = useState('소셜 보안 인증 세션을 조립 중입니다...');

    useEffect(() => {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        const rawProvider = params?.provider;
        const provider = Array.isArray(rawProvider) ? rawProvider[0] : rawProvider;

        if (!provider || !code) {
            router.push('/');
            return;
        }

        const handleSocialLogin = async () => {
            setStatusText(`🌱 ${provider.toUpperCase()} 서버와 토큰을 교환 중입니다...`);

            try {
                const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.7.120:5000';

                // 백엔드 컨트롤러에 맞춘 요청 (소셜사별로 엔드포인트가 다를 경우 분기 필요)
                // 만약 백엔드 컨트롤러가 /auth/{provider}/login 이라면 아래 주소를 조정하세요.
                const response = await fetch(`${BACKEND_URL}/auth/${provider}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: code, state: state }) // 네이버는 state도 필요
                });

                if (!response.ok) throw new Error('백엔드 로그인 실패');

                // 🎯 백엔드 TokenResponseDto와 1:1 매칭되는 JSON 수신
                const data = await response.json();
                console.log("✅ 백엔드 응답 데이터:", data);

                // 🛡️ 데이터 금고(LocalStorage)에 정교하게 저장
                if (data.accessToken) {
                    localStorage.setItem('accessToken', data.accessToken);
                    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);

                    // 🛡️ [수정] 일반 로그인처럼 방어 로직 적용
                    // 백엔드가 주는 구조에 따라 data.email 혹은 data.user.email 등을 유연하게 처리
                    const finalEmail = data.email || data.user?.email || 'user@domain.com';
                    const finalNickname = data.nickname || data.user?.nickname || '사용자';
                    const finalAvatar = data.profileImageUrl || data.user?.profileImageUrl || 'default';
                    const finalRole = data.role || data.user?.role || 'USER';

                    localStorage.setItem('user_email', finalEmail);
                    localStorage.setItem('user_nickname', finalNickname);
                    localStorage.setItem('user_avatar', finalAvatar);
                    localStorage.setItem('user_role', finalRole);

                    setStatusText('🎉 인증 성공! 메인 지도로 워프합니다.');

                    setTimeout(() => {
                        window.location.href = '/';
                    }, 500);
                } else {
                    throw new Error('토큰 정보가 응답에 없습니다.');
                }
            } catch (err) {
                console.error("🚨 소셜 연동 에러:", err);
                setStatusText('⚠️ 인증에 실패했습니다. 메인으로 돌아갑니다.');
                setTimeout(() => router.push('/'), 2000);
            }
        };

        handleSocialLogin();
    }, [searchParams, params, router]);

    return (
        <div className="min-h-screen w-screen bg-white flex flex-col items-center justify-center text-xs font-bold text-green-700 select-none">
            <div className="text-3xl mb-3 animate-spin duration-1000">🌱</div>
            <p className="tracking-tight text-gray-500 animate-pulse">{statusText}</p>
        </div>
    );
}