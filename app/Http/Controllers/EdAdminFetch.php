<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use App\Models\User;
use App\Models\StudentParent;
use App\Models\Mentor;


class EdAdminFetch extends Controller
{
    private $request;
    private string $url;
    private array $staff;
    private array $mentorSubjects;
    private array $mentors;
    private array $parents;
    private array $students;
    private array $mentor_groups;
    private array $student_classes;
    /**
     * Fetch data from the EdAdmin API.
     */
    public function __invoke()
    {
        // Fetch data from the EdAdmin API
        $this->url = env('EDADMIN_URL');
        $this->fetchStaff();
        $this->fetchSubjectSetup();
        $this->fetchStaffClasses();
        $this->fetchParents();
        $this->fetchStudentClasses();
        $this->fetchStudentSubjects();
        $this->fetchStudents();  
    }

    private function fetchStaff():void
    {
        // Logic to fetch staff from EdAdmin API
        $response = Http::withHeaders([
            'Authorization' => env('EDADMIN_API_KEY'),
        ])->withQueryParameters([
            'query' => 'Staff',
            'campus' => 'High School',
        ])->get($this->url);
        if($response->ok()){
            $staff = $response->body();
            $xml = simplexml_load_string($staff);
            $json = json_encode($xml);
            $staff_array = json_decode($json,TRUE);
            $this->staff = $staff_array['Staff'];
            if(is_array($this->staff)){
                foreach($this->staff as $staff_member){
                    if($staff_member['StatusName'] !== 'Current'){
                        $staffMember = User::where('edadmin_id', $staff_member['ID'])->first();
                        if($staffMember){
                            $staffMember->staffRole()->delete();
                            $staffMember->delete();
                        }
                        continue;
                    }
                    if($staffMember = User::where('edadmin_id', $staff_member['ID'])->first()){
                       $staffMember->update([
                            'first_name' => $staff_member['FirstName'],
                            'last_name' => $staff_member['LastName'],
                            'email' => $staff_member['Email'],
                       ]);
                    }
                    else{
                        $staffMember = User::create([
                            'first_name' => $staff_member['FirstName'],
                            'last_name' => $staff_member['LastName'],
                            'email' => $staff_member['Email'],
                            'type' => 'staff',
                            'edadmin_id' => $staff_member['ID'],
                        ]);
                    }
                    if($staffMember->wasRecentlyCreated){
                        // Create associated staff role record
                        $staffMember->staffRole()->create([
                            'user_id' =>$staffMember->id,
                            'role' => 'staff',
                        ]);
                    }
                }
            }
        }
    }

    private function fetchSubjectSetup():void
    {
        // Logic to fetch subject setup from EdAdmin API
        $response = Http::withHeaders([
            'Authorization' => env('EDADMIN_API_KEY'),
        ])->withQueryParameters([
            'query' => 'SubjectSetup',
            'campus' => 'High School',
        ])->get($this->url);
        if($response->ok()){
            $subject_setup = $response->body();
            $xml = simplexml_load_string($subject_setup);
            $json = json_encode($xml);
            $subject_setup_array = json_decode($json,TRUE);
            $mentorSubjects = array_filter($subject_setup_array['SubjectSetup'], function($subject) {
                return $subject['SubjName'] === 'Mentor';
            });
            $this->mentorSubjects = array_map(function($subject) {
                return $subject['ID'];
            }, $mentorSubjects);
        }
    }

    private function fetchStaffClasses():void
    {
        // Logic to fetch staff classes from EdAdmin API
        $response = Http::withHeaders([
            'Authorization' => env('EDADMIN_API_KEY'),
        ])->withQueryParameters([
            'query' => 'EducatorSubjects',
            'campus' => 'High School',
        ])->get($this->url);
        if($response->ok()){
            $staff_classes = $response->body();
            $xml = simplexml_load_string($staff_classes);
            $json = json_encode($xml);
            $staff_classes_array = json_decode($json,TRUE);
            $this->mentors = array_filter($staff_classes_array['StaffClasses'], function($class) {
                return in_array($class['SubjectID'], $this->mentorSubjects);
            });
        }
    }

    private function fetchParents():void
    {
        // Logic to fetch parents from EdAdmin API
        $response = Http::withHeaders([
            'Authorization' => env('EDADMIN_API_KEY'),
        ])->withQueryParameters([
            'query' => 'Parents',
            'campus' => 'High School',
        ])->get($this->url);
        if($response->ok()){
            $parents = $response->body();
            $xml = simplexml_load_string($parents);
            $json = json_encode($xml);
            $parents_array = json_decode($json,TRUE);
            $this->parents = $parents_array['Parents'];
            if(is_array($this->parents)){
                foreach($this->parents as $parent){
                    if($parent['FEmail']){
                        $user=User::updateOrCreate(
                            ['edadmin_id' => $parent['ID']],
                            [
                                'first_name' => $parent['FatherFName'],
                                'last_name' => $parent['FatherLName'],
                                'email' => $parent['FEmail'],
                                'type' => 'parent',
                            ]
                        );
                        if($user->wasRecentlyCreated){
                            // Create associated parent login record
                            $user->parentLogin()->create([
                                'user_id' => $user->id,
                            ]);
                        }
                    }
                    if($parent['MEmail']){
                        $user=User::updateOrCreate(
                            ['edadmin_id' => $parent['ID']],
                            [
                                'first_name' => $parent['MotherFName'],
                                'last_name' => $parent['MotherLName'],
                                'email' => $parent['MEmail'],
                                'type' => 'parent',
                            ]
                        );
                        if($user->wasRecentlyCreated){
                            // Create associated parent login record
                            $user->parentLogin()->create([
                                'user_id' => $user->id,
                            ]);
                        }
                    }
                }
            }
        }
    }
   

