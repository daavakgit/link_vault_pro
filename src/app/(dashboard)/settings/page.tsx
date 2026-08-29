// Redirect /settings → /profile so existing links still work
import { redirect } from 'next/navigation';

export default function SettingsPage() {
  redirect('/profile');
}
