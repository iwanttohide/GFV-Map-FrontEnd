'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMyFavorites, toggleFavorite } from '@/libs/api/favorite';
import type { FavoriteResponse } from '@/types/favorite';

export default function FavoritesPage() {
    const router = useRouter();
    const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchFavorites();
    }, [page]);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const data = await getMyFavorites(page);
            setFavorites((prev) => page === 0 ? data.content : [...prev, ...data.content]);
            setTotalPages(data.totalPages);
        } catch {
            alert('즐겨찾기 목록을 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (restaurant_id: number) => {
        try {
            await toggleFavorite(restaurant_id);
            setFavorites((prev) => prev.filter((f) => f.restaurant_id !== restaurant_id));
        } catch {
            alert('즐겨찾기 해제에 실패했습니다.');
        }
    };

    const handleCardClick = (restaurant_id: number) => {
        router.push(`/?restaurant_id=${restaurant_id}`);
    };

    return (
        <div className="min-h-screen w-screen bg-gray-50 flex flex-col items-center justify-start p-6 select-none">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl p-8 space-y-5 relative my-8">

                {/* 좌상단 로고 */}
                <button
                    onClick={() => router.push('/')}
                    className="absolute top-4 left-4 bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-500 px-3 py-1.5 rounded-lg hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all shadow-sm active:scale-95"
                >
                    로고 🌱
                </button>

                {/* 타이틀 */}
                <div className="pt-6 text-center">
                    <h2 className="text-base font-bold text-gray-900">⭐ 즐겨찾기</h2>
                    <p className="text-xs text-gray-400 mt-1">저장한 식당 목록이에요</p>
                </div>

                {/* 로딩 */}
                {loading && page === 0 && (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-gray-100 animate-pulse rounded-2xl h-16" />
                        ))}
                    </div>
                )}

                {/* 빈 상태 */}
                {!loading && favorites.length === 0 && (
                    <div className="text-center py-10 text-xs text-gray-400 font-medium">
                        즐겨찾기한 식당이 없습니다. 🥑<br />
                        <span className="text-gray-300">지도에서 ⭐ 버튼을 눌러 저장해보세요!</span>
                    </div>
                )}

                {/* 목록 */}
                <ul className="flex flex-col gap-3">
                    {favorites.map((fav) => (
                        <li
                            key={fav.restaurant_id}
                            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 flex items-center justify-between cursor-pointer hover:border-green-300 hover:bg-green-50/30 transition-all shadow-sm active:scale-[0.99]"
                            onClick={() => handleCardClick(fav.restaurant_id)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center text-base flex-shrink-0">
                                    🌱
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-bold text-gray-800">{fav.restaurantName}</span>
                                    <span className="text-[11px] text-gray-400 truncate max-w-[240px]">{fav.restaurantAddress}</span>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-[10px] text-amber-500 font-bold">⭐ {fav.avgRating}</span>
                                        <span className="text-[10px] text-gray-300">·</span>
                                        <span className="text-[10px] text-gray-400">리뷰 {fav.reviewCount}개</span>
                                        <span className="text-[10px] text-gray-300">·</span>
                                        <span className="text-[10px] text-gray-400">{fav.favoritedAt?.slice(0, 10) ?? '-'}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleRemove(fav.restaurant_id); }}
                                className="text-gray-300 hover:text-red-400 transition-colors text-sm px-2 flex-shrink-0"
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>

                {/* 더보기 */}
                {page < totalPages - 1 && (
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={loading}
                        className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors border border-gray-200 active:scale-[0.98] disabled:opacity-40"
                    >
                        {loading ? '불러오는 중...' : '더 보기'}
                    </button>
                )}

                <div className="pt-2 border-t border-gray-100 text-center text-[11px] text-gray-400 font-medium">
                    VEGAN & GF MAP 🌱
                </div>
            </div>
        </div>
    );
}