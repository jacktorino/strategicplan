<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubKra;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => User::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
     public function create(): Response
    {
        return Inertia::render('Users/Create', [
            'subKras' => SubKra::select('id', 'code', 'title')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
  public function store(Request $request)
{
    $validated = $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
        'role' => ['required', Rule::in(['admin', 'strategic_planner', 'key_result_area', 'viewer'])],
        'sub_kra_id' => [
            Rule::requiredIf($request->input('role') === 'key_result_area'),
            'nullable',
            'exists:sub_kras,id',
        ],
    ]);

    // Generate an 8-character temporary password
    $temporaryPassword = Str::password(
        length: 8,
        letters: true,
        numbers: true,
        symbols: false
    );

    User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($temporaryPassword),
        'role' => $validated['role'],
        'sub_kra_id' => $validated['role'] === 'key_result_area'
            ? $validated['sub_kra_id']
            : null,
    ]);

    return back()->with([
        'success' => 'User created successfully.',
        'temporary_password' => $temporaryPassword,
    ]);
}

    /**
     * Display the specified resource.
     */
 public function show(User $user): Response
{
    $user->load('subKra');

    return Inertia::render('Users/Show', [
        'user' => $user,
    ]);
}

    /**
     * Show the form for editing the specified resource.
     */
public function edit(User $user)
{
    return Inertia::render('Users/Edit', [
        'user' => $user,
        'subKras' => SubKra::select('id', 'code', 'title')->get(),
    ]);
}
    /**
     * Update the specified resource in storage.
     */
public function update(Request $request, User $user)
{
    $validated = $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'email' => [
            'required',
            'email',
            'max:255',
            Rule::unique('users')->ignore($user->id),
        ],
        'role' => [
            'required',
            Rule::in([
                'admin',
                'strategic_planner',
                'key_result_area',
                'viewer',
            ]),
        ],
        'sub_kra_id' => [
            Rule::requiredIf($request->role === 'key_result_area'),
            'nullable',
            'exists:sub_kras,id',
        ],
    ]);

    $user->update([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'role' => $validated['role'],
        'sub_kra_id' => $validated['role'] === 'key_result_area'
            ? $validated['sub_kra_id']
            : null,
    ]);

    return redirect()
        ->route('users.index')
        ->with('success', 'User updated successfully.');
}

    /**
     * Remove the specified resource from storage.
     */
public function destroy(User $user)
{
    $user->delete();

    return redirect()
        ->route('users.index')
        ->with('success', 'User deleted successfully.');
}
}