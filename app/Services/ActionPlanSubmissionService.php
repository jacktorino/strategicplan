<?php

namespace App\Services;

use App\Models\ActionPlanSubmission;
use App\Models\ActionPlanUnit;
use App\Models\ReportingPeriod;
use App\Models\User;
use Carbon\Carbon;
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
            */

            $isAuthorized = $user->organizationalUnits()
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

            if (
                $actionPlan->kpi->subKra->kra->strategic_plan_id
                !== $reportingPeriod->strategic_plan_id
            ) {
                throw ValidationException::withMessages([
                    'reporting_period' =>
                        'The reporting period does not belong to the same strategic plan.',
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | Check that the action plan is currently active
            |--------------------------------------------------------------------------
            */

            $today = Carbon::today();

            if (
                $today->lt(Carbon::parse($actionPlan->start_date))
                ||
                $today->gt(Carbon::parse($actionPlan->end_date))
            ) {
                throw ValidationException::withMessages([
                    'action_plan' =>
                        'This action plan is not currently active.',
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | Determine submission window
            |--------------------------------------------------------------------------
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
                $now->between(
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
            */

            $alreadySubmitted = ActionPlanSubmission::where(
                'action_plan_unit_id',
                $actionPlanUnit->id
            )
                ->where(
                    'reporting_period_id',
                    $reportingPeriod->id
                )
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
        });
    }
}

