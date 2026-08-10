<?php

namespace Database\Seeders;

use App\Models\ActionPlan;
use App\Models\Kpi;
use App\Models\Kra;
use App\Models\OrganizationalUnit;
use App\Models\ReportingPeriod;
use App\Models\StrategicPlan;
use App\Models\SubKra;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class StrategicPlanSeeder extends Seeder
{
    /**
     * Organizational unit code => ['name' => ..., 'parent' => code|null].
     * ACADEMIC, NONACADEMIC, and SATELLITE are top-level categories
     * (organizational_units.parent_id is self-referencing). The child units
     * under ACADEMIC, NONACADEMIC, and SATELLITE are taken directly from the
     * "Assign Units" screen (colleges, non-academic offices, and satellite
     * campuses) so codes line up exactly with what's selectable in the app.
     *
     * ALUMNI, UVAAI, and QC are not shown on that screen but are still
     * referenced by name in the source strategic plan document (alumni
     * relations action plans, Quality Circles), so they're kept as
     * additional units — ALUMNI/UVAAI nested under NONACADEMIC, and QC
     * left as its own top-level unit since it cuts across both academic
     * and non-academic units rather than belonging to either.
     */
    private array $units = [
        // Top-level categories
        'ACADEMIC' => ['name' => 'Academic Units', 'parent' => null],
        'NONACADEMIC' => ['name' => 'Non-Academic Units', 'parent' => null],
        'SATELLITE' => ['name' => 'Satellite Campuses', 'parent' => null],
        'QC' => ['name' => 'Quality Circles', 'parent' => null],

        // Academic units (colleges) — from the Assign Units screen
        'CAHS' => ['name' => 'College of Allied Health Sciences', 'parent' => 'ACADEMIC'],
        'CAS' => ['name' => 'College of Arts and Sciences', 'parent' => 'ACADEMIC'],
        'CBA' => ['name' => 'College of Business Administration', 'parent' => 'ACADEMIC'],
        'CCJE' => ['name' => 'College of Criminal Justice Education', 'parent' => 'ACADEMIC'],
        'COED' => ['name' => 'College of Education', 'parent' => 'ACADEMIC'],
        'CETA' => ['name' => 'College of Engineering, Technology and Architecture', 'parent' => 'ACADEMIC'],
        'COME' => ['name' => 'College of Maritime Education', 'parent' => 'ACADEMIC'],
        'GLS' => ['name' => 'Graduate and Law School', 'parent' => 'ACADEMIC'],

        // Non-academic units — from the Assign Units screen
        'CPAD' => ['name' => 'Corporate Planning and Advancement Department', 'parent' => 'NONACADEMIC'],
        'QMSO' => ['name' => 'Quality Management System Office', 'parent' => 'NONACADEMIC'],
        'FMD' => ['name' => 'Facilities Management Department', 'parent' => 'NONACADEMIC'],
        'ICTD' => ['name' => 'Information and Communications Technology Department', 'parent' => 'NONACADEMIC'],
        'FAD' => ['name' => 'Finance and Accounting Department', 'parent' => 'NONACADEMIC'],
        'HRD' => ['name' => 'Human Resources Department', 'parent' => 'NONACADEMIC'],
        'CRI' => ['name' => 'Center for Research and Innovation', 'parent' => 'NONACADEMIC'],
        'DPO' => ['name' => 'Data Privacy Office', 'parent' => 'NONACADEMIC'],
        'COMEX' => ['name' => 'Community Extension Office', 'parent' => 'NONACADEMIC'],
        'IAD' => ['name' => 'International Affairs Department', 'parent' => 'NONACADEMIC'],
        'SASC' => ['name' => 'Student Affairs and Services Center', 'parent' => 'NONACADEMIC'],
        'ARC' => ['name' => 'Academic Resource Center (Library)', 'parent' => 'NONACADEMIC'],
        'ACD' => ['name' => 'Arts and Culture Development Office', 'parent' => 'NONACADEMIC'],
        'DPIA' => ['name' => 'Data Privacy and Information Assurance Office', 'parent' => 'NONACADEMIC'],
        'IQA' => ['name' => 'Internal Quality Auditors', 'parent' => 'NONACADEMIC'],
        'CPARC' => ['name' => 'CPARC', 'parent' => 'NONACADEMIC'],
        'SRMD' => ['name' => 'SRMD', 'parent' => 'NONACADEMIC'],
        'SSD' => ['name' => 'SSD', 'parent' => 'NONACADEMIC'],
        'CTESD' => ['name' => 'CTESD', 'parent' => 'NONACADEMIC'],
        'DQMR' => ['name' => 'Deputy Quality Management Representatives', 'parent' => 'NONACADEMIC'],
        'EDTECH' => ['name' => 'Educational Technology Office', 'parent' => 'NONACADEMIC'],
        'CIE' => ['name' => 'Center for Innovative Education', 'parent' => 'NONACADEMIC'],
        

        // Not shown on the Assign Units screen, but referenced in the
        // source strategic plan document.
        'ALUMNI' => ['name' => 'Alumni Affairs / Alumni Relations Office', 'parent' => 'NONACADEMIC'],
        'UVAAI' => ['name' => 'UV Alumni Association Inc.', 'parent' => 'NONACADEMIC'],

        // Satellite campuses — from the Assign Units screen
        'PARDO' => ['name' => 'Pardo Campus', 'parent' => 'SATELLITE'],
        'COMPOSTELA' => ['name' => 'Compostela Campus', 'parent' => 'SATELLITE'],
        'MINGLANILLA' => ['name' => 'Minglanilla Campus', 'parent' => 'SATELLITE'],
        'TOLEDO' => ['name' => 'Toledo Campus', 'parent' => 'SATELLITE'],
        'DALAGUETE' => ['name' => 'Dalaguete Campus', 'parent' => 'SATELLITE'],
    ];

    /** @var array<string, OrganizationalUnit> */
    private array $unitModels = [];

    public function run(): void
    {
        $user = User::first();

        if (!$user) {
            throw new \Exception(
                'No users found. Please create a user first.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Strategic Plan
        |--------------------------------------------------------------------------
        */

        $strategicPlan = StrategicPlan::updateOrCreate(
            [
                'name' => 'UV Strategic Plan AY 2023-2026',
            ],
            [
                'academic_year' => '2023–2026',
                'start_date' => '2023-06-01',
                'end_date' => '2026-05-31',
            ]
        );

        $nextStrategicPlan = StrategicPlan::updateOrCreate(
            [
                'name' => 'Strategic Plan 2026–2028',
            ],
            [
                'academic_year' => '2026–2028',
                'start_date' => '2026-01-01',
                'end_date' => '2028-12-31',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Organizational Units
        |--------------------------------------------------------------------------
        */

        $this->seedOrganizationalUnits();

        /*
        |--------------------------------------------------------------------------
        | KRAs / Sub-KRAs / KPIs / Action Plans
        |--------------------------------------------------------------------------
        |
        | Both strategic plans share the exact same KRA/Sub-KRA/KPI/Action Plan
        | content — only the academic year differs between them.
        |
        */

        foreach ([$strategicPlan, $nextStrategicPlan] as $plan) {
            $this->seedPlanData($plan, $user);
        }

        $this->createReportingPeriods($strategicPlan);
        $this->createReportingPeriods($nextStrategicPlan);
    }

    private function seedPlanData(StrategicPlan $strategicPlan, User $user): void
    {
        foreach ($this->planData() as $kraCode => $kraData) {
            $kra = Kra::updateOrCreate(
                [
                    'strategic_plan_id' => $strategicPlan->id,
                    'code' => $kraCode,
                ],
                [
                    'name' => $kraData['name'],
                    'description' => $kraData['description'],
                    'champion_id' => $user->id,
                ]
            );

            foreach ($kraData['sub_kras'] as $subKraCode => $subKraData) {
                $subKra = SubKra::updateOrCreate(
                    [
                        'kra_id' => $kra->id,
                        'code' => $subKraCode,
                    ],
                    [
                        'name' => $subKraData['name'],
                        'description' => $subKraData['description'] ?? null,
                        'owner_id' => $user->id,
                    ]
                );

                foreach ($subKraData['kpis'] as $kpiCode => $kpiData) {
                    $kpi = Kpi::updateOrCreate(
                        [
                            'sub_kra_id' => $subKra->id,
                            'code' => $kpiCode,
                        ],
                        [
                            'name' => $kpiData['name'],
                            'description' => $kpiData['description'] ?? null,
                        ]
                    );

                    foreach ($kpiData['action_plans'] as $actionPlanData) {
                        $actionPlan = ActionPlan::updateOrCreate(
                            [
                                'kpi_id' => $kpi->id,
                                'title' => $actionPlanData['title'],
                            ],
                            [
                                'description' => $actionPlanData['description'] ?? null,
                            ]
                        );

                        $unitIds = collect($actionPlanData['units'])
                            ->map(fn (string $code) => $this->unitModels[$code]->id)
                            ->all();

                        $actionPlan->responsibleUnits()->sync($unitIds);
                    }
                }
            }
        }
    }

    private function seedOrganizationalUnits(): void
    {
        // Pass 1: top-level categories (no parent) so children can
        // reference their database id via foreignId constraint.
        foreach ($this->units as $code => $unit) {
            if ($unit['parent'] !== null) {
                continue;
            }

            $this->unitModels[$code] = OrganizationalUnit::updateOrCreate(
                ['code' => $code],
                [
                    'name' => $unit['name'],
                    'parent_id' => null,
                ]
            );
        }

        // Pass 2: children, nested under their resolved parent.
        foreach ($this->units as $code => $unit) {
            if ($unit['parent'] === null) {
                continue;
            }

            $this->unitModels[$code] = OrganizationalUnit::updateOrCreate(
                ['code' => $code],
                [
                    'name' => $unit['name'],
                    'parent_id' => $this->unitModels[$unit['parent']]->id,
                ]
            );
        }
    }

    private function createReportingPeriods(
        StrategicPlan $strategicPlan
    ): void {
        $start = Carbon::parse($strategicPlan->start_date)
            ->startOfMonth();

        $end = Carbon::parse($strategicPlan->end_date)
            ->endOfMonth();

        while ($start->lessThanOrEqualTo($end)) {
            $periodStart = $start->copy()->startOfMonth();
            $periodEnd = $start->copy()->endOfMonth();

            $lateStart = $periodEnd->copy()
                ->addDay()
                ->startOfDay();

            $lateEnd = $lateStart->copy()
                ->addDays(5)
                ->endOfDay();

            ReportingPeriod::updateOrCreate(
                [
                    'strategic_plan_id' => $strategicPlan->id,
                    'period_start' => $periodStart,
                    'period_end' => $periodEnd,
                ],
                [
                    'late_submission_start' => $lateStart,
                    'late_submission_end' => $lateEnd,
                ]
            );

            $start->addMonth();
        }
    }

    /**
     * Full KRA / Sub-KRA / KPI / Action Plan structure transcribed from the
     * UV Strategic Plan AY 2023-2026. Targets for AY 2023-2024, 2024-2025,
     * and 2025-2026 are summarized inside each KPI's description since the
     * schema does not have dedicated per-year target columns.
     */
    private function planData(): array
    {
        return [

            /*
            |----------------------------------------------------------------
            | KRA 1
            |----------------------------------------------------------------
            */
            'KRA 1' => [
                'name' => 'Efficient and Effective Governance, Management and Leadership',
                'description' => 'Mission #4 / QO #4. Strengthen governance, leadership, HR development, communication, physical plant, ICT, finance, and accreditation across the University.',
                'sub_kras' => [

                    '1.1' => [
                        'name' => 'Governance',
                        'kpis' => [
                            '1.1.1' => [
                                'name' => 'Deployment and dissemination of VMO and Quality Management System in all units',
                                'action_plans' => [
                                    ['title' => 'Publish VMO on website, social media, and campus signage', 'units' => ['CPAD', 'QMSO', 'FMD']],
                                    ['title' => 'Publish PQF Levels 6-8 Descriptors and UV Institutional Learning Outcomes', 'units' => ['ACADEMIC']],
                                    ['title' => 'Integrate VMO into course syllabi and program activities', 'units' => ['ACADEMIC']],
                                    ['title' => 'Integrate VMO into class orientation and unit meetings', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '1.1.2' => [
                                'name' => 'Alignment and dissemination of the 17 UN Sustainable Development Goals in all university operations',
                                'action_plans' => [
                                    ['title' => 'Publish the 17 UN SDGs on website, social media, and campus signage', 'units' => ['CPAD', 'QMSO', 'FMD']],
                                    ['title' => 'Integrate SDGs into course syllabi and program activities', 'units' => ['ACADEMIC']],
                                    ['title' => 'Integrate SDGs into class orientation and unit meetings', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '1.1.3' => [
                                'name' => 'Senior Leaders and stakeholders participate in the Quality Assurance Review and Planning',
                                'action_plans' => [
                                    ['title' => 'Participate actively in scheduled QA Review and Planning', 'units' => ['ACADEMIC', 'NONACADEMIC']],
                                    ['title' => 'Regularly recognize stakeholder contributions', 'units' => ['ACADEMIC', 'NONACADEMIC']],
                                ],
                            ],
                            '1.1.4' => [
                                'name' => 'Compliance with National Privacy Commission requirements',
                                'action_plans' => [
                                    ['title' => 'Undertake data privacy audit procedures', 'units' => ['ACADEMIC', 'NONACADEMIC', 'DPO']],
                                    ['title' => 'Implement employee data privacy awareness program', 'units' => ['ACADEMIC', 'NONACADEMIC', 'DPO']],
                                    ['title' => 'Install data security software on university devices', 'units' => ['ICTD', 'FAD', 'ACADEMIC', 'NONACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '1.2' => [
                        'name' => 'Leadership',
                        'kpis' => [
                            '1.2.1' => [
                                'name' => 'Involvement of all senior leaders in University Committee Leadership / Membership',
                                'action_plans' => [
                                    ['title' => 'Ensure every senior leader chairs, vice-chairs, or is a member of at least one committee', 'units' => ['ACADEMIC', 'NONACADEMIC']],
                                    ['title' => 'Assign assistants/associates to sustain committee chairmanship continuity', 'units' => ['ACADEMIC', 'NONACADEMIC']],
                                ],
                            ],
                            '1.2.2' => [
                                'name' => 'Involvement in the 5S program',
                                'action_plans' => [
                                    ['title' => 'Conduct periodic 5S implementation audits across all campuses', 'units' => ['ACADEMIC', 'NONACADEMIC']],
                                    ['title' => 'Conduct capacity-building for 5S implementers', 'units' => ['ACADEMIC', 'NONACADEMIC']],
                                ],
                            ],
                            '1.2.3' => [
                                'name' => 'Involvement of all employees in the Quality Circles',
                                'action_plans' => [
                                    ['title' => 'Orient employees on Quality Circle policies and procedures', 'units' => ['ACADEMIC', 'NONACADEMIC']],
                                    ['title' => 'Deploy Quality Circle policies and procedures', 'units' => ['ACADEMIC', 'NONACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '1.3' => [
                        'name' => 'Human Resources Learning and Development',
                        'kpis' => [
                            '1.3.1' => [
                                'name' => 'University-wide learning and development program participation (non-teaching)',
                                'action_plans' => [
                                    ['title' => 'Conduct training needs assessment for non-teaching learning and development plan', 'units' => ['HRD']],
                                    ['title' => 'Complete at least one online training/webinar aligned to job function', 'units' => ['NONACADEMIC']],
                                ],
                            ],
                            '1.3.2' => [
                                'name' => 'Academic development participation in the unit faculty program',
                                'action_plans' => [
                                    ['title' => 'Conduct training needs assessment for faculty development plan', 'units' => ['ACADEMIC', 'HRD']],
                                    ['title' => 'Attend at least one online training/webinar aligned to field of specialization', 'units' => ['ACADEMIC']],
                                    ['title' => 'Implement Faculty Immersion Program during Special Period', 'units' => ['ACADEMIC', 'HRD']],
                                ],
                            ],
                        ],
                    ],

                    '1.4' => [
                        'name' => 'Communication',
                        'kpis' => [
                            '1.4.1' => [
                                'name' => 'Deployment of internal and external communication guidelines/protocols',
                                'action_plans' => [
                                    ['title' => 'Customize Office 365 for secure inter-office communication', 'units' => ['CPAD', 'ACADEMIC', 'NONACADEMIC']],
                                    ['title' => 'Establish a contingency communication plan for unexpected challenges', 'units' => ['CPAD', 'ACADEMIC', 'NONACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '1.5' => [
                        'name' => 'Physical Plant and Facilities',
                        'kpis' => [
                            '1.5.1' => [
                                'name' => 'Completion of the 3-year campus development plan',
                                'action_plans' => [
                                    ['title' => 'Prepare the campus development plan', 'units' => ['FMD']],
                                ],
                            ],
                            '1.5.2' => [
                                'name' => 'Implementation of the 3-year campus development plan',
                                'action_plans' => [
                                    ['title' => 'Monitor campus development plan implementation', 'units' => ['FMD']],
                                ],
                            ],
                        ],
                    ],

                    '1.6' => [
                        'name' => 'ICT',
                        'kpis' => [
                            '1.6.1' => [
                                'name' => 'Up-to-date, innovative, user-friendly and functional website and automation systems',
                                'action_plans' => [
                                    ['title' => 'Maintain a regularly updated website and automation system', 'units' => ['ICTD', 'CPAD', 'ACADEMIC']],
                                ],
                            ],
                            '1.6.2' => [
                                'name' => 'Improvement of ICT network infrastructure capability',
                                'action_plans' => [
                                    ['title' => 'Maintain a regularly upgraded IT infrastructure', 'units' => ['ICTD', 'FAD']],
                                    ['title' => 'Install security software on all university devices and satellite campuses', 'units' => ['ICTD', 'FAD', 'ACADEMIC', 'NONACADEMIC']],
                                    ['title' => 'Host secured systems over the cloud', 'units' => ['ICTD', 'FAD', 'ACADEMIC', 'NONACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '1.7' => [
                        'name' => 'Finance',
                        'kpis' => [
                            '1.7.1' => [
                                'name' => 'Increase accounts receivable collection efficiency to 98%',
                                'action_plans' => [
                                    ['title' => 'Deploy cashless payment scheme efficiently', 'units' => ['FAD', 'ACADEMIC']],
                                    ['title' => 'Closely monitor student accounts and send consistent reminders', 'units' => ['FAD']],
                                    ['title' => 'Strengthen partnerships with financing intermediaries offering student loans', 'units' => ['FAD']],
                                    ['title' => 'Integrate available payment channels into the Enrolment system', 'units' => ['FAD', 'ICTD']],
                                    ['title' => 'Create a University Communication System to update students on school fees', 'units' => ['FAD', 'ICTD', 'ACADEMIC']],
                                ],
                            ],
                            '1.7.2' => [
                                'name' => 'Zero complaints of late posting or unposted online payments daily',
                                'action_plans' => [
                                    ['title' => 'Monitor the daily status report of online collections', 'units' => ['FAD', 'ICTD']],
                                ],
                            ],
                            '1.7.3' => [
                                'name' => 'Utilization of resources based on approved budget for all units',
                                'action_plans' => [
                                    ['title' => 'Monitor actual expenditures versus approved budget', 'units' => ['FAD', 'ACADEMIC', 'NONACADEMIC']],
                                    ['title' => 'Integrate the purchasing system with the existing accounting system (Ledgea)', 'units' => ['FAD', 'ICTD']],
                                    ['title' => 'Submit weekly Purchase Monitoring Sheet to track request status', 'units' => ['FAD', 'ACADEMIC', 'NONACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '1.8' => [
                        'name' => 'Accreditation and Certification',
                        'kpis' => [
                            '1.8.1' => [
                                'name' => 'Compliance with Institutional Sustainability Assessment (ISA) Standards',
                                'action_plans' => [
                                    ['title' => 'Regularly review compliance and submit gap-closing action plans (ISA)', 'units' => ['QMSO', 'QC', 'ACADEMIC']],
                                ],
                            ],
                            '1.8.2' => [
                                'name' => 'Compliance with Autonomous Standards',
                                'action_plans' => [
                                    ['title' => 'Regularly review compliance and submit gap-closing action plans (Autonomous Standards)', 'units' => ['QMSO', 'QC', 'ACADEMIC']],
                                ],
                            ],
                            '1.8.3' => [
                                'name' => 'Compliance to PACUCOA Accreditation standards for all programs',
                                'action_plans' => [
                                    ['title' => 'Comply with PACUCOA standards and submit gap-closing action plans', 'units' => ['ACADEMIC', 'QC', 'QMSO']],
                                ],
                            ],
                            '1.8.4' => [
                                'name' => 'Compliance with CHED COD/COE standard',
                                'action_plans' => [
                                    ['title' => 'Regularly review compliance and submit gap-closing action plans (CHED COD/COE)', 'units' => ['ACADEMIC', 'QMSO', 'QC']],
                                ],
                            ],
                            '1.8.5' => [
                                'name' => 'Compliance to International accreditation standards',
                                'action_plans' => [
                                    ['title' => 'Review international accreditation requirements and submit gap-closing action plans', 'units' => ['ACADEMIC', 'QMSO', 'QC']],
                                ],
                            ],
                            '1.8.6' => [
                                'name' => 'Compliance with ISO 9001:2015 version',
                                'action_plans' => [
                                    ['title' => 'Monitor, review, and evaluate compliance with ISO 9001:2015 standards', 'units' => ['QMSO', 'ACADEMIC', 'NONACADEMIC', 'DQMR', 'IQA']],
                                ],
                            ],
                            '1.8.7' => [
                                'name' => 'Compliance to National Competency Certification',
                                'action_plans' => [
                                    ['title' => 'Identify, train, and capacitate faculty for TESDA qualified assessor assessments', 'units' => ['ACADEMIC']],
                                ],
                            ],
                        ],
                    ],
                ],
            ],

            /*
            |----------------------------------------------------------------
            | KRA 2
            |----------------------------------------------------------------
            */
            'KRA 2' => [
                'name' => 'Quality Research and Knowledge Management',
                'description' => 'Mission #1 / QO #3. Strengthen research production, dissemination and utilization, knowledge management, and library resources.',
                'sub_kras' => [

                    '2.1' => [
                        'name' => 'Research Production, Dissemination, Utilization',
                        'kpis' => [
                            '2.1.1' => [
                                'name' => 'Full-time faculty personnel engaged in research',
                                'action_plans' => [
                                    ['title' => 'Create a core team of research coordinators and personnel; conduct weekly research didactics', 'units' => ['CRI', 'ACADEMIC', 'NONACADEMIC']],
                                ],
                            ],
                            '2.1.2' => [
                                'name' => 'At least one research capacity and capability building per college per semester',
                                'action_plans' => [
                                    ['title' => 'Conduct discipline-specific research capability trainings and workshops per semester', 'units' => ['CRI', 'ACADEMIC']],
                                    ['title' => 'Produce research outputs using netnography design and big data analysis', 'units' => ['CRI', 'ACADEMIC']],
                                ],
                            ],
                            '2.1.3' => [
                                'name' => 'One research journal per college per academic year',
                                'action_plans' => [
                                    ['title' => 'Publish research outputs in the college research journal', 'units' => ['CRI', 'ACADEMIC']],
                                ],
                            ],
                            '2.1.4' => [
                                'name' => 'At least two research-based S&T applications for patent and/or four utility models',
                                'action_plans' => [
                                    ['title' => 'Forge cross-disciplinary collaborative research within the university', 'units' => ['CRI', 'ACADEMIC']],
                                ],
                            ],
                            '2.1.5' => [
                                'name' => 'At least one research output from Non-Teaching Personnel per unit',
                                'action_plans' => [
                                    ['title' => 'Conduct training and workshop on writing in a publishable format', 'units' => ['CRI', 'NONACADEMIC']],
                                ],
                            ],
                            '2.1.6' => [
                                'name' => 'Utilize tracer study results yearly per academic unit',
                                'action_plans' => [
                                    ['title' => 'Innovate curricula and improve learning outcomes/graduate competencies using tracer data', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '2.1.7' => [
                                'name' => 'Thesis/dissertation are IMRAD-ready',
                                'action_plans' => [
                                    ['title' => 'Modify thesis/dissertation format to become IMRAD-ready', 'units' => ['CRI', 'ACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '2.2' => [
                        'name' => 'Knowledge Management',
                        'kpis' => [
                            '2.2.1' => [
                                'name' => 'Deployment of knowledge management system, measurement and analysis',
                                'action_plans' => [
                                    ['title' => 'Prepare a Knowledge Management Manual with forms and SOPs', 'units' => ['ACADEMIC', 'HRD']],
                                    ['title' => 'Deploy Knowledge Management System activities per unit', 'units' => ['ACADEMIC', 'HRD']],
                                    ['title' => 'Include KM System in scheduled re-orientation and unit performance evaluation KPIs', 'units' => ['ACADEMIC', 'HRD']],
                                    ['title' => 'Promote knowledge management programs via e-media channels', 'units' => ['ACADEMIC', 'HRD']],
                                ],
                            ],
                        ],
                    ],

                    '2.3' => [
                        'name' => 'Library',
                        'kpis' => [
                            '2.3.1' => [
                                'name' => 'Print acquisitions within AY 2023-2026',
                                'action_plans' => [
                                    ['title' => 'Expand printed resource collections in collaboration with academic units', 'units' => ['ACADEMIC', 'ARC']],
                                ],
                            ],
                            '2.3.2' => [
                                'name' => 'Non-print acquisitions within AY 2023-2026',
                                'action_plans' => [
                                    ['title' => 'Improve electronic resource collections via inter-university consortium', 'units' => ['ACADEMIC', 'ARC']],
                                ],
                            ],
                            '2.3.3' => [
                                'name' => 'Information dissemination and accessibility of academic resources, print and non-print',
                                'action_plans' => [
                                    ['title' => 'Integrate the library management system into the university website', 'units' => ['ICTD', 'CPAD', 'ARC']],
                                    ['title' => 'Create digital library guides/infographics promoting library resources', 'units' => ['ICTD', 'CPAD', 'ARC']],
                                ],
                            ],
                            '2.3.4' => [
                                'name' => 'Full-time faculty accessed and utilized academic resources per month',
                                'action_plans' => [
                                    ['title' => 'Require full-time faculty to borrow at least two books/month and use e-learning resources', 'units' => ['ACADEMIC', 'ARC']],
                                ],
                            ],
                            '2.3.5' => [
                                'name' => 'Students accessed and utilized academic resources per month',
                                'action_plans' => [
                                    ['title' => 'Require students to borrow at least two books/month and use e-learning resources', 'units' => ['ACADEMIC', 'ARC']],
                                ],
                            ],
                            '2.3.5B' => [
                                'name' => 'Non-Teaching personnel borrow and read at least one book per month',
                                'action_plans' => [
                                    ['title' => 'Require non-teaching personnel to visit the ARC and use available resources', 'units' => ['NONACADEMIC', 'ARC']],
                                ],
                            ],
                            '2.3.6' => [
                                'name' => 'At least one top academic resources borrower award recipient per department per semester (faculty, non-teaching, students)',
                                'action_plans' => [
                                    ['title' => 'Set award criteria and prepare a resource utilization monitoring matrix', 'units' => ['ARC']],
                                ],
                            ],
                        ],
                    ],
                ],
            ],

            /*
            |----------------------------------------------------------------
            | KRA 3
            |----------------------------------------------------------------
            */
            'KRA 3' => [
                'name' => 'Innovative and Excellent Teaching and Learning',
                'description' => 'Mission #2 / QO #2. Strengthen faculty qualifications, instruction quality, innovative education, and graduate employability.',
                'sub_kras' => [

                    '3.1' => [
                        'name' => 'Faculty',
                        'kpis' => [
                            '3.1.1' => [
                                'name' => 'Full-time faculty meet required minimum academic qualifications',
                                'action_plans' => [
                                    ['title' => 'Strictly comply with CHED minimum academic qualifications in hiring', 'units' => ['HRD', 'ACADEMIC']],
                                    ['title' => 'Encourage academic personnel to avail of educational scholarships', 'units' => ['HRD', 'ACADEMIC']],
                                    ['title' => 'Craft and monitor a 5-year faculty development plan', 'units' => ['HRD', 'ACADEMIC']],
                                ],
                            ],
                            '3.1.2' => [
                                'name' => '90% of faculty meet a performance rating of at least 4.51',
                                'action_plans' => [
                                    ['title' => 'Regularly evaluate faculty using the updated performance evaluation tool', 'units' => ['HRD', 'ACADEMIC']],
                                    ['title' => 'Deploy automated Faculty Evaluation System integrated with the Student Portal', 'units' => ['HRD', 'ACADEMIC']],
                                ],
                            ],
                            '3.1.3' => [
                                'name' => 'Full-time faculty are members of relevant professional organizations',
                                'action_plans' => [
                                    ['title' => 'Require faculty to be a member/officer of a discipline-aligned professional organization', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '3.1.4' => [
                                'name' => 'At least one class section advisership every semester',
                                'action_plans' => [
                                    ['title' => 'Organize homeroom advisership in regular classes', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '3.1.5' => [
                                'name' => 'Deployment of Ranking, Tenureship and Promotion',
                                'action_plans' => [
                                    ['title' => 'Faculty respond to the ranking call and submit required evidence', 'units' => ['HRD', 'ACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '3.2' => [
                        'name' => 'Instruction',
                        'kpis' => [
                            '3.2.1' => [
                                'name' => 'Compliance with Curriculum Validation every semester',
                                'action_plans' => [
                                    ['title' => 'Prepare a curriculum validation policy and conduct validation each semester', 'units' => ['ACADEMIC']],
                                    ['title' => 'Develop an automated curriculum-compliance system embedded in UV ACCESS LMS', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '3.2.2' => [
                                'name' => 'Compliance with Curriculum Evaluation every four/five years',
                                'action_plans' => [
                                    ['title' => 'Conduct curriculum evaluation every four or five years', 'units' => ['ACADEMIC']],
                                    ['title' => 'Train prospective IAAC members on curriculum review and evaluation', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '3.2.3' => [
                                'name' => 'Compliance to selective retention guidelines',
                                'action_plans' => [
                                    ['title' => 'Prepare and comply with selective retention policies for all programs', 'units' => ['ACADEMIC']],
                                    ['title' => 'Publish each program\'s retention policy on the university website', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '3.2.4' => [
                                'name' => 'Above national passing percentage for all licensure/bar exams for 1st-time takers',
                                'action_plans' => [
                                    ['title' => 'Deploy board exam preparation policy', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '3.2.5' => [
                                'name' => 'Deployment of at least one external certification per program for faculty',
                                'action_plans' => [
                                    ['title' => 'Capacitate and train faculty to deliver external certification programs', 'units' => ['ACADEMIC']],
                                    ['title' => 'Establish partnerships with certification-providing agencies/institutions', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '3.2.6' => [
                                'name' => 'Integration of one NC (National Certificate) per program',
                                'action_plans' => [
                                    ['title' => 'Verify TESDA NC programs aligned to offered programs', 'units' => ['ACADEMIC', 'EDTECH']],
                                ],
                            ],
                            '3.2.7' => [
                                'name' => 'Organize student Quality Circles in all year levels',
                                'action_plans' => [
                                    ['title' => 'Identify and organize students into Quality Circles per college/year level', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '3.2.8' => [
                                'name' => '3rd-year students take sub-professional and professional Civil Service examinations',
                                'action_plans' => [
                                    ['title' => 'Orient students on Civil Service exam types and career qualification paths', 'units' => ['ACADEMIC']],
                                    ['title' => 'Facilitate Civil Service exam application (paper-based and computer-based)', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '3.2.9' => [
                                'name' => 'Faculty members acquire a C1 score in the International English Language Certification',
                                'action_plans' => [
                                    ['title' => 'Prepare an intervention program across all academic units', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '3.2.10' => [
                                'name' => 'Students acquire a B1 score in the International English Language Certification',
                                'action_plans' => [
                                    ['title' => 'Prepare an intervention program across all year levels', 'units' => ['ACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '3.3' => [
                        'name' => 'Innovative Education',
                        'kpis' => [
                            '3.3.1' => [
                                'name' => 'Implementation of the e-learning program/roadmap',
                                'action_plans' => [
                                    ['title' => 'Develop online course modules per program/college in Office 365 and Open LMS', 'units' => ['ACADEMIC', 'CIE']],
                                    ['title' => 'Develop a HyFlex learning strategy for all colleges', 'units' => ['ACADEMIC', 'CIE']],
                                    ['title' => 'Provide ICT professional development training (AI, KM, IoT, data science)', 'units' => ['ACADEMIC', 'CIE']],
                                    ['title' => 'Retool faculty on MS Teams integration within UV ACCESS LMS', 'units' => ['ACADEMIC', 'CIE']],
                                    ['title' => 'Establish strategic partnerships with technology companies (MOA/MOU)', 'units' => ['ACADEMIC', 'CIE']],
                                    ['title' => 'Integrate AI/robotics into all courses', 'units' => ['ACADEMIC', 'CIE']],
                                ],
                            ],
                        ],
                    ],

                    '3.4' => [
                        'name' => 'Employability',
                        'kpis' => [
                            '3.4.1' => [
                                'name' => 'Graduates engaged in gainful activities and professional development within 12 months after graduation',
                                'action_plans' => [
                                    ['title' => 'Monitor graduate employment, entrepreneurship, and further study engagement', 'units' => ['CPAD', 'ALUMNI', 'ACADEMIC']],
                                    ['title' => 'Provide incentives for graduate post-employment feedback', 'units' => ['CPAD', 'ALUMNI', 'ACADEMIC']],
                                    ['title' => 'Conduct regular job fairs with industry partners and document on-the-spot hires', 'units' => ['CPAD', 'ALUMNI', 'ACADEMIC']],
                                ],
                            ],
                            '3.4.2' => [
                                'name' => 'Establish at least 2 industry partners per semester/program',
                                'action_plans' => [
                                    ['title' => 'Identify and network with local/international companies for partnerships', 'units' => ['CPAD', 'IAD', 'ACADEMIC']],
                                    ['title' => 'Build mutually beneficial industry-college collaborative programs', 'units' => ['CPAD', 'IAD', 'ACADEMIC']],
                                ],
                            ],
                            '3.4.3' => [
                                'name' => 'Conduct the annual graduate tracer study',
                                'action_plans' => [
                                    ['title' => 'Initiate and conduct the annual graduate tracer study', 'units' => ['CPAD', 'ALUMNI', 'CRI', 'ACADEMIC']],
                                    ['title' => 'Convert tracer study data into a research paper with CRI', 'units' => ['CPAD', 'ALUMNI', 'CRI', 'ACADEMIC']],
                                    ['title' => 'Cascade tracer study results to colleges to improve programs', 'units' => ['CPAD', 'ALUMNI', 'CRI', 'ACADEMIC']],
                                ],
                            ],
                        ],
                    ],
                ],
            ],

            /*
            |----------------------------------------------------------------
            | KRA 4
            |----------------------------------------------------------------
            */
            'KRA 4' => [
                'name' => 'Sustained Social Responsibility, Community Involvement and Industry Linkages',
                'description' => 'Mission #3 / QO #1. Strengthen community extension, Philippine linkages, and international linkages.',
                'sub_kras' => [

                    '4.1' => [
                        'name' => 'Community Extension',
                        'kpis' => [
                            '4.1.1' => [
                                'name' => 'Sectoral representation in community extension programs',
                                'action_plans' => [
                                    ['title' => 'Involve all stakeholders in community extension programs', 'units' => ['COMEX', 'ACADEMIC', 'NONACADEMIC', 'ALUMNI']],
                                ],
                            ],
                            '4.1.2' => [
                                'name' => 'At least 2 full researches per academic unit and one from non-teaching personnel',
                                'action_plans' => [
                                    ['title' => 'Conduct at least one extension program derived from these researches', 'units' => ['COMEX', 'ACADEMIC', 'NONACADEMIC', 'CRI']],
                                ],
                            ],
                            '4.1.3' => [
                                'name' => 'Involvement and participation in environmental protection and preservation',
                                'action_plans' => [
                                    ['title' => 'Develop programs related to environmental protection and conservation', 'units' => ['COMEX', 'ACADEMIC', 'NONACADEMIC', 'CRI']],
                                ],
                            ],
                            '4.1.4' => [
                                'name' => 'Sustain and expand the Community Tutorial program to other sitios',
                                'action_plans' => [
                                    ['title' => 'Sustain the community tutorial program and expand to surrounding communities', 'units' => ['COMEX', 'ACADEMIC', 'NONACADEMIC']],
                                ],
                            ],
                            '4.1.5' => [
                                'name' => 'Implementation, involvement and participation from all colleges/departments',
                                'action_plans' => [
                                    ['title' => 'Involve COMEX, faculty, student reps, and college deans in planning to evaluation', 'units' => ['COMEX', 'ACADEMIC', 'NONACADEMIC']],
                                    ['title' => 'Post COMEX activities on UV Facebook page and website', 'units' => ['COMEX', 'CPAD']],
                                ],
                            ],
                        ],
                    ],

                    '4.2' => [
                        'name' => 'Philippine Linkages',
                        'kpis' => [
                            '4.2.1' => [
                                'name' => 'At least one active partnership with government, industry, or NGO per academic unit every semester',
                                'action_plans' => [
                                    ['title' => 'Document all networking with national and regional organizations', 'units' => ['COMEX', 'ACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '4.3' => [
                        'name' => 'International Linkages',
                        'kpis' => [
                            '4.3.1' => [
                                'name' => 'At least one active partnership with an international university per academic unit per semester',
                                'action_plans' => [
                                    ['title' => 'Document all networking with international organizations', 'units' => ['COMEX', 'ACADEMIC']],
                                ],
                            ],
                            '4.3.2' => [
                                'name' => 'At least 1 faculty exchange per academic unit for AY 2024-2025',
                                'action_plans' => [
                                    ['title' => 'Deploy activities stipulated in the faculty exchange MOA/MOU', 'units' => ['IAD', 'ACADEMIC']],
                                ],
                            ],
                            '4.3.3' => [
                                'name' => 'At least 2 student exchange programs per academic unit for AY 2024-2025',
                                'action_plans' => [
                                    ['title' => 'Deploy activities stipulated in the student exchange MOA/MOU', 'units' => ['IAD', 'ACADEMIC']],
                                ],
                            ],
                            '4.3.4' => [
                                'name' => 'At least 1 collaborative research activity/colloquium (production, publication, presentation, utilization)',
                                'action_plans' => [
                                    ['title' => 'Deploy activities stipulated in the collaborative research MOA/MOU', 'units' => ['IAD', 'ACADEMIC']],
                                ],
                            ],
                            '4.3.5' => [
                                'name' => 'At least 50 foreign student admissions in any academic program for AY 2024-2025',
                                'action_plans' => [
                                    ['title' => 'Produce at least one campaign per type (commercial, reputation, education/awareness, social action) per semester', 'units' => ['IAD', 'ACADEMIC']],
                                    ['title' => 'Develop at least one campaign per semester for the international market', 'units' => ['IAD', 'ACADEMIC']],
                                ],
                            ],
                        ],
                    ],
                ],
            ],

            /*
            |----------------------------------------------------------------
            | KRA 5
            |----------------------------------------------------------------
            */
            'KRA 5' => [
                'name' => 'Holistic Engagement with Students and Other Stakeholders',
                'description' => 'Mission #4 / QO #5. Strengthen PR and marketing, customer feedback, guidance and counseling, student development, gender and development, sports, arts and culture, and alumni relations.',
                'sub_kras' => [

                    '5.1' => [
                        'name' => 'PR and Marketing',
                        'kpis' => [
                            '5.1.1' => [
                                'name' => 'Freshmen enrollment targets by college size (CCJE 300; CAHS/COME 500; CAS/CBA/COED/CETA 600; JD 100; Grade 11 600)',
                                'action_plans' => [
                                    ['title' => 'Conduct focus group discussions to gather feedback and inputs', 'units' => ['CPAD', 'ACADEMIC', 'SASC', 'CRI']],
                                    ['title' => 'Increase field marketing campaigns to private academic institutions', 'units' => ['CPAD', 'ACADEMIC', 'SASC', 'CRI']],
                                    ['title' => 'Grow social media engagement and expand advertising to other platforms', 'units' => ['CPAD', 'ACADEMIC', 'SASC', 'CRI']],
                                    ['title' => 'Create an enhanced "enroll now, pay later" and sponsorship scheme', 'units' => ['CPAD', 'ACADEMIC', 'SASC', 'CRI']],
                                ],
                            ],
                            '5.1.2' => [
                                'name' => 'Achieve at least 80% student retention',
                                'action_plans' => [
                                    ['title' => 'Implement JRG\'s "Himunga-an System" and strengthen academic advising', 'units' => ['ACADEMIC']],
                                    ['title' => 'Sustain positive student experiences through exceptional customer service', 'units' => ['NONACADEMIC']],
                                ],
                            ],
                            '5.1.3' => [
                                'name' => 'Submission of College Marketing Plan',
                                'action_plans' => [
                                    ['title' => 'Conduct webinars and prepare the college marketing plan', 'units' => ['CPAD', 'ACADEMIC']],
                                ],
                            ],
                            '5.1.4' => [
                                'name' => 'Deployment of university campaign advertisement materials per semester',
                                'action_plans' => [
                                    ['title' => 'Produce at least one campaign per type (commercial, reputation, education/awareness, social action) per semester', 'units' => ['CPAD', 'ACADEMIC']],
                                    ['title' => 'Develop at least one campaign per semester for the international market', 'units' => ['CPAD', 'ACADEMIC']],
                                ],
                            ],
                            '5.1.5' => [
                                'name' => 'Five signed MOA per academic year with feeder schools',
                                'action_plans' => [
                                    ['title' => 'Seal at least five feeder school partnerships per academic year', 'units' => ['CPAD', 'ACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '5.2' => [
                        'name' => 'Customer Feedback',
                        'kpis' => [
                            '5.2.1' => [
                                'name' => 'Deployment of the Best Innovative Procedures Award (BIPA) and customer feedback mechanism in all units',
                                'action_plans' => [
                                    ['title' => 'Strengthen the feedback system via the online portal and other mechanisms', 'units' => ['CPAD', 'ACADEMIC', 'NONACADEMIC', 'SASC']],
                                ],
                            ],
                            '5.2.2' => [
                                'name' => 'Response to customer feedback within seven days',
                                'action_plans' => [
                                    ['title' => 'Provide timely feedback response via the online portal and other mechanisms', 'units' => ['SASC', 'ACADEMIC']],
                                    ['title' => 'Create a customer feedback committee with academic, support-office, and SSC representation', 'units' => ['SASC', 'ACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '5.3' => [
                        'name' => 'Guidance and Counseling',
                        'kpis' => [
                            '5.3.1' => [
                                'name' => 'Deployment of counseling program',
                                'action_plans' => [
                                    ['title' => 'Sustain the guidance and counseling program via flexible deployment', 'units' => ['SASC', 'ACADEMIC']],
                                    ['title' => 'Link with agencies for psychological assessment, debriefing, and medical assistance referrals', 'units' => ['SASC', 'ACADEMIC']],
                                    ['title' => 'Partner with industries/companies on CIP deployment', 'units' => ['SASC', 'ACADEMIC']],
                                    ['title' => 'Implement a peer counseling program', 'units' => ['SASC', 'ACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '5.4' => [
                        'name' => 'Student Development and Discipline',
                        'kpis' => [
                            '5.4.1' => [
                                'name' => 'Deployment of student-planned extracurricular activities',
                                'action_plans' => [
                                    ['title' => 'Participate in inter-school competitions showcasing student talents', 'units' => ['SASC', 'ACADEMIC']],
                                ],
                            ],
                            '5.4.3' => [
                                'name' => '2% decrease of student violations',
                                'action_plans' => [
                                    ['title' => 'Develop a student discipline program plan addressing new-normal challenges', 'units' => ['SASC', 'ACADEMIC']],
                                    ['title' => 'Sustain monitoring of student behavioral concerns and awareness drives', 'units' => ['SASC', 'ACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '5.5' => [
                        'name' => 'Gender and Development Program',
                        'kpis' => [
                            '5.5.1' => [
                                'name' => 'Deployment of the Gender and Development program',
                                'action_plans' => [
                                    ['title' => 'Create gender-inclusive teaching materials and classroom resources', 'units' => ['ACADEMIC', 'SASC']],
                                ],
                            ],
                        ],
                    ],

                    '5.6' => [
                        'name' => 'Sports Development',
                        'kpis' => [
                            '5.6.1' => [
                                'name' => 'Involvement in intramural and extramural activities',
                                'action_plans' => [
                                    ['title' => 'Organize sports leagues among system schools and broadcast online', 'units' => ['SASC', 'ACADEMIC', 'COMEX', 'ACD']],
                                    ['title' => 'Create virtual intramural activities with alumni and sponsor support', 'units' => ['SASC', 'ACADEMIC', 'ALUMNI', 'ACD']],
                                    ['title' => 'Invite alumni and company representatives as resource speakers on fitness/sports webinars', 'units' => ['SASC', 'ACD', 'ALUMNI']],
                                    ['title' => 'Reconnect and create linkages with former sponsors and alumni', 'units' => ['SASC', 'ACD', 'ALUMNI']],
                                ],
                            ],
                        ],
                    ],

                    '5.7' => [
                        'name' => 'Arts and Culture Development',
                        'kpis' => [
                            '5.7.1' => [
                                'name' => 'Organize at least one NTPIF/Faculty/Student arts and culture program per semester',
                                'action_plans' => [
                                    ['title' => 'Create a culture and arts development program plan', 'units' => ['ACADEMIC', 'NONACADEMIC', 'SASC']],
                                    ['title' => 'Create a virtual platform for cultural and artistic performances and exhibitions', 'units' => ['ACADEMIC', 'NONACADEMIC', 'ACD']],
                                    ['title' => 'Hold virtual and in-person cultural and artistic performances and exhibitions', 'units' => ['ACADEMIC', 'NONACADEMIC', 'ACD']],
                                    ['title' => 'Intensify promotion of arts and culture activities through social media', 'units' => ['ACADEMIC', 'NONACADEMIC', 'ACD']],
                                ],
                            ],
                        ],
                    ],

                    '5.8' => [
                        'name' => 'Alumni Relations',
                        'kpis' => [
                            '5.8.1' => [
                                'name' => 'Strengthen alumni chapter in all academic units',
                                'action_plans' => [
                                    ['title' => 'Create a chapter alumni development plan in all academic units', 'units' => ['ACADEMIC', 'ALUMNI']],
                                    ['title' => 'Create an International Alumni Chapter', 'units' => ['ACADEMIC', 'ALUMNI']],
                                ],
                            ],
                            '5.8.2' => [
                                'name' => 'Organize a university-wide Alumni Homecoming/Reunion every year',
                                'action_plans' => [
                                    ['title' => 'Conduct alumni homecoming/reunion activities', 'units' => ['ALUMNI', 'UVAAI']],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }
}