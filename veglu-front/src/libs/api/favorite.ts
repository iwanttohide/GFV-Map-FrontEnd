import { apiClient } from '@/libs/api/client';
import type { Page } from '@/types/common';
import type { FavoriteResponse, FavoriteToggleResponse } from '@/types/favorite';

export async function toggleFavorite(restaurant_id: number): Promise<FavoriteToggleResponse> {
    return apiClient(`/favorite/${restaurant_id}`, { method: 'POST' });
}

export async function checkFavorite(restaurant_id: number): Promise<boolean> {
    const data = await apiClient(`/favorite/check/${restaurant_id}`);
    return data.favorited;
}

// 내 즐겨찾기 목록
export async function getMyFavorites(page = 0, size = 20): Promise<Page<FavoriteResponse>> {
    const data = await apiClient(`/favorite/my?page=${page}&size=${size}`);
    data.content = data.content.map((item: any) => ({
        ...item,
        restaurant_id: item.restaurantId,
    }));
    return data;
}