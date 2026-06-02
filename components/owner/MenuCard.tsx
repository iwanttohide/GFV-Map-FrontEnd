'use client';

import { useState } from 'react';

export type Menu = {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
};

type Props = {
    menu: Menu;
    onDelete: (id: string) => void;
    onEdit: (menu: Menu) => void;
};

export default function MenuCard({
                                     menu,
                                     onDelete,
                                     onEdit,
                                 }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <li className="flex gap-4 py-4 relative">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                <img
                    src={menu.thumbnail}
                    alt={menu.name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                        {menu.name}
                    </p>

                    <div className="relative">
                        <button
                            onClick={() => setOpen(!open)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
                        >
                            ⋮
                        </button>

                        {open && (
                            <div className="absolute right-0 top-9 w-24 bg-white border rounded-lg shadow-lg z-10 overflow-hidden">
                                <button
                                    className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
                                    onClick={() => {
                                        const name = prompt(
                                            '메뉴명',
                                            menu.name
                                        );

                                        if (!name) return;

                                        const description = prompt(
                                            '설명',
                                            menu.description
                                        );

                                        if (!description) return;

                                        onEdit({
                                            ...menu,
                                            name,
                                            description,
                                        });

                                        setOpen(false);
                                    }}
                                >
                                    수정
                                </button>

                                <button
                                    className="w-full px-3 py-2 text-sm text-left text-red-500 hover:bg-red-50"
                                    onClick={() => {
                                        if (
                                            confirm(
                                                '메뉴를 삭제하시겠습니까?'
                                            )
                                        ) {
                                            onDelete(menu.id);
                                        }

                                        setOpen(false);
                                    }}
                                >
                                    삭제
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mt-1">
                    {menu.description}
                </p>
            </div>
        </li>
    );
}