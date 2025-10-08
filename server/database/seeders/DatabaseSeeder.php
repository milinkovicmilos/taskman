<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\Membership;
use App\Models\Project;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\RoleEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call([
            RoleSeeder::class,
        ]);

        $mainOwner = User::factory()->create([
            'first_name' => 'Main',
            'last_name' => 'Owner',
            'email' => 'owner@example.com',
            'password' => Hash::make('password'),
        ]);

        $moderator = User::factory()->create([
            'first_name' => 'Group',
            'last_name' => 'Moderator',
            'email' => 'moderator@example.com',
            'password' => Hash::make('password'),
        ]);

        $member = User::factory()->create([
            'first_name' => 'Group',
            'last_name' => 'Member',
            'email' => 'member@example.com',
            'password' => Hash::make('password'),
        ]);

        for ($i = 0; $i < 15; $i++) {
            $mainOwner->projects()->create([
                'name' => fake()->text(32),
                'description' => fake()->text(128),
            ]);
        }

        $mainGroup = Group::factory()->create([
            'name' => 'Main group',
        ]);

        Membership::factory()->create([
            'role_id' => RoleEnum::Owner->value,
            'user_id' => $mainOwner->id,
            'group_id' => $mainGroup->id,
        ]);

        Membership::factory()->create([
            'role_id' => RoleEnum::Moderator->value,
            'user_id' => $moderator->id,
            'group_id' => $mainGroup->id,
        ]);

        Membership::factory()->create([
            'role_id' => RoleEnum::Member->value,
            'user_id' => $member->id,
            'group_id' => $mainGroup->id,
        ]);

        for ($i = 0; $i < 9; $i++) {
            $project = $mainGroup->projects()->create([
                'user_id' => $mainOwner->id,
                'name' => fake()->text(32),
                'description' => fake()->text(128),
            ]);

            $randomNumber = random_int(5, 32);
            for ($i = 0; $i < $randomNumber; $i++) {
                $day = random_int(1, 20);
                $month = random_int(1, 12);
                $year = random_int(2025, 2026);
                $priority = random_int(0, 10);
                if ($priority === 0) {
                    $task = $project->tasks()->create([
                        'user_id' => $moderator->id,
                        'title' => fake()->text(16),
                        'description' => fake()->text(64),
                        'due_date' => "$year-$month-$day",
                    ]);
                    $randomNumberOfSubtasks = random_int(5, 16);
                    for ($i = 0; $i < $randomNumberOfSubtasks; $i++) {
                        $task->subtasks()->create([
                            'task_id' => $task->id,
                            'user_id' => $moderator->id,
                            'text' => fake()->text(32),
                        ]);
                    }
                } else {
                    $task = $project->tasks()->create([
                        'user_id' => $moderator->id,
                        'title' => fake()->text(16),
                        'description' => fake()->text(64),
                        'priority' => $priority,
                        'due_date' => "$year-$month-$day",
                    ]);
                    $randomNumberOfSubtasks = random_int(5, 16);
                    for ($i = 0; $i < $randomNumberOfSubtasks; $i++) {
                        $task->subtasks()->create([
                            'task_id' => $task->id,
                            'user_id' => $moderator->id,
                            'text' => fake()->text(32),
                        ]);
                    }
                }
            }
        }
    }
}
