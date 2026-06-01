'use client';

import React, { useState, useRef, useEffect } from 'react';

interface HeaderProps {
    onOpenAuth: () => void;
    onLogout: () => void; // ◀ 로그아웃 상태 전환을 위한 함수를 프롭스 규격에 추가합니다.
}

export default function Header({ onOpenAuth, onLogout }: HeaderProps) {
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [searchCategory, setSearchCategory] = useState('region');
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleFilterToggle = (filterName: string) => {
        if (selectedFilters.includes(filterName)) {
            setSelectedFilters(selectedFilters.filter(item => item !== filterName));
        } else {
            setSelectedFilters([...selectedFilters, filterName]);
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsFilterDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 z-30 shadow-sm relative">
            <div className="text-xl font-extrabold text-green-700 tracking-tight cursor-pointer flex-shrink-0">
                VEGAN & GF MAP 🌱
            </div>

            {/* 중앙 와이어프레임 4대 카테고리 검색 필터 영역 (F-SEARCH-003) */}
            <div className="flex-1 max-w-3xl mx-6 relative" ref={dropdownRef}>
                <div className="flex items-center border border-gray-300 rounded-xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-green-600/20 focus-within:border-green-600 transition-all overflow-hidden">
                    <select
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                        className="h-10 px-3 bg-gray-50 border-r border-gray-200 text-xs font-semibold text-gray-500 focus:outline-none cursor-pointer"
                    >
                        <option value="region">지역명</option>
                        <option value="store">상호명</option>
                        <option value="menu">메뉴명</option>
                    </select>

                    <input
                        type="text"
                        onFocus={() => setIsFilterDropdownOpen(true)}
                        placeholder="검색어를 입력하세요 (F-SEARCH-003)"
                        className="w-full px-4 h-10 text-sm focus:outline-none text-gray-800"
                    />

                    <button type="button" className="p-2.5 text-gray-400 hover:text-green-600 mr-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>

                {/* 기획 도안 내용 100% 매칭 세부 필터 드롭다운 */}
                {isFilterDropdownOpen && (
                    <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl p-6 z-50 text-xs select-none animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="space-y-4 text-gray-700">
                            {/* 1. 카테고리 행 */}
                            <div className="flex items-center min-h-[32px]">
                                <span className="w-24 font-bold text-gray-400 text-left">카테고리</span>
                                <div className="flex space-x-4">
                                    {['다이닝', '베이커리'].map((tag) => (
                                        <button key={tag} type="button" onClick={() => handleFilterToggle(tag)} className={`transition-all font-medium ${selectedFilters.includes(tag) ? 'text-green-600 font-bold underline' : 'text-gray-700 hover:text-black'}`}>
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* 2. 평균 가격대 행 */}
                            <div className="flex items-center min-h-[32px]">
                                <span className="w-24 font-bold text-gray-400 text-left">평균 가격대</span>
                                <div className="flex space-x-5 flex-wrap">
                                    {['10,000원 이하', '10,000원 ~ 20,000원', '20,000원 ~ 30,000원', '30,000원 이상'].map((tag) => (
                                        <button key={tag} type="button" onClick={() => handleFilterToggle(tag)} className={`transition-all font-medium ${selectedFilters.includes(tag) ? 'text-green-600 font-bold underline' : 'text-gray-700 hover:text-black'}`}>
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* 3. 최소평점 행 */}
                            <div className="flex items-center min-h-[32px]">
                                <span className="w-24 font-bold text-gray-400 text-left">최소 평점</span>
                                <div className="flex space-x-6">
                                    {['1점', '2점', '3점', '4점', '5점'].map((tag) => (
                                        <button key={tag} type="button" onClick={() => handleFilterToggle(tag)} className={`transition-all font-medium ${selectedFilters.includes(tag) ? 'text-green-600 font-bold underline' : 'text-gray-700 hover:text-black'}`}>
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* 4. 비건 요소 행 */}
                            <div className="flex items-center min-h-[32px]">
                                <span className="w-24 font-bold text-gray-400 text-left">비건 요소</span>
                                <div className="flex space-x-6">
                                    {['비건', '글루텐프리', '락토', '락토-오보'].map((tag) => (
                                        <button key={tag} type="button" onClick={() => handleFilterToggle(tag)} className={`transition-all font-medium ${selectedFilters.includes(tag) ? 'text-green-600 font-bold underline' : 'text-gray-700 hover:text-black'}`}>
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-2 border-t border-gray-100 flex justify-end text-[10px] text-gray-400">
                            검색창 바깥 영역을 클릭하면 설정이 필터에 자동 반영되어 닫힙니다.
                        </div>
                    </div>
                )}
            </div>

            {/* 우측 마이페이지 및 로그아웃 유기적 배치 영역 */}
            <div className="flex items-center space-x-2 flex-shrink-0">
                {/* 🛠️ 새 부품: 로그아웃 버튼 */}
                <button
                    type="button"
                    onClick={onLogout}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-medium transition-colors"
                >
                    로그아웃
                </button>

                {/* 마이페이지 링크 기능 유지 */}
                <button
                    type="button"
                    onClick={onOpenAuth}
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors"
                >
                    마이페이지 (로그인)
                </button>
            </div>
        </header>
    );
}