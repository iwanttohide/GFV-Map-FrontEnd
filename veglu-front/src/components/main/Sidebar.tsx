'use client';

import React, { useState } from 'react';

interface Restaurant {
    restaurantId: number;
    name: string;
    address: string;
    points: string;
    matchedMenus: string[];
    veganType: string;
    rating?: number;
}

interface SidebarProps {
    restaurants: Restaurant[];
    selectedIndex: number | null;
    onShopSelect: (index: number) => void;
}

export default function Sidebar({ restaurants, selectedIndex, onShopSelect }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [sortRule, setSortRule] = useState('distance');

    const processedList = [...restaurants].sort((a, b) => {
        if (sortRule === 'rating') {
            return (b.rating || 0) - (a.rating || 0);
        }
        return a.restaurantId - b.restaurantId;
    });

    return (
        /* 🎯 [전체 오버레이 컨테이너]
           사이드바 본체와 토글 버튼이 한 가족처럼 묶여서 이동하도록 absolute 레이어를 고수합니다.
        */
        <div className="absolute inset-y-0 left-0 flex h-full z-10 pointer-events-none">

            {/* 🎯 [사이드바 메인 패널]
                w-[360px] 고정 크기에서 열고 닫힐 때 'transform duration-300' 애니메이션을 탑재합니다.
            */}
            <div
                className={`bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-300 pointer-events-auto shadow-2xl flex-shrink-0 ${
                    isOpen
                        ? 'w-[360px] translate-x-0'
                        : 'w-[360px] -translate-x-full overflow-hidden border-r-0'
                }`}
            >
                {/* 상단 정렬 바 */}
                <div className="p-4 border-b border-gray-100 flex-shrink-0">
                    <select value={sortRule} onChange={(e) => setSortRule(e.target.value)} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 focus:outline-none cursor-pointer">
                        <option value="distance">거리순 정렬 (F-SEARCH-003)</option>
                        <option value="rating">평점순 정렬</option>
                    </select>
                </div>

                {/* 식당 카드 리스트 영역 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {processedList.map((shop, index) => (
                        <div
                            key={`sidebar-shop-${shop.restaurantId}-${index}`}
                            onClick={() => onShopSelect(index)}
                            className={`p-4 border rounded-2xl bg-white transition-all cursor-pointer hover:border-green-600 hover:shadow-sm ${
                                selectedIndex === index
                                    ? 'border-green-600 ring-2 ring-green-600/10 bg-green-50/20'
                                    : 'border-gray-200'
                            }`}
                        >
                            <div className="flex space-x-3">
                                <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400 flex-shrink-0">사진</div>
                                <div className="space-y-1 overflow-hidden w-full">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-sm text-gray-900 truncate max-w-[180px]">{shop.name}</h3>
                                        <span className="text-[9px] bg-green-100 text-green-800 font-extrabold px-1.5 py-0.5 rounded-md flex-shrink-0">{shop.veganType}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">{shop.address}</p>
                                    {shop.matchedMenus && shop.matchedMenus.length > 0 && (
                                        <p className="text-[10px] text-gray-400 truncate pt-0.5">
                                            🔍 관련 메뉴: <span className="text-gray-600 font-medium">{shop.matchedMenus.join(', ')}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {processedList.length === 0 && <div className="text-center py-20 text-xs text-gray-400">검색 조건에 맞는 매장이 없습니다.</div>}
                </div>
            </div>

            {/* 🎯 [대혁명 구역: 접기/펴기 토글 버튼 트랙커]
              기존에 버튼 레이어가 혼자 공중에 굳어있던 버그를 격파합니다!
              사이드바 본체의 이동 명령줄인 `isOpen` 스위치 상태를 고스란히 공유받아서,
              사이드바가 닫힐 때 본체 꼬리에 딱 달라붙어 'transition-all duration-300' 모션과 함께
              좌측 벽으로 `-translate-x-[360px]` 동시 순간이동 슬라이딩을 수행합니다!
            */}
            <div
                className={`flex items-center h-full pointer-events-auto flex-shrink-0 transition-all duration-300 ease-out ${
                    isOpen
                        ? 'transform translate-x-0'
                        : 'transform -translate-x-[360px]' // 💡 본체가 숨은 거리만큼 바짝 쫓아갑니다!
                }`}
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-white border border-gray-200 border-l-0 hover:bg-gray-50 text-gray-600 p-2 rounded-r-xl shadow-md transition-all -ml-[1px] h-14 flex items-center justify-center font-bold text-sm z-30"
                    title={isOpen ? '사이드바 접기' : '사이드바 열기'}
                >
                    {isOpen ? '◀' : '▶'}
                </button>
            </div>
        </div>
    );
}