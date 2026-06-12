import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-2xl border border-brand-100 bg-white p-8 text-center shadow-panel">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600">404</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-brand-900">Page not found</h1>
        <p className="mt-3 text-brand-700">The page you requested does not exist.</p>
        <Link
          to="/login"
          className="mt-6 inline-flex rounded-xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
        >
          Go to login
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;
