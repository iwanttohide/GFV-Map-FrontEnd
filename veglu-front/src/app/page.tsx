'use client';

import React, { useState } from 'react';
import Header from '@/components/main/Header';
import Sidebar from '@/components/main/Sidebar';
import MapContainer from '@/components/main/MapContainer';
import AuthModal from '@/components/auth/AuthModal';

export default function MainPage() {
    // 1. 모달이 열려있는지 닫혀있는지 제어하는 스위치 (처음엔 닫혀있음)
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    // 2. ★ 핵심: 사용자가 로그인을 성공했는지 기억하는 상태 (기본값 false = 미로그인)
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 3. LoginForm에서 최종적으로 모달을 닫을 때 실행될 성공 핸들러 함수
    const handleModalClose = () => {
        setIsAuthOpen(false);
        // 임시 디버깅: 로그인이 성공했다고 간주하고 메인 지도를 엽니다.
        // (실제 LoginForm에서 로그인 버튼 누르고 onClose() 가 실행되면 이리로 들어옵니다.)
        setIsLoggedIn(true);
    };

    return (
        <>
            {/* ──────────────────────────────────────────────────────────
          시나리오 A: 로그인을 안 했을 때 (isLoggedIn === false)
          기존에 소중하게 기획하신 "시작 페이지 내비게이션" 화면을 그대로 노출합니다!
          ────────────────────────────────────────────────────────── */}
            {!isLoggedIn ? (
                <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gray-50 p-4 select-none">
                    <div className="text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                        {/* 기존 아이콘 및 타이틀 디자인 완벽 보존 */}
                        <div className="text-5xl animate-bounce mb-2">🗺️</div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            비건 식당 지도
                        </h1>
                        <p className="text-gray-500 max-w-sm text-sm">
                            지도를 통해 주변 안전 정보를 한눈에 확인해 보세요.
                        </p>

                        {/* 누르면 우리가 정성껏 만든 로그인 모달 팝업이 뜹니다. */}
                        <button
                            onClick={() => setIsAuthOpen(true)}
                            className="mt-4 px-6 py-3 bg-gray-950 hover:bg-gray-800 text-white font-medium rounded-xl text-sm transition-all shadow-md active:scale-95"
                        >
                            시작하기 (로그인)
                        </button>
                    </div>
                </div>
            ) : (
                /* ──────────────────────────────────────────────────────────
                   시나리오 B: 로그인 성공했을 때 (isLoggedIn === true)
                   시작 페이지는 감쪽같이 사라지고, 와이어프레임 기반의 '진짜 지도 메인화면'이 전면 개방됩니다!
                   ────────────────────────────────────────────────────────── */
                <div className="h-screen w-screen flex flex-col overflow-hidden select-none bg-white animate-in fade-in duration-500">
                    {/* 1. 상단 헤더 (검색, 필터, 마이페이지) */}
                    <Header onOpenAuth={() => setIsAuthOpen(true)} />

                    {/* 2. 하단 지도 및 리스트 오버레이 워크스페이스 */}
                    <div className="flex-1 relative w-full h-full overflow-hidden">
                        {/* 바닥 전체를 채우는 지도 컴포넌트 */}
                        <MapContainer />

                        {/* 지도 위에 둥둥 떠 있는 좌측 식당 리스트 사이드바 */}
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-10">
                            <Sidebar />
                        </div>
                    </div>
                </div>
            )}

            {/* ──────────────────────────────────────────────────────────
         C. 글로벌 통합 컨트롤 모달 타워
         LoginForm의 25번째 줄 onClose()가 트리거되면 바깥의 handleModalClose가 실행됩니다.
         ────────────────────────────────────────────────────────── */}
            <AuthModal isOpen={isAuthOpen} onClose={handleModalClose} />
        </>
    );
}