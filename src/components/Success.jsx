export default function Success() {
  return (
    <section className="forms-card success-card" role="status">
      <div className="success-check" aria-hidden="true">&check;</div>
      <h2>Your response has been recorded.</h2>
      <p>Thank you for supporting the cause! Your signature is now part of the petition.</p>
      <p className="small">Share the link with other hostel students so their voices count too.</p>
      <p className="footer-admin">
        <a href="/" onClick={(e) => { e.preventDefault(); window.location.hash = ''; window.location.reload(); }}>
          Submit another response
        </a>
      </p>
    </section>
  );
}