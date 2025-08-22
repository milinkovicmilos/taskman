<?php

namespace App\Http\Controllers;

use App\Models\Project;
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

        $subtasks = $task->subtasks()
            ->select('id', 'text', 'completed', 'completed_at')
            ->paginate(4);

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

        return response()->json(['message' => 'Successfully created a subtask.']);
    }
}
