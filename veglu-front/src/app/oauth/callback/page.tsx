'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OAuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');

        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
            if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
            router.replace('/');   // 홈으로
        } else {
            router.replace('/login');
        }
    }, [router]);

    return <div>로그인 처리 중...</div>;
}