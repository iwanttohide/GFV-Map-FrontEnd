export default function ReviewDeleteModal({
                                              onConfirm,
                                              onCancel,
                                          }: {
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20">
            <div className="bg-white rounded-2xl shadow-xl px-6 py-5 mx-6 w-full max-w-xs">
                <p className="text-sm text-gray-700 text-center mb-5">답글을 삭제하시겠어요?</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        아니요
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
                    >
                        예
                    </button>
                </div>
            </div>
        </div>
    );
}