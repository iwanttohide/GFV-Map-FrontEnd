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

        // 타입스크립트 string | string[] 엄격 검사 에러 완벽 박멸
        const rawProvider = params?.provider;
        const provider = Array.isArray(rawProvider) ? rawProvider[0] : rawProvider;

        if (!provider) {
            router.push('/');
            return;
        }

        const executeTestingFreePass = () => {
            const displayProvider = provider.toUpperCase();
            setStatusText(`🌱 [${displayProvider}] 임시 보안 우회 통행증을 발급하는 중...`);

            // 🎯 실제 로그인했을 때와 100% 동일한 금고(LocalStorage) 명세 환경을 모킹(Mocking)합니다.
            localStorage.setItem('accessToken', `mock_${provider}_auth_token_secret_2026`);
            localStorage.setItem('user_email', `${provider}_user@domain.com`);

            // 소셜 미디어별 맞춤형 테스터 닉네임 부여
            const mockNickname = provider === 'kakao'
                ? '달콤한카카오'
                : provider === 'naver'
                    ? '푸른네이버'
                    : '스마트구글';

            localStorage.setItem('user_nickname', mockNickname);
            localStorage.setItem('user_avatar', '🥑');

            console.log(`✅ [임시 우회 성공] ${displayProvider} 인증 프리패스 완수. 메인 지도로 도약합니다.`);

            // 세션 동기화를 수반하여 메인 지도 컴포넌트들을 강제 청정 부팅시킵니다.
            setTimeout(() => {
                window.location.href = '/';
            }, 800); // 0.8초간 이쁜 애니메이션을 보여준 뒤 리다이렉트
        };

        executeTestingFreePass();
        // ──────────────────────────────────────────────────────────

    }, [searchParams, params]);

    return (
        <div className="min-h-screen w-screen bg-white flex flex-col items-center justify-center text-xs font-bold text-green-700 select-none">
            {/* 세련된 회전하는 새싹 로딩 인디케이터 기믹 */}
            <div className="text-3xl mb-3 animate-spin duration-1000">🌱</div>
            <p className="tracking-tight text-gray-500 animate-pulse">{statusText}</p>
        </div>
    );
}