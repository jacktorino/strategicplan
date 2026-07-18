<?php

namespace Database\Seeders;

use App\Models\Kpi;
use App\Models\InnovativeActionPlan;
use Illuminate\Database\Seeder;

class InnovativeActionPlanSeeder extends Seeder
{
    /**
     * KPI code (as stored in the 'description' column of the kpis table,
     * e.g. '1.1.1') => list of innovative action plan titles.
     *
     * Source: UV Strategic Plan AY 2023-2026.
     */
    protected array $actionPlans = [
        // KRA 1: EFFICIENT AND EFFECTIVE GOVERNANCE, MANAGEMENT AND LEADERSHIP
        '1.1.1' => [
            'Upload the VMO in the website, official social media accounts, and post in the conspicuous places/areas in the University Campuses.',
            'Upload the PQF Levels 6 - 8 Descriptors and the UV Institutional Learning Outcomes in the website, official social media accounts, and post in the conspicuous places/areas in the University Campuses.',
            'Integrate in the course syllabi and activities of all programs across campuses, colleges and units.',
            "Integration in all classes' orientation and recitation in all units' regular meetings.",
        ],
        '1.1.2' => [
            'Upload the 17 UNSDG in the website, official social media accounts, and post in the conspicuous places/areas in the University Campuses.',
            'Integrate in the course syllabi and activities of all programs across campuses, colleges and units.',
            "Integration in all classes' orientation and recitation in all units' regular meetings.",
        ],
        '1.1.3' => [
            "Senior leaders and stakeholders participate actively in the scheduled Quality Assurance Review and Planning towards continuous improvement and stakeholder's satisfaction.",
            'Regularly recognize the valuable contribution of the stakeholders.',
        ],
        '1.1.4' => [
            'Undertake audit procedures on data privacy.',
            'Implement Awareness Program for employees to improve privacy knowledge, skills, attitude, and behavior.',
            "Install much-needed security software's to protect data on all devices used in the University and its satellite campuses.",
        ],
        '1.2.1' => [
            'Senior Leaders should chair/vice chair/member of at least one (1) university/college committee.',
            'Ensure continuity of involvement in university committee leaderships memberships by assigning assistants or associates to every senior leader occupying chairmanship positions in various committees.',
        ],
        '1.2.2' => [
            'Conduct periodic implementation audit of 5S in the different units across all campuses.',
            'Conduct Capacity-Building for 5S Implementers.',
        ],
        '1.2.3' => [
            'Organize and orient employees on the policies and procedures of the University Quality Circles.',
            'Deployment of the policies and procedures of the University Quality Circles.',
        ],
        '1.3.1' => [
            'Conduct training needs assessment as a basis in crafting the learning and development program for non-teaching.',
            'Attend and complete at least one online training/webinar aligned to the job function.',
        ],
        '1.3.2' => [
            'Conduct training assessment as basis crafting of the development program needs in the faculty.',
            'Attendance to at least one online training or webinar aligned to the field of specialization.',
            'Include Faculty Immersion program and have it implemented during Special Period.',
        ],
        '1.4.1' => [
            'Efficient and regular use of corporate emails and online systems in inter-office communication by customizing Office 365 features and applications for a secured and reliable communication processes.',
            'Establish a contingency communication plan with due consideration on security for unexpected challenges.',
        ],
        '1.5.1' => [
            'Prepare a campus development plan.',
        ],
        '1.5.2' => [
            'Monitoring of the campus development plan implementation.',
        ],
        '1.6.1' => [
            'Maintain regularly an updated website and automation system.',
        ],
        '1.6.2' => [
            'Maintain regularly an upgraded IT infrastructure.',
            "Install much-needed security software's to protect data on all devices used in the University and its satellite campuses.",
            'Host secured systems over the cloud.',
        ],
        '1.7.1' => [
            'Efficient deployment of cashless payment scheme.',
            "Close monitoring of students' accounts and consistent reminders to students.",
            'Strengthen partnership/linkages with financing intermediaries who could offer educational loans to students.',
            'Integrate the available payment channels in the Enrolment system.',
            'Create a University Communication System to update students on their school fees.',
        ],
        '1.7.2' => [
            'Monitor daily status report of online collections to ensure on time and accurate posting of student online payments.',
        ],
        '1.7.3' => [
            'Monitoring of the actual expenditures versus approved budget.',
            'Create and integrate the purchasing system to the existing accounting system (Ledgea).',
            'Submission of weekly Purchase monitoring sheet to track status of request.',
        ],
        '1.8.1' => [
            'Regular review of compliance to standards and submit action plan to address gaps.',
        ],
        '1.8.2' => [
            'Regular review of compliance to standards and submit action plan to address gaps.',
        ],
        '1.8.3' => [
            'Compliance to standards and submit action plan to address gaps.',
        ],
        '1.8.4' => [
            'Regular review of compliance to standards and submit action plan to address gaps.',
        ],
        '1.8.5' => [
            'All quality circles to review requirements and submit action plans to address gaps.',
        ],
        '1.8.6' => [
            'Monitoring, review and evaluation on the compliance to ISO 9001:2015 standards.',
        ],
        '1.8.7' => [
            'Identify, train and capacitate faculty members to take the assessments to with TESDA qualify assessors.',
        ],

        // KRA 2: QUALITY RESEARCH AND KNOWLEDGE MANAGEMENT
        '2.1.1' => [
            'Creation of a core team among research coordinators, teaching and non-teaching personnel.',
            'Conduct weekly research didactics for the faculty.',
        ],
        '2.1.2' => [
            "Conduct Discipline-Specific Research Capability Trainings and Workshops per Semester for every College/Program including non-teaching staffs based on the results of the need's assessment survey.",
            'Produce outputs which uses NETNOGRAPHY research design and big data analysis.',
        ],
        '2.1.3' => [
            'Publish research outputs in the college research journal.',
        ],
        '2.1.4' => [
            'Forge collaboration researches among different disciplines in the university.',
        ],
        '2.1.5' => [
            'Conduct a training and workshop on writing a publishable format research.',
        ],
        '2.1.6' => [
            'Innovate curricula and improve learning outcomes and graduate competencies.',
        ],
        '2.1.7' => [
            'Modify thesis/dissertation format to become IMRAD-ready.',
        ],
        '2.2.1' => [
            'Prepare a Knowledge Management Manual containing forms and SOPPs based on the listed processes and procedures.',
            'Deployment of Knowledge Management System activities per unit.',
            'Include in KM System in the scheduled re-orientation program.',
            'Include KPI of Knowledge Management in the Performance Evaluation per unit.',
            'Introduce knowledge management programs to the Visayanian community through exposure of programs to e-media channels.',
        ],
        '2.3.1' => [
            'Beef up collections of printed resources in collaboration with the academic units.',
        ],
        '2.3.2' => [
            'Improve collections of relevant electronic resources by participating in consortium with other universities.',
        ],
        '2.3.3' => [
            'Integrate the library management system in the university website.',
            'Create infographics (digital library guides) to encourage all faculty and students to fully maximize the utilization of all library resources and services.',
        ],
        '2.3.4' => [
            'Require all full-time faculty to borrow at least two books per month and access the e-learning resources through the library management system.',
        ],
        // Source document lists two KPIs both numbered "2.3.5" with distinct
        // text (students vs. non-teaching personnel); the seeder disambiguates
        // the second one as '2.3.5B'.
        '2.3.5' => [
            'Require all the students to borrow at least two books per month and access the e-learning resources through the library management system.',
        ],
        '2.3.5B' => [
            'Require the non-teaching personnel to visit the ARC and/or access the library management system and utilize the available resources.',
        ],
        '2.3.6' => [
            'Sets criteria for the recognition and prepares monitoring matrix on ARC resources utilization.',
        ],

        // KRA 3: INNOVATIVE AND EXCELLENT TEACHING AND LEARNING
        '3.1.1' => [
            'Strictly comply with the CHED minimum academic qualifications hiring personnel for academic position.',
            'Encourage the academic personnel to avail of the educational scholarship.',
            'Craft a 5-year faculty development plan and monitors its implementation.',
        ],
        '3.1.2' => [
            'Regularly evaluate the faculty using the revised/updated performance evaluation tool.',
            'Automated Faculty Evaluation System integrated with the Student Portal.',
        ],
        '3.1.3' => [
            'Require all full-time faculty to be involved as member or officer in a professional organization that is aligned to their discipline.',
        ],
        '3.1.4' => [
            'Homeroom organization in regular classes.',
        ],
        '3.1.5' => [
            'Faculty responds to the call for ranking, send application and submit with the required evidence for ranking.',
        ],
        '3.2.1' => [
            'Prepare a curriculum validation policy.',
            'Conduct a curriculum validation before the end of each semester.',
            'Develop an automated system embedded in the UV ACCESS LMS as part of the course compliance.',
        ],
        '3.2.2' => [
            'Conduct a curriculum evaluation every four or five years.',
            'Conduct seminar/workshop/training for all the prospective participants (IAAC members) on the conduct of the curriculum review and evaluation.',
        ],
        '3.2.3' => [
            'Prepare selective retention policies for all programs.',
            'Compliance to selective retention policies in all programs.',
            'Integrate in the University website the retention policy of each program.',
        ],
        '3.2.4' => [
            'Deployment of board exam prep policy.',
        ],
        '3.2.5' => [
            'Capacitate and train faculty to deliver the external certification programs.',
            'Establish partnership with agencies/institution providing certification programs.',
        ],
        '3.2.6' => [
            'Verify with TESDA available NC programs aligned to the programs offered.',
        ],
        '3.2.7' => [
            "Identify students who will compose the quality circle per college/per year level and organize them according to the Students' Quality circle policy.",
        ],
        '3.2.8' => [
            'Orient students on the types of civil service exam and career advancement in terms of qualification.',
            'Facilitate application the civil service examination in both procedure Pencil and Paper Test and Computer Based Examination.',
        ],
        '3.2.9' => [
            'Prepare an intervention program across all academic units.',
        ],
        '3.2.10' => [
            'Prepare an intervention program across all year level.',
        ],
        '3.3.1' => [
            'Develop Online Course Module per program per College in the Office 365 and Open LMS.',
            'Develop Hyflex Learning Strategy in all colleges.',
            'Provide professional development training courses on ICT for faculty and staff (e.g. AI, KM, IoT, data science).',
            'Retooling on integration of MS Teams in the LMS (UV ACCESS).',
            'Strategic partnership with technology companies through MOA and MOU.',
            'Integrate AI/Robotics in all courses.',
        ],
        '3.4.1' => [
            'Monitor graduates to document their employment, engagement to entrepreneurial activities, or pursuit to further studies.',
            'Provide incentive to encourage graduates to give feedback when they get a job after their graduation.',
            'Conduct a regular job fair in collaboration with industry partners and document those hired on the spot.',
        ],
        '3.4.2' => [
            'Identify local and international companies and start networking for partnerships.',
            'Build collaborative programs that are mutually beneficial with the industry and the college/university.',
        ],
        '3.4.3' => [
            'Initiate the conduct of the annual graduate tracer studies.',
            'Collaborate with the colleges & alumni affairs in the deployment of the graduate tracer survey questionnaire.',
            'Utilize data gathered from the tracer study and convert into a research paper in coordination with the CRI.',
            'Cascade results to the colleges as an input to improve programs.',
        ],

        // KRA 4: SUSTAINED SOCIAL RESPONSIBILITY, COMMUNITY INVOLVEMENT AND INDUSTRY LINKAGES
        '4.1.1' => [
            'Involvement of all stakeholders.',
        ],
        '4.1.2' => [
            'Conduct at least one (1) extension programs from these researches.',
        ],
        '4.1.3' => [
            'Develop programs related to Environment Protection and Conservation.',
        ],
        '4.1.4' => [
            'Sustain the community tutorial and expand to other surrounding communities.',
        ],
        '4.1.5' => [
            'Participation of the COMEX representative, faculty and student representatives per program, and the college dean from planning to evaluation.',
            'Posting of COMEX activities in UV FB page and website.',
        ],
        '4.2.1' => [
            'Document all networking with national and regional organizations by all academic units.',
        ],
        '4.3.1' => [
            'Document all networking with international organizations by all academic units.',
        ],
        '4.3.2' => [
            'Deployment of activities stipulated in the MOA/MOU.',
        ],
        '4.3.3' => [
            'Deployment of activities stipulated in the MOA/MOU.',
        ],
        '4.3.4' => [
            'Deployment of activities stipulated in the MOA/MOU.',
        ],
        '4.3.5' => [
            'Produce at least one for each types of campaigns (commercial, reputation, education/awareness and social action) per semester.',
            'Develop at least one campaign per semester intended for the international market.',
        ],

        // KRA 5: HOLISTIC ENGAGEMENT WITH STUDENTS AND OTHER STAKEHOLDERS
        '5.1.1a' => [
            'Conduct FGD as one of the tools to get feedback and inputs.',
            'Increase field marketing campaign to private academic institutions.',
            'Create more page engagements in Facebook in a daily/weekly basis to reach more page likes and follows, and expand in other social media for advertisement and promotion.',
            'Create an enhanced "enroll now, pay later" scheme, sponsorship programs, for them to pursue their studies.',
        ],
        '5.1.2' => [
            "Implement JRG's \"Himunga-an System\".",
            "Strengthen students' academic advising.",
            "Sustain students' positive experiences through the exceptional customer services throughout all units.",
        ],
        '5.1.3' => [
            'Conduct webinars and prepare Marketing Plan.',
        ],
        '5.1.4' => [
            'Produce at least one for each types of campaigns (commercial, reputation, education/awareness and social action) per semester.',
            'Develop at least one campaign per semester intended for the international market.',
        ],
        '5.1.5' => [
            'Seal at least five (5) Feeder School Partnership per academic year.',
        ],
        '5.2.1' => [
            'Strengthen feedback system thru the university online portal and other mechanisms where stakeholders can convey service satisfaction and experiences.',
        ],
        '5.2.2' => [
            'Timely feedback system thru the university online portal and other mechanisms where stakeholders can convey service satisfaction and experiences.',
            'Orient Internal Stakeholders on the various feedback mechanisms and the Standards Operating Policies and Procedures on Customer Feedback Facilitation.',
            'Create customer feedback committee comprising of employees from Academic units, Support Service Offices, President of SSC to realize sincere involvement.',
        ],
        '5.3.1' => [
            'Sustain the Implementation of Guidance and Counseling program through Flexible Deployment Program.',
            'Link with the different private or government agencies offering Psychological Assessment, Debriefing and Medical Assistance and refer students with special needs to specialists concerned.',
            'Partner with industries or companies on the deployment of CIP.',
            'Implement peer counseling program.',
        ],
        '5.4.1' => [
            'Participate in inter-school competitions which give opportunity for students to exhibit and unleash their talents and potentials.',
        ],
        '5.4.3' => [
            'Developmental Program Plan on student discipline that counters the challenges of the new normal.',
            'Sustain monitoring mechanism of student behavioral concerns.',
            "Conduct regular awareness drive on the digital mechanisms for monitoring students' behavior.",
        ],
        '5.5.1' => [
            "Create gender inclusive teaching materials and resources for teachers to enhance teacher's classroom discussion.",
        ],
        '5.6.1' => [
            "Organize sports leagues among the system schools by the support of the school's linkages and broadcast those though online platforms for global audience.",
            'Create Virtual Intramural activities for students & other stakeholders with support of the alumni and sponsors.',
            'Invite alumni and company representatives as resource speakers on fitness and sports related webinars.',
            'Initiate, reconnect and create linkages with the former sponsors and alumni.',
        ],
        '5.7.1' => [
            'Create Culture and Arts development program plan.',
            'Create Virtual platform for Cultural & Artistic performances and Exhibitions.',
            'Create virtual and in-person cultural and artistic performances and exhibitions.',
            'Intensify the promotion of the Arts and Culture activities by increasing social media engagement.',
        ],
        '5.8.1' => [
            'Creation of chapter alumni developmental plan in all academic units.',
            'Creation of International Alumni Chapter.',
        ],
        '5.8.2' => [
            'Conduct Alumni Homecoming/reunion activities.',
        ],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $created = 0;

        foreach ($this->actionPlans as $code => $titles) {
            // IMPORTANT: 'description' is where the KPI code (e.g. '1.1.1')
            // is stored, so we match against it directly.
            $kpi = Kpi::where('description', $code)->first();

            if (! $kpi) {
                $this->command->warn("KPI Code {$code} not found in database.");
                continue;
            }

            foreach ($titles as $title) {
                InnovativeActionPlan::firstOrCreate([
                    'kpi_id' => $kpi->id,
                    'title' => $title,
                ]);
                $created++;
            }
        }

        $this->command->info("Innovative action plans seeded: {$created}");
    }
}