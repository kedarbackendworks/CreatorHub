"use client";

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AlertTriangle, ExternalLink, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/src/lib/api';

type ReportStatus = 'pending' | 'reviewed' | 'dismissed';
type ReportReason = 'spam' | 'hate_speech' | 'misinformation' | 'nudity' | 'harassment' | 'violence' | 'copyright' | 'other';

type ReportItem = {
	_id: string;
	reason: ReportReason;
	description?: string;
	status: ReportStatus;
	createdAt: string;
	reportedBy?: { name?: string; email?: string; avatar?: string };
	creatorId?: { name?: string; email?: string; avatar?: string };
	postId?: { _id?: string; title?: string; thumbnailUrl?: string; type?: string };
	totalReportsOnThisPost?: number;
};

type TabKey = 'all' | ReportStatus;

const statusStyles: Record<ReportStatus, string> = {
	pending: 'bg-amber-100 text-amber-800',
	reviewed: 'bg-emerald-100 text-emerald-800',
	dismissed: 'bg-slate-100 text-slate-700',
};

const reasonStyles: Record<ReportReason, string> = {
	spam: 'bg-slate-100 text-slate-700',
	hate_speech: 'bg-red-100 text-red-700',
	misinformation: 'bg-purple-100 text-purple-700',
	nudity: 'bg-pink-100 text-pink-700',
	harassment: 'bg-orange-100 text-orange-700',
	violence: 'bg-rose-100 text-rose-700',
	copyright: 'bg-blue-100 text-blue-700',
	other: 'bg-gray-100 text-gray-700',
};

