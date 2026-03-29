"use client";
import Link from "next/link";
import { useMe } from "@/lib/hooks/use-auth";

export default function HomePage() {
  const { data: user } = useMe();

  return (
    <div className="-mx-4 -mt-8">
      <section className="relative border-b border-gray-100 px-6 py-24 sm:py-36">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Mini E-Commerce
          </p>
          <h1 className="mb-6 text-5xl font-black leading-[1.05] tracking-tight text-gray-950 sm:text-7xl">
            Products worth
            <br />
            <span className="text-blue-600">your attention.</span>
          </h1>
          <p className="mb-10 max-w-xl text-lg leading-relaxed text-gray-500">
            A clean, no-nonsense store. Browse the catalogue, add what you need,
            and check out in seconds.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Browse Products
            </Link>
            {!user && (
              <Link
                href="/auth"
                className="inline-flex items-center rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-100 px-6 py-16">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-3">
          {[
            {
              title: "Curated catalogue",
              body: "Every product is in stock and ready to ship. No filler, no noise.",
            },
            {
              title: "Secure checkout",
              body: "Your payment and account data stays protected end to end.",
            },
            {
              title: "Order tracking",
              body: "Follow every order from placement through to delivery.",
            },
          ].map((f) => (
            <div key={f.title}>
              <div className="mb-3 h-px w-8 bg-blue-600" />
              <h3 className="mb-2 text-sm font-bold text-gray-900">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-gray-950 px-10 py-14 text-white">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Ready?
            </p>
            <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl">
              Start shopping today.
            </h2>
            <p className="mb-8 max-w-md text-gray-400">
              {user
                ? `Welcome back, ${user.name.split(" ")[0]}. Pick up where you left off.`
                : "Create a free account in under a minute and start adding to your cart."}
            </p>
            <Link
              href={user ? "/products" : "/auth"}
              className="inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              {user ? "Go to Products" : "Get Started"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
