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
            $actionPlan = $actionPlanUnit->actionPlan;

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