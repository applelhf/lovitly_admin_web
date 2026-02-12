"use client";

import React from "react";
import VotingList from "@/components/votings/VotingList";
import { useVotings } from "@/hooks/votings/useVotings";

export default function VotingsPage() {
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
