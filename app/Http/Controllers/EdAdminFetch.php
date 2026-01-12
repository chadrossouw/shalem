<?php
namespace App\Http\Controllers;
ini_set('max_execution_time', 900);
use Illuminate\Support\Facades\Http;
use App\Models\User;
use App\Models\StudentParent;
use App\Models\Mentor;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;


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
       // $this->fetchParents();
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
            $all_staff = User::where('type','staff')->get();
            $all_staff_w_trashed = User::withTrashed()->where('type','staff')->get();
            if(is_array($this->staff)){
                foreach($this->staff as $staff_member){
                    try{
                        if($staff_member['StatusName'] !== 'Current'){
                            $staffMember = User::where('edadmin_id', $staff_member['ID'])->first();
                            if($staffMember){
                                $staffMember->delete();
                            }
                            continue;
                        }
                        if($staffMember = $all_staff_w_trashed->where('edadmin_id', $staff_member['ID'])->first()){
                            if ($staffMember->trashed()) {
                                $staffMember->restore();
                            }
                            $new = $staffMember->first_name !== $staff_member['FirstName'] || $staffMember->last_name !== $staff_member['LastName'] || $staffMember->email !== $staff_member['Email'] || $staffMember->honorific !== $staff_member['Title'];
                            if($new){
                                $staffMember->update([
                                        'first_name' => $staff_member['FirstName'] ?: '',
                                        'last_name' => $staff_member['LastName'] ?: '',
                                        'email' => $staff_member['Email'] ?: '',
                                        'honorific' => $staff_member['Title'] ?: '',
                                ]);
                            }
                        }
                        else{
                            $staffMember = User::create([
                                'first_name' => $staff_member['FirstName'] ?: '',
                                'last_name' => $staff_member['LastName'] ?: '',
                                'honorific' => $staff_member['Title'] ?: '',
                                'email' => $staff_member['Email'] ?: '',
                                'type' => 'staff',
                                'edadmin_id' => $staff_member['ID'],
                                'password' => bcrypt(Str::random(16)),
                                'email_verified_at' => now(),
                            ]);
                        }
                        if($staffMember->wasRecentlyCreated){
                            // Create associated staff role record
                            $staffMember->staffRole()->create([
                                'user_id' =>$staffMember->id,
                                'role' => 'staff',
                            ]);
                        }
                        if($all_staff->contains('id', $staffMember->id)){
                            //Get rid of processed staff from the old staff list
                            $all_staff = $all_staff->reject(function($user) use ($staffMember) {
                                return $user->id === $staffMember->id;
                            });
                        }
                    } catch (\Exception $e) {
                        // Log the error or handle it as needed
                        Log::error('Error processing staff member: ' . $e->getMessage());
                        continue;
                    }
                }
            }
            if($all_staff->isNotEmpty()){
                foreach($all_staff as $old_staff){
                    $role = $old_staff->staffRole;
                    if($role && $role->role==='superadmin'){
                        continue;
                    }
                    try{
                        $old_staff->delete();
                    } catch (\Exception $e) {
                        // Log the error or handle it as needed
                        Log::error('Error deleting old staff member: ' . $e->getMessage());
                        continue;
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
            $this->mentors = array_filter($staff_classes_array['EducatorSubjects'], function($class) {
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
            $all_parents = User::where('type','parent')->get();
            $all_parents_w_trashed = User::withTrashed()->where('type','parent')->get();
            $all_staff=User::where('type','staff')->get();
            if(is_array($this->parents)){
                foreach($this->parents as $parent){
                    try{
                        if($parent['MEmail']){
                            if($user = $all_staff->where('email', $parent['MEmail'])->first()){
                                $user->parent_id = $parent['ID'];
                                $user->save();
                                continue;
                            }
                            $user=$all_parents_w_trashed->where('edadmin_id', $parent['ID'].'_2')->first();
                            if($user){
                                if ($user->trashed()) {
                                    $user->restore();
                                }
                                $new = $user->first_name !== $parent['MotherFName'] || $user->last_name !== $parent['MotherLName'] || $user->email !== $parent['MEmail'];
                                if($new){
                                    $user->update([
                                        'first_name' => $parent['MotherFName'] ?: '',
                                        'last_name' => $parent['MotherLName'] ?: '',
                                        'email' => $parent['MEmail'] ?: '',
                                    ]);
                                }
                            }
                            else{
                                $user=User::create([
                                    'first_name' => $parent['MotherFName'] ?: '',
                                    'last_name' => $parent['MotherLName'] ?: '',
                                    'email' => $parent['MEmail'] ?: '',
                                    'type' => 'parent',
                                    'edadmin_id' => $parent['ID'].'_2',
                                    'password' => bcrypt(Str::random(16)),
                                    'email_verified_at' => now(),
                                ]);
                            }
                            if($all_parents->contains('id', $user->id)){
                                $all_parents = $all_parents->reject(function($parent) use ($user) {
                                    return $parent->id === $user->id;
                                });
                            }
                        }
                        if($parent['FEmail']&& $parent['FEmail'] !== $parent['MEmail']){
                            if($user = $all_staff->where('email', $parent['FEmail'])->first()){
                                $user->parent_id = $parent['ID'];
                                $user->save();
                                continue;
                            }
                            $user=$all_parents_w_trashed->where('edadmin_id', $parent['ID'].'_1')->first();
                            if($user){
                                if ($user->trashed()) {
                                    $user->restore();
                                }
                                $new = $user->first_name !== $parent['FatherFName'] || $user->last_name !== $parent['FatherLName'] || $user->email !== $parent['FEmail'];
                                if($new){
                                    $user->update([
                                        'first_name' => $parent['FatherFName'] ?: '',
                                        'last_name' => $parent['FatherLName'] ?: '',
                                        'email' => $parent['FEmail'] ?: '',
                                    ]);
                                }
                            }
                            else{
                                $user = User::create([
                                    'first_name' => $parent['FatherFName'] ?: '',
                                    'last_name' => $parent['FatherLName'] ?: '',
                                    'email' => $parent['FEmail'] ?: '',
                                    'type' => 'parent',
                                    'edadmin_id' => $parent['ID'].'_1',
                                    'password' => bcrypt(Str::random(16)),
                                    'email_verified_at' => now(),
                                ]);  
                            }
                            if($all_parents->contains('id', $user->id)){
                                $all_parents = $all_parents->reject(function($parent) use ($user) {
                                    return $parent->id === $user->id;
                                });
                            }   
                        } 
                    } catch (\Exception $e) {
                        // Log the error or handle it as needed
                        Log::error('Error processing parent: ' . $e->getMessage());
                        continue;
                    }
                }
            }
            if($all_parents->isNotEmpty()){
                foreach($all_parents as $old_parent){
                    try{
                        $old_parent->delete();
                    } catch (\Exception $e) {
                        // Log the error or handle it as needed
                        Log::error('Error deleting old parent: ' . $e->getMessage());
                        continue;
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
        $all_students = User::where('type','student')->get();
        $all_students_w_trashed = User::withTrashed()->where('type','student')->get();
        $all_staff=User::where('type','staff')->get();
        $all_parents=User::where('type','parent')->orWhere('parent_id', '!=', null)->get();
        $all_parent_students=StudentParent::all();
        $all_mentors=Mentor::all();
        foreach($this->students as $student){
            try{
                $user = $all_students_w_trashed->where('edadmin_id', $student['ID'])->first();
                if($user){
                    if ($user->trashed()) {
                        $user->restore();
                    }
                    $new = $user->first_name !== $student['FirstName'] || $user->last_name !== $student['LastName'] || $user->email !== $student['Email'];
                    if($new){
                        $user->update([
                            'first_name' => $student['FirstName'] ?: '',
                            'last_name' => $student['LastName'] ?: '',
                            'email' => $student['Email'] ?: '',
                        ]);
                    }
                }
                else{
                    $user = User::create([
                        'first_name' => $student['FirstName'] ?: '',
                        'last_name' => $student['LastName'] ?: '',
                        'email' => $student['Email'] ?: '',
                        'type' => 'student',
                        'edadmin_id' => $student['ID'],
                        'password' => bcrypt(Str::random(16)),
                        'email_verified_at' => now(),
                    ]);  
                }
            } catch (\Exception $e) {
                // Log the error or handle it as needed
                Log::error('Error processing student: ' . $e->getMessage());
                continue;
            }
            if($all_students->contains('id', $user->id)){
                //Get rid of processed students from the old student list
                $all_students = $all_students->reject(function($student) use ($user) {
                    return $student->id === $user->id;
                });
            }
            $parent_1 = $all_parents->where('edadmin_id', $student['ParentID'].'_1')->first() ?: $all_parents->where('parent_id', $student['ParentID'].'_1')->first();
            $parent_2 = $all_parents->where('edadmin_id', $student['ParentID'].'_2')->first() ?: $all_parents->where('parent_id', $student['ParentID'].'_2')->first();
            $parentIds = [$parent_1->id ?? null, $parent_2->id ?? null];
            $parentIds = array_filter($parentIds); // Remove null values
            $parentJson = json_encode($parentIds);
            $gradeObj = array_find($this->student_classes, function($class) use ($student) {
                return $class['StudentID'] === $student['ID'];
            });
            $grade = $gradeObj ? $gradeObj['Grade'] : null;
            $grade = preg_replace('/[^0-9]/', '', $grade);
            if($user->wasRecentlyCreated){
                // Create associated student record
                try{
                    $user->student()->create([
                        'grade' => $grade,
                        'edadmin_id' => $student['ID'],
                        'avatar' =>  null,
                        'parents_id' => $parentJson,
                    ]);
                } catch (\Exception $e) {
                    // Log the error or handle it as needed
                    Log::error('Error creating student record: ' . $e->getMessage());
                    continue;
                }
            } else {
                // Update existing student record
                try{
                    $user->student()->update([
                        'grade' => $grade,
                        'edadmin_id' => $student['ID'],
                        'parents_id' => $parentJson,
                    ]);
                } catch (\Exception $e) {
                    // Log the error or handle it as needed
                    Log::error('Error updating student record: ' . $e->getMessage());
                    continue;
                }
            }
            foreach($parentIds as $parentId){
                $studentParent = $all_parent_students->where('student_id', $user->id)->where('user_id', $parentId)->first();
                if($studentParent){
                    continue;
                }
                else{
                    StudentParent::create([
                        'student_id' => $user->id,
                        'user_id' => $parentId
                    ]);
                }
            }
            $mentorGroup = array_find($this->mentor_groups, function($group) use ($student) {
                return $group['StudentID'] === $student['ID'];
            });
            $mentor = $mentorGroup?array_find($this->mentors, function($mentor) use ($mentorGroup) {
                return $mentor['SubjectID'] === $mentorGroup['SubjectSetupID'];
            }):null;
            
            
            if($mentor){
                $mentorUser = $all_staff->where('edadmin_id', $mentor['StaffID'])->first();
                if($mentorUser){
                    $mentorRecord = $all_mentors->where('student_id', $user->id)->first();
                    if($mentorRecord){
                        if($mentorRecord->user_id != $mentorUser->id){
                            $mentorRecord->update([
                                'user_id' => $mentorUser->id
                            ]);
                        }
                    }
                    else{
                        Mentor::create([
                            'student_id' => $user->id,
                            'user_id' => $mentorUser->id
                        ]);
                    }
                }
            }
        }
        if($all_students->isNotEmpty()){
            foreach($all_students as $old_student){
                try{
                    $old_student->delete();
                } catch (\Exception $e) {
                    // Log the error or handle it as needed
                    Log::error('Error deleting old student: ' . $e->getMessage());
                    continue;
                }
            }
        }
    }
}