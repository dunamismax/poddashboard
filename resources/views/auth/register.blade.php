@extends('layouts.pod')

@section('content')
    <section class="mx-auto mt-12 w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <flux:heading size="xl">Create account</flux:heading>
        <flux:subheading class="mt-2">
            Create your account to manage pods and events.
        </flux:subheading>

        <form method="POST" action="{{ route('register.store') }}" class="mt-6 space-y-4">
            @csrf

            <flux:input
                name="name"
                :label="__('Name')"
                type="text"
                :value="old('name')"
                required
                autocomplete="name"
                placeholder="Your name"
            />
            <flux:error name="name" />

            <flux:input
                name="email"
                :label="__('Email')"
                type="email"
                autocomplete="email"
                :value="old('email')"
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

            <flux:button type="submit" variant="primary" class="cursor-pointer" data-test="register-button">
                Create account
            </flux:button>
        </form>

        <p class="mt-4 text-sm text-zinc-600">
            Already have an account?
            <flux:link href="{{ route('login') }}">Sign in</flux:link>.
        </p>
    </section>
@endsection
