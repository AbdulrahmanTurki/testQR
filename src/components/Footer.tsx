import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to get started?
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          Contact us today to learn more about how Paytab can revolutionize your business.
        </p>
        <div className="mt-8">
          <Link
            href="mailto:contact@paytab.com"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            Contact Us
          </Link>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8">
          <p className="text-base text-slate-400">
            &copy; {new Date().getFullYear()} Paytab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 