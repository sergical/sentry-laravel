<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class TodoController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'ooopsieMode' => 'nullable|boolean',
        ]);

        // Check if ooopsie mode is enabled
        if ($request->boolean('ooopsieMode')) {
            throw new \Exception('Ooopsie! Server error while creating todo "' . $validated['title'] . '" - this is a test error for Sentry tracking. User: ' . $request->user()->name . ' (' . $request->user()->email . ')');
        }

        $request->user()->todos()->create($validated);

        return redirect()->route('dashboard')->with('success', 'Todo created successfully!');
    }

    public function update(Request $request, Todo $todo): RedirectResponse
    {
        // Ensure user can only update their own todos
        if ($todo->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'completed' => 'required|boolean',
            'ooopsieMode' => 'nullable|boolean',
        ]);

        // Check if ooopsie mode is enabled
        if ($request->boolean('ooopsieMode')) {
            throw new \Exception('Ooopsie! Server error while toggling todo "' . $todo->title . '" - this is a test error for Sentry tracking. User: ' . $request->user()->name . ' (' . $request->user()->email . ')');
        }

        $todo->update($validated);

        return redirect()->route('dashboard');
    }

    public function destroy(Request $request, Todo $todo): RedirectResponse
    {
        // Ensure user can only delete their own todos
        if ($todo->user_id !== $request->user()->id) {
            abort(403);
        }

        // Check if ooopsie mode is enabled (from query parameter)
        if ($request->boolean('ooopsieMode')) {
            throw new \Exception('Ooopsie! Server error while deleting todo "' . $todo->title . '" - this is a test error for Sentry tracking. User: ' . $request->user()->name . ' (' . $request->user()->email . ')');
        }

        $todo->delete();

        return redirect()->route('dashboard')->with('success', 'Todo deleted successfully!');
    }
} 