import { useEffect, useState } from 'react';
import PetitionForm from './components/PetitionForm.jsx';
import Success from './components/Success.jsx';
import Admin from './components/Admin.jsx';
import { getCount } from './api.js';

export default function App() {
  const [route, setRoute] = useState(window.location.hash);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    refreshCount();
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  function refreshCount() {
    getCount()
      .then(setCount)
      .catch(() => setCount(0));
  }

  const isAdmin = route.startsWith('#/admin');

  return (
    <>
      <div className="app-topbar">
        <div className="container topbar-inner">
          <span className="brand">
            <span className="logo" aria-hidden="true">EDC</span>
            Forms
          </span>
          <span className="responses-chip">
            {count} response{count === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      <header className="form-hero">
        <div className="container">
          <div className="hero-inner">
            <h1>Petition to Restore Ethernet at GGSIPU EDC Hostels</h1>
            <p className="tagline">
              Add your digital signature below to support restoring wired Ethernet connectivity in our
              hostel rooms.
            </p>
          </div>
        </div>
      </header>

      <main className="container">
        {isAdmin ? <Admin /> : <PetitionRoute onSigned={refreshCount} />}
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>GGSIPU EDC (East Delhi Campus) &middot; Student Initiative for Hostel Ethernet Connectivity</p>
          <p className="footer-admin">
            <a href="#/admin">Organiser sign in</a>
          </p>
        </div>
      </footer>
    </>
  );
}

function PetitionRoute({ onSigned }) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return <Success />;
  }
  return (
    <PetitionForm
      onSuccess={() => {
        onSigned();
        setSubmitted(true);
      }}
    />
  );
}