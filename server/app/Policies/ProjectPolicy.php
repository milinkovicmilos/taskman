<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use App\RoleEnum;
use Illuminate\Auth\Access\Response;

class ProjectPolicy
{
    /**
     * Determine whether the user can show the model.
     */
    public function show(User $user, Project $project): bool
    {
        if ($user->id === $project->user_id) {
            return true;
        }

        return $user->memberships()
            ->where('group_id', $project->group_id)
            ->exists();
    }

    public function createTask(User $user, Project $project)
    {
        if ($user->id === $project->user_id) {
            return true;
        }

        if (is_null($project->group_id)) {
            return false;
        }

        return $project->group
            ->memberships()
            ->where('user_id', $user->id)
            ->whereIn('role_id', [
                RoleEnum::Owner->value,
                RoleEnum::Moderator->value,
            ])
            ->exists();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Project $project): bool
    {
        return $user->id === $project->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Project $project): bool
    {
        return $user->id === $project->user_id;
    }
}
