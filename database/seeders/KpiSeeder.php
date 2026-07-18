    <?php

    namespace Database\Seeders;

    use App\Models\Kpi;
    use App\Models\SubKra;
    use Illuminate\Database\Seeder;

    class KpiSeeder extends Seeder
    {
        public function run(): void
        {
            $subKras = SubKra::pluck('id', 'code');

            $kpis = [

                /*
                |--------------------------------------------------------------------------
                | KRA 1 - Governance (1.1)
                |--------------------------------------------------------------------------
                */

                [
                    'code' => '1.1',
                    'title' => 'Deployment and dissemination of VMO, Quality Management System in all units',
                    'description' => '1.1.1',
                    'target' => '100%',
                ],

                [
                    'code' => '1.1',
                    'title' => 'Alignment and dissemination of the 17 UN Sustainable Development Goals in all university operations',
                    'description' => '1.1.2',
                    'target' => '100%',
                ],

                [
                    'code' => '1.1',
                    'title' => '100% of Senior Leaders and other stakeholders participate in the Quality Assurance Review and Planning',
                    'description' => '1.1.3',
                    'target' => '100%',
                ],

                [
                    'code' => '1.1',
                    'title' => 'Compliance with National Privacy Commission requirements',
                    'description' => '1.1.4',
                    'target' => '100%',
                ],

                /*
                |--------------------------------------------------------------------------
                | Leadership (1.2)
                |--------------------------------------------------------------------------
                */

                [
                    'code' => '1.2',
                    'title' => '100% involvement of all senior leaders in University Committee Leadership/Memberships',
                    'description' => '1.2.1',
                    'target' => '100%',
                ],

                [
                    'code' => '1.2',
                    'title' => '100% involvement in the 5S Program',
                    'description' => '1.2.2',
                    'target' => '100%',
                ],

                [
                    'code' => '1.2',
                    'title' => '100% involvement of all employees in the Quality Circles',
                    'description' => '1.2.3',
                    'target' => '100%',
                ],

                /*
                |--------------------------------------------------------------------------
                | Human Resources Learning & Development (1.3)
                |--------------------------------------------------------------------------
                */

                [
                    'code' => '1.3',
                    'title' => '100% participation in university-wide learning and development program',
                    'description' => '1.3.1',
                    'target' => '100%',
                ],

                [
                    'code' => '1.3',
                    'title' => '100% academic development participation in unit faculty development program',
                    'description' => '1.3.2',
                    'target' => '100%',
                ],

                /*
                |--------------------------------------------------------------------------
                | Communication (1.4)
                |--------------------------------------------------------------------------
                */

                [
                    'code' => '1.4',
                    'title' => '100% deployment of internal and external communication guidelines/protocols',
                    'description' => '1.4.1',
                    'target' => '100%',
                ],
                /*
    |--------------------------------------------------------------------------
    | Physical Plant and Facilities (1.5)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '1.5',
        'title' => '100% completion in crafting the 3-year campus development plan',
        'description' => '1.5.1',
        'target' => '100%',
    ],

    [
        'code' => '1.5',
        'title' => 'Implementation of the 3-year campus development plan',
        'description' => '1.5.2',
        'target' => '100%',
    ],

    /*
    |--------------------------------------------------------------------------
    | ICT (1.6)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '1.6',
        'title' => '100% up-to-date, innovative, user-friendly and functional website and automation systems',
        'description' => '1.6.1',
        'target' => '100%',
    ],

    [
        'code' => '1.6',
        'title' => '100% improvement of ICT network infrastructure capability',
        'description' => '1.6.2',
        'target' => '100%',
    ],

    /*
    |--------------------------------------------------------------------------
    | Finance (1.7)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '1.7',
        'title' => 'Increase Accounts Receivable collection efficiency to 98%',
        'description' => '1.7.1',
        'target' => '100%',
    ],

    [
        'code' => '1.7',
        'title' => 'Zero complaints from students of late posting or unposted online payments every day',
        'description' => '1.7.2',
        'target' => '100%',
    ],

    [
        'code' => '1.7',
        'title' => 'Utilization of resources based on approved budget for all units',
        'description' => '1.7.3',
        'target' => '100%',
    ],

    /*
    |--------------------------------------------------------------------------
    | Accreditation & Certification (1.8)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '1.8',
        'title' => '100% Compliance with Institutional Sustainability Assessment (ISA) Standards',
        'description' => '1.8.1',
        'target' => '100%',
    ],

    [
        'code' => '1.8',
        'title' => '100% Compliance with Autonomous Standards',
        'description' => '1.8.2',
        'target' => '100%',
    ],

    [
        'code' => '1.8',
        'title' => '100% Compliance with PACUCOA Accreditation Standards for all programs',
        'description' => '1.8.3',
        'target' => '100%',
    ],

    [
        'code' => '1.8',
        'title' => '100% Compliance with CHED COD/COE Standards',
        'description' => '1.8.4',
        'target' => '100%',
    ],

    [
        'code' => '1.8',
        'title' => '100% Compliance with International Accreditation Standards',
        'description' => '1.8.5',
        'target' => '100%',
    ],

    [
        'code' => '1.8',
        'title' => '100% Compliance with ISO 9001:2015',
        'description' => '1.8.6',
        'target' => '100%',
    ],

    [
        'code' => '1.8',
        'title' => '100% Compliance with National Competency Certification',
        'description' => '1.8.7',
        'target' => '100%',
    ],

    /*
    |--------------------------------------------------------------------------
    | KRA 2 - Quality Research and Knowledge Management
    |--------------------------------------------------------------------------
    */

    /*
    |--------------------------------------------------------------------------
    | Research Production, Dissemination and Utilization (2.1)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '2.1',
        'title' => 'Full-time faculty personnel are engaged in research',
        'description' => '2.1.1',
        'target' => '100%',
    ],

    [
        'code' => '2.1',
        'title' => 'At least one research capacity and capability building per college per semester',
        'description' => '2.1.2',
        'target' => '100%',
    ],

    [
        'code' => '2.1',
        'title' => 'One research journal per college per academic year',
        'description' => '2.1.3',
        'target' => '100%',
    ],

    [
        'code' => '2.1',
        'title' => 'At least two research-based science and technology outputs applied for patent and/or at least four utility models',
        'description' => '2.1.4',
        'target' => '100%',
    ],

    [
        'code' => '2.1',
        'title' => 'At least one research output from Non-Teaching Personnel per unit',
        'description' => '2.1.5',
        'target' => '100%',
    ],

    [
        'code' => '2.1',
        'title' => 'Utilize tracer study results yearly per academic unit',
        'description' => '2.1.6',
        'target' => '100%',
    ],

    [
        'code' => '2.1',
        'title' => 'Thesis and dissertation are IMRAD-ready',
        'description' => '2.1.7',
        'target' => '100%',
    ],

    /*
    |--------------------------------------------------------------------------
    | Knowledge Management (2.2)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '2.2',
        'title' => '100% deployment of Knowledge Management System, measurement and analysis',
        'description' => '2.2.1',
        'target' => '100%',
    ],

    /*
    |--------------------------------------------------------------------------
    | Library (2.3)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '2.3',
        'title' => '30% print acquisitions within AY 2023–2026',
        'description' => '2.3.1',
        'target' => '100%',
    ],

    [
        'code' => '2.3',
        'title' => '70% non-print acquisitions within AY 2023–2026',
        'description' => '2.3.2',
        'target' => '100%',
    ],

    [
        'code' => '2.3',
        'title' => '100% information dissemination and accessibility of academic resources (print and non-print)',
        'description' => '2.3.3',
        'target' => '100%',
    ],

    [
        'code' => '2.3',
        'title' => '100% of full-time faculty accessed and utilized academic resources per month',
        'description' => '2.3.4',
        'target' => '100%',
    ],

    [
        'code' => '2.3',
        'title' => 'Students accessed and utilized academic resources per month within AY 2023–2026',
        'description' => '2.3.5',
        'target' => '100%',
    ],

    [
        'code' => '2.3',
        'title' => 'Non-Teaching personnel should borrow and read at least one book per month',
        'description' => '2.3.5B',
        'target' => '100%',
    ],

    [
        'code' => '2.3',
        'title' => 'At least one recipient per department per semester for the Top Academic Resources Borrower Award',
        'description' => '2.3.6',
        'target' => '100%',
    ],
    /*
    |--------------------------------------------------------------------------
    | KRA 3 - Innovative and Excellent Teaching and Learning
    |--------------------------------------------------------------------------
    */

    /*
    |--------------------------------------------------------------------------
    | Faculty (3.1)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '3.1',
        'title' => 'Full-time faculty members will have the required minimum academic qualifications',
        'description' => '3.1.1',
        'target' => '100%',
    ],

    [
        'code' => '3.1',
        'title' => '90% of the faculty meets a performance rating of at least 4.51',
        'description' => '3.1.2',
        'target' => '100%',
    ],

    [
        'code' => '3.1',
        'title' => 'Full-time faculty are members of relevant professional organizations',
        'description' => '3.1.3',
        'target' => '100%',
    ],

    [
        'code' => '3.1',
        'title' => 'At least one class section advisership every semester',
        'description' => '3.1.4',
        'target' => '100%',
    ],

    [
        'code' => '3.1',
        'title' => 'Deployment of Ranking, Tenureship and Promotion',
        'description' => '3.1.5',
        'target' => '100%',
    ],

    /*
    |--------------------------------------------------------------------------
    | Instruction (3.2)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '3.2',
        'title' => 'Compliance with Curriculum Validation every semester',
        'description' => '3.2.1',
        'target' => '100%',
    ],

    [
        'code' => '3.2',
        'title' => '100% compliance with Curriculum Evaluation every four/five years',
        'description' => '3.2.2',
        'target' => '100%',
    ],

    [
        'code' => '3.2',
        'title' => 'Compliance with Selective Retention Guidelines',
        'description' => '3.2.3',
        'target' => '100%',
    ],

    [
        'code' => '3.2',
        'title' => 'Above national passing percentage for all licensure/bar examinations for first-time takers',
        'description' => '3.2.4',
        'target' => '100%',
    ],

    [
        'code' => '3.2',
        'title' => 'Deployment of at least one external certification per program for faculty',
        'description' => '3.2.5',
        'target' => '100%',
    ],

    [
        'code' => '3.2',
        'title' => 'Integration of one National Certificate (NC) per program',
        'description' => '3.2.6',
        'target' => '100%',
    ],

    [
        'code' => '3.2',
        'title' => 'Organize Student Quality Circles in all year levels',
        'description' => '3.2.7',
        'target' => '100%',
    ],

    [
        'code' => '3.2',
        'title' => 'Third-year students should take Sub-Professional and Professional Civil Service Examinations',
        'description' => '3.2.8',
        'target' => '100%',
    ],

    [
        'code' => '3.2',
        'title' => 'Faculty members should acquire a C1 score in the International English Language Certification',
        'description' => '3.2.9',
        'target' => '100%',
    ],

    [
        'code' => '3.2',
        'title' => 'Students should acquire a B1 score in the International English Language Certification',
        'description' => '3.2.10',
        'target' => '100%',
    ],

    /*
    |--------------------------------------------------------------------------
    | Innovative Education (3.3)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '3.3',
        'title' => '100% implementation of the E-learning Program/Roadmap',
        'description' => '3.3.1',
        'target' => '100%',
    ],

    /*
    |--------------------------------------------------------------------------
    | Employability (3.4)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '3.4',
        'title' => 'Graduates are engaged in gainful activities and professional development within 12 months after graduation',
        'description' => '3.4.1',
        'target' => '100%',
    ],

    [
        'code' => '3.4',
        'title' => 'Establish at least two industry partners per semester per program',
        'description' => '3.4.2',
        'target' => '100%',
    ],

    [
        'code' => '3.4',
        'title' => 'Conduct the annual tracer study',
        'description' => '3.4.3',
        'target' => '100%',
    ],

    /*
    |--------------------------------------------------------------------------
    | KRA 4 - Sustained Social Responsibility, Community Involvement
    | and Industry Linkages
    |--------------------------------------------------------------------------
    */

    /*
    |--------------------------------------------------------------------------
    | Community Extension (4.1)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '4.1',
        'title' => '100% sectoral representation in community extension programs',
        'description' => '4.1.1',
        'target' => '100%',
    ],

    [
        'code' => '4.1',
        'title' => 'Conduct at least two full researches per academic unit and at least one from the non-teaching personnel',
        'description' => '4.1.2',
        'target' => '100%',
    ],

    [
        'code' => '4.1',
        'title' => 'Involvement and participation in environmental protection and preservation',
        'description' => '4.1.3',
        'target' => '100%',
    ],

    [
        'code' => '4.1',
        'title' => 'Sustain the Community Tutorial Program and expand to other communities',
        'description' => '4.1.4',
        'target' => '100%',
    ],

    [
        'code' => '4.1',
        'title' => '100% implementation, involvement and participation from all colleges and departments',
        'description' => '4.1.5',
        'target' => '100%',
    ],

    /*
    |--------------------------------------------------------------------------
    | Philippine Linkages (4.2)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '4.2',
        'title' => 'At least one active partnership with government, industry or NGO per academic unit every semester',
        'description' => '4.2.1',
        'target' => '100%',
    ],

    /*
    |--------------------------------------------------------------------------
    | International Linkages (4.3)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '4.3',
        'title' => 'At least one active partnership with an international university per academic unit per semester',
        'description' => '4.3.1',
        'target' => '100%',
    ],

    [
        'code' => '4.3',
        'title' => 'At least one faculty exchange per academic unit',
        'description' => '4.3.2',
        'target' => '100%',
    ],

    [
        'code' => '4.3',
        'title' => 'At least two student exchange programs per academic unit',
        'description' => '4.3.3',
        'target' => '100%',
    ],

    [
        'code' => '4.3',
        'title' => 'At least one collaborative research activity or colloquium activity',
        'description' => '4.3.4',
        'target' => '100%',
    ],

    [
        'code' => '4.3',
        'title' => 'At least fifty foreign students enrolled in academic programs',
        'description' => '4.3.5',
        'target' => '100%',
    ],
    /*
    |--------------------------------------------------------------------------
    | KRA 5 - Holistic Engagement with Students and Other Stakeholders
    |--------------------------------------------------------------------------
    */

    /*
    |--------------------------------------------------------------------------
    | PR and Marketing (5.1)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '5.1',
        'title' => 'At least 300 freshmen students for colleges with single program offering',
        'description' => '5.1.1a',
        'target' => '100%',
    ],

    [
        'code' => '5.1',
        'title' => 'At least 500 freshmen students for colleges with two to three program offerings',
        'description' => '5.1.1b',
        'target' => '100%',
    ],

    [
        'code' => '5.1',
        'title' => 'At least 600 freshmen students for colleges with more than three program offerings',
        'description' => '5.1.1c',
        'target' => '100%',
    ],

    [
        'code' => '5.1',
        'title' => 'At least 100 freshmen students for Juris Doctor',
        'description' => '5.1.1d',
        'target' => '100%',
    ],

    [
        'code' => '5.1',
        'title' => 'At least 600 Grade 11 students with at least 50 students per track',
        'description' => '5.1.1e',
        'target' => '100%',
    ],

    [
        'code' => '5.1',
        'title' => 'Achieve at least 80% student retention',
        'description' => '5.1.2',
        'target' => '80%',
    ],

    [
        'code' => '5.1',
        'title' => 'Submission of College Marketing Plan',
        'description' => '5.1.3',
        'target' => '100%',
    ],

    [
        'code' => '5.1',
        'title' => 'Deployment of university campaign advertisement materials every semester',
        'description' => '5.1.4',
        'target' => '100%',
    ],

    [
        'code' => '5.1',
        'title' => 'Five signed MOAs per academic year with feeder schools',
        'description' => '5.1.5',
        'target' => '100%',
    ],

    /*
    |--------------------------------------------------------------------------
    | Customer Feedback (5.2)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '5.2',
        'title' => 'Deployment of the Best Innovative Procedures Award (BIPA) and customer feedback mechanism in all units',
        'description' => '5.2.1',
        'target' => '100%',
    ],

    [
        'code' => '5.2',
        'title' => 'Response to customer feedback within seven days',
        'description' => '5.2.2',
        'target' => '100%',
    ],

    /*
    |--------------------------------------------------------------------------
    | Guidance and Counseling (5.3)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '5.3',
        'title' => 'Deployment of the Guidance and Counseling Program',
        'description' => '5.3.1',
        'target' => '100%',
    ],

    /*
    |--------------------------------------------------------------------------
    | Student Development and Discipline (5.4)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '5.4',
        'title' => 'Deployment of student-planned extracurricular activities',
        'description' => '5.4.1',
        'target' => '100%',
    ],

    [
        'code' => '5.4',
        'title' => '2% decrease in student violations',
        'description' => '5.4.3',
        'target' => '100%',
    ],

    /*
    |--------------------------------------------------------------------------
    | Gender and Development (5.5)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '5.5',
        'title' => 'Deployment of the Gender and Development Program',
        'description' => '5.5.1',
        'target' => '100%',
    ],

    /*
    |--------------------------------------------------------------------------
    | Sports Development (5.6)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '5.6',
        'title' => '100% involvement in intramural and extramural activities',
        'description' => '5.6.1',
        'target' => '100%',
    ],

    /*
    |--------------------------------------------------------------------------
    | Arts and Culture Development (5.7)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '5.7',
        'title' => 'Organize at least one NTPIF, Faculty or Student Arts and Culture Program per semester',
        'description' => '5.7.1',
        'target' => '100%',
    ],

    /*
    |--------------------------------------------------------------------------
    | Alumni Relations (5.8)
    |--------------------------------------------------------------------------
    */

    [
        'code' => '5.8',
        'title' => 'Strengthen alumni chapters in all academic units',
        'description' => '5.8.1',
        'target' => '100%',
    ],

    [
        'code' => '5.8',
        'title' => 'Organize a university-wide Alumni Homecoming or Reunion every year',
        'description' => '5.8.2',
        'target' => '100%',
    ],

            ];

            foreach ($kpis as $kpi) {

                Kpi::create([
                    'sub_kra_id'      => $subKras[$kpi['code']],
                    'title'           => $kpi['title'],
                    'description'     => $kpi['description'],
                    'target'          => $kpi['target'],
                    'unit_of_measure' => '%',
                    'status'          => 'Approved',
                    'remarks'         => null,
                    'proposed_by'     => 1,
                    'approved_by'     => 1,
                    'approved_at'     => now(),
                ]);

            }
        }
    }