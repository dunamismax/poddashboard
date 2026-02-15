@extends('layouts.pod')

@section('content')
    <section class="mx-auto mt-12 w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <flux:heading size="xl">Sign in</flux:heading>
        <flux:subheading class="mt-2">
            Use your email and password to access your pod dashboard.
        </flux:subheading>

        @if (session('status'))
            <div x-data="{ visible: true }" x-show="visible" x-transition class="mt-4">
                <flux:callout icon="check-circle" variant="secondary">
                    <flux:callout.heading>{{ session('status') }}</flux:callout.heading>
                    <x-slot name="controls">
                        <flux:button type="button" icon="x-mark" variant="ghost" x-on:click="visible = false" />
                    </x-slot>
                </flux:callout>
            </div>
        @endif

        <form method="POST" action="{{ route('login.store') }}" class="mt-6 space-y-4">
            @csrf

            <flux:input
                name="email"
                :label="__('Email')"
                type="email"
                autocomplete="email"
                :value="old('email')"
                required
                autofocus
                placeholder="email@example.com"
            />
            <flux:error name="email" />

            <flux:input
                name="password"
                :label="__('Password')"
                type="password"
                autocomplete="current-password"
                viewable
                required
            />
            <flux:error name="password" />

            <label class="flex items-center gap-2 text-sm text-zinc-600">
                <input type="checkbox" name="remember" value="1" class="rounded border-zinc-300 text-zinc-900">
                <span>Remember me</span>
            </label>

            <flux:button type="submit" variant="primary" class="cursor-pointer" data-test="login-button">
                Sign in
            </flux:button>
        </form>

        <p class="mt-4 text-sm text-zinc-600">
            Forgot your password?
            <flux:link href="{{ route('password.request') }}">Reset it here</flux:link>.
        </p>

        <p class="mt-2 text-sm text-zinc-600">
            New here?
            <flux:link href="{{ route('register') }}">Create an account</flux:link>.
        </p>
    </section>
@endsection
