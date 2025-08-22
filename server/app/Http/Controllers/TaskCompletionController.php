<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskCompletionController extends Controller
{
    public function store(Request $request, Project $project, Task $task)
    {
        if ($request->user()->cannot('complete', $task)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to mark this task as complete.'
                ],
                403
            );
        }

        $task->update([
            'completed' => true,
            'completed_at' => now(),
        ]);
        dd($task);

        return response()->json(['message' => 'Successfully marked the task as complete.']);
    }

    public function destroy(Request $request, Project $project, Task $task)
    {
        if ($request->user()->cannot('complete', $task)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to mark this task as incomplete.'
                ],
                403
            );
        }

        $task->update([
            'completed' => 0,
            'completed_at' => null,
        ]);

        return response()->json(['message' => 'Successfully marked the task as complete.']);
    }
}
