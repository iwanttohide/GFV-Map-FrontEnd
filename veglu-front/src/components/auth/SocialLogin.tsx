'use client';

import React from 'react';

export default function SocialLogin() {
    return (
        <div>
            <div className="relative my-5 text-center">
                <hr className="border-gray-200" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-white text-xs text-gray-400">
                    소셜 계정 로그인
                </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {/* 🟡 카카오 관문
                  - 백엔드가 완성되면 카카오가 준 인가코드(code)를 들고 프론트 대기실로 귀환합니다.
                */}
                <a
                    href={`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=5cbb4b90ecb89c2feefea4ade7ed1db0&redirect_uri=${encodeURIComponent('http://192.168.7.120:5000/auth/kakao/callback')}`}
                    className="flex items-center justify-center py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-medium transition-colors text-center text-gray-700"
                >
                    카카오
                </a>

                {/* 🟢 네이버 관문 */}
                <a
                    href={`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=k5TSkkHC8gIfT9M15ECc&redirect_uri=${encodeURIComponent('http://localhost:3000/auth/naver/callback')}&state=vegan_gf_map_state`}
                    className="flex items-center justify-center py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-medium transition-colors text-center text-gray-700"
                >
                    네이버
                </a>

                {/* 🔵 구글 관문 */}
                <a
                    href={`https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=332714059523-bh6db7jsaabpmf6fvvtahjal0fhfqa5u.apps.googleusercontent.com&redirect_uri=${encodeURIComponent('http://localhost:3000/auth/google/callback')}&scope=${encodeURIComponent('email profile')}`}
                    className="flex items-center justify-center py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-medium transition-colors text-center text-gray-700"
                >
                    구글
                </a>
            </div>
        </div>
    );
}