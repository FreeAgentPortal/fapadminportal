// app/notifications/DynamicTitleUpdater.tsx
"use client";

import { useEffect, useState } from "react";
import Head from "next/head";

export default function DynamicTitleUpdater({ baseTitle }: { baseTitle: string }) {
  const [notificationCount, setNotificationCount] = useState(0);
  const [title, setTitle] = useState(baseTitle); // Initial title set here
 

  // Update the title based on notification count
  useEffect(() => {
    // Construct the new title based on the notification count
    const newTitle = notificationCount > 0 ? `${baseTitle} (${notificationCount})` : baseTitle;
    setTitle(newTitle); // Update the title state
    document.title = newTitle; // Update the document title
  }, [notificationCount, baseTitle]); // Re-run when notificationCount changes

  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
}
