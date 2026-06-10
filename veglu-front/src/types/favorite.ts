export interface FavoriteResponse {
    restaurant_id: number;
    restaurantName: string;
    restaurantAddress: string;
    points: string;
    avgRating: number;
    reviewCount: number;
    favoritedAt: string;
}

export interface FavoriteToggleResponse {
    favorited: boolean;
}