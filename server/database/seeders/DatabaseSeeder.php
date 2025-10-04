<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\Membership;
use App\Models\Project;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\RoleEnum;
use Illuminate\Database\Seeder;

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

        User::factory(5)->create();

        Group::factory()->create([
            'name' => fake()->company(),
        ]);

        Group::factory()->create([
            'name' => fake()->company(),
        ]);

        Membership::factory()->create([
            'user_id' => 1,
            'group_id' => 1,
            'role_id' => RoleEnum::Owner->value,
        ]);

        Membership::factory()->create([
            'user_id' => 2,
            'group_id' => 1,
            'role_id' => RoleEnum::Moderator->value,
        ]);

        Membership::factory()->create([
            'user_id' => 3,
            'group_id' => 1,
            'role_id' => RoleEnum::Member->value,
        ]);

        Membership::factory()->create([
            'user_id' => 4,
            'group_id' => 2,
            'role_id' => RoleEnum::Owner->value,
        ]);

        Membership::factory()->create([
            'user_id' => 5,
            'group_id' => 2,
            'role_id' => RoleEnum::Moderator->value,
        ]);

        Membership::factory()->create([
            'user_id' => 3,
            'group_id' => 2,
            'role_id' => RoleEnum::Member->value,
        ]);

        $proj = Project::factory()->create([
            'user_id' => 1,
            'group_id' => 1,
            'name' => fake()->text(12),
            'description' => fake()->text(16),
        ]);

        $proj->tasks()->create([
            'user_id' => 1,
            'title' => fake()->text(10),
            'description' => fake()->text(30),
            'completed' => true,
        ]);

        $task = $proj->tasks()->create([
            'user_id' => 2,
            'title' => fake()->text(10),
            'description' => fake()->text(30),
        ]);

        $task->subtasks()->create([
            'user_id' => 2,
            'text' => fake()->text(16),
            'completed' => true,
        ]);

        $task->subtasks()->create([
            'user_id' => 2,
            'text' => fake()->text(16),
        ]);

        $task->subtasks()->create([
            'user_id' => 2,
            'text' => fake()->text(16),
            'completed' => true,
        ]);

        Project::factory()->create([
            'user_id' => 1,
            'group_id' => 1,
            'name' => fake()->text(12),
            'description' => fake()->text(16),
        ]);

        for ($i = 0; $i < 5; $i++) {
            Project::factory()->create([
                'user_id' => 1,
                'name' => fake()->text(12),
                'description' => fake()->text(16),
            ]);
        }

        for ($i = 0; $i < 5; $i++) {
            Project::factory()->create([
                'user_id' => 2,
                'name' => fake()->text(12),
                'description' => fake()->text(16),
            ]);
        }

        $proj = Project::factory()->create([
            'user_id' => 4,
            'group_id' => 2,
            'name' => fake()->text(12),
            'description' => fake()->text(16),
        ]);

        $proj->tasks()->create([
            'user_id' => 4,
            'title' => fake()->text(10),
            'description' => fake()->text(12),
        ]);

        $task = $proj->tasks()->create([
            'user_id' => 5,
            'title' => fake()->text(10),
            'description' => fake()->text(12),
        ]);

        $task->subtasks()->create([
            'user_id' => 5,
            'text' => fake()->text(6),
        ]);

        $task->subtasks()->create([
            'user_id' => 5,
            'text' => fake()->text(6),
        ]);

        $proj = Project::factory()->create([
            'user_id' => 5,
            'group_id' => 2,
            'name' => fake()->text(12),
            'description' => fake()->text(16),
        ]);

        $task = $proj->tasks()->create([
            'user_id' => 5,
            'title' => fake()->text(12),
            'description' => fake()->text(12),
        ]);

        $task->subtasks()->create([
            'user_id' => 5,
            'text' => fake()->text(6),
        ]);
    }
}
