'use client';

import React from 'react';

interface HeaderProps {
    onOpenAuth: () => void;
}

export default function Header({ onOpenAuth }: HeaderProps) {
    return (
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 z-10 shadow-sm">
            {/* 로고 영역 */}
            <div className="text-xl font-bold text-gray-900 tracking-tight cursor-pointer">
                안심지도 LOGO
            </div>

            {/* 중앙 검색 및 필터 영역 */}
            <div className="flex items-center space-x-2 flex-1 max-w-xl mx-4">
                {/* 검색창 (F-SEARCH-001) */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="동네나 장소를 검색해보세요 (F-SEARCH-001)"
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* 필터 버튼 (F-SEARCH-002) */}
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors">
                    필터 (F-SEARCH-002)
                </button>
            </div>

            {/* 우측 마이페이지/시작하기 버튼 (F-MY-001) */}
            <button
                onClick={onOpenAuth}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors"
            >
                마이페이지 (로그인)
            </button>
        </header>
    );
}