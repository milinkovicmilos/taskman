<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Membership;
use App\RoleEnum;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MembershipController extends Controller
{
    public function index(Request $request, Group $group)
    {
        if ($request->user()->cannot('show', $group)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to view members of this group.'
                ],
                403
            );
        }

        $memberships = $group->memberships()
            ->select('id', 'user_id', 'role_id')
            ->paginate(4);

        return response()->json($memberships);
    }

    public function store(Request $request, Group $group)
    {
        if ($request->user()->cannot('inviteToGroup', $group)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to invite users to this group.'
                ],
                403
            );
        }

        $data = $request->validate([
            'user_id' => [
                'required',
                Rule::exists('users', 'id'),
                Rule::unique('memberships', 'user_id')->where('group_id', $group->id)
            ],
            'role_id' => [
                'required',
                Rule::enum(RoleEnum::class),
            ]
        ]);

        if ($data['role_id'] == RoleEnum::Owner->value) {
            return response()->json(
                [
                    'message' => 'You are not allowed to invite users as owners of this group.'
                ],
                403
            );
        }

        $isModerator = $request->user()->memberships()
            ->where('group_id', $group->id)
            ->where('role_id', RoleEnum::Moderator->value)
            ->exists();

        if ($isModerator && in_array($data['role_id'], [RoleEnum::Owner->value, RoleEnum::Moderator->value])) {
            return response()->json(
                [
                    'message' => 'You are only allowed to invite users as members to this group.'
                ],
                403
            );
        }

        $group->memberships()->create($data);

        return response()->json(['message' => 'Successfully invited a user to the group.']);
    }

    public function show(Request $request, Group $group, Membership $membership)
    {
        if ($request->user()->cannot('show', $group)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to view members info of this group.'
                ],
                403
            );
        }

        return response()->json([
            'id' => $membership->id,
            'user_id' => $membership->user_id,
            'role_id' => $membership->role_id,
            'group_id' => $membership->group_id,
        ]);
    }

    public function update(Request $request, Group $group, Membership $membership)
    {
        if ($request->user()->cannot('updateMembership', $group)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to update memberships for this group.'
                ],
                403
            );
        }

        if ($membership->role_id === RoleEnum::Owner->value) {
            return response()->json(
                [
                    'message' => 'You are not allowed to update membership of group owner.'
                ],
                403
            );
        }

        $data = $request->validate([
            'role_id' => [
                'required',
                Rule::enum(RoleEnum::class),
            ]
        ]);

        if ($data['role_id'] === RoleEnum::Owner->value) {
            return response()->json(
                [
                    'message' => 'You are not allowed to set users as owners of this group.'
                ],
                403
            );
        }

        $membership->update($data);

        return response()->json(['message' => 'Successfully updated users membership for this group.']);
    }

    public function destroy(Request $request, Group $group, Membership $membership)
    {
        if ($request->user()->cannot('removeFromGroup', $group)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to remove memberships for this group.'
                ],
                403
            );
        }

        if ($membership->role_id === RoleEnum::Owner->value) {
            return response()->json(
                [
                'message' => 'You are not allowed to remove membership of this groups owner.'
                ],
                403
            );
        }

        $owner = $group->memberships()
            ->select('user_id')
            ->where('role_id', RoleEnum::Owner->value)
            ->first();

        $group->projects()
            ->where('user_id', $membership->user_id)
            ->update(['user_id' => $owner['user_id']]);

        $membership->delete();

        return response()->json(['message' => 'Successfully removed the user from the group.']);
    }
}
