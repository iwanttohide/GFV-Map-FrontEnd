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

    const initKakaoMap = () => {
        if (mapInstance.current) return;
        if (!mapContainerRef.current) return;

        const container = mapContainerRef.current;
        const options = {
            center: new window.kakao.maps.LatLng(37.5172, 127.0473),
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

    // ──────────────────────────────────────────────────────────
    // 🎯 [정밀 수선 구역] 마커 강제 드로잉 엔진 보강
    // ──────────────────────────────────────────────────────────
    const drawMapMarkers = () => {
        const map = mapInstance.current;
        const clusterer = clustererInstance.current;
        if (!map || !clusterer) return;

        console.log("📍 [지도 마킹 엔진 개시] 수입된 식당 개수:", restaurants.length);

        // 💡 [디버깅 비밀무기] 실제로 백엔드가 던져준 데이터 가방의 첫 번째 껍데기를 까서 봅니다.
        if (restaurants.length > 0) {
            console.log("🔍 백엔드가 준 첫 번째 식당 실물 명세 데이터 원본:", restaurants[0]);
        }

        // 1. 기존 마커 잔상 완벽 청소
        clusterer.clear();
        if (markersRef.current && markersRef.current.length > 0) {
            markersRef.current.forEach(marker => {
                if (marker) marker.setMap(null);
            });
        }
        markersRef.current = [];

        // 2. 어떤 포맷이 들어와도 좌표를 찾아내는 하이브리드 파싱 엔진 가동
        const newMarkers = restaurants.map((shop: any) => {
            let finalLat: number | null = null;
            let finalLng: number | null = null;

            // 주동선 A: points 문자열이 존재할 때 (슬래시 / 또는 콤마 , 모두 가드)
            if (shop.points && typeof shop.points === 'string') {
                const separator = shop.points.includes('/') ? '/' : (shop.points.includes(',') ? ',' : null);
                if (separator) {
                    const [latStr, lngStr] = shop.points.split(separator);
                    finalLat = parseFloat(latStr.trim());
                    finalLng = parseFloat(lngStr.trim());
                }
            }

            // 주동선 B: 만약 백엔드가 points를 안 주고 lat, lng 이나 latitude, longitude로 직접 쪼개 줬을 때 우회로 확보
            if (finalLat === null || isNaN(finalLat)) {
                const fallbackLat = shop.latitude || shop.lat;
                const fallbackLng = shop.longitude || shop.lng;
                if (fallbackLat && fallbackLng) {
                    finalLat = typeof fallbackLat === 'string' ? parseFloat(fallbackLat) : fallbackLat;
                    finalLng = typeof fallbackLng === 'string' ? parseFloat(fallbackLng) : fallbackLng;
                }
            }

            // 최종 위도 경도가 정상적인 숫자로 도출되었다면 카카오 마커 확정 격발
            if (finalLat && finalLng && !isNaN(finalLat) && !isNaN(finalLng)) {
                const markerPosition = new window.kakao.maps.LatLng(finalLat, finalLng);
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                    title: shop.name,
                    map: map
                });
                return marker;
            }

            console.warn(`⚠️ [좌표 유실 경고] '${shop.name}' 식당의 좌표 정보를 파싱할 수 없어 마킹에서 제외됨. 원본 points:`, shop.points);
            return null;
        }).filter(m => m !== null) as any[];

        // 3. 클러스터러 주입
        markersRef.current = newMarkers;
        clusterer.addMarkers(newMarkers);

        console.log(`✅ [마킹 성공 완료] 최종 지도에 주입된 핀 마커 개수: ${newMarkers.length}개`);
    };
    // ──────────────────────────────────────────────────────────

    useEffect(() => {
        if (mapInstance.current) {
            drawMapMarkers();
        }
    }, [restaurants]); // 💡 부모의 검색 결과 배열이 뒤바뀌면 지체 없이 격발됩니다.

    useEffect(() => {
        const map = mapInstance.current;
        if (!map || !selectedId) return;

        const targetShop = restaurants.find(item => item.restaurantId === selectedId);
        if (targetShop && targetShop.points && targetShop.points.includes('/')) {
            const [latStr, lngStr] = targetShop.points.split('/');
            const moveLocation = new window.kakao.maps.LatLng(parseFloat(latStr.trim()), parseFloat(lngStr.trim()));
            map.panTo(moveLocation);
        }
    }, [selectedId, restaurants]);

    return (
        <div className="absolute inset-0 min-w-full min-h-full bg-gray-100 z-0">
            <Script
                src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=604e9a64453d6167f7a58e8231871b49&autoload=false&libraries=clusterer"
                strategy="afterInteractive"
                onLoad={() => {
                    if (window.kakao && window.kakao.maps) {
                        window.kakao.maps.load(initKakaoMap);
                    }
                }}
            />
            <div ref={mapContainerRef} className="w-full h-full" />
        </div>
    );
}

declare global {
    interface Window {
        kakao: any;
    }
}