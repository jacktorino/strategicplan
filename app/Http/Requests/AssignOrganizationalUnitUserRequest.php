<?php

namespace App\Http\Requests;

use App\Enums\UserRole;
use App\Models\OrganizationalUnitUser;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssignOrganizationalUnitUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isExecutive() ?? false;
    }

    public function rules(): array
    {
        return [
            'user_id' => [
                'required',
                'exists:users,id',
                function ($attribute, $value, $fail) {
                    $user = User::find($value);

                    if ($user && ! in_array($user->role, OrganizationalUnitUser::ALLOWED_ROLES, true)) {
                        $fail(sprintf(
                            'The selected user has the "%s" role, which cannot be assigned to an organizational unit.',
                            $user->role?->label() ?? 'unknown'
                        ));
                    }
                },
            ],
            'organizational_unit_id' => ['required', 'exists:organizational_units,id'],
            'is_primary' => ['sometimes', 'boolean'],
        ];
    }
}