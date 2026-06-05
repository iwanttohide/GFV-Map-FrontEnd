'use client';

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

interface Restaurant {
    restaurantId: number;
    name: string;
    address: string;
    points: string; // "위도/경도" 슬래시 문자열 구조
    matchedMenus: string[];
    veganType: string;
}

interface MapContainerProps {
    restaurants: Restaurant[];
    selectedId: number | null;
}

export default function MapContainer({ restaurants, selectedId }: MapContainerProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const clustererInstance = useRef<any>(null);
    const markersRef = useRef<any[]>([]);

    // 💡 [방어선 구축] kakao 객체가 완전히 준비되었을 때만 안전하게 지도를 그리는 이니셜라이저
    const initKakaoMap = () => {
        if (typeof window === 'undefined' || !window.kakao || !window.kakao.maps || !mapContainerRef.current) {
            console.warn('⚠️ 카카오 지도 인프라가 아직 로드되지 않아 대기합니다.');
            return;
        }

        const container = mapContainerRef.current;
        const options = {
            center: new window.kakao.maps.LatLng(37.5172, 127.0473), // 샐러디 강남구청역점 인근 초점
            level: 4,
        };

        const map = new window.kakao.maps.Map(container, options);
        mapInstance.current = map;

        clustererInstance.current = new window.kakao.maps.MarkerClusterer({
            map: map,
            averageCenter: true,
            minLevel: 6,
        });

        drawMapMarkers();
    };

    const drawMapMarkers = () => {
        const map = mapInstance.current;
        const clusterer = clustererInstance.current;
        if (!map || !clusterer) return;

        clusterer.clear();
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        const newMarkers = restaurants.map((shop) => {
            if (shop.points && shop.points.includes('/')) {
                const [latStr, lngStr] = shop.points.split('/');
                const latitude = parseFloat(latStr);
                const longitude = parseFloat(lngStr);

                if (!isNaN(latitude) && !isNaN(longitude)) {
                    const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
                    const marker = new window.kakao.maps.Marker({
                        position: markerPosition,
                        title: shop.name
                    });
                    return marker;
                }
            }
            return null;
        }).filter(m => m !== null) as any[];

        markersRef.current = newMarkers;
        clusterer.addMarkers(newMarkers);
    };

    useEffect(() => {
        if (mapInstance.current) {
            drawMapMarkers();
        }
    }, [restaurants]);

    useEffect(() => {
        const map = mapInstance.current;
        if (!map || !selectedId) return;

        const targetShop = restaurants.find(item => item.restaurantId === selectedId);
        if (targetShop && targetShop.points && targetShop.points.includes('/')) {
            const [latStr, lngStr] = targetShop.points.split('/');
            const moveLocation = new window.kakao.maps.LatLng(parseFloat(latStr), parseFloat(lngStr));
            map.panTo(moveLocation);
        }
    }, [selectedId, restaurants]);

    return (
        // 💡 부모의 찌그러짐을 원천 차단하는 안전 뷰포트 레이아웃 틀
        <div className="absolute inset-0 min-w-full min-h-full bg-gray-100 z-0">
            {/* 💡 [교정 구역]
              1. 프로토콜(https:) 명시
              2. afterInteractive로 부드럽게 지연 로드하되, onLoad 순간에 kakao 내부 수동 부팅 명령 집행!
            */}
            <Script
                src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=4f896162df4492722dcacb46156da66c&autoload=false&libraries=clusterer"
                strategy="afterInteractive"
                onLoad={() => {
                    // 스크립트 파일이 디스크에 다운로드 완료된 순간 수동 부팅 락 해제
                    if (window.kakao && window.kakao.maps) {
                        window.kakao.maps.load(initKakaoMap);
                    }
                }}
            />
            {/* 실제 카카오 엔진 레이어가 입혀지는 도화지 */}
            <div ref={mapContainerRef} className="w-full h-full" />
        </div>
    );
}

declare global {
    interface Window {
        kakao: any;
    }
}