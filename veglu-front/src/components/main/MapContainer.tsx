'use client';

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

interface Restaurant {
    restaurantId: number;
    name: string;
    address: string;
    points: string;
    matchedMenus: string[];
    veganType: string;
}

interface MapContainerProps {
    restaurants: Restaurant[];
    selectedIndex: number | null;
}

export default function MapContainer({ restaurants, selectedIndex }: MapContainerProps) {
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

    // 🎯 마커 드로잉 엔진 (단독 마커 분기 유지)
    const drawMapMarkers = () => {
        const map = mapInstance.current;
        const clusterer = clustererInstance.current;
        if (!map || !clusterer) return;

        clusterer.clear();
        if (markersRef.current && markersRef.current.length > 0) {
            markersRef.current.forEach(marker => {
                if (marker) marker.setMap(null);
            });
        }
        markersRef.current = [];

        // 상세창이 열려있으면 해당 식당 마커만, 없으면 전체 노출
        const targets = selectedIndex !== null ? [restaurants[selectedIndex]] : restaurants;

        const newMarkers = targets.map((shop: any) => {
            if (!shop) return null;
            let finalLat: number | null = null;
            let finalLng: number | null = null;

            if (shop.points && typeof shop.points === 'string') {
                const separator = shop.points.includes('/') ? '/' : (shop.points.includes(',') ? ',' : null);
                if (separator) {
                    const [latStr, lngStr] = shop.points.split(separator);
                    finalLat = parseFloat(latStr.trim());
                    finalLng = parseFloat(lngStr.trim());
                }
            }

            if (finalLat === null || isNaN(finalLat)) {
                const fallbackLat = shop.latitude || shop.lat;
                const fallbackLng = shop.longitude || shop.lng;
                if (fallbackLat && fallbackLng) {
                    finalLat = typeof fallbackLat === 'string' ? parseFloat(fallbackLat) : fallbackLat;
                    finalLng = typeof fallbackLng === 'string' ? parseFloat(fallbackLng) : fallbackLng;
                }
            }

            if (finalLat && finalLng && !isNaN(finalLat) && !isNaN(finalLng)) {
                const markerPosition = new window.kakao.maps.LatLng(finalLat, finalLng);
                return new window.kakao.maps.Marker({
                    position: markerPosition,
                    title: shop.name,
                    map: map
                });
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
    }, [restaurants, selectedIndex]);

    // ──────────────────────────────────────────────────────────
    // 🎯 [완치 구역] 사이드바 클릭 시 해당 식당으로 "확실하게 무빙" 시키는 트리거
    // ──────────────────────────────────────────────────────────
    useEffect(() => {
        const map = mapInstance.current;
        if (!map || selectedIndex === null) return;

        const targetShop = restaurants[selectedIndex];
        if (targetShop) {
            let finalLat: number | null = null;
            let finalLng: number | null = null;

            // 좌표 추출 장치
            if (targetShop.points && typeof targetShop.points === 'string') {
                const separator = targetShop.points.includes('/') ? '/' : (targetShop.points.includes(',') ? ',' : null);
                if (separator) {
                    const [latStr, lngStr] = targetShop.points.split(separator);
                    finalLat = parseFloat(latStr.trim());
                    finalLng = parseFloat(lngStr.trim());
                }
            }

            if (finalLat === null || isNaN(finalLat)) {
                const fallbackLat = (targetShop as any).latitude || (targetShop as any).lat;
                const fallbackLng = (targetShop as any).longitude || (targetShop as any).lng;
                if (fallbackLat && fallbackLng) {
                    finalLat = typeof fallbackLat === 'string' ? parseFloat(fallbackLat) : fallbackLat;
                    finalLng = typeof fallbackLng === 'string' ? parseFloat(fallbackLng) : fallbackLng;
                }
            }

            // 🚀 [핵심] 마커를 지웠다 그리는 타이밍과 엇갈리지 않도록, 미세한 딜레이(setTimeout)를 주어 확실하게 시점을 이동시킵니다!
            if (finalLat && finalLng && !isNaN(finalLat) && !isNaN(finalLng)) {
                const moveLocation = new window.kakao.maps.LatLng(finalLat, finalLng);

                setTimeout(() => {
                    console.log(`🚀 [저격 무빙 실행] '${targetShop.name}' 위치로 부드럽게 카메라를 이동합니다.`);
                    map.panTo(moveLocation);
                }, 50); // 50ms 버퍼를 통해 지도 렌더링 락을 해제합니다.
            }
        }
    }, [selectedIndex]); // 💡 인덱스가 변경되는 순간을 날카롭게 포착합니다.
    // ──────────────────────────────────────────────────────────

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