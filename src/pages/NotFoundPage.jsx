import { EmptyState } from "../components/Common.jsx";

export default function NotFoundPage() {
  return (
    <main id="main" className="section">
      <div className="container">
        <EmptyState
          title="Page not found"
          message="The page you are looking for may have moved."
          action="Return home"
          to="/"
        />
      </div>
    </main>
  );
}
