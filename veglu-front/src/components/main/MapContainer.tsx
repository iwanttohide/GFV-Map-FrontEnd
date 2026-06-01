'use client';

import React from 'react';

export default function MapContainer() {
    return (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            {/* 실제 지도 API가 연동되기 전 격자 그리드 형태의 가상 백그라운드 */}
            <div className="text-center space-y-2 pointer-events-none select-none">
                <div className="text-4xl">🗺️</div>
                <h2 className="font-bold text-gray-400 text-sm tracking-wide">
                    지도 영역 (F-MAP-001)
                </h2>
                <p className="text-xs text-gray-400">
                    추후 마커 클러스터링(F-MAP-002) 라이브러리가 주입되는 공간입니다.
                </p>
            </div>

            {/* 가상 마커 클러스터 샘플 오버레이 */}
            <div className="absolute top-1/3 left-1/2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg animate-bounce">
                5
            </div>
            <div className="absolute top-1/2 left-2/3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg animate-bounce delay-150">
                3
            </div>
        </div>
    );
}