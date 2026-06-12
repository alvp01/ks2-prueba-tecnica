function PageShell({ children }) {
  return (
    <main className="auth-shell">
      <div className="auth-shell__inner">{children}</div>
    </main>
  );
}

export default PageShell;
