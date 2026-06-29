import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export const NavigationMenu = ({ children, className }) => (
  <nav className={cn("flex items-center justify-center gap-4", className)}>
    {children}
  </nav>
);

export const NavigationMenuList = ({ children, className }) => (
  <ul className={cn("flex items-center gap-2 list-none m-0 p-0", className)}>
    {children}
  </ul>
);

export const NavigationMenuItem = ({ children, className }) => (
  <li className={cn("relative", className)}>{children}</li>
);

export const NavigationMenuLink = ({
  to,
  children,
  className,
  exact = false,
  onClick,
}) => {
  const location = useLocation();
  const isActive = exact
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "text-muted-foreground hover:text-primary transition-colors inline-flex h-10 items-center justify-center rounded-md bg-background px-4 text-sm font-medium focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
        isActive && "text-primary bg-accent/20",
        className
      )}
    >
      {children}
    </Link>
  );
};

export const NavigationMenuTrigger = ({ children, onClick, open, className }) => (
  <button
    onClick={onClick}
    className={cn(
      "inline-flex items-center justify-center gap-1 rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
      className
    )}
  >
    {children}
    <ChevronDown
      className={`w-3 h-3 transition-transform duration-300 ${
        open ? "rotate-180" : ""
      }`}
    />
  </button>
);

export const NavigationMenuContent = ({ children, open, className }) =>
  open ? (
    <div
      className={cn(
        "absolute left-0 mt-2 w-48 rounded-md border bg-popover shadow-md",
        className
      )}
    >
      {children}
    </div>
  ) : null;

export const NavigationMenuDropdownItem = ({ to, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
  >
    {label}
  </Link>
);
