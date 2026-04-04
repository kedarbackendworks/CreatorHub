import DashboardSidebar from '@/src/components/UserDashboard/DashboardSidebar';
import TermsAndConditionsContent from '@/src/components/UserDashboard/TermsAndConditionsContent';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg,#f6f4f1)] flex">
      <DashboardSidebar />
      <main className="flex-1 md:ml-[240px] pt-20 md:pt-0 min-h-screen overflow-y-auto">
        <TermsAndConditionsContent />
      </main>
    </div>
  );
}

