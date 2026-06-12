'use client';

import React, { useEffect, useState } from 'react';

export default function SocialLogin() {
    // 하이드레이션(서버-프론트 렌더링 균열) 방지용 마운트 체크
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 1. 백엔드 API 주소 (소셜 로그인 callback을 수신할 백엔드 서버의 URL)
    const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    // 2. 소셜 로그인 설정값 징집 (환경변수 우선, 없으면 하드코딩된 fallback 값 사용)
    const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || '5cbb4b90ecb89c2feefea4ade7ed1db0';
    const KAKAO_REDIRECT_URI = BACKEND_API_URL ? `${BACKEND_API_URL}/auth/kakao/callback` : '';

    const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || 'k5TSkkHC8gIfT9M15ECc';
    const NAVER_REDIRECT_URI = BACKEND_API_URL ? `${BACKEND_API_URL}/auth/naver/callback` : '';
    const NAVER_STATE = process.env.NEXT_PUBLIC_NAVER_STATE || 'vegan_gf_map_state';

    const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '332714059523-bh6db7jsaabpmf6fvvtahjal0fhfqa5u.apps.googleusercontent.com';
    const GOOGLE_REDIRECT_URI = BACKEND_API_URL ? `${BACKEND_API_URL}/auth/google/callback` : '';
    const GOOGLE_SCOPE = process.env.NEXT_PUBLIC_GOOGLE_SCOPE || 'email profile';

    // 🛡️ API 키 누락 방어용 보안 가드 검사
    const handleGuardAlert = (provider: string) => {
        console.error(`🚨 [보안 가드] ${provider} 로그인 정보 혹은 백엔드 API Base URL이 누락되었습니다. (.env 파일 확인 필요)`);
        alert(`현재 ${provider} 로그인 시스템 점검 중입니다. 잠시 후 다시 시도해 주세요.`);
    };

    // 마운트 전에는 레이아웃 깨짐(하이드레이션 에러)을 방지하기 위해 빈 껍데기 반환
    if (!isMounted) return null;

    return (
        <div>
            <div className="relative my-5 text-center">
                <hr className="border-gray-200" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-white text-xs text-gray-400">
                    소셜 계정 로그인
                </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {/* 🟡 카카오 로그인 */}
                {BACKEND_API_URL && KAKAO_CLIENT_ID ? (
                    <a
                        href={`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}`}
                        className="flex items-center justify-center py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-medium transition-colors text-center text-gray-700 active:scale-[0.98]"
                    >
                        카카오
                    </a>
                ) : (
                    <button
                        type="button"
                        onClick={() => handleGuardAlert('카카오')}
                        className="flex items-center justify-center py-2 border border-gray-200 rounded-xl hover:bg-red-50 text-xs font-medium transition-colors text-center text-red-400"
                    >
                        카카오 ⚠️
                    </button>
                )}

                {/* 🟢 네이버 로그인 */}
                {BACKEND_API_URL && NAVER_CLIENT_ID ? (
                    <a
                        href={`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(NAVER_REDIRECT_URI)}&state=${NAVER_STATE}`}
                        className="flex items-center justify-center py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-medium transition-colors text-center text-gray-700 active:scale-[0.98]"
                    >
                        네이버
                    </a>
                ) : (
                    <button
                        type="button"
                        onClick={() => handleGuardAlert('네이버')}
                        className="flex items-center justify-center py-2 border border-gray-200 rounded-xl hover:bg-red-50 text-xs font-medium transition-colors text-center text-red-400"
                    >
                        네이버 ⚠️
                    </button>
                )}

                {/* 🔵 구글 로그인 */}
                {BACKEND_API_URL && GOOGLE_CLIENT_ID ? (
                    <a
                        href={`https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&scope=${encodeURIComponent(GOOGLE_SCOPE)}`}
                        className="flex items-center justify-center py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-medium transition-colors text-center text-gray-700 active:scale-[0.98]"
                    >
                        구글
                    </a>
                ) : (
                    <button
                        type="button"
                        onClick={() => handleGuardAlert('구글')}
                        className="flex items-center justify-center py-2 border border-gray-200 rounded-xl hover:bg-red-50 text-xs font-medium transition-colors text-center text-red-400"
                    >
                        구글 ⚠️
                    </button>
                )}
            </div>
        </div>
    );
}