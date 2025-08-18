<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    /** @use HasFactory<\Database\Factories\GroupFactory> */
    use HasFactory;
    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function memberships()
    {
        return $this->hasMany(Membership::class);
    }
}
