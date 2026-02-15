@extends('layouts.pod')

@section('content')
    <section class="mx-auto mt-12 w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <flux:heading size="xl">Reset password</flux:heading>
        <flux:subheading class="mt-2">
            Set a new password for your account.
        </flux:subheading>

        <form method="POST" action="{{ route('password.update') }}" class="mt-6 space-y-4">
            @csrf

            <input type="hidden" name="token" value="{{ $request->route('token') }}">

            <flux:input
                name="email"
                :label="__('Email')"
                type="email"
                autocomplete="email"
                :value="old('email', $request->email)"
                required
                placeholder="email@example.com"
            />
            <flux:error name="email" />

            <flux:input
                name="password"
                :label="__('Password')"
                type="password"
                autocomplete="new-password"
                viewable
                required
            />
            <flux:error name="password" />

            <flux:input
                name="password_confirmation"
                :label="__('Confirm password')"
                type="password"
                autocomplete="new-password"
                viewable
                required
            />

            <flux:button type="submit" variant="primary" class="cursor-pointer" data-test="reset-password-button">
                Reset password
            </flux:button>
        </form>
    </section>
@endsection
