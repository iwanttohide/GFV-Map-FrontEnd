'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// 🎯 백엔드 명세 기반 리뷰 데이터 타입 설계
interface ReviewItem {
    reviewId?: number;        // 백엔드에서 내려줄 고유 번호
    // restaurantId: number;     // 필수
    restaurant_id: number;
    restaurantName?: string;   // UI 화면에 뿌려줄 식당 이름 (백엔드에 추가 요청 필요)
    rating: number;           // 필수 (1.0~5.0)
    content: string;          // 필수
    photos?: string[];        // 선택 (URL 배열)
    visitDate?: string;       // 선택
    companionCount?: number;   // 선택
    recommendedMenu?: string; // 선택
}

// 📸 사진첩 모달용 정제 데이터 타입
interface GalleryPhoto {
    id: string | number;
    title: string;
    url: string;
}

export default function MyPage() {
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

    // 🚨 작성한 리뷰 리스트 활성화 스위치 상태
    const [isReviewListOpen, setIsReviewListOpen] = useState(false);

    // 로컬 저장소 값 기반 동적 바인딩 상태
    const [email, setEmail] = useState('veglu@domain.com');
    const [nickname, setNickname] = useState('익명유저');
    const [bio, setBio] = useState('여기는 사용자 자기소개 텍스트가 노출되거나 수정 입력되는 공간입니다.');
    const [avatar, setAvatar] = useState('🥑');

    // 🎯 백엔드 실물 리뷰 데이터를 보관할 전역 상태 서버 저장소
    const [myReviews, setMyReviews] = useState<ReviewItem[]>([]);
    const [myPhotos, setMyPhotos] = useState<GalleryPhoto[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedEmail = localStorage.getItem('user_email');
            const savedNickname = localStorage.getItem('user_nickname');
            const savedBio = localStorage.getItem('user_bio');
            const savedAvatar = localStorage.getItem('user_avatar');

            if (savedEmail && savedEmail !== 'undefined' && savedEmail !== 'null' && savedEmail.trim() !== '') {
                setEmail(savedEmail);
            }
            if (savedNickname && savedNickname !== 'undefined' && savedNickname !== 'null' && savedNickname.trim() !== '') {
                setNickname(savedNickname);
            }
            if (savedBio && savedBio !== 'undefined' && savedBio !== 'null' && savedBio.trim() !== '') {
                setBio(savedBio);
            }
            if (savedAvatar && savedAvatar !== 'undefined' && savedAvatar !== 'null' && savedAvatar.trim() !== '') {
                setAvatar(savedAvatar);
            }

            // 🚀 컴포넌트 마운트 시 사용자의 실물 리뷰 리스트를 수입해옵니다.
            fetchUserReviews();
        }
    }, []);

    // ⚡ 백엔드와 통신하여 실물 리뷰를 징집하는 엔진
    const fetchUserReviews = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.7.120:5000';

            // 💡 [프로젝트 명세 조율] 백엔드의 마이리뷰 조회 API 경로 명칭에 맞춰 정렬하세요.
            const response = await fetch(`${BACKEND_URL}/review/my`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken ? `Bearer ${accessToken}` : ''
                }
            });

            if (!response.ok) throw new Error('리뷰 목록 로드 실패');

            const data: ReviewItem[] = await response.json();
            const sanitizedReviews = Array.isArray(data) ? data : [];

            // 1. 상태창에 실물 리뷰 배열 주입
            setMyReviews(sanitizedReviews);

            // 2. 🌟 [리팩터링 핵심] 리뷰 목록 내에 흩어져 있는 photos URL들을 긁어모아 사진첩(Gallery) 데이터로 재조립!
            const extractedPhotos: GalleryPhoto[] = [];
            sanitizedReviews.forEach((review, rIndex) => {
                if (review.photos && Array.isArray(review.photos)) {
                    review.photos.forEach((photoUrl, pIndex) => {
                        if (photoUrl && photoUrl.trim() !== '') {
                            extractedPhotos.push({
                                id: `${rIndex}-${pIndex}`,
                                title: review.recommendedMenu ? `추천메뉴: ${review.recommendedMenu}` : '안심 비건 인증 먹거리',
                                url: photoUrl
                            });
                        }
                    });
                }
            });

            setMyPhotos(extractedPhotos);

        } catch (err) {
            console.error("🚨 마이페이지 리뷰 연동 실패:", err);
            // 통신 장애 시 유저 경험을 방해하지 않는 선에서 빈 배열 처리 방어
            setMyReviews([]);
            setMyPhotos([]);
        }
    };

    // 별점 숫자를 이쁜 별 이모지(⭐️) 문자열로 변환해 주는 시각 필터 변환기
    const renderStarRating = (rating: number) => {
        const floorRating = Math.floor(rating);
        return '⭐️'.repeat(floorRating) || '⭐️';
    };

    return (
        <div className="min-h-screen w-screen bg-gray-50 flex flex-col items-center justify-center p-6 select-none relative overflow-y-auto">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl p-8 space-y-6 relative z-10 animate-in fade-in duration-200 my-8">

                <Link
                    href="/"
                    className="absolute top-4 left-4 bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-500 px-3 py-1.5 rounded-lg hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all shadow-sm active:scale-95 cursor-pointer"
                    title="지도 페이지 홈으로 이동"
                >
                    로고 🌱
                </Link>

                <div className="text-right">
                    <Link
                        href="/mypage/edit"
                        className="text-[10px] font-bold text-green-700 bg-green-50 hover:bg-green-100 px-2.5 py-1.5 rounded-lg transition-all shadow-sm tracking-wider inline-block active:scale-95"
                    >
                        수정하기 ⚙️
                    </Link>
                </div>

                <div className="flex flex-col items-center space-y-3 pt-2">
                    <div className="w-24 h-24 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-3xl shadow-inner overflow-hidden">
                        {avatar.startsWith('data:image') || avatar.startsWith('http') ? (
                            <img src={avatar} alt="user-avatar" className="w-full h-full object-cover" />
                        ) : (
                            avatar
                        )}
                    </div>
                    <div className="text-center">
                        <h2 className="text-base font-bold text-gray-900">{nickname}</h2>
                        <p className="text-xs text-gray-500 font-semibold mt-0.5">{email}</p>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">자기소개</label>
                    <div className="w-full h-20 bg-gray-100 border border-gray-200 rounded-xl p-3 text-xs text-gray-600 flex items-start justify-start leading-relaxed shadow-inner overflow-y-auto">
                        {bio}
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    {/* 📸 동적 사진첩 모달 오픈 트리거 */}
                    <button
                        type="button"
                        onClick={() => setIsPhotoModalOpen(true)}
                        className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors border border-gray-200 text-center active:scale-[0.98]"
                    >
                        사진첩 열기 📸 ({myPhotos.length})
                    </button>

                    {/* 🚨 미구현 영역 해제 및 아코디언 토글형 리뷰 리스트 변신 */}
                    <button
                        type="button"
                        onClick={() => setIsReviewListOpen(!isReviewListOpen)}
                        className={`w-full py-3 font-semibold rounded-xl text-xs transition-all border text-center active:scale-[0.98] ${
                            isReviewListOpen
                                ? 'bg-green-700 text-white border-green-700 shadow-md'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                        }`}
                    >
                        {isReviewListOpen ? '리뷰 리스트 접기 🔼' : `작성한 리뷰 리스트 📝 (${myReviews.length})`}
                    </button>
                </div>

                {/* 📝 아코디언 컴포넌트: 작성한 리뷰 리스트 실물 뷰포트 레이어 */}
                {isReviewListOpen && (
                    <div className="pt-2 space-y-3 border-t border-gray-100 max-h-80 overflow-y-auto pr-1 animate-in slide-in-from-top-3 duration-200">
                        {myReviews.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-xs font-medium">
                                아직 작성하신 안심 비건 리뷰가 없습니다. <br/>지도의 식당 정보에서 첫 리뷰를 남겨보세요! 🥑
                            </div>
                        ) : (
                            myReviews.map((review, index) => (
                                <div key={review.reviewId || index} className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl space-y-2 text-left">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-xs font-bold text-gray-800 truncate max-w-[200px]">
                                            {/*{review.restaurantName || `안심 인증 식당 (ID: ${review.restaurantId})`}*/}
                                            {review.restaurantName || `안심 인증 식당 (ID: ${review.restaurant_id})`}
                                        </h4>
                                        <span className="text-[10px] text-gray-400 font-semibold">{review.visitDate || '방문일 미지정'}</span>
                                    </div>
                                    <div className="flex items-center space-x-1.5 text-xs">
                                        <span className="text-amber-500 font-bold">{renderStarRating(review.rating)}</span>
                                        <span className="text-gray-400 text-[10px] font-bold">({review.rating.toFixed(1)})</span>
                                        {review.companionCount && (
                                            <span className="text-[9px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded font-bold">
                                                👥 {review.companionCount}인 방문
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed font-medium break-all whitespace-pre-line">
                                        {review.content}
                                    </p>
                                    {review.recommendedMenu && (
                                        <div className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-1 rounded-lg inline-block">
                                            👍 추천메뉴: {review.recommendedMenu}
                                        </div>
                                    )}
                                    {/* 리뷰 내 미니 이미지 썸네일 노출 */}
                                    {review.photos && review.photos.length > 0 && (
                                        <div className="flex space-x-1.5 pt-1 overflow-x-auto">
                                            {review.photos.map((pUrl, pIdx) => (
                                                <img key={pIdx} src={pUrl} alt="review-thumb" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                <div className="pt-4 border-t border-gray-100 text-center text-[11px] text-gray-400 font-medium">
                    현재 마이페이지 독립형 스프린트 조립 중입니다.
                </div>
            </div>

            {/* 📸 사진첩 갤러리 모달창 구역 (실물 데이터 파싱 완료) */}
            {isPhotoModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="w-full max-w-lg bg-white border border-gray-100 rounded-3xl shadow-2xl p-6 relative flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100 flex-shrink-0">
                            <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center"><span className="mr-1.5">📸</span> {nickname}님의 비건 안심 갤러리</h3>
                            <button type="button" onClick={() => setIsPhotoModalOpen(false)} className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full font-bold text-xs">✕</button>
                        </div>
                        <div className="flex-1 overflow-y-auto pt-4 pr-1 space-y-2">
                            <p className="text-[10px] text-gray-400 font-medium">총 {myPhotos.length}개의 안심 먹거리 추억이 보관되어 있습니다.</p>

                            {myPhotos.length === 0 ? (
                                <div className="text-center py-16 text-gray-400 text-xs font-semibold">
                                    갤러리에 등록된 사진이 없습니다. <br/>리뷰 작성 시 멋진 비건푸드 사진을 첨부해 보세요! 🥖
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-3">
                                    {myPhotos.map((photo) => (
                                        <div key={photo.id} className="aspect-square w-full rounded-xl bg-gray-50 border border-gray-200 overflow-hidden relative group cursor-pointer shadow-sm hover:ring-2 hover:ring-green-600/40 transition-all" title={photo.title}>
                                            <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                                <span className="text-[9px] font-semibold text-white truncate w-full">{photo.title}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end flex-shrink-0">
                            <button type="button" onClick={() => setIsPhotoModalOpen(false)} className="px-4 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold shadow-sm">닫기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}