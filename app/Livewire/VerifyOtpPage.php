<?php

namespace App\Livewire;

use App\Services\OtpAuthService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\View\View;
use Livewire\Component;

class VerifyOtpPage extends Component
{
    public string $email = '';

    public string $code = '';

    public function mount(?string $email = null): void
    {
        if (Auth::check()) {
            $this->redirectRoute('dashboard', navigate: true);

            return;
        }

        if (is_string($email)) {
            $this->email = strtolower(trim($email));
        }
    }

    public function verify(OtpAuthService $otpAuthService): void
    {
        $validated = $this->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'regex:/^\d{6}$/'],
        ], [
            'email.required' => 'Enter a valid email address.',
            'email.email' => 'Enter a valid email address.',
            'code.required' => 'Enter the 6-digit code from your email.',
            'code.regex' => 'Enter the 6-digit code from your email.',
        ]);

        $normalizedEmail = strtolower(trim($validated['email']));
        $rateLimitKey = $this->verifyCodeRateLimitKey($normalizedEmail);

        if (RateLimiter::tooManyAttempts($rateLimitKey, 8)) {
            $retryAfterSeconds = RateLimiter::availableIn($rateLimitKey);
            $this->addError('code', "Too many attempts. Try again in {$retryAfterSeconds} seconds.");

            return;
        }

        $didAuthenticate = $otpAuthService->verifyCodeAndLogin(
            $normalizedEmail,
            trim($validated['code']),
        );

        if (! $didAuthenticate) {
            RateLimiter::hit($rateLimitKey, 60);
            $this->addError('code', 'Invalid or expired code.');

            return;
        }

        RateLimiter::clear($rateLimitKey);
        session()->regenerate();
        $this->redirectRoute('dashboard', navigate: true);
    }

    public function render(): View
    {
        return view('livewire.verify-otp-page')
            ->layout('layouts.pod');
    }

    private function verifyCodeRateLimitKey(string $email): string
    {
        $ip = request()->ip() ?? 'unknown';

        return 'otp:verify:'.Str::transliterate($email).'|'.$ip;
    }
}
