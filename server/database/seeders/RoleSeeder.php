<?php

namespace Database\Seeders;

use App\Models\Role;
use App\RoleEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('roles')->insert([
            ['id' => RoleEnum::Owner->value, 'name' => RoleEnum::Owner->name],
            ['id' => RoleEnum::Moderator->value, 'name' => RoleEnum::Moderator->name],
            ['id' => RoleEnum::Member->value, 'name' => RoleEnum::Member->name],
        ]);
    }
}
