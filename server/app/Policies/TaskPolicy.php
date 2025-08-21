<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskPolicy
{
    public function update(User $user, Task $task)
    {
        return $user->id === $task->user_id || $user->id === $task->project->user_id;
    }

    public function destroy(User $user, Task $task)
    {
        return $user->id === $task->user_id || $user->id === $task->project->user_id;
    }
}
