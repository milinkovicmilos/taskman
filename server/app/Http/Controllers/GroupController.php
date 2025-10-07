<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\RoleEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class GroupController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $groups = $user->memberships()
            ->select('groups.id', 'groups.name')
            ->join('groups', 'groups.id', '=', 'memberships.group_id');

        $keyword = $request->input('keyword');
        if (!is_null($keyword)) {
            $groups->where(DB::raw('LOWER(name)'), 'LIKE', '%' . strtolower($keyword) . '%');
        }

        return response()->json($groups->paginate(4));
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'name' => ['required'],
        ]);

        $group = Group::create($data);
        $group->memberships()->create([
            'user_id' => $user->id,
            'role_id' => RoleEnum::Owner->value,
        ]);

        return response()->json([
            'message' => 'Successfully created a group.',
            'data' => [
                'id' => $group->id,
            ],
        ]);
    }

    public function show(Request $request, Group $group)
    {
        if ($request->user()->cannot('show', $group)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to view this group.'
                ],
                403
            );
        }

        $owner = $group->memberships()
            ->select(DB::raw("CONCAT(first_name, ' ', last_name) AS full_name"))
            ->join('users', 'users.id', '=', 'memberships.user_id')
            ->where('role_id', RoleEnum::Owner->value)
            ->value('full_name');

        $members = $group->memberships()
            ->select(DB::raw("CONCAT(users.first_name, ' ', users.last_name) AS full_name"))
            ->join('users', 'users.id', '=', 'memberships.user_id')
            ->orderBy('memberships.role_id', 'asc')
            ->take(5)
            ->pluck('full_name');

        $memberCount = $group->memberships()->count();

        $deletable = $request->user()->can('destroy', $group);
        $editable = $request->user()->can('update', $group);
        $canInviteToGroup = $request->user()->can('inviteToGroup', $group);
        $canCreateProjects = $request->user()->can('createProject', $group);

        return response()->json([
            'id' => $group->id,
            'name' => $group->name,
            'owner' => $owner,
            'members' => $members,
            'member_count' => $memberCount,
            'deletable' => $deletable,
            'editable' => $editable,
            'can_invite_to_group' => $canInviteToGroup,
            'can_create_projects' => $canCreateProjects,
        ]);
    }

    public function update(Request $request, Group $group)
    {
        if ($request->user()->cannot('update', $group)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to update this group.'
                ],
                403
            );
        }

        $data = $request->validate([
            'name' => ['sometimes', 'required'],
        ]);

        $group->update($data);

        return response()->json(['message' => 'Successfully updated the group.']);
    }

    public function destroy(Request $request, Group $group)
    {
        if ($request->user()->cannot('destroy', $group)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to delete this group.'
                ],
                403
            );
        }

        $group->projects()->delete();

        $group->memberships()->delete();

        $group->delete();

        return response()->json(['message' => 'Successfully deleted the group.']);
    }
}
