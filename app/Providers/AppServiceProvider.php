<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
    * Bootstrap any application services.
    */
    public function boot(): void
    {
        \Illuminate\Support\Facades\Event::listen(function (\Illuminate\Auth\Events\Authenticated $event) {
            $user = $event->user;
            \Sentry\Laravel\Integration::configureScope(static function (\Sentry\State\Scope $scope) use ($user): void {
                $scope->setUser([
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ]);
            });
        });
    }
}
