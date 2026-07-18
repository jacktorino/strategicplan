<?php

namespace Database\Seeders;

use App\Models\ResponsibleUnit;
use Illuminate\Database\Seeder;

class ResponsibleUnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [

            /*
            |--------------------------------------------------------------------------
            | Administrative Offices
            |--------------------------------------------------------------------------
            */

            ['name' => 'Corporate Planning and Development', 'acronym' => 'CPAD'],
            ['name' => 'Quality Management System Office', 'acronym' => 'QMSO'],
            ['name' => 'Quality Management System', 'acronym' => 'QMS'],
            ['name' => 'Facilities Management Department', 'acronym' => 'FMD'],
            ['name' => 'Finance and Accounting Department', 'acronym' => 'FAD'],
            ['name' => 'Information and Communications Technology Department', 'acronym' => 'ICTD'],
            ['name' => 'Human Resource Department', 'acronym' => 'HRD'],
            ['name' => 'Center for Research and Innovation', 'acronym' => 'CRI'],
            ['name' => 'Academic Resource Center', 'acronym' => 'ARC'],
            ['name' => 'Center for Innovative Education', 'acronym' => 'CIE'],
            ['name' => 'Community Extension Office', 'acronym' => 'COMEX'],
            ['name' => 'International Affairs Department', 'acronym' => 'IAD'],
            ['name' => 'Student Affairs and Services Center', 'acronym' => 'SASC'],
            ['name' => 'Alumni Affairs', 'acronym' => 'ALUMNI'],
            ['name' => 'Data Privacy Office', 'acronym' => 'DPO'],
            ['name' => 'Deputy Quality Management Representative', 'acronym' => 'DQMR'],
            ['name' => 'Internal Quality Audit', 'acronym' => 'IQA'],
            ['name' => 'Arts and Culture Development', 'acronym' => 'ACD'],
            ['name' => 'University of the Visayas Alumni Association Inc.', 'acronym' => 'UVAAI'],
            ['name' => 'Student Records Management Department', 'acronym' => 'SRMD'],
            /*
            |--------------------------------------------------------------------------
            | Colleges / Academic Units
            |--------------------------------------------------------------------------
            */

            ['name' => 'College of Arts and Sciences', 'acronym' => 'CAS'],
            ['name' => 'College of Business and Accountancy', 'acronym' => 'CBA'],
            ['name' => 'College of Education', 'acronym' => 'COED'],
            ['name' => 'College of Engineering, Architecture and Technology', 'acronym' => 'CETA'],
            ['name' => 'College of Criminal Justice Education', 'acronym' => 'CCJE'],
            ['name' => 'College of Allied Health Sciences', 'acronym' => 'CAHS'],
            ['name' => 'College of Maritime Education', 'acronym' => 'COME'],

            /*
            |--------------------------------------------------------------------------
            | Common Groups
            |--------------------------------------------------------------------------
            */

            ['name' => 'Academic Units', 'acronym' => null],
            ['name' => 'All Academic Units', 'acronym' => null],
            ['name' => 'Academic Units (Per College)', 'acronym' => null],
            ['name' => 'Academic Units (Per Program)', 'acronym' => null],

            ['name' => 'Non-Academic Units', 'acronym' => null],
            ['name' => 'Academic and Non-Academic Units', 'acronym' => null],

            ['name' => 'Quality Circles', 'acronym' => null],

            /*
            |--------------------------------------------------------------------------
            | Other Units
            |--------------------------------------------------------------------------
            */

            // ['name' => 'President\'s Office', 'acronym' => null],
   
            // ['name' => 'Accounting Office', 'acronym' => 'ACCOUNTING'],
            // ['name' => 'Cashier', 'acronym' => 'CASHIER'],
            // ['name' => 'Procurement Office', 'acronym' => 'PROCUREMENT'],
            // ['name' => 'Guidance Office', 'acronym' => 'GUIDANCE'],
            // ['name' => 'Library', 'acronym' => 'LIBRARY'],
            // ['name' => 'Security Office', 'acronym' => 'SECURITY'],
            // ['name' => 'Clinic', 'acronym' => 'CLINIC'],
            // ['name' => 'Physical Plant Office', 'acronym' => 'PPO'],
        ];

        foreach ($units as $unit) {
            ResponsibleUnit::updateOrCreate(
                ['name' => $unit['name']],
                [
                    'acronym' => $unit['acronym'],
                ]
            );
        }
    }
}