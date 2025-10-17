<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use App\Models\User;

use function PHPSTORM_META\type;

class EdAdminFetch extends Controller
{
    private $request;
    private $students;
    private $student_classes;
    /**
     * Fetch data from the EdAdmin API.
     */
    public function __invoke()
    {
        // Fetch data from the EdAdmin API
        $this->request = Http::withHeaders([
            'Authorization' => env('EDADMIN_API_KEY'),
        ]);
        $this->fetchStaff();
        $this->fetchSubjectSetup();
        $this->fetchStaffClasses();
        $this->fetchParents();
        $this->fetchStudentClasses();
        $this->fetchStudents();
        
    }

    private function fetchStudents()
    {
        // Logic to fetch students from EdAdmin API
        $url = env('EDADMIN_URL');
        $response = $this->request->withQueryParameters([
            'query' => 'Students',
            'campus' => 'High School',
        ])->get($url);
        if($response->ok()){
            $students = $response->body();
            $xml = simplexml_load_string($students);
            $json = json_encode($xml);
            $students_array = json_decode($json,TRUE);
            $this->students = $students_array['Students'];
        }
    }

    private function fetchStudentClasses()
    {
        // Logic to fetch student classes from EdAdmin API
        $url = env('EDADMIN_URL');
        $response = $this->request->withQueryParameters([
            'query' => 'StudentClasses',
            'campus' => 'High School',
        ])->get($url);
        if($response->ok()){
            $student_classes = $response->body();
            $xml = simplexml_load_string($student_classes);
            $json = json_encode($xml);
            $student_classes_array = json_decode($json,TRUE);
            $this->student_classes = $student_classes_array['StudentClasses'];
        }
    }

    private function processStudents(){
        foreach($this->students as $student){
            $user =User::updateOrCreate(
                ['edadmin_id' => $student['ID']],
                [
                    'first_name' => $student['FirstName'],
                    'last_name' => $student['LastName'],
                    'email' => $student['Email'],
                    'type' => 'student',
                ]
            );
            if($user->wasRecentlyCreated){
                // Create associated student record
                $user->student()->create([
                    'edadmin_id' => $student['ID'],
                    'avatar' =>  null,
                    'parents_id' => $student['ParentID'] ?? null,
                ]);
            } else {
                // Update existing student record
                $user->student()->update([
                    'edadmin_id' => $student['ID'],
                    'parents_id' => $student['ParentID'] ?? null,
                ]);
            }
        }
    }

"ID" => "26208"
      "LastName" => "Zar"
      "FirstName" => "Elijah"
      "MiddleName" => []
      "BirthDate" => "2005-09-05T00:00:00"
      "PassNo" => "0509055501084"
      "Gender" => "1"
      "Photo" => "26208.jpg"
      "ParentID" => "11860"
      "Email" => "ezar23@herzlia.com"
}