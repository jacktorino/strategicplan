<?php

namespace App\Http\Controllers;

use App\Models\OrganizationalUnit;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::with(['roles', 'organizationalUnits', 'ownedSubKras'])
            ->select('id', 'name', 'email', 'created_at')
            ->latest()
            ->paginate(10)
            ->through(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->first()?->name ?? 'None',
                'unit' => $user->organizationalUnits->first() ? [
                    'id' => $user->organizationalUnits->first()->id,
                    'code' => $user->organizationalUnits->first()->code,
                    'name' => $user->organizationalUnits->first()->name,
                ] : null,
                'owned_sub_kras_count' => $user->ownedSubKras ? $user->ownedSubKras->count() : 0,
                'created_at' => $user->created_at->format('M d, Y'),
            ]);

        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('users/create', [
            'roles' => Role::pluck('name'),
            'units' => OrganizationalUnit::select('id', 'code', 'name')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Password::defaults()],
            'role' => 'required|string|exists:roles,name',
            'organizational_unit_id' => 'nullable|exists:organizational_units,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'email_verified_at' => now(),
        ]);

        $user->assignRole($validated['role']);

        if (!empty($validated['organizational_unit_id'])) {
            $user->organizationalUnits()->sync([$validated['organizational_unit_id']]);
        }

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user): Response
    {
        $user->load('organizationalUnits');

        return Inertia::render('users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->first()?->name ?? '',
                'organizational_unit_id' => $user->organizationalUnits->first()?->id ?? null,
            ],
            'roles' => Role::pluck('name'),
            'units' => OrganizationalUnit::select('id', 'code', 'name')->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => ['nullable', Password::defaults()],
            'role' => 'required|string|exists:roles,name',
            'organizational_unit_id' => 'nullable|exists:organizational_units,id',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if (!empty($validated['password'])) {
            $user->password = bcrypt($validated['password']);
        }

        $user->save();
        $user->syncRoles([$validated['role']]);

        // Sync unit assignment in the organizational_unit_user pivot table
        if (isset($validated['organizational_unit_id'])) {
            $user->organizationalUnits()->sync(
                $validated['organizational_unit_id'] ? [$validated['organizational_unit_id']] : []
            );
        }

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}