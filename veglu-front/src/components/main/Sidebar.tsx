'use client';

import React, { useState } from 'react';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    // UI 확인용 임시 식당 리스트 더미 데이터
    const dummyRestaurants = [
        { id: 1, name: '안심 돈까스', category: '일식', address: '서울시 행복동 12-3' },
        { id: 2, name: '든든 1인 김치찌개', category: '한식', address: '서울시 행복동 45-1' },
        { id: 3, name: '든든 1인 김치찌개', category: '한식', address: '서울시 행복동 45-1' },
    ];

    return (
        <div className="relative flex h-full z-10 pointer-events-none">
            {/* 본체 레이어 (pointer-events-auto로 터치 활성화) */}
            <div
                className={`bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-300 pointer-events-auto ${
                    isOpen ? 'w-[360px]' : 'w-0 overflow-hidden border-r-0'
                }`}
            >
                {/* 상단 정렬 바 (F-SEARCH-003) */}
                <div className="p-4 border-b border-gray-100">
                    <select className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 focus:outline-none">
                        <option>거리순 정렬 (F-SEARCH-003)</option>
                        <option>평점순 정렬</option>
                    </select>
                </div>

                {/* 식당 카드 리스트 영역 (내부 스크롤 구현) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {dummyRestaurants.map((shop, index) => (
                        <div
                            key={index}
                            className={`p-4 border rounded-2xl bg-white transition-all cursor-pointer hover:border-blue-500 hover:shadow-sm ${
                                index === 0 ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-gray-200'
                            }`}
                        >
                            <div className="flex space-x-3">
                                {/* 회색 사각형 이미지 영역 */}
                                <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400 flex-shrink-0">
                                    사진
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-bold text-sm text-gray-900">{shop.name}</h3>
                                        <span className="text-xs text-gray-400">{shop.category}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">{shop.address}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 접기/펴기 토글 버튼 (사이드바 오른쪽에 딱 붙어 움직임) */}
            <div className="flex items-center h-full pointer-events-auto">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 p-2 rounded-r-xl shadow-md transition-all -ml-[1px]"
                    title={isOpen ? '사이드바 접기' : '사이드바 열기'}
                >
                    {isOpen ? '◀' : '▶'}
                </button>
            </div>
        </div>
    );
}