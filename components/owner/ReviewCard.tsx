type Review = {
    id: string;
    author: string;
    content: string;
    reply?: string;
};

export default function ReviewCard({
                                       review,
                                       onReply,
                                       onDelete,
                                   }: {
    review: Review;
    onReply: () => void;
    onDelete: () => void;
}) {
    return (
        <li className="py-4">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <UserIcon />
                    </div>
                    <span className="text-sm font-medium text-gray-800">{review.author}</span>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                    <button onClick={onReply} className="text-gray-400 hover:text-yellow-500 transition-colors">
                        <ReplyIcon />
                    </button>
                    {review.reply && (
                        <button onClick={onDelete} className="text-gray-400 hover:text-red-500 transition-colors">
                            <TrashIcon />
                        </button>
                    )}
                </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mt-2 whitespace-pre-line">{review.content}</p>
            {review.reply && (
                <div className="mt-2 pl-3 border-l-2 border-green-300">
                    <p className="text-xs text-gray-600">{review.reply}</p>
                </div>
            )}
        </li>
    );
}

function UserIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
    );
}

function ReplyIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
        </svg>
    );
}