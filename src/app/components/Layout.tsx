import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";

const imgImage2 = "/logo.png";

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f3f6ff] transition-colors duration-500 day-mode">
      {/* Navbar */}
      <nav className="bg-[#072c3c] shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:px-6 md:px-8 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Business Name */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src={imgImage2}
                alt="WEND logo"
                className="h-10 w-12 object-cover sm:h-12 sm:w-14"
              />
              <span className="max-w-[190px] truncate font-['Arimo:Regular',sans-serif] text-base text-white tracking-wide sm:max-w-none sm:text-lg md:text-xl">
                WENDbysakshifatnani
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className="font-['Arimo:Regular',sans-serif] text-white hover:text-[#99a1af] transition-colors duration-200 relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/portfolio"
                className="font-['Arimo:Regular',sans-serif] text-white hover:text-[#99a1af] transition-colors duration-200 relative group"
              >
                Portfolio
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/projects"
                className="font-['Arimo:Regular',sans-serif] text-white hover:text-[#99a1af] transition-colors duration-200 relative group"
              >
                Projects
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/services"
                className="font-['Arimo:Regular',sans-serif] text-white hover:text-[#99a1af] transition-colors duration-200 relative group"
              >
                Services
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/about"
                className="font-['Arimo:Regular',sans-serif] text-white hover:text-[#99a1af] transition-colors duration-200 relative group"
              >
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/contact"
                className="bg-white text-[#072c3c] px-6 py-2 rounded hover:bg-[#f3f6ff] transition-all duration-300 shadow-md hover:shadow-lg font-['Arimo:Regular',sans-serif]"
              >
                Contact
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                aria-label="Toggle navigation menu"
                aria-controls="mobile-nav"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="rounded-md border border-white/20 p-2 text-white transition hover:bg-white/10"
              >
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div
            id="mobile-nav"
            className={`overflow-hidden transition-all duration-300 ease-out md:hidden ${
              isMobileMenuOpen ? "mt-3 max-h-[420px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-1 rounded-xl border border-white/15 bg-[#0b3850] p-3 shadow-lg">
              <Link
                to="/"
                className="block rounded-md px-3 py-2 font-['Arimo:Regular',sans-serif] text-white transition hover:bg-white/10"
              >
                Home
              </Link>
              <Link
                to="/portfolio"
                className="block rounded-md px-3 py-2 font-['Arimo:Regular',sans-serif] text-white transition hover:bg-white/10"
              >
                Portfolio
              </Link>
              <Link
                to="/projects"
                className="block rounded-md px-3 py-2 font-['Arimo:Regular',sans-serif] text-white transition hover:bg-white/10"
              >
                Projects
              </Link>
              <Link
                to="/services"
                className="block rounded-md px-3 py-2 font-['Arimo:Regular',sans-serif] text-white transition hover:bg-white/10"
              >
                Services
              </Link>
              <Link
                to="/about"
                className="block rounded-md px-3 py-2 font-['Arimo:Regular',sans-serif] text-white transition hover:bg-white/10"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="mt-2 block rounded-md bg-white px-3 py-2 text-center font-['Arimo:Regular',sans-serif] text-[#072c3c] transition hover:bg-[#f3f6ff]"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <Outlet />

      <footer className="bg-[#061f2b] py-14">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 gap-10 text-white md:grid-cols-4">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <img
                  src={imgImage2}
                  alt="WEND logo"
                  className="h-12 w-14 object-cover"
                />
                <span className="font-['Arimo:Regular',sans-serif] text-2xl tracking-widest">
                  WENDbysakshifatnani
                </span>
              </div>
              <p className="font-['Arimo:Regular',sans-serif] text-sm text-white/75">
                Crafting premium interiors with clarity, character, and timeless design.
              </p>
            </div>

            <div>
              <h4 className="mb-3 font-['Arimo:Regular',sans-serif] text-lg">Navigation</h4>
              <div className="space-y-2 font-['Arimo:Regular',sans-serif] text-sm text-white/80">
                <Link to="/" className="transition-colors hover:text-white">Home</Link>
                <br />
                <Link to="/services" className="transition-colors hover:text-white">Services</Link>
                <br />
                <Link to="/projects" className="transition-colors hover:text-white">Projects</Link>
                <br />
                <Link to="/contact" className="transition-colors hover:text-white">Contact</Link>
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-['Arimo:Regular',sans-serif] text-lg">Contact</h4>
              <div className="space-y-2 font-['Arimo:Regular',sans-serif] text-sm text-white/80">
                <p>wendbysakshifatnani@gmail.com</p>
                <p>+91 8767-915-715</p>
                <p>Cloud Office</p>
                <p>Malegaon, Nashik</p>
                <p>Maharashtra- 423203</p>
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-['Arimo:Regular',sans-serif] text-lg">Follow</h4>
              <div className="flex items-center gap-4 text-white/85">
                <a
                  href="https://www.instagram.com/wendbysakshifatnani/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="transition-colors hover:text-white"
                >
                  <Instagram className="size-5" />
                </a>
                <a
                  href="mailto:wendbysakshifatnani@gmail.com"
                  aria-label="Email"
                  className="transition-colors hover:text-white"
                >
                  <Mail className="size-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/15 pt-6 text-center font-['Arimo:Regular',sans-serif] text-sm text-white/65">
            © 2026 WEND. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}