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
     * UV Strategic Plan AY 2023-2026. Action plan titles are taken verbatim
     * from the "Innovative Action Plan" column of the source document.
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
                                'name' => 'Deployment and dissemination of VMO, Quality Management System in all units',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Upload the VMO in the website, official social media accounts, and post in the conspicuous places/areas in the University Campuses.', 'units' => ['CPAD', 'QMSO', 'FMD']],
                                    ['title' => 'Upload the PQF Levels 6-8 Descriptors and the UV Institutional Learning Outcomes in the website, official social media accounts, and post in the conspicuous places/areas in the University Campuses', 'units' => ['ACADEMIC']],
                                    ['title' => 'Integrate in the course syllabi and activities of all programs across campuses, colleges and units.', 'units' => ['ACADEMIC']],
                                    ['title' => 'Integration in all classes\' orientation and recitation in all units\' regular meetings.', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '1.1.2' => [
                                'name' => 'Alignment and dissemination of 17 UN Sustainable Development Goals in all university operations.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Upload the 17 UNSDG in the website, official social media accounts, and post in the conspicuous places/areas in the University Campuses.', 'units' => ['CPAD', 'QMSO', 'FMD']],
                                    ['title' => 'Integrate in the course syllabi and activities of all programs across campuses, colleges and units.', 'units' => ['ACADEMIC']],
                                    ['title' => 'Integration in all classes\' orientation and recitation in all units\' regular meetings.', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '1.1.3' => [
                                'name' => '100% of Senior Leaders and other stakeholders participate in the Quality Assurance Review and Planning.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Senior leaders and stakeholders participate actively in the scheduled Quality Assurance Review and Planning towards continuous improvement and stakeholder\'s satisfaction.', 'units' => ['ACADEMIC', 'NONACADEMIC']],
                                    ['title' => 'Regularly recognize the valuable contribution of the stakeholders.', 'units' => ['ACADEMIC', 'NONACADEMIC']],
                                ],
                            ],
                            '1.1.4' => [
                                'name' => 'Compliance with the National Privacy Commission requirements',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Undertake audit procedures on data privacy', 'units' => ['ACADEMIC', 'NONACADEMIC', 'DPO']],
                                    ['title' => 'Implement Awareness Program for employees to improve privacy knowledge, skills, attitude, and behavior.', 'units' => ['ACADEMIC', 'NONACADEMIC', 'DPO']],
                                    ['title' => 'Install much-needed security software\'s to protect data on all devices used in the University and its satellite campuses.', 'units' => ['ICTD', 'FAD', 'ACADEMIC', 'NONACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '1.2' => [
                        'name' => 'Leadership',
                        'kpis' => [
                            '1.2.1' => [
                                'name' => '100% involvement of all senior leaders in University Committee Leadership/Memberships',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Senior Leaders should chair/vice chair/member of at least one (1) university/college committee.', 'units' => ['ACADEMIC', 'NONACADEMIC']],
                                    ['title' => 'Ensure continuity of involvement in university committee leaderships memberships by assigning assistants or associates to every senior leader occupying chairmanship positions in various committees', 'units' => ['ACADEMIC', 'NONACADEMIC']],
                                ],
                            ],
                            '1.2.2' => [
                                'name' => '100% involvement in 5S program',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Conduct periodic implementation audit of 5S in the different units across all campuses.', 'units' => ['ACADEMIC', 'NONACADEMIC']],
                                    ['title' => 'Conduct Capacity-Building for 5S Implementers', 'units' => ['ACADEMIC', 'NONACADEMIC']],
                                ],
                            ],
                            '1.2.3' => [
                                'name' => '100% involvement of all employees in the Quality Circles',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Organize and orient employees on the policies and procedures of the University Quality Circles.', 'units' => ['ACADEMIC', 'NONACADEMIC']],
                                    ['title' => 'Deployment of the policies and procedures of the University Quality Circles', 'units' => ['ACADEMIC', 'NONACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '1.3' => [
                        'name' => 'Human Resources Learning and Development',
                        'kpis' => [
                            '1.3.1' => [
                                'name' => '100% participation in university-wide learning and development program',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Conduct training needs assessment as a basis in crafting the learning and development program for non-teaching', 'units' => ['HRD']],
                                    ['title' => 'Attend and complete at least one online training/webinar aligned to the job function.', 'units' => ['NONACADEMIC']],
                                ],
                            ],
                            '1.3.2' => [
                                'name' => '100% academic development participation in unit faculty program',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Conduct training assessment as basis crafting of the development program needs in the faculty', 'units' => ['ACADEMIC', 'HRD']],
                                    ['title' => 'Attendance to at least one online training or webinar aligned to the field of specialization', 'units' => ['ACADEMIC']],
                                    ['title' => 'Include Faculty Immersion program and have it implemented during Special Period', 'units' => ['ACADEMIC', 'HRD']],
                                ],
                            ],
                        ],
                    ],

                    '1.4' => [
                        'name' => 'Communication',
                        'kpis' => [
                            '1.4.1' => [
                                'name' => '100% deployment of internal and external communication guidelines/protocols.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Efficient and regular use of corporate emails and online systems in inter-office communication by customizing Office 365 features and applications for a secured and reliable communication processes', 'units' => ['CPAD', 'ACADEMIC', 'NONACADEMIC']],
                                    ['title' => 'Establish a contingency communication plan with due consideration on security for unexpected challenges', 'units' => ['CPAD', 'ACADEMIC', 'NONACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '1.5' => [
                        'name' => 'Physical Plant and Facilities',
                        'kpis' => [
                            '1.5.1' => [
                                'name' => '100% completion in crafting the 3-year campus development plan.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Prepare a campus development plan.', 'units' => ['FMD']],
                                ],
                            ],
                            '1.5.2' => [
                                'name' => 'Implementation of the 3-year campus development plan.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Monitoring of the campus development plan implementation.', 'units' => ['FMD']],
                                ],
                            ],
                        ],
                    ],

                    '1.6' => [
                        'name' => 'ICT',
                        'kpis' => [
                            '1.6.1' => [
                                'name' => '100% up to date, innovative and user friendly, functional website and automation systems',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Maintain regularly an updated website and automation system', 'units' => ['ICTD', 'CPAD', 'ACADEMIC']],
                                ],
                            ],
                            '1.6.2' => [
                                'name' => '100% improvement of ICT network infrastructure capability',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Maintain regularly an upgraded IT infrastructure', 'units' => ['ICTD', 'FAD']],
                                    ['title' => 'Install much-needed security software\'s to protect data on all devices used in the University and its satellite campuses.', 'units' => ['ICTD', 'FAD', 'ACADEMIC', 'NONACADEMIC']],
                                    ['title' => 'Host secured systems over the cloud.', 'units' => ['ICTD', 'FAD', 'ACADEMIC', 'NONACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '1.7' => [
                        'name' => 'Finance',
                        'kpis' => [
                            '1.7.1' => [
                                'name' => 'Increase accounts Receivable collection efficiency to 98%.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Efficient deployment of cashless payment scheme', 'units' => ['FAD', 'ACADEMIC']],
                                    ['title' => 'Close monitoring of students\' accounts and consistent reminders to students', 'units' => ['FAD']],
                                    ['title' => 'Strengthen partnership/linkages with financing intermediaries who could offer educational loans to students', 'units' => ['FAD']],
                                    ['title' => 'Integrate the available payment channels in the Enrolment system', 'units' => ['FAD', 'ICTD']],
                                    ['title' => 'Create a University Communication System to update students on their school fees.', 'units' => ['FAD', 'ICTD', 'ACADEMIC']],
                                ],
                            ],
                            '1.7.2' => [
                                'name' => 'Zero complain from students of late posting or unposted online payments every day.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Monitor daily status report of online collections to ensure on time and accurate posting of student online payments.', 'units' => ['FAD', 'ICTD']],
                                ],
                            ],
                            '1.7.3' => [
                                'name' => 'Utilization of resources based on approved budget for all units',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Monitoring of the actual expenditures versus approved budget', 'units' => ['FAD', 'ACADEMIC', 'NONACADEMIC']],
                                    ['title' => 'Create and integrate the purchasing system to the existing accounting system (Ledgea)', 'units' => ['FAD', 'ICTD']],
                                    ['title' => 'Submission of weekly Purchase monitoring sheet to track status of request.', 'units' => ['FAD', 'ACADEMIC', 'NONACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '1.8' => [
                        'name' => 'Accreditation and Certification',
                        'kpis' => [
                            '1.8.1' => [
                                'name' => '100% Compliance with Institutional Sustainability Assessment (ISA) Standards',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Regular review of compliance to standards and submit action plan to address gaps', 'units' => ['QMSO', 'QC', 'ACADEMIC']],
                                ],
                            ],
                            '1.8.2' => [
                                'name' => '100% Compliance with Autonomous Standards',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Regular review of compliance to standards and submit action plan to address gaps', 'units' => ['QMSO', 'QC', 'ACADEMIC']],
                                ],
                            ],
                            '1.8.3' => [
                                'name' => '100% Compliance to PACUCOA Accreditation standards for all programs',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Compliance to standards and submit action plan to address gaps.', 'units' => ['ACADEMIC', 'QC', 'QMSO']],
                                ],
                            ],
                            '1.8.4' => [
                                'name' => '100% compliance with CHED COD/COE standard',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Regular review of compliance to standards and submit action plan to address gaps.', 'units' => ['ACADEMIC', 'QMSO', 'QC']],
                                ],
                            ],
                            '1.8.5' => [
                                'name' => '100% Compliance to International accreditation standards.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'All quality circles to review requirements and submit action plans to address gaps.', 'units' => ['ACADEMIC', 'QMSO', 'QC']],
                                ],
                            ],
                            '1.8.6' => [
                                'name' => '100% Compliance with ISO 9001:2015 version by AY 2023-2026',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Monitoring, review and evaluation on the compliance to ISO 9001:2015 standards.', 'units' => ['QMSO', 'ACADEMIC', 'NONACADEMIC', 'DQMR', 'IQA']],
                                ],
                            ],
                            '1.8.7' => [
                                'name' => '100% Compliance to National Competency Certification',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Identify, train and capacitate faculty members to take the assessments to with TESDA qualify assessors.', 'units' => ['ACADEMIC']],
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
                                'name' => 'Full time faculty personnel are engaged in research',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Creation of a core team among research coordinators, teaching and non-teaching personnel.', 'units' => ['CRI', 'ACADEMIC', 'NONACADEMIC']],
                                    ['title' => 'Conduct weekly research didactics for the faculty.', 'units' => ['CRI', 'ACADEMIC', 'NONACADEMIC']],
                                ],
                            ],
                            '2.1.2' => [
                                'name' => 'At least one research capacity and capability building per college per semester',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Conduct Discipline-Specific Research Capability Trainings and Workshops per Semester for every College/Program including non-teaching staffs based on the results of the need\'s assessment survey.', 'units' => ['CRI', 'ACADEMIC']],
                                    ['title' => 'Produce outputs which uses NETNOGRAPHY research design and big data analysis.', 'units' => ['CRI', 'ACADEMIC']],
                                ],
                            ],
                            '2.1.3' => [
                                'name' => 'One research journal per college per academic year',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Publish research outputs in the college research journal.', 'units' => ['CRI', 'ACADEMIC']],
                                ],
                            ],
                            '2.1.4' => [
                                'name' => 'At least two research-based science and technology applied for patent and/or at least four utility models',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Forge collaboration researches among different disciplines in the university.', 'units' => ['CRI', 'ACADEMIC']],
                                ],
                            ],
                            '2.1.5' => [
                                'name' => 'At least one (1) research output from Non-Teaching Personnel per unit',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Conduct a training and workshop on writing a publishable format research.', 'units' => ['CRI', 'NONACADEMIC']],
                                ],
                            ],
                            '2.1.6' => [
                                'name' => 'Utilize tracer study results yearly per academic unit',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Innovate curricula and improve learning outcomes and graduate competencies.', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '2.1.7' => [
                                'name' => 'Thesis/dissertation are IMRAD-ready',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Modify thesis/dissertation format to become IMRAD-ready.', 'units' => ['CRI', 'ACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '2.2' => [
                        'name' => 'Knowledge Management',
                        'kpis' => [
                            '2.2.1' => [
                                'name' => '100% deployment of knowledge management system, measurement and analysis.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Prepare a Knowledge Management Manual containing forms and SOPPs based on the listed processes and procedures.', 'units' => ['ACADEMIC', 'HRD']],
                                    ['title' => 'Deployment of Knowledge Management System activities per unit.', 'units' => ['ACADEMIC', 'HRD']],
                                    ['title' => 'Include in KM System in the scheduled re-orientation program.', 'units' => ['ACADEMIC', 'HRD']],
                                    ['title' => 'Include KPI of Knowledge Management in the Performance Evaluation per unit.', 'units' => ['ACADEMIC', 'HRD']],
                                    ['title' => 'Introduce knowledge management programs to the Visayanian community through exposure of programs to e-media channels.', 'units' => ['ACADEMIC', 'HRD']],
                                ],
                            ],
                        ],
                    ],

                    '2.3' => [
                        'name' => 'Library',
                        'kpis' => [
                            '2.3.1' => [
                                'name' => '30% print acquisitions within AY 2023-2026',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Beef up collections of printed resources in collaboration with the academic units.', 'units' => ['ACADEMIC', 'ARC']],
                                ],
                            ],
                            '2.3.2' => [
                                'name' => '70% non-print acquisitions within the AY 2023-2026',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Improve collections of relevant electronic resources by participating in consortium with other universities.', 'units' => ['ACADEMIC', 'ARC']],
                                ],
                            ],
                            '2.3.3' => [
                                'name' => '100% information dissemination and accessibility of academic resources, print & non-print.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Integrate the library management system in the university website', 'units' => ['ICTD', 'CPAD', 'ARC']],
                                    ['title' => 'Create infographics (digital library guides) to encourage all faculty and students to fully maximize the utilization of all library resources and services.', 'units' => ['ICTD', 'CPAD', 'ARC']],
                                ],
                            ],
                            '2.3.4' => [
                                'name' => '100% of Full-time faculty accessed and utilized the academic resources per month',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Require all full-time faculty to borrow at least two books per month and access the e-learning resources through the library management system.', 'units' => ['ACADEMIC', 'ARC']],
                                ],
                            ],
                            '2.3.5' => [
                                'name' => 'Students accessed and utilized the academic resources per month within the AY 2023-2026',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Require all the students to borrow at least two books per month and access the e-learning resources through the library management system.', 'units' => ['ACADEMIC', 'ARC']],
                                ],
                            ],
                            '2.3.5B' => [
                                'name' => 'Non-Teaching personnel should borrow and read at least one book per month',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Require the non-teaching personnel to visit the ARC and/or access the library management system and utilize the available resources.', 'units' => ['NONACADEMIC', 'ARC']],
                                ],
                            ],
                            '2.3.6' => [
                                'name' => 'At least one recipient per department per semester for the top academic resources borrower award from the following: a) faculty, b) non-teaching, and c) students',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Sets criteria for the recognition and prepares monitoring matrix on ARC resources utilization.', 'units' => ['ARC']],
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
                                'name' => 'Full Time faculty members will have the required qualifications/minimum academic qualifications: a. Higher Education Graduate degree=100%; b. Basic Education LET Passer=100%, Graduate degree=30%',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Strictly comply with the CHED minimum academic qualifications hiring personnel for academic position.', 'units' => ['HRD', 'ACADEMIC']],
                                    ['title' => 'Encourage the academic personnel to avail of the educational scholarship.', 'units' => ['HRD', 'ACADEMIC']],
                                    ['title' => 'Craft a 5-year faculty development plan and monitors its implementation', 'units' => ['HRD', 'ACADEMIC']],
                                ],
                            ],
                            '3.1.2' => [
                                'name' => '90% of the faculty meets a performance rating of at least 4.51',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Regularly evaluate the faculty using the revised/updated performance evaluation tool.', 'units' => ['HRD', 'ACADEMIC']],
                                    ['title' => 'Automated Faculty Evaluation System integrated with the Student Portal.', 'units' => ['HRD', 'ACADEMIC']],
                                ],
                            ],
                            '3.1.3' => [
                                'name' => 'Full-time faculty are members of relevant professional organizations.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Require all full-time faculty to be involved as member or officer in a professional organization that is aligned to their discipline.', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '3.1.4' => [
                                'name' => 'At least one class section advisership every semester',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Homeroom organization in regular classes.', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '3.1.5' => [
                                'name' => 'Deployment of Ranking, Tenureship & Promotion',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Faculty responds to the call for ranking, send application and submit with the required evidence for ranking.', 'units' => ['HRD', 'ACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '3.2' => [
                        'name' => 'Instruction',
                        'kpis' => [
                            '3.2.1' => [
                                'name' => 'Compliance with Curriculum Validation every semester',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Prepare a curriculum validation policy.', 'units' => ['ACADEMIC']],
                                    ['title' => 'Conduct a curriculum validation before the end of each semester.', 'units' => ['ACADEMIC']],
                                    ['title' => 'Develop an automated system embedded in the UV ACCESS LMS as part of the course compliance.', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '3.2.2' => [
                                'name' => '100% compliance with Curriculum Evaluation every four/five years',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Conduct a curriculum evaluation every four or five years.', 'units' => ['ACADEMIC']],
                                    ['title' => 'Conduct seminar/workshop/training for all the prospective participants (IAAC members) on the conduct of the curriculum review and evaluation.', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '3.2.3' => [
                                'name' => 'Compliance to selective retention guidelines.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Prepare selective retention policies for all programs.', 'units' => ['ACADEMIC']],
                                    ['title' => 'Compliance to selective retention policies in all programs.', 'units' => ['ACADEMIC']],
                                    ['title' => 'Integrate in the University website the retention policy of each program.', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '3.2.4' => [
                                'name' => 'Above national passing percentage for all licensure/bar exams for 1st time takers.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Deployment of board exam prep policy.', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '3.2.5' => [
                                'name' => 'Deployment of at least one external certification per program for faculty.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Capacitate and train faculty to deliver the external certification programs.', 'units' => ['ACADEMIC']],
                                    ['title' => 'Establish partnership with agencies/institution providing certification programs.', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '3.2.6' => [
                                'name' => 'Integration of One NC per program',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Verify with TESDA available NC programs aligned to the programs offered.', 'units' => ['ACADEMIC', 'EDTECH']],
                                ],
                            ],
                            '3.2.7' => [
                                'name' => 'Organize student Quality Circles in all year levels',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Identify students who will compose the quality circle per college/per year level and organize them according to the Students\' Quality circle policy', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '3.2.8' => [
                                'name' => '3rd year students should take sub-professional and professional Civil Service examinations',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Orient students on the types of civil service exam and career advancement in terms of qualification.', 'units' => ['ACADEMIC']],
                                    ['title' => 'Facilitate application the civil service examination in both procedure Pencil and Paper Test and Computer Based Examination.', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '3.2.9' => [
                                'name' => 'Faculty Members should acquire score of C1 in the International English Language Certification.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Prepare an intervention program across all academic units.', 'units' => ['ACADEMIC']],
                                ],
                            ],
                            '3.2.10' => [
                                'name' => 'Students should acquire score of B1 in the International English Language Certification.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Prepare an intervention program across all year level.', 'units' => ['ACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '3.3' => [
                        'name' => 'Innovative Education',
                        'kpis' => [
                            '3.3.1' => [
                                'name' => '100% implementation of the E-learning program/roadmap',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Develop Online Course Module per program per College in the Office 365 and Open LMS.', 'units' => ['ACADEMIC', 'CIE']],
                                    ['title' => 'Develop Hyflex Learning Strategy in all colleges.', 'units' => ['ACADEMIC', 'CIE']],
                                    ['title' => 'Provide professional development training courses on ICT for faculty and staff (e.g. AI, KM, IoT, data science).', 'units' => ['ACADEMIC', 'CIE']],
                                    ['title' => 'Retooling on integration of MS Teams in the LMS (UV ACCESS)', 'units' => ['ACADEMIC', 'CIE']],
                                    ['title' => 'Strategic partnership with technology companies through MOA and MOU.', 'units' => ['ACADEMIC', 'CIE']],
                                    ['title' => 'Integrate AI/Robotics in all courses.', 'units' => ['ACADEMIC', 'CIE']],
                                ],
                            ],
                        ],
                    ],

                    '3.4' => [
                        'name' => 'Employability',
                        'kpis' => [
                            '3.4.1' => [
                                'name' => 'Graduates are engaged in gainful activities and professional development within 12-months after graduation (employment, entrepreneurship, graduate studies).',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Monitor graduates to document their employment, engagement to entrepreneurial activities, or pursuit to further studies', 'units' => ['CPAD', 'ALUMNI', 'ACADEMIC']],
                                    ['title' => 'Provide incentive to encourage graduates to give feedback when they get a job after their graduation.', 'units' => ['CPAD', 'ALUMNI', 'ACADEMIC']],
                                    ['title' => 'Conduct a regular job fair in collaboration with industry partners and document those hired on the spot.', 'units' => ['CPAD', 'ALUMNI', 'ACADEMIC']],
                                ],
                            ],
                            '3.4.2' => [
                                'name' => 'Establish at least 2-industry partners per semester/program',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Identify local and international companies and start networking for partnerships.', 'units' => ['CPAD', 'IAD', 'ACADEMIC']],
                                    ['title' => 'Build collaborative programs that are mutually beneficial with the industry and the college/university.', 'units' => ['CPAD', 'IAD', 'ACADEMIC']],
                                ],
                            ],
                            '3.4.3' => [
                                'name' => 'Conduct the annual tracer study',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Initiate the conduct of the annual graduate tracer studies', 'units' => ['CPAD', 'ALUMNI', 'CRI', 'ACADEMIC']],
                                    ['title' => 'Collaborate with the colleges & alumni affairs in the deployment of the graduate tracer survey questionnaire.', 'units' => ['CPAD', 'ALUMNI', 'CRI', 'ACADEMIC']],
                                    ['title' => 'Utilize data gathered from the tracer study and convert into a research paper in coordination with the CRI.', 'units' => ['CPAD', 'ALUMNI', 'CRI', 'ACADEMIC']],
                                    ['title' => 'Cascade results to the colleges as an input to improve programs', 'units' => ['CPAD', 'ALUMNI', 'CRI', 'ACADEMIC']],
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
                                'name' => '100% sectoral representation in community extension programs',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Involvement of all stakeholders', 'units' => ['COMEX', 'ACADEMIC', 'NONACADEMIC', 'ALUMNI']],
                                ],
                            ],
                            '4.1.2' => [
                                'name' => 'Conduct at least 2 full researches per academic unit and at least one from the non-teaching personnel',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Conduct at least one (1) extension programs from these researches.', 'units' => ['COMEX', 'ACADEMIC', 'NONACADEMIC', 'CRI']],
                                ],
                            ],
                            '4.1.3' => [
                                'name' => 'Involvement and participation in the environmental protection and preservation',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Develop programs related to Environment Protection and Conservation.', 'units' => ['COMEX', 'ACADEMIC', 'NONACADEMIC', 'CRI']],
                                ],
                            ],
                            '4.1.4' => [
                                'name' => 'Sustain the Community Tutorial program. Expansion of the program to the other 6 sitios by the 2nd semester of AY 2023-2024',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Sustain the community tutorial and expand to other surrounding communities.', 'units' => ['COMEX', 'ACADEMIC', 'NONACADEMIC']],
                                ],
                            ],
                            '4.1.5' => [
                                'name' => '100% implementation, involvement and participation from all colleges/departments during AY 2023-2026',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Participation of the COMEX representative, faculty and student representatives per program, and the college dean from planning to evaluation.', 'units' => ['COMEX', 'ACADEMIC', 'NONACADEMIC']],
                                    ['title' => 'Posting of COMEX activities in UV FB page and website.', 'units' => ['COMEX', 'CPAD']],
                                ],
                            ],
                        ],
                    ],

                    '4.2' => [
                        'name' => 'Philippine Linkages',
                        'kpis' => [
                            '4.2.1' => [
                                'name' => 'At least one active partnership with government, industry or NGO per academic unit every semester',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Document all networking with national and regional organizations by all academic units', 'units' => ['COMEX', 'ACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '4.3' => [
                        'name' => 'International Linkages',
                        'kpis' => [
                            '4.3.1' => [
                                'name' => 'At least one active partnership with international university per academic unit per semester.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Document all networking with international organizations by all academic units.', 'units' => ['COMEX', 'ACADEMIC']],
                                ],
                            ],
                            '4.3.2' => [
                                'name' => 'At least 1 faculty exchange per academic unit for academic year 2024-2025.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Deployment of activities stipulated in the MOA/MOU.', 'units' => ['IAD', 'ACADEMIC']],
                                ],
                            ],
                            '4.3.3' => [
                                'name' => 'At least 2 student exchange programs per academic unit for academic year 2024-2025.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Deployment of activities stipulated in the MOA/MOU.', 'units' => ['IAD', 'ACADEMIC']],
                                ],
                            ],
                            '4.3.4' => [
                                'name' => 'At least 1 collaborative Research Activity/Colloquium Activities such as: Production, Publication, Presentation, and utilization',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Deployment of activities stipulated in the MOA/MOU.', 'units' => ['IAD', 'ACADEMIC']],
                                ],
                            ],
                            '4.3.5' => [
                                'name' => 'At least 50 admissions of Foreign Students enrolled in any academic program for academic year 2024-2025.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Produce at least one for each types of campaigns (commercial, reputation, education/awareness and social action) per semester.', 'units' => ['IAD', 'ACADEMIC']],
                                    ['title' => 'Develop at least one campaign per semester intended for the international market.', 'units' => ['IAD', 'ACADEMIC']],
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
                                'name' => 'Freshmen enrollment targets: a) at least 300 for colleges with a single program offering (CCJE); b) at least 500 for colleges with two to three program offerings, at least 50 students/program (CAHS, COME); c) at least 600 for colleges with more than three program offerings, at least 50 students/program (CAS, CBA, COED, CETA); d) at least 100 for JD; e) at least 600 for Grade 11, at least 50 students/track',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Conduct FGD as one of the tools to get feedback and inputs', 'units' => ['CPAD', 'ACADEMIC', 'SASC', 'CRI']],
                                    ['title' => 'Increase field marketing campaign to private academic institutions.', 'units' => ['CPAD', 'ACADEMIC', 'SASC', 'CRI']],
                                    ['title' => 'Create more page engagements in Facebook in a daily/weekly basis to reach more page likes and follows, and expand in other social media for advertisement and promotion.', 'units' => ['CPAD', 'ACADEMIC', 'SASC', 'CRI']],
                                    ['title' => 'Create an enhanced "enroll now, pay later" scheme, sponsorship programs, for them to pursue their studies.', 'units' => ['CPAD', 'ACADEMIC', 'SASC', 'CRI']],
                                ],
                            ],
                            '5.1.2' => [
                                'name' => 'Achieve at least 80% students\' retention',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Implement JRG\'s "Himunga-an System"; strengthen students\' academic advising', 'units' => ['ACADEMIC']],
                                    ['title' => 'Sustain students\' positive experiences through the exceptional customer services throughout all units', 'units' => ['NONACADEMIC']],
                                ],
                            ],
                            '5.1.3' => [
                                'name' => 'Submission of College Marketing Plan',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Conduct webinars and prepare Marketing Plan', 'units' => ['CPAD', 'ACADEMIC']],
                                ],
                            ],
                            '5.1.4' => [
                                'name' => 'Deployment of the university campaign advertisement materials per semester',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Produce at least one for each types of campaigns (commercial, reputation, education/awareness and social action) per semester.', 'units' => ['CPAD', 'ACADEMIC']],
                                    ['title' => 'Develop at least one campaign per semester intended for the international market.', 'units' => ['CPAD', 'ACADEMIC']],
                                ],
                            ],
                            '5.1.5' => [
                                'name' => 'Five (5) signed MOA per Academic Year with the feeder school',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Seal at least five (5) Feeder School Partnership per academic year', 'units' => ['CPAD', 'ACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '5.2' => [
                        'name' => 'Customer Feedback',
                        'kpis' => [
                            '5.2.1' => [
                                'name' => 'Deployment of the Best Innovative Procedures Award (BIPA) and customer feedback mechanism in all units',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Strengthen feedback system thru the university online portal and other mechanisms where stakeholders can convey service satisfaction and experiences.', 'units' => ['CPAD', 'ACADEMIC', 'NONACADEMIC', 'SASC']],
                                ],
                            ],
                            '5.2.2' => [
                                'name' => 'Response to customer feedback within seven days',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Timely feedback system thru the university online portal and other mechanisms where stakeholders can convey service satisfaction and experiences.', 'units' => ['SASC', 'ACADEMIC']],
                                    ['title' => 'Orient Internal Stakeholders on the various feedback mechanisms and the Standards Operating Policies and Procedures on Customer Feedback Facilitation.', 'units' => ['SASC', 'ACADEMIC']],
                                    ['title' => 'Create customer feedback committee comprising of employees from Academic units, Support Service Offices, President of SSC to realize sincere involvement.', 'units' => ['SASC', 'ACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '5.3' => [
                        'name' => 'Guidance and Counseling',
                        'kpis' => [
                            '5.3.1' => [
                                'name' => 'Deployment of counseling program',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Sustain the Implementation of Guidance and Counseling program through Flexible Deployment Program.', 'units' => ['SASC', 'ACADEMIC']],
                                    ['title' => 'Link with the different private or government agencies offering Psychological Assessment, Debriefing and Medical Assistance and refer students with special needs to specialists concerned.', 'units' => ['SASC', 'ACADEMIC']],
                                    ['title' => 'Partner with industries or companies on the deployment of CIP.', 'units' => ['SASC', 'ACADEMIC']],
                                    ['title' => 'Implement peer counseling program.', 'units' => ['SASC', 'ACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '5.4' => [
                        'name' => 'Student Development and Discipline',
                        'kpis' => [
                            '5.4.1' => [
                                'name' => 'Deployment of student planned extracurricular activities.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Participate in inter-school competitions which give opportunity for students to exhibit and unleash their talents and potentials.', 'units' => ['SASC', 'ACADEMIC']],
                                ],
                            ],
                            '5.4.3' => [
                                'name' => '2% decrease of student violations',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Developmental Program Plan on student discipline that counters the challenges of the new normal.', 'units' => ['SASC', 'ACADEMIC']],
                                    ['title' => 'Sustain monitoring mechanism of student behavioral concerns. Conduct regular awareness drive on the digital mechanisms for monitoring students\' behavior.', 'units' => ['SASC', 'ACADEMIC']],
                                ],
                            ],
                        ],
                    ],

                    '5.5' => [
                        'name' => 'Gender and Development Program',
                        'kpis' => [
                            '5.5.1' => [
                                'name' => 'Deployment of the Gender and development program',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Create gender inclusive teaching materials and resources for teachers to enhance teacher\'s classroom discussion.', 'units' => ['ACADEMIC', 'SASC']],
                                ],
                            ],
                        ],
                    ],

                    '5.6' => [
                        'name' => 'Sports Development',
                        'kpis' => [
                            '5.6.1' => [
                                'name' => '100% involvement in intramural and extramural activities',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Organize sports leagues among the system schools by the support of the school\'s linkages and broadcast those though online platforms for global audience.', 'units' => ['SASC', 'ACADEMIC', 'COMEX', 'ACD']],
                                    ['title' => 'Create Virtual Intramural activities for students & other stakeholders with support of the alumni and sponsors.', 'units' => ['SASC', 'ACADEMIC', 'ALUMNI', 'ACD']],
                                    ['title' => 'Invite alumni and company representatives as resource speakers on fitness and sports related webinars.', 'units' => ['SASC', 'ACD', 'ALUMNI']],
                                    ['title' => 'Initiate, reconnect and create linkages with the former sponsors and alumni.', 'units' => ['SASC', 'ACD', 'ALUMNI']],
                                ],
                            ],
                        ],
                    ],

                    '5.7' => [
                        'name' => 'Arts & Culture Development',
                        'kpis' => [
                            '5.7.1' => [
                                'name' => 'Organize at least one NTPIF/Faculty/Student arts and culture program per semester.',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Create Culture and Arts development program plan.', 'units' => ['ACADEMIC', 'NONACADEMIC', 'SASC']],
                                    ['title' => 'Create Virtual platform for Cultural & Artistic performances and Exhibitions.', 'units' => ['ACADEMIC', 'NONACADEMIC', 'ACD']],
                                    ['title' => 'Create virtual and in-person cultural and artistic performances and exhibitions.', 'units' => ['ACADEMIC', 'NONACADEMIC', 'ACD']],
                                    ['title' => 'Intensify the promotion of the Arts and Culture activities by increasing social media engagement.', 'units' => ['ACADEMIC', 'NONACADEMIC', 'ACD']],
                                ],
                            ],
                        ],
                    ],

                    '5.8' => [
                        'name' => 'Alumni Relations',
                        'kpis' => [
                            '5.8.1' => [
                                'name' => 'Strengthen alumni chapter in all academic units',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Creation of chapter alumni developmental plan in all academic units.', 'units' => ['ACADEMIC', 'ALUMNI']],
                                    ['title' => 'Creation of International Alumni Chapter', 'units' => ['ACADEMIC', 'ALUMNI']],
                                ],
                            ],
                            '5.8.2' => [
                                'name' => 'Organize university wide Alumni Homecoming/Reunion every year',
                                'description' => null,
                                'action_plans' => [
                                    ['title' => 'Conduct Alumni Homecoming/reunion activities.', 'units' => ['ALUMNI', 'UVAAI']],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }
}