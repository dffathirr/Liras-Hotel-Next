// Layout untuk section user/home.
// Tailwind sudah ter-load dari globals.css di root layout.
// Tambahkan import CSS custom di sini nanti kalau butuh design sendiri.
// Contoh: import './home.css';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
