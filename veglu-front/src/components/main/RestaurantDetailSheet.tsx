'use client';

import React, { useState, useEffect } from 'react';

interface Restaurant {
    restaurantId: number;
    name: string;
    address: string;
    points: string;
    matchedMenus: string[];
    veganType: string;
}

interface RestaurantDetailSheetProps {
    restaurant: Restaurant | null;
    onClose: () => void;
}

// 💡 탭 상태 관리를 위한 타입 정의
type TabType = 'HOME' | 'MENU' | 'REVIEW' | 'PHOTO';

export default function RestaurantDetailSheet({ restaurant, onClose }: RestaurantDetailSheetProps) {
    const [activeTab, setActiveTab] = useState<TabType>('HOME');
    const [shouldRender, setShouldRender] = useState(false);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);

    // ──────────────────────────────────────────────────────────
    // 🔄 [애니메이션 핵심 트리거] 들어오고 나가는 타이밍 제어 매커니즘
    // ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (restaurant) {
            setShouldRender(true);
            setIsAnimatingOut(false);
            setActiveTab('HOME'); // 식당이 새로 선택되면 기본 '홈' 탭으로 초기화
        } else if (shouldRender) {
            // 부모가 데이터를 비웠을(null) 때 즉시 파괴하지 않고, 퇴장 애니메이션을 위해 유예 시간을 줍니다.
            setIsAnimatingOut(true);
            const timer = setTimeout(() => {
                setShouldRender(false);
                setIsAnimatingOut(false);
            }, 300); // duration-300과 싱크 일치
            return () => clearTimeout(timer);
        }
    }, [restaurant]);

    // X 버튼을 누를 때 바로 꺼지지 않고 부드럽게 내려가는 함수
    const handleCloseTrigger = () => {
        setIsAnimatingOut(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    if (!shouldRender) return null;

    return (
        <div
            className={`absolute bottom-0 right-0 left-0 bg-white border-t border-gray-200 rounded-t-3xl shadow-[0_-15px_35px_rgba(0,0,0,0.1)] z-20 p-6 flex flex-col transition-all duration-300 ease-out h-[360px] ${
                isAnimatingOut
                    ? 'transform translate-y-full opacity-0' // ➔ 아래로 사라지는 애니메이션 상태
                    : 'transform translate-y-0 opacity-100'  // ➔ 아래에서 슥 올라온 장착 상태
            }`}
        >
            {/* 상단 파트: 고정형 헤더 명세 (식당명, 인증마크, 닫기버튼) */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-3 flex-shrink-0">
                <div className="flex items-center space-x-4 overflow-hidden">
                    <div className="w-14 h-14 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl shadow-inner">
                        🌱
                    </div>
                    <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center space-x-2.5">
                            <h2 className="text-lg font-black text-gray-900 truncate max-w-[280px] md:max-w-[500px]">
                                {restaurant?.name}
                            </h2>
                            <span className="text-[10px] bg-green-700 text-white font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex-shrink-0">
                                {restaurant?.veganType}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 font-semibold truncate">
                            📍 {restaurant?.address}
                        </p>
                    </div>
                </div>

                {/* 우상단 닫기 단추 */}
                <button
                    type="button"
                    onClick={handleCloseTrigger}
                    className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-xl transition-colors border border-gray-200 flex items-center justify-center w-9 h-9"
                >
                    ✕
                </button>
            </div>

            {/* 중간 파트: 사진으로 주신 4단 서브 네비게이션 탭 바 기믹 */}
            <div className="flex space-x-1 border-b border-gray-100 my-3 text-xs font-bold flex-shrink-0">
                {(['HOME', 'MENU', 'REVIEW', 'PHOTO'] as const).map((tab) => {
                    const tabNames: Record<TabType, string> = {
                        HOME: '홈 (기본)',
                        MENU: '메뉴',
                        REVIEW: '리뷰',
                        PHOTO: '사진'
                    };
                    const isSelected = activeTab === tab;
                    return (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2.5 transition-all relative top-[1px] ${
                                isSelected
                                    ? 'text-green-700 border-b-2 border-green-700 font-extrabold'
                                    : 'text-gray-400 hover:text-gray-600 font-medium'
                            }`}
                        >
                            {tabNames[tab]}
                        </button>
                    );
                })}
            </div>

            {/* 하단 파트: 선택된 탭에 따라 실시간 알맹이가 가변 전환되는 가동 콘텐트 구역 */}
            <div className="flex-1 overflow-y-auto pr-1 text-xs text-gray-600 leading-relaxed min-h-0 bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                {activeTab === 'HOME' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                        <p className="font-semibold text-gray-800 text-sm">💡 매장 안내 요약</p>
                        <div className="bg-white p-3.5 border border-gray-200 rounded-xl space-y-2 shadow-sm">
                            <p>✔️ 저희 매장은 동물성 원료를 일체 배제한 안심 비건 가공 공정을 거칩니다.</p>
                            {restaurant?.matchedMenus && restaurant.matchedMenus.length > 0 && (
                                <p>🔍 현재 발견된 매칭 핵심 키워드: <span className="text-green-700 font-bold bg-green-50 px-1.5 py-0.5 rounded-md">{restaurant.matchedMenus.join(', ')}</span></p>
                            )}
                            <p>📞 문의 전화: 02-XXX-XXXX</p>
                            <p>⏰ 영업 시간: 매일 10:00 ~ 21:00 (라스트오더 20:30)</p>
                        </div>
                    </div>
                )}

                {activeTab === 'MENU' && (
                    <div className="space-y-2 animate-in fade-in duration-200">
                        <p className="font-semibold text-gray-800 text-sm">📋 실물 메뉴판 명세</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="bg-white p-3 border border-gray-200 rounded-xl flex justify-between items-center shadow-sm">
                                <span>시그니처 비건 샐러드볼</span>
                                <span className="font-bold text-green-700">11,900원</span>
                            </div>
                            <div className="bg-white p-3 border border-gray-200 rounded-xl flex justify-between items-center shadow-sm">
                                <span>글루텐프리 쌀 베이글</span>
                                <span className="font-bold text-green-700">4,500원</span>
                            </div>
                            <div className="bg-white p-3 border border-gray-200 rounded-xl flex justify-between items-center shadow-sm">
                                <span>아보카도 샌드위치</span>
                                <span className="font-bold text-green-700">8,900원</span>
                            </div>
                            <div className="bg-white p-3 border border-gray-200 rounded-xl flex justify-between items-center shadow-sm">
                                <span>오트밀 라떼 (Iced)</span>
                                <span className="font-bold text-green-700">5,500원</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'REVIEW' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-gray-800 text-sm">⭐️ 방문자 리뷰 (3)</p>
                            <button
                                type="button"
                                onClick={() => alert('리뷰 작성 모달 팝업 회로 연동 구역')}
                                className="bg-white px-2.5 py-1 border border-gray-300 rounded-lg font-bold text-[10px] hover:bg-gray-50 text-gray-700 shadow-sm"
                            >
                                리뷰 쓰기 ✍️
                            </button>
                        </div>
                        <div className="space-y-2">
                            <div className="bg-white p-3 border border-gray-100 rounded-xl shadow-sm space-y-1">
                                <div className="flex justify-between text-[11px] text-gray-400">
                                    <span className="font-bold text-gray-700">비건새내기 (⭐️ 5/5)</span>
                                    <span>2026.06.01</span>
                                </div>
                                <p className="text-gray-600">쌀 베이글이 진짜 쫄깃하고 속이 하나도 안 더부룩해요! 정착 예정입니다.</p>
                            </div>
                            <div className="bg-white p-3 border border-gray-100 rounded-xl shadow-sm space-y-1">
                                <div className="flex justify-between text-[11px] text-gray-400">
                                    <span className="font-bold text-gray-700">안심먹거리 (⭐️ 4.5/5)</span>
                                    <span>2026.05.28</span>
                                </div>
                                <p className="text-gray-600">직원분들이 비건 옵션 설명도 엄청 친절하게 잘 해주시네요. 재방문 의사 백프로!</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'PHOTO' && (
                    <div className="space-y-2 animate-in fade-in duration-200">
                        <p className="font-semibold text-gray-800 text-sm">📸 매장 실물 포토 갤러리</p>
                        <div className="grid grid-cols-4 gap-2">
                            <div className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center text-[10px] text-gray-400 font-bold border border-gray-300 shadow-inner">음식사진 1</div>
                            <div className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center text-[10px] text-gray-400 font-bold border border-gray-300 shadow-inner">내부전경 2</div>
                            <div className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center text-[10px] text-gray-400 font-bold border border-gray-300 shadow-inner">메뉴판사진 3</div>
                            <div className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center text-[10px] text-gray-400 font-bold border border-gray-300 shadow-inner">외관전경 4</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}