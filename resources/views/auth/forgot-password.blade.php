@extends('layouts.pod')

@section('content')
    <section class="mx-auto mt-12 w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <flux:heading size="xl">Forgot password</flux:heading>
        <flux:subheading class="mt-2">
            Enter your email and we will send you a password reset link.
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

        <form method="POST" action="{{ route('password.email') }}" class="mt-6 space-y-4">
            @csrf

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

            <flux:button type="submit" variant="primary" class="cursor-pointer" data-test="send-reset-link-button">
                Email reset link
            </flux:button>
        </form>

        <p class="mt-4 text-sm text-zinc-600">
            Remembered it?
            <flux:link href="{{ route('login') }}">Back to sign in</flux:link>.
        </p>
    </section>
@endsection
