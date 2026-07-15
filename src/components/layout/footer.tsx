import Link from "next/link";
import { ManipuriGirlPlaceholder } from "../shared/manipuri-patterns";

export default function Footer() {
  return (
    <footer className="w-full bg-brand-yellow text-primary relative pt-28 pb-12 md:py-6 px-6 md:px-8 mt-auto select-none overflow-visible z-10 footer-masked">

      <div className="mx-auto max-w-page-content relative z-10">
        {/* Desktop View — hidden on mobile */}
        <div className="hidden md:flex items-center justify-between gap-6 pl-[280px]">
          {/* Address & Privacy */}
          <div className="flex items-center gap-6 text-left">
            <span className="text-xs font-semibold tracking-tight uppercase opacity-90">
              Sreemangal, Sylhet
            </span>
            <span className="text-primary/30">|</span>
            <Link
              href="#"
              className="text-xs font-bold underline hover:opacity-80 transition-opacity"
            >
              Privacy notice
            </Link>
          </div>

          {/* Socials, Copyright, and Doll */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="hover:opacity-75 transition-opacity"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a
                href="#"
                className="hover:opacity-75 transition-opacity"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="#"
                className="hover:opacity-75 transition-opacity"
                aria-label="WhatsApp"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.47l-6.256 1.647zM6.604 19.345l.374.222c1.617.962 3.554 1.469 5.539 1.47 5.617 0 10.186-4.57 10.189-10.188.002-2.722-1.053-5.28-2.971-7.198s-4.484-2.974-7.209-2.975c-5.616 0-10.187 4.57-10.191 10.188-.001 2.059.539 4.072 1.564 5.867l.244.427-1.018 3.722 3.815-1.002zm11.366-5.467c-.29-.145-1.716-.847-1.978-.942-.262-.096-.453-.145-.644.145-.191.29-.738.942-.905 1.133-.167.191-.334.215-.624.07-1.36-.682-2.299-1.202-3.218-2.783-.243-.417.243-.387.696-1.294.076-.153.038-.287-.019-.431-.057-.145-.453-1.09-.621-1.493-.164-.395-.333-.341-.454-.347-.117-.006-.252-.007-.387-.007s-.356.05-.542.254c-.187.203-.712.696-.712 1.697 0 1.001.728 1.968.829 2.103.102.135 1.433 2.188 3.472 3.07 1.371.593 2.124.64 2.879.529.475-.07 1.716-.701 1.957-1.38.24-.678.24-1.262.168-1.38-.072-.119-.262-.192-.553-.337z"/>
                </svg>
              </a>
            </div>
            <span className="text-xs font-semibold opacity-90">
              &copy; {new Date().getFullYear()} TraDiva
            </span>
            <div className="h-14 w-12 flex items-center justify-center shrink-0 scale-110">
              <ManipuriGirlPlaceholder className="h-full w-auto" />
            </div>
          </div>
        </div>

        {/* Mobile View — hidden on desktop */}
        <div className="flex md:hidden flex-col items-start gap-4 text-left">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="hover:opacity-75 transition-opacity"
              aria-label="Facebook"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
            <a
              href="#"
              className="hover:opacity-75 transition-opacity"
              aria-label="Instagram"
            >
              <svg className="h-5 w-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a
              href="#"
              className="hover:opacity-75 transition-opacity"
              aria-label="WhatsApp"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.47l-6.256 1.647zM6.604 19.345l.374.222c1.617.962 3.554 1.469 5.539 1.47 5.617 0 10.186-4.57 10.189-10.188.002-2.722-1.053-5.28-2.971-7.198s-4.484-2.974-7.209-2.975c-5.616 0-10.187 4.57-10.191 10.188-.001 2.059.539 4.072 1.564 5.867l.244.427-1.018 3.722 3.815-1.002zm11.366-5.467c-.29-.145-1.716-.847-1.978-.942-.262-.096-.453-.145-.644.145-.191.29-.738.942-.905 1.133-.167.191-.334.215-.624.07-1.36-.682-2.299-1.202-3.218-2.783-.243-.417.243-.387.696-1.294.076-.153.038-.287-.019-.431-.057-.145-.453-1.09-.621-1.493-.164-.395-.333-.341-.454-.347-.117-.006-.252-.007-.387-.007s-.356.05-.542.254c-.187.203-.712.696-.712 1.697 0 1.001.728 1.968.829 2.103.102.135 1.433 2.188 3.472 3.07 1.371.593 2.124.64 2.879.529.475-.07 1.716-.701 1.957-1.38.24-.678.24-1.262.168-1.38-.072-.119-.262-.192-.553-.337z"/>
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <span className="text-xs font-semibold opacity-90">
            &copy; {new Date().getFullYear()} TraDiva
          </span>

          {/* Privacy Notice */}
          <Link
            href="#"
            className="text-xs font-bold underline hover:opacity-80 transition-opacity"
          >
            Privacy notice
          </Link>

          {/* Address */}
          <span className="text-xs font-semibold tracking-tight uppercase opacity-90 max-w-[280px]">
            Sreemangal, Sylhet
          </span>
        </div>
      </div>
    </footer>
  );
}
