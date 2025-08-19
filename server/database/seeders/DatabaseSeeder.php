<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\Membership;
use App\Models\Project;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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

        Membership::factory()->create([
            'user_id' => 1,
            'group_id' => 1,
            'role_id' => 1,
        ]);

        Membership::factory()->create([
            'user_id' => 2,
            'group_id' => 1,
            'role_id' => 2,
        ]);

        Project::factory()->create([
            'user_id' => 1,
            'group_id' => 1,
            'name' => fake()->text(12),
        ]);

        Project::factory()->create([
            'user_id' => 1,
            'group_id' => 1,
            'name' => fake()->text(12),
        ]);

        for ($i = 0; $i < 5; $i++) {
            Project::factory()->create([
                'user_id' => 1,
                'name' => fake()->text(12),
            ]);
        }

        for ($i = 0; $i < 5; $i++) {
            Project::factory()->create([
                'user_id' => 2,
                'name' => fake()->text(12),
            ]);
        }
    }
}
