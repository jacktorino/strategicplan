<?php

use App\Models\Kpi;
use App\Models\Kra;
use App\Models\SubKra;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::transaction(function () {
            // KRAs currently exist once per strategic plan (academic year),
            // all sharing the same `number`/`title`. Collapse each group of
            // duplicates down to a single canonical row.
            $krasByNumber = Kra::orderBy('id')->get()->groupBy('number');

            foreach ($krasByNumber as $number => $duplicates) {
                $canonical = $duplicates->first();
                $duplicateIds = $duplicates->slice(1)->pluck('id');

                if ($duplicateIds->isEmpty()) {
                    continue;
                }

                $canonicalSubKras = SubKra::where('kra_id', $canonical->id)
                    ->get()
                    ->keyBy('code');

                foreach (SubKra::whereIn('kra_id', $duplicateIds)->get() as $dupSubKra) {
                    $canonicalSubKra = $canonicalSubKras->get($dupSubKra->code);

                    if (! $canonicalSubKra) {
                        // Not actually a duplicate (no matching code under the
                        // canonical KRA) — reattach it rather than deleting,
                        // so we never silently lose data that differs.
                        $dupSubKra->update(['kra_id' => $canonical->id]);
                        $canonicalSubKras->put($dupSubKra->code, $dupSubKra);

                        continue;
                    }

                    // Remap any KPIs pointing at the duplicate sub-KRA onto
                    // the canonical one before removing the duplicate.
                    Kpi::where('sub_kra_id', $dupSubKra->id)
                        ->update(['sub_kra_id' => $canonicalSubKra->id]);

                    $dupSubKra->delete();
                }

                // Any leftover sub_kras under the duplicate KRAs at this point
                // have already been remapped or reattached above, so this is
                // now safe.
                Kra::whereIn('id', $duplicateIds)->delete();
            }
        });

        Schema::table('kras', function (Blueprint $table) {
            $table->dropConstrainedForeignId('strategic_plan_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Not reversible: the duplicate KRA/Sub-KRA rows removed in up()
        // cannot be reconstructed. This only restores the column so the
        // schema can be re-populated manually if ever needed.
        Schema::table('kras', function (Blueprint $table) {
            $table->foreignId('strategic_plan_id')
                ->nullable()
                ->after('id')
                ->constrained()
                ->cascadeOnDelete();
        });
    }
};