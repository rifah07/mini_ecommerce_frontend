"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMe, useLogout } from "@/lib/hooks/use-auth";
import { useCart } from "@/lib/hooks/use-cart";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { data: user } = useMe();
  const { data: cart } = useCart();
  const logout = useLogout();

  const cartCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors",
        pathname === href
          ? "text-gray-950"
          : "text-gray-400 hover:text-gray-900",
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-base font-black tracking-tight text-gray-950"
        >
          ShopNest
        </Link>

        <nav className="flex items-center gap-6">
          {navLink("/products", "Products")}
          {user && navLink("/orders", "Orders")}
          {user?.role === "admin" && (
            <Link
              href="/admin/products"
              className={cn(
                "text-sm font-medium transition-colors",
                pathname.startsWith("/admin")
                  ? "text-purple-700"
                  : "text-purple-400 hover:text-purple-700",
              )}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/cart"
                className="relative text-sm font-medium text-gray-400 transition-colors hover:text-gray-900"
              >
                Cart
                {cartCount > 0 && (
                  <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link
                href="/profile"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600 transition hover:bg-gray-200"
                title={user.name}
              >
                {user.name.charAt(0).toUpperCase()}
              </Link>
            </>
          ) : (
            <Link href="/auth">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
