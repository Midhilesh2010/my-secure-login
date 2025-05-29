// src/app/account/reset-password/page.js
import { Suspense } from 'react';
import ResetPasswordForm from './ResetPasswordForm'; // Adjust path if needed

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}