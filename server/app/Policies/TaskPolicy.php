<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\RoleEnum;
use Illuminate\Auth\Access\Response;

class TaskPolicy
{
    public function show(User $user, Task $task)
    {
        if ($user->id === $task->project->user_id) {
            return true;
        }

        return $task->project->group
            ->memberships()
            ->where('user_id', $user->id)
            ->exists();
    }

    public function createSubtask(User $user, Task $task)
    {
        if ($user->id === $task->user_id) {
            return true;
        }

        if (is_null($task->project->group_id)) {
            return false;
        }

        return $task->project->group
            ->memberships()
            ->where('user_id', $user->id)
            ->whereIn('role_id', [
                RoleEnum::Owner->value,
                RoleEnum::Moderator->value,
            ])
            ->exists();
    }

    public function update(User $user, Task $task)
    {
        return $user->id === $task->user_id || $user->id === $task->project->user_id;
    }

    public function destroy(User $user, Task $task)
    {
        return $user->id === $task->user_id || $user->id === $task->project->user_id;
    }

    public function complete(User $user, Task $task)
    {
        if ($user->id === $task->project->user_id) {
            return true;
        }

        if (is_null($task->project->group_id)) {
            return false;
        }

        return $task->project->group
            ->memberships()
            ->where('user_id', $user->id)
            ->exists();
    }
}
