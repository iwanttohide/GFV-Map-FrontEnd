// 가게 상세 정보
export interface Store {
    id: string;
    name: string;
    rating: number;
    hours: string;      // 영업시간
    breakTime: string;  // 브레이크 타임
    phone: string;
    address: string;
    imageUrl?: string;
}

// 리뷰 정보
export interface Review {
    id: string;
    userId: string;
    content: string;
    rating: number;
    date: string;
    hasReply: boolean;
    replyContent?: string;
}

// 메뉴 정보
export interface Menu {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
}