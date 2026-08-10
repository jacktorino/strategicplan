<?php

namespace App\Policies;

use App\Models\ActionPlanSubmission;
use App\Models\User;

class ActionPlanSubmissionPolicy
{
    /**
     * Can view the submission itself (not the file contents).
     */
    public function view(User $user, ActionPlanSubmission $submission): bool
    {
        if ($user->isExecutive()) {
            return true;
        }

        return $this->belongsToSubmittingUnit($user, $submission)
            || $submission->submitted_by === $user->id
            || $this->isInReviewChain($user, $submission);
    }

    /**
     * Edit the submission's comment. Matches the controller's existing
     * rule: any member of the submitting organizational unit may edit,
     * not just the original submitter. No status restriction currently —
     * that means a submission can be edited even after being reviewed.
     * If that's not intended, add a status check here (e.g. limit to
     * 'pending'/'submitted') and update the route/controller to match.
     */
    public function update(User $user, ActionPlanSubmission $submission): bool
    {
        if ($user->isExecutive()) {
            return true;
        }

        return $this->belongsToSubmittingUnit($user, $submission);
    }

    /**
     * Upload or delete attachments. Same rule as update() — any member of
     * the submitting unit, no status restriction (matches original
     * controller behavior, which didn't check status either).
     */
    public function manageAttachments(User $user, ActionPlanSubmission $submission): bool
    {
        if ($user->isExecutive()) {
            return true;
        }

        return $this->belongsToSubmittingUnit($user, $submission);
    }

    /**
     * Download an attachment. Original controller only checked submitting-
     * unit membership; the isExecutive() bypass is new — added so
     * president/admin don't need to be manually added to every unit to
     * audit submissions. Remove it if that's not desired.
     */
    public function download(User $user, ActionPlanSubmission $submission): bool
    {
        if ($user->isExecutive()) {
            return true;
        }

        return $this->belongsToSubmittingUnit($user, $submission);
    }

    /**
     * True if the user is a member of the organizational unit that made
     * this submission.
     */
    protected function belongsToSubmittingUnit(User $user, ActionPlanSubmission $submission): bool
    {
        $unitId = $submission->actionPlanUnit?->organizational_unit_id;

        if (! $unitId) {
            return false;
        }

        return $user->organizationalUnits()->whereKey($unitId)->exists();
    }

    /**
     * True if the user is the Sub-KRA owner or KRA champion in this
     * submission's reporting chain (i.e. a reviewer for it).
     */
    protected function isInReviewChain(User $user, ActionPlanSubmission $submission): bool
    {
        $kpi = $submission->actionPlan?->kpi;

        if (! $kpi) {
            return false;
        }

        $subKra = $kpi->subKra;

        return $subKra?->owner_id === $user->id
            || $subKra?->kra?->champion_id === $user->id;
    }
}
