"use client";
import React from "react";
import { useParams } from "next/navigation";

const ClaimDetailPage = () => {
  const params = useParams();
  const claimId = params.id as string;

  return (
    <div style={{ padding: "2rem", color: "#ffffff" }}>
      <h1>Claim Details</h1>
      <p>Claim ID: {claimId}</p>
      <p>This page will show detailed claim information and approval/denial controls.</p>
    </div>
  );
};

export default ClaimDetailPage;
