<?php

use Illuminate\Database\Seeder;
use App\Project;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $columns = [
            ['key' => 'id', 'name' => 'ID'],
            ['key' => 'title', 'name' => 'Title'],
            ['key' => 'paid_date', 'name' => 'Paid Date'],
            ['key' => 'complete', 'name' => 'Complete'],
            ['key' => 'paid_by', 'name' => 'Paid By'],
            ['key' => 'medium', 'name' => 'Medium'],
            ['key' => 'comment', 'name' => 'Comment']
        ];
        Project::create(['name' => 'My Project', 'columns' => $columns]);
    }
}
