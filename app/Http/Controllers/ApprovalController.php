<?php

namespace App\Http\Controllers\KeyResultArea;

use App\Http\Controllers\Controller;
use App\Models\Kpi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApprovalController extends Controller
{
    // Recording/editing/deleting entries is handled by KpiProgressController
    // (store/update/destroy, already routed under the key_result_area group).
    // This controller only renders the "Progress" landing page.

    public function index(Request $request): Response
    {
        $user = $request->user();

        abort_unless($user->sub_kra_id, 403, 'Your account is not yet assigned to a Sub KRA. Contact an administrator.');

        $kpis = Kpi::where('sub_kra_id', $user->sub_kra_id)
            ->with(['progress' => fn ($q) => $q->orderBy('year')->orderBy('month')])
            ->orderBy('title')
            ->get(['id', 'sub_kra_id', 'title', 'status']);

        return Inertia::render('key-result-area/progress/index', [
            'kpis' => $kpis,
        ]);
    }
}
