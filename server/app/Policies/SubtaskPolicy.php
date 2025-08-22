<?php

namespace App\Policies;

use App\Models\Subtask;
use App\Models\User;
use App\RoleEnum;
use Illuminate\Auth\Access\Response;

class SubtaskPolicy
{
    public function update(User $user, Subtask $subtask)
    {
        return $user->id === $subtask->user_id || $user->id === $subtask->task->project->user_id;
    }
}
