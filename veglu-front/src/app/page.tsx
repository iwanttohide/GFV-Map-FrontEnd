'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/main/Header';
import Sidebar from '@/components/main/Sidebar';
import MapContainer from '@/components/main/MapContainer';
import AuthModal from '@/components/auth/AuthModal';
import RestaurantDetailSheet from '@/components/main/RestaurantDetailSheet';

interface Restaurant {
    restaurant_id: number;
    name: string;
    address: string;
    points: string;
    matchedMenus: string[];
    veganType: string;
    rating?: number;
}

export default function MainPage() {
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleHeaderFilter = async (filterData: any) => {
        console.log("➡️ 부모가 전달받은 원본 조건 데이터:", filterData);

        const currentCategory = filterData.searchCategory;
        const currentKeyword = (filterData.keyword || '').trim();

        if (currentKeyword === '') {
            console.log("💡 검색어가 비어있어 백엔드 요청을 생략하고 프론트 원본 데이터로 복원합니다.");
            setRestaurants(allRestaurants);
            setSelectedRestaurantId(null);
            return;
        }

        try {
            const accessToken = localStorage.getItem('accessToken');
            const targetKeyword = encodeURIComponent(currentKeyword);

            let apiUrl = `http://192.168.7.120:5000/restaurant/name?keyword=${targetKeyword}`;
            if (currentCategory === 'region') {
                apiUrl = `http://192.168.7.120:5000/restaurant/region?keyword=${targetKeyword}`;
            } else if (currentCategory === 'menu') {
                apiUrl = `http://192.168.7.120:5000/restaurant/menu?keyword=${targetKeyword}`;
            }

            console.log(`🔎 [검색 실행] 백엔드로 찌르는 최종 주소 ➔ ${apiUrl}`);

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken ? `Bearer ${accessToken}` : ''
                }
            });

            if (response.ok) {
                const data = await response.json();
                const sanitizedData = Array.isArray(data) ? data : [];
                setRestaurants(sanitizedData);
                setSelectedRestaurantId(null);
            }

        } catch (err) {
            console.error("식당 검색 조회 에러:", err);
        }
    };

    const fetchInitialRestaurants = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            const response = await fetch(
                'http://192.168.7.120:5000/restaurant/name?keyword=',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': accessToken ? `Bearer ${accessToken}` : ''
                    }
                }
            );
            if (response.ok) {
                const data = await response.json();
                const sanitizedData = Array.isArray(data) ? data : [];

                setAllRestaurants(sanitizedData);
                setRestaurants(sanitizedData);

                console.log("🔥 프론트엔드가 보관에 성공한 마스터 시드 데이터:", sanitizedData.length, "개");
            }
        } catch (err) {
            console.error("초기 식당 데이터 로드 실패:", err);
        }
    };

    // restaurants 로드 완료 후 쿼리스트링 체크 → 바텀시트 자동 오픈
    useEffect(() => {
        if (restaurants.length === 0) return;

        const urlParams = new URLSearchParams(window.location.search);
        const restaurantIdParam = urlParams.get('restaurant_id');
        if (!restaurantIdParam) return;

        const targetId = Number(restaurantIdParam);
        const exists = restaurants.find((r) => r.restaurant_id === targetId);
        if (exists) {
            setSelectedRestaurantId(targetId);
            window.history.replaceState({}, '', '/');
        }
    }, [restaurants]);

    // 새로고침 시 자동 토큰 검증 및 재발급
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const email = urlParams.get('email');

        if (token && email) {
            localStorage.setItem('accessToken', token);
            localStorage.setItem('user_email', email);
            window.location.href = '/';
        }

        const checkAuthAndRefresh = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (!accessToken && !refreshToken) return;

            if (accessToken?.startsWith('mock_')) {
                console.log("⚠️ [테스트 오버라이딩] 가짜 토큰을 감지했습니다. 백엔드 갱신 요청을 생략하고 프리패스 지도를 오픈합니다.");
                setIsLoggedIn(true);
                fetchInitialRestaurants();
                return;
            }

            try {
                const response = await fetch('http://192.168.7.120:5000/auth/refresh', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({ refreshToken: refreshToken })
                });

                if (response.ok) {
                    const data = await response.json();

                    localStorage.setItem('accessToken', data.accessToken);
                    if (data.refreshToken) {
                        localStorage.setItem('refreshToken', data.refreshToken);
                    }

                    setIsLoggedIn(true);
                    fetchInitialRestaurants();
                } else {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
            } catch (err) {
                console.error('자동 로그인 재발급 통신 중 오류:', err);
            }
        };

        checkAuthAndRefresh();
    }, []);

    const handleModalClose = () => {
        setIsAuthOpen(false);
    };

    const handleLoginSuccess = () => {
        setIsAuthOpen(false);
        setIsLoggedIn(true);
        fetchInitialRestaurants();
    };

    const handleLogout = () => {
        if (confirm('로그아웃 하시겠습니까?')) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setIsLoggedIn(false);
            setRestaurants([]);
            setAllRestaurants([]);
            setSelectedRestaurantId(null);
        }
    };

    return (
        <>
            {!isLoggedIn ? (
                <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gray-50 p-4 select-none">
                    <div className="text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                        <div className="text-5xl animate-bounce mb-2">🌱🍞</div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            비건 & 글루텐프리 안심 지도
                        </h1>
                        <p className="text-gray-500 max-w-sm text-sm">
                            내 주변의 안심하고 먹을 수 있는 채식 식당과 속 편한 쌀 베이커리를 지도에서 한눈에 확인해 보세요.
                        </p>
                        <button
                            type="button"
                            onClick={() => setIsAuthOpen(true)}
                            className="mt-4 px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-medium rounded-xl text-sm transition-all shadow-md active:scale-95"
                        >
                            시작하기 (로그인)
                        </button>
                    </div>
                </div>
            ) : (
                <div className="h-screen w-screen flex flex-col bg-white overflow-hidden">
                    <Header onLogout={handleLogout} onFilterChange={handleHeaderFilter} />

                    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-gray-50">

                        <MapContainer
                            restaurants={restaurants}
                            selectedId={selectedRestaurantId}
                            onMarkerSelect={(id) => setSelectedRestaurantId(id)}
                        />

                        <Sidebar
                            restaurants={restaurants}
                            selectedIndex={selectedRestaurantId}
                            onShopSelect={(id) => setSelectedRestaurantId(id)}
                            isOpenProps={isSidebarOpen}
                            onToggleSidebar={(open) => setIsSidebarOpen(open)}
                        />

                        <RestaurantDetailSheet
                            restaurant={selectedRestaurantId !== null ? (restaurants.find(r => r.restaurant_id === selectedRestaurantId) || null) : null}
                            onClose={() => setSelectedRestaurantId(null)}
                            isSidebarOpen={isSidebarOpen}
                        />

                    </div>
                </div>
            )}

            <AuthModal
                isOpen={isAuthOpen}
                onClose={handleModalClose}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    );
}