'use client';

import React, { useState, useRef, useEffect } from 'react';

interface HeaderProps {
    onOpenAuth: () => void;
}

export default function Header({ onOpenAuth }: HeaderProps) {
    // 검색창 포커스 시 하단 필터 드롭다운 오픈 제어 스위치
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    // 좌측 대분류 select bar (지역, 상호명, 메뉴)
    const [searchCategory, setSearchCategory] = useState('region');

    // 사용자가 클릭한 기획안 태그들을 기억할 다중 선택 배열 상태
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // 태그 버튼을 클릭했을 때 활성화/비활성화 토글하는 핸들러
    const handleFilterToggle = (filterName: string) => {
        if (selectedFilters.includes(filterName)) {
            setSelectedFilters(selectedFilters.filter(item => item !== filterName));
        } else {
            setSelectedFilters([...selectedFilters, filterName]);
        }
    };

    // 외부 클릭 시 드롭다운 자동으로 닫아주는 기능
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
            {/* 테마 로고 고정 */}
            <div className="text-xl font-extrabold text-green-700 tracking-tight cursor-pointer flex-shrink-0">
                VEGAN & GF MAP 🌱
            </div>

            {/* ──────────────────────────────────────────────────────────
          중앙 검색창 및 와이어프레임 필터 영역 (F-SEARCH-003)
          ────────────────────────────────────────────────────────── */}
            <div className="flex-1 max-w-3xl mx-6 relative" ref={dropdownRef}>
                <div className="flex items-center border border-gray-300 rounded-xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-green-600/20 focus-within:border-green-600 transition-all overflow-hidden">

                    {/* 와이어프레임 지정: 지역, 상호명, 메뉴 select bar */}
                    <select
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                        className="h-10 px-3 bg-gray-50 border-r border-gray-200 text-xs font-semibold text-gray-500 focus:outline-none cursor-pointer"
                    >
                        <option value="region">지역명</option>
                        <option value="store">상호명</option>
                        <option value="menu">메뉴명</option>
                    </select>

                    {/* 인풋 검색창 (포커스 시 아래 기획안 도면 드롭다운 활성화) */}
                    <input
                        type="text"
                        onFocus={() => setIsFilterDropdownOpen(true)}
                        placeholder="검색어를 입력하세요 (F-SEARCH-003)"
                        className="w-full px-4 h-10 text-sm focus:outline-none text-gray-800"
                    />

                    {/* 돋보기 검색 버튼 */}
                    <button type="button" className="p-2.5 text-gray-400 hover:text-green-600 mr-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>

                {/* ──────────────────────────────────────────────────────────
            와이어프레임 기획 도안 내용 100% 매칭 세부 필터 드롭다운
            ────────────────────────────────────────────────────────── */}
                {isFilterDropdownOpen && (
                    <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl p-6 z-50 text-xs select-none animate-in fade-in slide-in-from-top-2 duration-150">

                        {/* 정렬 격자 테이블 레이아웃 구조화 */}
                        <div className="space-y-4 text-gray-700">

                            {/* 1. 카테고리 행 */}
                            <div className="flex items-center min-h-[32px]">
                                <span className="w-24 font-bold text-gray-400 text-left">카테고리</span>
                                <div className="flex space-x-4">
                                    {['다이닝', '베이커리'].map((tag) => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => handleFilterToggle(tag)}
                                            className={`transition-all font-medium ${
                                                selectedFilters.includes(tag) ? 'text-green-600 font-bold underline' : 'text-gray-700 hover:text-black'
                                            }`}
                                        >
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
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => handleFilterToggle(tag)}
                                            className={`transition-all font-medium ${
                                                selectedFilters.includes(tag) ? 'text-green-600 font-bold underline' : 'text-gray-700 hover:text-black'
                                            }`}
                                        >
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
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => handleFilterToggle(tag)}
                                            className={`transition-all font-medium ${
                                                selectedFilters.includes(tag) ? 'text-green-600 font-bold underline' : 'text-gray-700 hover:text-black'
                                            }`}
                                        >
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
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => handleFilterToggle(tag)}
                                            className={`transition-all font-medium ${
                                                selectedFilters.includes(tag) ? 'text-green-600 font-bold underline' : 'text-gray-700 hover:text-black'
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* 필터창 우측 하단 닫기/적용 간접 가이드 */}
                        <div className="mt-4 pt-2 border-t border-gray-100 flex justify-end text-[10px] text-gray-400">
                            검색창 바깥 영역을 클릭하면 설정이 필터에 자동 반영되어 닫힙니다.
                        </div>
                    </div>
                )}
            </div>

            {/* 우측 마이페이지 */}
            <button
                onClick={onOpenAuth}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors flex-shrink-0"
            >
                마이페이지 (로그인)
            </button>
        </header>
    );
}