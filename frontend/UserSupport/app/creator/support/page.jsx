"use client";

import MyTicketsList from '../../../components/MyTicketsList';

export default function CreatorSupportPageModule() {
  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-6xl w-full mx-auto">
      <MyTicketsList role="creator" />
    </div>
  );
}
