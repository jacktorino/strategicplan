<?php

namespace App\Services;

use App\Models\ActionPlanSubmission;
use App\Models\ActionPlanUnit;
use App\Models\ReportingPeriod;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ActionPlanSubmissionService
{
    public function submit(
        ActionPlanUnit $actionPlanUnit,
        ReportingPeriod $reportingPeriod,
        User $user,
        ?string $comment = null,
    ): ActionPlanSubmission {
        return DB::transaction(function () use (
            $actionPlanUnit,
            $reportingPeriod,
            $user,
            $comment
        ) {
            /*
            |--------------------------------------------------------------------------
            | Load related models
            |--------------------------------------------------------------------------
            */

            $actionPlan = $actionPlanUnit->actionPlan;

            /*
            |--------------------------------------------------------------------------
            | Verify that the user belongs to the responsible organizational unit
            |--------------------------------------------------------------------------
            |
            | This can't go through a Policy on ActionPlanSubmission because the
            | submission doesn't exist yet at this point — it's an authorization
            | check on the *unit*, not the record being created.
            */

            $isAuthorized = $user
                ->organizationalUnits()
                ->whereKey($actionPlanUnit->organizational_unit_id)
                ->exists();

            if (! $isAuthorized) {
                throw ValidationException::withMessages([
                    'organizational_unit' =>
                        'You are not authorized to submit for this responsible unit.',
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | Verify that the reporting period belongs to the same strategic plan
            |--------------------------------------------------------------------------
            */

            $strategicPlanId =
                $actionPlan->kpi
                    ->subKra
                    ->kra
                    ->strategic_plan_id;

            if (
                $strategicPlanId !==
                $reportingPeriod->strategic_plan_id
            ) {
                throw ValidationException::withMessages([
                    'reporting_period' =>
                        'The reporting period does not belong to the same strategic plan.',
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | Determine submission window
            |--------------------------------------------------------------------------
            |
            | The reporting period now controls submission availability.
            |
            | Regular period:
            |     period_start → period_end
            |
            | Late period (optional — a period may not define a late window):
            |     late_submission_start → late_submission_end
            |
            */

            $now = now();

            $timeliness = null;

            if (
                $now->between(
                    $reportingPeriod->period_start,
                    $reportingPeriod->period_end
                )
            ) {
                $timeliness = 'on_time';
            } elseif (
                $reportingPeriod->late_submission_start
                && $reportingPeriod->late_submission_end
                && $now->between(
                    $reportingPeriod->late_submission_start,
                    $reportingPeriod->late_submission_end
                )
            ) {
                $timeliness = 'late';
            } else {
                throw ValidationException::withMessages([
                    'reporting_period' =>
                        'This reporting period is currently closed for submission.',
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | Check duplicate submission
            |--------------------------------------------------------------------------
            |
            | This exists() check plus the create() below aren't atomic on their
            | own — two near-simultaneous requests could both pass the check
            | before either inserts. The unique constraint on
            | (action_plan_id, action_plan_unit_id, reporting_period_id) is the
            | real guard; this check just gives a friendlier message in the
            | common (non-race) case. The try/catch below covers the race.
            */

            $alreadySubmitted = ActionPlanSubmission::query()
                ->where('action_plan_id', $actionPlan->id)
                ->where('action_plan_unit_id', $actionPlanUnit->id)
                ->where('reporting_period_id', $reportingPeriod->id)
                ->exists();

            if ($alreadySubmitted) {
                throw ValidationException::withMessages([
                    'submission' =>
                        'This responsible unit has already submitted for this reporting period.',
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | Create submission
            |--------------------------------------------------------------------------
            */

            try {
                return ActionPlanSubmission::create([
                    'action_plan_id' => $actionPlan->id,
                    'action_plan_unit_id' => $actionPlanUnit->id,
                    'reporting_period_id' => $reportingPeriod->id,
                    'submitted_by' => $user->id,
                    'comment' => $comment,
                    'submitted_at' => now(),
                    'status' => 'submitted',
                    'timeliness' => $timeliness,
                ]);
            } catch (QueryException $e) {
                // 23000 = integrity constraint violation (unique constraint hit)
                if ($e->getCode() === '23000') {
                    throw ValidationException::withMessages([
                        'submission' =>
                            'This responsible unit has already submitted for this reporting period.',
                    ]);
                }

                throw $e;
            }
        });
    }
}
