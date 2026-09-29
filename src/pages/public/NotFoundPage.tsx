import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 text-center">
      <h1 className="text-6xl font-serif font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-charcoal-light mb-8">This page seems to have wandered off...</p>
      <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-light">
        Return Home
      </Link>
    </div>
  );
}