    private function fetchStudentClasses()
    {
        // Logic to fetch student classes from EdAdmin API
        $response = Http::withHeaders([
            'Authorization' => env('EDADMIN_API_KEY'),
        ])->withQueryParameters([
            'query' => 'StudentClasses',
            'campus' => 'High School',
        ])->get($this->url);
        if($response->ok()){
            $student_classes = $response->body();
            $xml = simplexml_load_string($student_classes);
            $json = json_encode($xml);
            $student_classes_array = json_decode($json,TRUE);
            $this->student_classes = $student_classes_array['StudentClasses'];
        }
    }

    private function fetchStudentSubjects()
    {
        // Logic to fetch student subjects from EdAdmin API
        $response = Http::withHeaders([
            'Authorization' => env('EDADMIN_API_KEY'),
        ])->withQueryParameters([
            'query' => 'StudentSubjects',
            'campus' => 'High School',
        ])->get($this->url);
        if($response->ok()){
            $student_subjects = $response->body();
            $xml = simplexml_load_string($student_subjects);
            $json = json_encode($xml);
            $student_subjects_array = json_decode($json,TRUE);
            $student_subjects = $student_subjects_array['StudentSubjects'];
            $this->mentor_groups = array_filter($student_subjects,function($subject){
                return in_array($subject['SubjectSetupID'], $this->mentorSubjects);
            });
        }
    }   
    private function fetchStudents():void
    {
        // Logic to fetch students from EdAdmin API
        $response = Http::withHeaders([
            'Authorization' => env('EDADMIN_API_KEY'),
        ])->withQueryParameters([
            'query' => 'Students',
            'campus' => 'High School',
        ])->get($this->url);
        if($response->ok()){
            $students = $response->body();
            $xml = simplexml_load_string($students);
            $json = json_encode($xml);
            $students_array = json_decode($json,TRUE);
            $this->students = $students_array['Students'];
            $this->processStudents();
        }
    }

    private function processStudents(){
        foreach($this->students as $student){
            $user=User::updateOrCreate(
                ['edadmin_id' => $student['ID']],
                [
                    'first_name' => $student['FirstName'],
                    'last_name' => $student['LastName'],
                    'email' => $student['Email'],
                    'type' => 'student',
                ]
            );
            $parents = User::where('edadmin_id', $student['ParentID'])->get();
            $parentIds = $parents->pluck('id')->toArray();
            $parentJson = json_encode($parentIds);
            $gradeObj = array_find($this->student_classes, function($class) use ($student) {
                return $class['StudentID'] === $student['ID'];
            });
            $grade = $gradeObj ? $gradeObj['Grade'] : null;
            if($user->wasRecentlyCreated){
                // Create associated student record
                $user->student()->create([
                    'grade' => $grade,
                    'edadmin_id' => $student['ID'],
                    'avatar' =>  null,
                    'parents_id' => $parentJson,
                ]);
            } else {
                // Update existing student record
                $user->student()->update([
                    'grade' => $grade,
                    'edadmin_id' => $student['ID'],
                    'parents_id' => $parentJson,
                ]);
            }
            foreach($parentIds as $parentId){
                StudentParent::updateOrCreate(
                    ['student_id' => $user->id, 'parent_id' => $parentId]
                );
            }
            $mentorGroup = array_find($this->mentor_groups, function($group) use ($student) {
                return $group['StudentID'] === $student['ID'];
            });
            $mentor = array_find($this->mentors, function($mentor) use ($mentorGroup) {
                return $mentor['SubjectID'] === $mentorGroup['SubjectSetupID'];
            });
            if($mentor){
                $mentorUser = User::where('edadmin_id', $mentor['StaffID'])->first();
                if($mentorUser){
                    Mentor::createOrUpdate(
                        ['student_id' => $user->id,'user_id' => $mentorUser->id]
                    );
                }
            }
        }
    }
/* 
"ID" => "26208"
      "LastName" => "Zar"
      "FirstName" => "Elijah"
      "MiddleName" => []
      "BirthDate" => "2005-09-05T00:00:00"
      "PassNo" => "0509055501084"
      "Gender" => "1"
      "Photo" => "26208.jpg"
      "ParentID" => "11860"
      "Email" => "ezar23@herzlia.com" */
}