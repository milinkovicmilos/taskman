<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\RoleEnum;
use App\TaskSortEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    public function index(Request $request, Project $project)
    {
        if ($request->user()->cannot('show', $project)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to view this projects tasks.'
                ],
                403
            );
        }

        $request->validate([
            'per_page' => ['sometimes', 'numeric'],
            'keyword' => ['sometimes'],
            'order' => ['sometimes', Rule::enum(TaskSortEnum::class)],
        ]);

        $tasks = $project->tasks()
            ->select('id', 'title', 'description', 'priority', 'due_date', 'completed', 'completed_at');

        $keyword = $request->input('keyword');
        if (!is_null($keyword)) {
            $tasks->where(DB::raw('LOWER(title)'), 'LIKE', '%' . strtolower($keyword) . '%');
        }

        $order = TaskSortEnum::tryFrom($request->input('order'));
        if (!is_null($order)) {
            switch ($order) {
                case TaskSortEnum::Newest:
                    $tasks->orderBy('created_at', 'desc');
                    break;

                case TaskSortEnum::Oldest:
                    $tasks->orderBy('created_at', 'asc');
                    break;

                case TaskSortEnum::HighestPriority:
                    $tasks->orderBy('priority', 'desc');
                    break;

                case TaskSortEnum::LowestPriority:
                    $tasks->orderBy('priority', 'asc');
                    break;
            }
            $tasks->where(DB::raw('LOWER(title)'), 'LIKE', '%' . strtolower($keyword) . '%');
        }

        $perPage = $request->input('per_page');
        if (is_null($perPage)) {
            $perPage = 8;
        }

        return response()->json($tasks->paginate($perPage));
    }

    public function store(Request $request, Project $project)
    {
        if ($request->user()->cannot('createTask', $project)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to create this task.'
                ],
                403
            );
        }

        $data = $request->validate([
            'title' => [
                'required',
                Rule::unique('tasks')->where('project_id', $project->id)->whereNull('deleted_at'),
            ],
            'description' => ['required'],
            'priority' => ['integer', 'between:1,10'],
            'due_date' => ['date', 'after_or_equal:today'],
        ]);

        $task = $project->tasks()->create($data);

        return response()->json([
            'message' => 'Successfully created a task.',
            'data' => [
                'id' => $task->id,
            ],
        ]);
    }

    public function show(Request $request, Project $project, Task $task)
    {
        if ($request->user()->cannot('show', $project)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to view this task.'
                ],
                403
            );
        }

        $user = Auth::user();
        $role = $task->project->group?->memberships()
            ->where('user_id', $user->id)
            ->value('role_id');

        if (is_null($role)) {
            $role = RoleEnum::Owner;
        }

        $editable = $request->user()->can('update', $task);
        $deletable = $request->user()->can('destroy', $task);
        $canCreateSubtasks = $request->user()->can('createSubtask', $task);

        return response()->json([
            'id' => $task->id,
            'title' => $task->title,
            'description' => $task->description,
            'priority' => $task->priority,
            'due_date' => $task->due_date,
            'completed' => $task->completed,
            'completed_at' => $task->completed_at,
            'role' => $role,
            'editable' => $editable,
            'deletable' => $deletable,
            'can_create_subtasks' => $canCreateSubtasks,
        ]);
    }

    public function update(Request $request, Project $project, Task $task)
    {
        if ($request->user()->cannot('update', $task)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to update this task.'
                ],
                403
            );
        }

        $data = $request->validate([
            'title' => [
                'sometimes',
                'required',
                Rule::unique('tasks')->where('project_id', $project->id)->ignore($task),
            ],
            'description' => ['sometimes', 'required'],
            'priority' => ['nullable', 'integer', 'between:1,10'],
            'due_date' => ['nullable', 'date', 'after_or_equal:today'],
        ]);

        $task->update($data);

        return response()->json(['message' => 'Successfully updated the task.']);
    }

    public function destroy(Request $request, Project $project, Task $task)
    {
        if ($request->user()->cannot('destroy', $task)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to delete this task.'
                ],
                403
            );
        }

        $task->delete();

        return response()->json(['message' => 'Successfully deleted the task.']);
    }
}
