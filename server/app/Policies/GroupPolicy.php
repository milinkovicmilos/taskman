<?php

namespace App\Policies;

use App\Models\Group;
use App\Models\User;
use App\RoleEnum;
use Illuminate\Auth\Access\Response;

class GroupPolicy
{
    public function inviteToGroup(User $user, Group $group)
    {
        return $group->memberships()
            ->where('user_id', $user->id)
            ->whereIn('role_id', [
                RoleEnum::Owner->value,
                RoleEnum::Moderator->value,
            ])
            ->exists();
    }

    public function show(User $user, Group $group)
    {
        return $group->memberships()
            ->where('user_id', $user->id)
            ->exists();
    }

    public function update(User $user, Group $group)
    {
        return $group->memberships()
            ->where('user_id', $user->id)
            ->where('role_id', RoleEnum::Owner->value)
            ->exists();
    }

    public function updateMembership(User $user, Group $group)
    {
        return $group->memberships()
            ->where('user_id', $user->id)
            ->where('role_id', RoleEnum::Owner->value)
            ->exists();
    }

    public function destroy(User $user, Group $group)
    {
        return $group->memberships()
            ->where('user_id', $user->id)
            ->where('role_id', RoleEnum::Owner->value)
            ->exists();
    }

    public function removeFromGroup(User $user, Group $group)
    {
        return $group->memberships()
            ->where('user_id', $user->id)
            ->where('role_id', RoleEnum::Owner->value)
            ->exists();
    }

    public function createProject(User $user, Group $group)
    {
        return $group->memberships()
            ->where('user_id', $user->id)
            ->where('role_id', RoleEnum::Owner->value)
            ->exists();
    }
}
