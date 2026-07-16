import { Link, useLocation } from "react-router-dom";
import { FileText, Sparkles } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            ResumeAI
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/"
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            to="/analyze"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              location.pathname === "/analyze"
                ? "bg-primary-600 text-white shadow-lg shadow-primary-600/25"
                : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
            }`}
          >
            <FileText className="h-4 w-4" />
            Analyze Resume
          </Link>
        </div>
      </div>
    </nav>
  );
}
