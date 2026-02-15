@extends('layouts.pod')

@section('content')
    <section class="mx-auto mt-12 w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <flux:heading size="xl">Confirm password</flux:heading>
        <flux:subheading class="mt-2">
            Re-enter your password to continue.
        </flux:subheading>

        <form method="POST" action="{{ route('password.confirm.store') }}" class="mt-6 space-y-4">
            @csrf

            <flux:input
                name="password"
                :label="__('Password')"
                type="password"
                autocomplete="current-password"
                viewable
                required
            />
            <flux:error name="password" />

            <flux:button type="submit" variant="primary" class="cursor-pointer">
                Confirm
            </flux:button>
        </form>
    </section>
@endsection
