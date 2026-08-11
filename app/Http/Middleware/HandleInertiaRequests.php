<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? array_merge($user->toArray(), [
                    'roles' => $user->getRoleNames(), // e.g. ['kra_champion']
                    'permissions' => $user->getAllPermissions()->pluck('name'), // e.g. ['create kras', ...]
                    'is_executive' => $user->isExecutive(),
                    'role_label' => $user->role?->label(),
                ]) : null,
            ],
            // Share all role enum options for UI dropdowns
            'enums' => [
                'userRoles' => collect(UserRole::cases())->map(fn (UserRole $role) => [
                    'value' => $role->value,
                    'label' => $role->label(),
                ]),
            ],
        ]);
    }
}
