"use client";

import React, { Suspense } from "react";
import VotingList from "@/components/votings/VotingList";
import { useVotings } from "@/hooks/votings/useVotings";

function VotingsContent() {
    const { votings, loading, pagination, fetchVotings, deleteVoting, updateUrlParams } =
        useVotings();

    return (
        <div>
            <VotingList
                votings={votings}
                loading={loading}
                pagination={pagination}
                onFetch={updateUrlParams}
                onDelete={deleteVoting}
            />
        </div>
    );
}

export default function VotingsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VotingsContent />
        </Suspense>
    );
}
