import { apiClient } from '@/libs/api/client'
import type {
    ReviewReportResponseDto,
    PageResponse,
    ReportStatus,
} from '@/types/reviewReport'

export async function getReports(page = 0, size = 10): Promise<PageResponse<ReviewReportResponseDto>> {
    return apiClient(`/review-report/admin?page=${page}&size=${size}`)
}

export async function getReportsByStatus(status: ReportStatus, page = 0, size = 10): Promise<PageResponse<ReviewReportResponseDto>> {
    return apiClient(`/review-report/admin/status/${status}?page=${page}&size=${size}`)
}

// 신고 해제 (리뷰 다시 노출)
export async function resolveReport(reportId: number, adminNote?: string): Promise<ReviewReportResponseDto> {
    return apiClient(`/review-report/admin/${reportId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ adminNote: adminNote ?? null }),
    })
}

// 관리자 리뷰 삭제
export async function deleteReview(reviewId: number): Promise<void> {
    return apiClient(`/review-report/admin/review/${reviewId}`, { method: 'DELETE' })
}