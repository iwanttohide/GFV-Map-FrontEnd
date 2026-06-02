type FilterState = {
    hasPhoto: boolean;
    positive: boolean;
    negative: boolean;
    noReply: boolean;
};

export default function ReviewFilterModal({
                                              filters,
                                              onChange,
                                              onClose,
                                          }: {
    filters: FilterState;
    onChange: (f: FilterState) => void;
    onClose: () => void;
}) {
    const toggle = (key: keyof FilterState) => onChange({ ...filters, [key]: !filters[key] });

    const items = [
        { key: 'hasPhoto' as const, label: '적성/비법' },
        { key: 'positive' as const, label: '사진리뷰' },
        { key: 'negative' as const, label: '긍정/부정' },
        { key: 'noReply' as const, label: '무응답 내용' },
    ];

    return (
        <div className="absolute inset-0 z-20 flex items-start justify-end bg-black/20" onClick={onClose}>
            <div
                className="mt-[100px] mr-4 bg-white rounded-xl shadow-xl py-2 min-w-[140px]"
                onClick={(e) => e.stopPropagation()}
            >
                {items.map((item) => (
                    <label key={item.key} className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50">
                        <input
                            type="checkbox"
                            checked={filters[item.key]}
                            onChange={() => toggle(item.key)}
                            className="w-4 h-4 accent-green-600"
                        />
                        <span className="text-sm text-gray-700">{item.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}