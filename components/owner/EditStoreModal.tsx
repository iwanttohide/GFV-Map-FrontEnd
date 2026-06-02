'use client';

import { useState } from 'react';

type Store = {
    name: string;
    hours: string;
    breakTime: string;
    phone: string;
    address: string;
};

type Props = {
    store: Store;
    onClose: () => void;
    onSave: (store: Store) => void;
};

export default function EditStoreModal({
                                           store,
                                           onClose,
                                           onSave,
                                       }: Props) {
    const [name, setName] = useState(store.name);
    const [hours, setHours] = useState(store.hours);
    const [breakTime, setBreakTime] = useState(store.breakTime);
    const [phone, setPhone] = useState(store.phone);
    const [address, setAddress] = useState(store.address);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onSave({
            name,
            hours,
            breakTime,
            phone,
            address,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
                <h3 className="text-lg font-bold mb-4">
                    가게 정보 수정
                </h3>

                <form
                    className="space-y-3"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label className="block text-xs text-gray-500">
                            가게명
                        </label>
                        <input
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            className="w-full border rounded-lg p-2 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs text-gray-500">
                                영업시간
                            </label>
                            <input
                                value={hours}
                                onChange={(e) =>
                                    setHours(e.target.value)
                                }
                                className="w-full border rounded-lg p-2 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500">
                                전화번호
                            </label>
                            <input
                                value={phone}
                                onChange={(e) =>
                                    setPhone(e.target.value)
                                }
                                className="w-full border rounded-lg p-2 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500">
                            브레이크타임
                        </label>
                        <input
                            value={breakTime}
                            onChange={(e) =>
                                setBreakTime(e.target.value)
                            }
                            className="w-full border rounded-lg p-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500">
                            주소
                        </label>
                        <input
                            value={address}
                            onChange={(e) =>
                                setAddress(e.target.value)
                            }
                            className="w-full border rounded-lg p-2 text-sm"
                        />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 bg-gray-100 rounded-lg text-sm"
                        >
                            취소
                        </button>

                        <button
                            type="submit"
                            className="flex-1 py-2 bg-black text-white rounded-lg text-sm"
                        >
                            저장하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}