const formatDate = (value?: string) => {
	if (!value) return '—';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '—';
	return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

const titleCase = (value: string) =>
	value
		.split('_')
		.map((v) => v.charAt(0).toUpperCase() + v.slice(1))
		.join(' ');

export default function AdminReportsPage() {
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<TabKey>('all');
	const [reportsByStatus, setReportsByStatus] = useState<Record<ReportStatus, ReportItem[]>>({
		pending: [],
		reviewed: [],
		dismissed: [],
	});
	const [counts, setCounts] = useState<Record<ReportStatus, number>>({ pending: 0, reviewed: 0, dismissed: 0 });

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
	const [loadingReportDetail, setLoadingReportDetail] = useState(false);

	const [selectedAction, setSelectedAction] = useState<'dismiss' | 'lock_post' | 'ban_creator'>('dismiss');
	const [banReason, setBanReason] = useState('');
	const [banType, setBanType] = useState<'temporary' | 'permanent'>('temporary');
	const [banDuration, setBanDuration] = useState<number>(7);
	const [submittingAction, setSubmittingAction] = useState(false);

	const fetchReports = async () => {
		setLoading(true);
		try {
			const [pendingRes, reviewedRes, dismissedRes] = await Promise.all([
				api.get('/admin/reports', { params: { status: 'pending', page: 1, limit: 100 } }),
				api.get('/admin/reports', { params: { status: 'reviewed', page: 1, limit: 100 } }),
				api.get('/admin/reports', { params: { status: 'dismissed', page: 1, limit: 100 } }),
			]);

			setReportsByStatus({
				pending: pendingRes.data?.data || [],
				reviewed: reviewedRes.data?.data || [],
				dismissed: dismissedRes.data?.data || [],
			});

			setCounts({
				pending: Number(pendingRes.data?.pagination?.total || 0),
				reviewed: Number(reviewedRes.data?.pagination?.total || 0),
				dismissed: Number(dismissedRes.data?.pagination?.total || 0),
			});
		} catch (error: any) {
			toast.error(error?.response?.data?.message || 'Failed to load reports');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchReports();
	}, []);

	const allReports = useMemo(
		() => [...reportsByStatus.pending, ...reportsByStatus.reviewed, ...reportsByStatus.dismissed]
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
		[reportsByStatus]
	);

	const visibleReports = useMemo(() => {
		if (activeTab === 'all') return allReports;
		return reportsByStatus[activeTab] || [];
	}, [activeTab, allReports, reportsByStatus]);

	const openReviewDrawer = async (reportId: string) => {
		setDrawerOpen(true);
		setLoadingReportDetail(true);
		setSelectedAction('dismiss');
		setBanReason('');
		setBanType('temporary');
		setBanDuration(7);

		try {
			const res = await api.get(`/admin/reports/${reportId}`);
			setSelectedReport(res.data?.report || null);
		} catch (error: any) {
			toast.error(error?.response?.data?.message || 'Failed to load report details');
		} finally {
			setLoadingReportDetail(false);
		}
	};

	const submitAction = async () => {
		if (!selectedReport) return;

		if (selectedAction === 'ban_creator' && !banReason.trim()) {
			toast.error('Ban reason is required');
			return;
		}

		if (selectedAction === 'ban_creator' && banType === 'temporary' && (!banDuration || banDuration <= 0)) {
			toast.error('Ban duration must be greater than 0');
			return;
		}

		const ok = window.confirm('Are you sure you want to apply this moderation action?');
		if (!ok) return;

		setSubmittingAction(true);
		try {
			const payload: any = { action: selectedAction };
			if (selectedAction === 'ban_creator') {
				payload.banReason = banReason.trim();
				payload.banType = banType;
				if (banType === 'temporary') payload.banDuration = banDuration;
			}

			await api.patch(`/admin/reports/${selectedReport._id}/action`, payload);
			toast.success('Action completed');
			setDrawerOpen(false);
			setSelectedReport(null);
			await fetchReports();
		} catch (error: any) {
			toast.error(error?.response?.data?.message || 'Failed to apply action');
		} finally {
			setSubmittingAction(false);
		}
	};

	const tabs = [
		{ key: 'all' as const, label: `All (${counts.pending + counts.reviewed + counts.dismissed})` },
		{ key: 'pending' as const, label: `Pending (${counts.pending})` },
		{ key: 'reviewed' as const, label: 'Reviewed' },
		{ key: 'dismissed' as const, label: 'Dismissed' },
	];

	return (
		<div className="p-4 md:p-6 lg:p-8">
			<h1 className="text-2xl font-bold text-slate-900">Content Reports</h1>

			<div className="mt-4 flex flex-wrap gap-2">
				{tabs.map((tab) => (
					<button
						key={tab.key}
						onClick={() => setActiveTab(tab.key)}
						className={`px-3 py-2 rounded-lg text-sm font-semibold border ${activeTab === tab.key ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
					>
						{tab.label}
					</button>
				))}
			</div>

			<div className="mt-6 rounded-xl border border-slate-200 bg-white overflow-x-auto">
				<table className="min-w-full text-sm">
					<thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
						<tr>
							<th className="text-left px-4 py-3">Reporter</th>
							<th className="text-left px-4 py-3">Reported Creator</th>
							<th className="text-left px-4 py-3">Post Preview</th>
							<th className="text-left px-4 py-3">Reason</th>
							<th className="text-left px-4 py-3">Date</th>
							<th className="text-left px-4 py-3">Status</th>
							<th className="text-left px-4 py-3">Action</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan={7} className="px-4 py-8 text-center text-slate-500">Loading reports...</td>
							</tr>
						) : visibleReports.length === 0 ? (
							<tr>
								<td colSpan={7} className="px-4 py-8 text-center text-slate-500">No reports found.</td>
							</tr>
						) : (
							visibleReports.map((report) => (
								<tr key={report._id} className="border-t border-slate-100">
									<td className="px-4 py-3">
										<p className="font-medium text-slate-900">{report.reportedBy?.name || 'Unknown'}</p>
										<p className="text-xs text-slate-500">{report.reportedBy?.email || '—'}</p>
									</td>
									<td className="px-4 py-3">
										<p className="font-medium text-slate-900">{report.creatorId?.name || 'Unknown'}</p>
										<p className="text-xs text-slate-500">{report.creatorId?.email || '—'}</p>
									</td>
									<td className="px-4 py-3">
										<div className="flex items-center gap-2 min-w-[220px]">
											<div className="relative w-10 h-10 rounded-md bg-slate-100 overflow-hidden shrink-0">
												{report.postId?.thumbnailUrl ? (
													<Image src={report.postId.thumbnailUrl} alt="Post thumbnail" fill className="object-cover" unoptimized />
												) : null}
											</div>
											<span className="truncate text-slate-700">{report.postId?.title || 'Untitled post'}</span>
										</div>
									</td>
									<td className="px-4 py-3">
										<span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${reasonStyles[report.reason]}`}>
											{titleCase(report.reason)}
										</span>
									</td>
									<td className="px-4 py-3 text-slate-600">{formatDate(report.createdAt)}</td>
									<td className="px-4 py-3">
										<span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[report.status]}`}>
											{titleCase(report.status)}
										</span>
									</td>
									<td className="px-4 py-3">
										<button
											onClick={() => openReviewDrawer(report._id)}
											className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
										>
											Review
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{drawerOpen && (
				<>
					<div className="fixed inset-0 bg-black/35 z-40" onClick={() => setDrawerOpen(false)} />
					<aside className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-white border-l border-slate-200 z-50 p-5 overflow-y-auto">
						<div className="flex items-center justify-between mb-5">
							<h2 className="text-lg font-bold text-slate-900">Review Report #{selectedReport?._id?.slice(-6) || ''}</h2>
							<button onClick={() => setDrawerOpen(false)} className="p-1 rounded-md hover:bg-slate-100"><X className="w-4 h-4" /></button>
						</div>

						{loadingReportDetail || !selectedReport ? (
							<p className="text-sm text-slate-500">Loading details...</p>
						) : (
							<div className="space-y-5 pb-6">
								<section className="rounded-xl border border-slate-200 p-4">
									<h3 className="font-semibold text-slate-900 mb-3">Report Details</h3>
									<p className="text-sm text-slate-700"><span className="font-medium">Reporter:</span> {selectedReport.reportedBy?.name || 'Unknown'} ({selectedReport.reportedBy?.email || '—'})</p>
									<p className="text-sm text-slate-700 mt-1"><span className="font-medium">Date reported:</span> {formatDate(selectedReport.createdAt)}</p>
									<p className="text-sm text-slate-700 mt-1"><span className="font-medium">Reason:</span> {titleCase(selectedReport.reason)}</p>
									<p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap"><span className="font-medium">Description:</span> {selectedReport.description || '—'}</p>
								</section>

								<section className="rounded-xl border border-slate-200 p-4">
									<h3 className="font-semibold text-slate-900 mb-3">Reported Content</h3>
									<p className="text-sm text-slate-700"><span className="font-medium">Creator:</span> {selectedReport.creatorId?.name || 'Unknown'}</p>
									<p className="text-sm text-slate-700">{selectedReport.creatorId?.email || '—'}</p>
									<div className="flex items-center gap-3 mt-3">
										<div className="relative w-12 h-12 rounded-md bg-slate-100 overflow-hidden shrink-0">
											{selectedReport.postId?.thumbnailUrl ? (
												<Image src={selectedReport.postId.thumbnailUrl} alt="Post thumbnail" fill className="object-cover" unoptimized />
											) : null}
										</div>
										<p className="text-sm text-slate-800 truncate">{selectedReport.postId?.title || 'Untitled post'}</p>
									</div>
									<a
										className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-3"
										href={`${typeof window !== 'undefined' ? window.location.origin : ''}/creator/post/${selectedReport.postId?._id || ''}`}
										target="_blank"
										rel="noreferrer"
									>
										View Post <ExternalLink className="w-3.5 h-3.5" />
									</a>
									<p className="text-xs text-slate-500 mt-2">This post has {selectedReport.totalReportsOnThisPost || 0} reports</p>
								</section>

								<section className="rounded-xl border border-slate-200 p-4">
									<h3 className="font-semibold text-slate-900 mb-3">Take Action</h3>

									<div className="space-y-2">
										<button
											onClick={() => setSelectedAction('dismiss')}
											className={`w-full text-left border rounded-lg p-3 ${selectedAction === 'dismiss' ? 'border-slate-900 bg-slate-50' : 'border-slate-200'}`}
										>
											<p className="font-medium text-slate-900">Dismiss Report</p>
											<p className="text-xs text-slate-500 mt-1">No action taken. Mark as reviewed.</p>
										</button>

										<button
											onClick={() => setSelectedAction('lock_post')}
											className={`w-full text-left border rounded-lg p-3 ${selectedAction === 'lock_post' ? 'border-slate-900 bg-slate-50' : 'border-slate-200'}`}
										>
											<p className="font-medium text-slate-900">Lock Post</p>
											<p className="text-xs text-slate-500 mt-1">The post will be hidden from all users.</p>
										</button>

										<button
											onClick={() => setSelectedAction('ban_creator')}
											className={`w-full text-left border rounded-lg p-3 ${selectedAction === 'ban_creator' ? 'border-slate-900 bg-slate-50' : 'border-slate-200'}`}
										>
											<p className="font-medium text-slate-900">Ban Creator</p>
											<p className="text-xs text-slate-500 mt-1">Suspend creator account access.</p>
										</button>
									</div>

									{selectedAction === 'ban_creator' && (
										<div className="mt-4 space-y-3">
											<input
												value={banReason}
												onChange={(e) => setBanReason(e.target.value)}
												placeholder="Ban Reason"
												className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
											/>

											<div className="grid grid-cols-2 gap-2">
												<button
													onClick={() => setBanType('temporary')}
													className={`rounded-lg border px-3 py-2 text-sm ${banType === 'temporary' ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200'}`}
												>
													Temporary
												</button>
												<button
													onClick={() => setBanType('permanent')}
													className={`rounded-lg border px-3 py-2 text-sm ${banType === 'permanent' ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200'}`}
												>
													Permanent
												</button>
											</div>

											{banType === 'temporary' && (
												<>
													<div className="flex items-center gap-2">
														<input
															type="number"
															min={1}
															value={banDuration}
															onChange={(e) => setBanDuration(Number(e.target.value || 0))}
															className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm"
														/>
														<span className="text-sm text-slate-600">days</span>
													</div>
													<div className="flex flex-wrap gap-2">
														{[7, 14, 30].map((days) => (
															<button
																key={days}
																onClick={() => setBanDuration(days)}
																className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs hover:bg-slate-100"
															>
																{days} days
															</button>
														))}
														<span className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs text-slate-500">Custom</span>
													</div>
												</>
											)}
										</div>
									)}

									<button
										onClick={submitAction}
										disabled={submittingAction}
										className="w-full mt-4 rounded-lg bg-red-600 hover:bg-red-500 text-white py-2.5 font-semibold disabled:opacity-60"
									>
										{submittingAction ? 'Applying...' : 'Take Action'}
									</button>
								</section>

								<div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs p-3 flex items-start gap-2">
									<AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
									Confirm decisions carefully. Some actions affect creator account access.
								</div>
							</div>
						)}
					</aside>
				</>
			)}
		</div>
	);
}
