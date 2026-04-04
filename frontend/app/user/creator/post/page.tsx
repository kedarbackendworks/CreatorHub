import DashboardSidebar from '@/src/components/UserDashboard/DashboardSidebar';
import PostHeader from '@/src/components/CreatorPost/PostHeader';
import PostHeroImage from '@/src/components/CreatorPost/PostHeroImage';
import PostMetadata from '@/src/components/CreatorPost/PostMetadata';
import PostDetails from '@/src/components/CreatorPost/PostDetails';
import RelatedCreators from '@/src/components/CreatorPost/RelatedCreators';

export default function CreatorPostDetailPage() {
  return (
    <div className="flex min-h-screen bg-[#f6f4f1] w-full">
      {/* Fixed Sidebar */}
      <DashboardSidebar />

      {/* Main Layout Area - Offset by Sidebar width */}
      <main className="flex-1 flex flex-col md:pl-[240px] pt-20 md:pt-0 relative w-full overflow-x-hidden min-h-screen">
        
        {/* Padded Container for all the Post elements */}
        <div className="px-4 sm:px-6 md:px-[42px] pt-20 md:pt-[42px] pb-[64px] flex flex-col items-start w-full md:w-[calc(100%-240px)] max-w-[1400px]">
          
          <PostHeader />
          <PostHeroImage />
          <PostMetadata />
          <PostDetails />
          <RelatedCreators />
          
        </div>
        
      </main>
    </div>
  );
}

