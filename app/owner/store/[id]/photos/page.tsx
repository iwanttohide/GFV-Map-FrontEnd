'use client';

import { use } from 'react';
import StoreTabs from '@/components/owner/StoreTabs';

export default function PhotoPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = use(params);

    return (
        <div className="max-w-lg mx-auto">

            <StoreTabs storeId={id} />

            <div className="px-5 py-6">
                <div className="flex flex-col items-center justify-center mt-24 gap-6">
                    <p className="text-sm text-gray-400">등록된 사진이 없습니다.</p>
                </div>
            </div>
        </div>
    );
}