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
                <button type="button" onClick={() => alert('카카오 로그인 연동 전 단계')} className="flex items-center justify-center py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-medium transition-colors">
                    카카오
                </button>
                <button type="button" onClick={() => alert('네이버 로그인 연동 전 단계')} className="flex items-center justify-center py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-medium transition-colors">
                    네이버
                </button>
                <button type="button" onClick={() => alert('구글 로그인 연동 전 단계')} className="flex items-center justify-center py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-medium transition-colors">
                    구글
                </button>
            </div>
        </div>
    );
}