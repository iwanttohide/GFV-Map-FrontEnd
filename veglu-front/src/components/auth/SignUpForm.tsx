'use client';

import React, { useState, useEffect } from 'react';
import { AuthViewMode } from './AuthModal';

interface SignUpFormProps {
    setViewMode: (mode: AuthViewMode) => void;
}

export default function SignUpForm({ setViewMode }: SignUpFormProps) {
    const [formData, setFormData] = useState({
        email: '', phone: '', nickname: '', password: '', confirmPassword: '', bio: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // ──────────────────────────────────────────────────────────
    // 🌱 이메일 실시간 검증 레이어 전용 상태 머신
    // ──────────────────────────────────────────────────────────
    const [emailCode, setEmailCode] = useState('');          // 유저가 입력한 6자리 인증번호
    const [isCodeSent, setIsCodeSent] = useState(false);      // 인증번호가 발송되었는지 여부
    const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 검증 완결 여부
    const [timeLeft, setTimeLeft] = useState(300);            // 5분 타이머 (300초)

    // 인증 유효시간 제한용 카운트다운 타이머 이펙트
    useEffect(() => {
        if (!isCodeSent || timeLeft <= 0 || isEmailVerified) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isCodeSent, timeLeft, isEmailVerified]);

    // 초 단위를 05:00 포맷 문자열로 파싱해주는 도우미 함수
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ──────────────────────────────────────────────────────────
    // 📩 [추가] 1단계 - 이메일로 인증번호 발송 요청 API
    // ──────────────────────────────────────────────────────────
    const handleSendVerificationCode = async () => {
        setError('');
        if (!formData.email.trim()) {
            setError('인증번호를 받을 이메일 주소를 입력해 주세요.');
            return;
        }

        setIsLoading(true);
        try {
            // 주신 로컬 백엔드 서버 주소와 포트(5000)를 기준으로 통신합니다.
            const response = await fetch('http://192.168.7.120:5000/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });

            if (!response.ok) {
                setError('인증번호 발송에 실패했습니다. 이미 가입된 이메일인지 확인해 주세요.');
                setIsLoading(false);
                return;
            }

            setIsCodeSent(true);
            setTimeLeft(300); // 5분(300초) 초기화
            alert('입력하신 이메일로 인증번호가 발송되었습니다.');

        } catch (err) {
            setError('이메일 서버와 통신 중 문제가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // ──────────────────────────────────────────────────────────
    // 🔑 [추가] 2단계 - 유저가 친 인증번호 검증 완료 처리 API
    // ──────────────────────────────────────────────────────────
    const handleVerifyEmailCode = async () => {
        setError('');
        if (!emailCode.trim()) {
            setError('인증번호 6자리를 입력해 주세요.');
            return;
        }
        if (timeLeft <= 0) {
            setError('인증 시간이 만료되었습니다. 다시 발송해 주세요.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('http://192.168.7.120:5000/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    code: emailCode
                })
            });

            if (!response.ok) {
                setError('인증번호가 올바르지 않거나 만료되었습니다.');
                setIsLoading(false);
                return;
            }

            setIsEmailVerified(true);
            alert('이메일 인증이 완료되었습니다. 회원가입 절차를 계속해 주세요.');

        } catch (err) {
            setError('인증 코드 검증 중 서버 에러가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // ──────────────────────────────────────────────────────────
    // 🚀 3단계 - 최종 회원가입 완료 요청 API
    // ──────────────────────────────────────────────────────────
    const handleSignUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // [방어막] 이메일 인증이 가동되지 않았다면 가입 차단
        if (!isEmailVerified) {
            setError('이메일 인증을 완료하셔야 회원가입이 가능합니다.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://192.168.7.120:5000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    phone: formData.phone,
                    nickname: formData.nickname,
                    password: formData.password,
                    bio: formData.bio
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                setError(errData.message || '이미 가입된 이메일이거나 중복된 닉네임입니다.');
                setIsLoading(false);
                return;
            }

            alert('회원가입이 완료되었습니다! 로그인 화면으로 돌아갑니다.');
            setViewMode('LOGIN');

        } catch (err) {
            setError('서버와 통신하는 중 오류가 발생했습니다. 네트워크 상태를 확인해 주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-gray-900">회원가입</h1>
                <p className="text-xs text-gray-400 mt-1">안심 지도 서비스의 회원이 되어보세요.</p>
            </div>

            <form onSubmit={handleSignUpSubmit} className="space-y-3">

                {/* 1. 아이디/이메일 및 인증번호 발송 단추 */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">아이디(이메일)</label>
                    <div className="flex space-x-2">
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading || isEmailVerified} // 인증 완료 시 이메일 수정 금지 고정
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                            placeholder="example@email.com"
                        />
                        <button
                            type="button"
                            onClick={handleSendVerificationCode}
                            disabled={isLoading || isEmailVerified}
                            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-xl text-xs font-medium transition-colors whitespace-nowrap"
                        >
                            {isCodeSent ? '재발송' : '인증요청'}
                        </button>
                    </div>
                </div>

                {/* 2. [요청 사양 반영] 인증번호 입력란 및 실시간 빨간색 5분 타이머 */}
                {isCodeSent && (
                    <div className="animate-in fade-in duration-200">
                        <label className="block text-xs font-medium text-gray-600 mb-1">인증번호 입력</label>
                        <div className="flex space-x-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={emailCode}
                                    onChange={(e) => setEmailCode(e.target.value)}
                                    disabled={isLoading || isEmailVerified}
                                    maxLength={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm pr-14 focus:outline-none text-gray-800 font-mono"
                                    placeholder="6자리 숫자"
                                />
                                {/* 우측 내부에 정렬될 빨간 글씨 카운트다운 타이머 */}
                                {!isEmailVerified && (
                                    <span className="absolute right-3 top-2.5 text-xs text-red-500 font-bold font-mono">
                                        {formatTime(timeLeft)}
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={handleVerifyEmailCode}
                                disabled={isLoading || isEmailVerified}
                                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white disabled:bg-green-600 rounded-xl text-xs font-medium transition-colors whitespace-nowrap"
                            >
                                {isEmailVerified ? '✓ 완료' : '확인'}
                            </button>
                        </div>
                    </div>
                )}

                {/* 전화번호 */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">전화번호</label>
                    <input
                        type="text"
                        name="phone"
                        required
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none"
                        placeholder="010-0000-0000"
                    />
                </div>

                {/* 닉네임 */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">닉네임</label>
                    <input
                        type="text"
                        name="nickname"
                        required
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none"
                        placeholder="닉네임을 입력하세요"
                    />
                </div>

                {/* 비밀번호 */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        required
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none"
                        placeholder="비밀번호 입력"
                    />
                </div>

                {/* 비밀번호 확인 */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">비밀번호 확인</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        required
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none"
                        placeholder="비밀번호 재입력"
                    />
                </div>

                {/* 프로필 사진 컴포넌트 자리 */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">프로필 사진</label>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-400">사진</div>
                        <input
                            type="file"
                            accept="image/*"
                            disabled={isLoading}
                            className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-gray-100 hover:file:bg-gray-200 disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* 자기소개 */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">자기소개</label>
                    <textarea
                        name="bio"
                        rows={2}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm resize-none focus:outline-none"
                        placeholder="한 줄 자기소개를 입력하세요"
                    />
                </div>

                {/* 실시간 피드백 예외 처리 라인 */}
                {error && <p className="text-xs text-red-500 font-medium animate-in fade-in duration-150">⚠️ {error}</p>}

                {/* 최종 회원가입 완료 버튼 (이메일 검증 전까지 누르지 못하도록 보안 락 유지) */}
                <button
                    type="submit"
                    disabled={isLoading || !isEmailVerified}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-xl text-sm mt-2 transition-colors disabled:opacity-60 flex items-center justify-center"
                >
                    {isLoading ? '가입 승인 대기 중...' : '회원가입 완료'}
                </button>
            </form>

            <div className="text-center mt-4">
                <button
                    onClick={() => setViewMode('LOGIN')}
                    disabled={isLoading}
                    className="text-xs text-gray-400 hover:underline disabled:opacity-50"
                >
                    이미 계정이 있으신가요? 로그인으로 가기
                </button>
            </div>
        </div>
    );
}