'use client';

import { use, useState } from 'react';
import StoreTabs from '@/components/owner/StoreTabs';
import MenuCard, { Menu } from '@/components/owner/MenuCard';

const initialMenus: Menu[] = [
    {
        id: '1',
        name: '두부아보카도샐러드',
        description:
            '부드러운 두부와 크리미한 아보카도를 신선한 채소와 함께 담아낸 샐러드입니다.',
        thumbnail:
            'https://i.pinimg.com/1200x/cb/26/23/cb2623d77ded2ff0650182f1709d788f.jpg',
    },
    {
        id: '2',
        name: '시저샐러드',
        description:
            '신선한 채소와 치즈를 곁들인 클래식 시저샐러드입니다.',
        thumbnail:
            'https://i.pinimg.com/1200x/cb/26/23/cb2623d77ded2ff0650182f1709d788f.jpg',
    },
];

export default function MenuPage({
                                     params,
                                 }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    const [menus, setMenus] = useState(initialMenus);

    const handleAddMenu = () => {
        const name = prompt('메뉴명을 입력하세요');

        if (!name) return;

        const description = prompt('설명을 입력하세요');

        if (!description) return;

        const thumbnail =
            prompt('이미지 URL을 입력하세요') ||
            'https://via.placeholder.com/150';

        const newMenu: Menu = {
            id: Date.now().toString(),
            name,
            description,
            thumbnail,
        };

        setMenus((prev) => [...prev, newMenu]);
    };

    return (
        <div className="max-w-lg mx-auto">
            <StoreTabs storeId={id} />

            <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-gray-900">
                        메뉴
                    </h2>

                    <button
                        onClick={handleAddMenu}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xl"
                    >
                        +
                    </button>
                </div>

                <ul className="flex flex-col divide-y divide-gray-100">
                    {menus.map((menu) => (
                        <MenuCard
                            key={menu.id}
                            menu={menu}
                            onDelete={(id) => {
                                setMenus((prev) =>
                                    prev.filter(
                                        (menu) => menu.id !== id
                                    )
                                );
                            }}
                            onEdit={(updatedMenu) => {
                                setMenus((prev) =>
                                    prev.map((menu) =>
                                        menu.id === updatedMenu.id
                                            ? updatedMenu
                                            : menu
                                    )
                                );
                            }}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}