'use client';;
import * as React from 'react';
import { useEffect, useState, useRef, useId } from 'react';
import { SearchIcon, BellIcon, ChevronDownIcon, User, CircleUserRound } from 'lucide-react';
import { Button } from '../../button';
import { Input } from '../../input';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '../../navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../../avatar';
import { Badge } from '../../badge';
import { cn } from '../../../../lib/utils';
import ThemeButton from '../../theme-button';
import { useDispatch, useSelector } from 'react-redux';
import { navOptions } from '../../../../store/navOptionsSlice'; // Adjust import path as needed
import { useNavigate } from 'react-router-dom';
import useLogout from '@/utils/logoutFunc';

// Simple logo component for the navbar
const Logo = (props) => {
  return (
    <svg
      width='1em'
      height='1em'
      viewBox='0 0 324 323'
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
      {...props}>
      <rect
        x='88.1023'
        y='144.792'
        width='151.802'
        height='36.5788'
        rx='18.2894'
        transform='rotate(-38.5799 88.1023 144.792)'
        fill='currentColor' />
      <rect
        x='85.3459'
        y='244.537'
        width='151.802'
        height='36.5788'
        rx='18.2894'
        transform='rotate(-38.5799 85.3459 244.537)'
        fill='currentColor' />
    </svg>
  );
};

const HamburgerIcon = ({ className, ...props }) => (
  <svg
    className={cn('pointer-events-none', className)}
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]" />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45" />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]" />
  </svg>
);

const NotificationMenu = ({ notificationCount = 3, onItemClick }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="h-9 w-9 relative">
        <BellIcon className="h-4 w-4" />
        {notificationCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {notificationCount > 9 ? '9+' : notificationCount}
          </Badge>
        )}
        <span className="sr-only">Notifications</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-80">
      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.('notification1')}>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">New message received</p>
          <p className="text-xs text-muted-foreground">2 minutes ago</p>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.('notification2')}>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">System update available</p>
          <p className="text-xs text-muted-foreground">1 hour ago</p>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.('notification3')}>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Weekly report ready</p>
          <p className="text-xs text-muted-foreground">3 hours ago</p>
        </div>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.('view-all')}>
        View all notifications
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const UserMenu = ({
  onItemClick,
}) => {
  const logout = useLogout(); 
  const navigate = useNavigate()
  const {email, username, avatar} = useSelector((s) => s.auth.user)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 px-2 py-0 hover:bg-accent hover:text-accent-foreground"
        >
          <Avatar className="h-7 w-7">
            {avatar ? <AvatarImage src={userAvatar} alt={username} /> : <CircleUserRound className='flex place-self-center size-6 dark:text-gray-400 text-slate-500' />}
          </Avatar>
          <ChevronDownIcon className="h-3 w-3 ml-1 text-slate-500 dark:text-gray-400" />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}> {/* ✅ Correct usage */}
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const defaultNavigationLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/sales', label: 'Sales' },
];

export const Navbar08 = React.forwardRef((
  {
    className,
    logo = <Logo />,
    logoHref = '#',
    navigationLinks = defaultNavigationLinks,
    searchPlaceholder = 'Search...',
    searchShortcut = '⌘K',
    userAvatar,
    notificationCount = 3,
    onNavItemClick,
    onSearchSubmit,
    onNotificationItemClick,
    onUserItemClick,
    ...props
  },
  ref
) => {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const searchId = useId();

  const dispatch = useDispatch();
  const navSelected = useSelector(state => state.nav.navSelected);
  const navigate = useNavigate();

  const handleNavItemClick = (link) => {
    dispatch(navOptions(link.label));

    if (typeof onNavItemClick === "function") {
      onNavItemClick(link.label);
    }

    // Navigate to the correct href directly
    navigate(link.href);
  };

  // Map links and set active based on Redux state
  const linksWithActive = navigationLinks.map(link => ({
    ...link,
    active: link.label === navSelected,
  }));

  useEffect(() => {
    const checkWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setIsMobile(width < 768); // md breakpoint for mobile
      }
    };

    checkWidth();

    const resizeObserver = new ResizeObserver(checkWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Combine refs for forwarded ref support
  const combinedRef = React.useCallback((node) => {
    containerRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search');
    if (onSearchSubmit) {
      onSearchSubmit(query);
    }
  };

  const user = useSelector(state => state.auth.user);
  const shopName = user.shopName;

  return (
    <header
      ref={combinedRef}
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 [&_*]:no-underline',
        className
      )}
      {...props}>
      <div className="container mx-auto max-w-screen-2xl">
        {/* Top section */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex flex-1 items-center gap-2">
            {/* Mobile menu trigger */}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="group h-8 w-8 hover:bg-accent hover:text-accent-foreground"
                    variant="ghost"
                    size="icon">
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 p-1">
                  <NavigationMenu className="max-w-none">
                    <NavigationMenuList className="flex-col items-start gap-0">
                      {linksWithActive.map((link, index) => (
                        <NavigationMenuItem key={index} className="w-full">
                          <NavigationMenuLink
                            to={`/${link.href.toLowerCase()}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavItemClick(link);
                            }}
                            className={cn(
                              'text-muted-foreground hover:text-primary py-1.5 font-medium transition-colors cursor-pointer group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
                              link.active && 'text-primary'
                            )}
                          >
                            {link.label}
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleNavItemClick({ label: 'Home', href: '/' });
                }}
                className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors cursor-pointer">
                <div className="text-2xl">
                  {logo}
                </div>
                <span className="hidden font-bold text-xl sm:inline-block">{shopName || "ShopName"}</span>
              </button>
            </div>
          </div>

          {/* Middle area */}
          <div className="grow">
            {/* Search form 
            <form
              onSubmit={handleSearchSubmit}
              className="relative mx-auto w-full max-w-xs">
              <Input
                id={searchId}
                name="search"
                className="peer h-8 ps-8 pe-10"
                placeholder={searchPlaceholder}
                type="search" />
              <div
                className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
                <SearchIcon size={16} />
              </div>
              <div
                className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-2">
                <kbd
                  className="text-muted-foreground/70 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                  {searchShortcut}
                </kbd>
              </div>
            </form>*/}
          </div>

          {/* Right side */}
          <div className="flex flex-1 items-center justify-end gap-2">
            {/* Notification */}
             <NotificationMenu
              notificationCount={notificationCount}
              onItemClick={onNotificationItemClick} /> 
            <ThemeButton />
            
            <UserMenu
              userName={userAvatar?.userName ?? 'John Doe'}
              userEmail={userAvatar?.userEmail ?? 'john@example.com'}
              userAvatar={userAvatar}
              onItemClick={onUserItemClick} />
          </div>
        </div>
        
        {/* Bottom navigation */}
        {!isMobile && (
          <div className='flex items-center justify-between px-5'>
            <div className="border-t py-2">
              <NavigationMenu>
                <NavigationMenuList className="gap-2">
                  {linksWithActive.map((link, index) => (
                    <NavigationMenuItem key={index}>
                      <NavigationMenuLink
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavItemClick(link);
                        }}
                        className={cn(
                          'text-muted-foreground hover:text-primary py-1.5 font-medium transition-colors cursor-pointer group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
                          link.active && 'text-primary'
                        )}
                        data-active={link.active}>
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        )}
      </div>
    </header>
  );
});

Navbar08.displayName = 'Navbar08';

export { Logo, HamburgerIcon, NotificationMenu, UserMenu };
