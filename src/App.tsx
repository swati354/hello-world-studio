import { useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { CalculatorPage } from './components/CalculatorPage';

type Page = 'home' | 'calculator';

function Nav({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-2xl mx-auto flex items-center gap-1 px-4 h-12">
        <button
          onClick={() => setPage('home')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            page === 'home' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setPage('calculator')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            page === 'calculator' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Calculator
        </button>
      </div>
    </nav>
  );
}

function SignInGate() {
  const { isAuthenticated, isLoading, login, error } = useAuth();
  const [page, setPage] = useState<Page>('home');

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-600">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-semibold">Sign in</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="button"
          onClick={login}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Sign in with UiPath
        </button>
      </div>
    );
  }

  return (
    <>
      <Nav page={page} setPage={setPage} />
      <div className="pt-12">
        {page === 'home' && (
          <main className="flex min-h-[calc(100vh-3rem)] items-center justify-center bg-gray-50">
            <div className="rounded-2xl bg-white px-12 py-10 shadow-md text-center">
              <h1 className="text-4xl font-bold text-gray-900">Hello, World!</h1>
              <p className="mt-3 text-gray-500">Welcome to your UiPath Coded Web App.</p>
              <button
                onClick={() => setPage('calculator')}
                className="mt-6 px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Open Calculator →
              </button>
            </div>
          </main>
        )}
        {page === 'calculator' && <CalculatorPage />}
      </div>
    </>
  );
}

export function App() {
  return (
    <AuthProvider>
      <SignInGate />
    </AuthProvider>
  );
}