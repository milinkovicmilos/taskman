<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskPolicy
{
    public function index(User $user, Project $project)
    {
        return $user->id === $project->user_id;
    }
}
