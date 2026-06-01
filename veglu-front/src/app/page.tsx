'use client';

import React, { useState } from 'react';
import AuthModal from "@/components/auth/AuthModal";

export default function MainPage() {
    // 1. 모달이 열려있는지 닫혀있는지 통제하는 스위치.
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    return (
        <>
            {/* 와이어프레임 메인화면 가상 레이아웃 */}
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        veglu 지도 🗺️
                    </h1>
                    <p className="text-gray-500 max-w-sm text-sm">
                        지도를 통해 주변 정보를 한눈에 확인해 보세요.
                    </p>

                    {/* 모달을 여는 시작하기 버튼 */}
                    <button
                        onClick={() => setIsAuthOpen(true)}
                        className="mt-4 px-6 py-3 bg-gray-950 hover:bg-gray-800 text-white font-medium rounded-xl text-sm transition-all shadow-md active:scale-95"
                    >
                        시작하기 (로그인)
                    </button>
                </div>
            </div>

            {/* 2. 메인 화면 최상단에 모달을 대기. */}
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    );
}
