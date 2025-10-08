<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Subtask;
use App\Models\Task;
use Illuminate\Http\Request;

class SubtaskController extends Controller
{
    public function index(Request $request, Project $project, Task $task)
    {
        if ($request->user()->cannot('show', $task)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to view this tasks subtasks.'
                ],
                403
            );
        }

        $request->validate([
            'per_page' => ['sometimes', 'numeric'],
        ]);

        $perPage = $request->input('per_page');
        if (is_null($perPage)) {
            $perPage = 12;
        }

        $subtasks = $task->subtasks()
            ->select('id', 'text', 'completed', 'completed_at')
            ->paginate($perPage);

        return response()->json($subtasks);
    }

    public function store(Request $request, Project $project, Task $task)
    {
        if ($request->user()->cannot('createSubtask', $task)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to create a subtask on this task.'
                ],
                403
            );
        }

        $data = $request->validate([
            'text' => ['required'],
        ]);

        $task->subtasks()->create($data);

        return response()->json([
            'message' => 'Successfully created a subtask.',
            'data' => [
                'id' => $task->id,
            ],
        ]);
    }

    public function show(Request $request, Project $project, Task $task, Subtask $subtask)
    {
        if ($request->user()->cannot('show', $task)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to view this subtask.'
                ],
                403
            );
        }

        return response()->json([
            'text' => $subtask->text,
            'completed' => $subtask->completed,
            'completed_at' => $subtask->completed_at,
        ]);
    }

    public function update(Request $request, Project $project, Task $task, Subtask $subtask)
    {
        if ($request->user()->cannot('update', $subtask)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to view this subtask.'
                ],
                403
            );
        }

        $data = $request->validate([
            'text' => ['sometimes', 'required'],
        ]);

        $subtask->update($data);

        return response()->json(['message' => 'Successfully updated the task.']);
    }

    public function destroy(Request $request, Project $project, Task $task, Subtask $subtask)
    {
        if ($request->user()->cannot('destroy', $subtask)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to view this subtask.'
                ],
                403
            );
        }

        $subtask->delete();

        return response()->json(['message' => 'Successfully deleted a subtask.']);
    }
}
