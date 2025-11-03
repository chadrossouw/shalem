<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Successful - {{ config('app.name') }}</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
        <div style="text-align: center;">
            <h2>Login Successful!</h2>
            <p>Preparing your dashboard...</p>
            <div style="margin: 20px 0;">
                <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>
        </div>
    </div>

    <style>
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>

    <script>
        // Ensure CSRF cookie is set before redirecting to dashboard
        async function prepareForDashboard() {
            try {
                // Get CSRF cookie from Sanctum
                await fetch('{{ env("APP_URL") }}/sanctum/csrf-cookie', { 
                    credentials: 'include' 
                });
                
                // Wait a moment for cookie to be set, then redirect
                setTimeout(function() {
                    window.location.href = '{{ env("APP_URL") }}/dashboard';
                }, 500);
            } catch (error) {
                console.error('Error setting CSRF cookie:', error);
                // Fallback - redirect anyway after a delay
                setTimeout(function() {
                    window.location.href = '{{ env("APP_URL") }}/dashboard';
                }, 2000);
            }
        }
        
        // Start the process after page loads
        document.addEventListener('DOMContentLoaded', prepareForDashboard);
    </script>
</body>
</html>