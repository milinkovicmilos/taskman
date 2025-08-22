<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Subtask;
use App\Models\Task;
use Illuminate\Http\Request;

class SubtaskCompletionController extends Controller
{
    public function store(Request $request, Project $project, Task $task, Subtask $subtask)
    {
        if ($request->user()->cannot('complete', $subtask)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to mark this subtask as complete.'
                ],
                403
            );
        }

        $subtask->update([
            'completed' => 1,
            'completed_at' => now(),
        ]);

        return response()->json(['message' => 'Successfully marked subtask as complete.']);
    }

    public function destroy(Request $request, Project $project, Task $task, Subtask $subtask)
    {
        if ($request->user()->cannot('complete', $subtask)) {
            return response()->json(
                [
                    'message' => 'You are not allowed to mark this subtask as incomplete.'
                ],
                403
            );
        }

        $subtask->update([
            'completed' => 0,
            'completed_at' => null,
        ]);

        return response()->json(['message' => 'Successfully marked subtask as incomplete.']);
    }
}
