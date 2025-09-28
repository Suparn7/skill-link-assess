import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, loading, signOut } = useAuth();
  // Example: check if user is admin (replace with your logic)
  const isAdmin = user?.role === "admin" || user?.email?.endsWith("@admin.com");

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 glass-nav">
      {/* Top Info Bar */}
      <div className="bg-gradient-primary text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm">
            <div className="flex items-center gap-4 mb-2 sm:mb-0">
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>7250310625</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>janmce.helpdesk@gmail.com</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>{t('home.lastDate')}: 10 Sep 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">JH</span>
            </div>
            <div>
              <Badge className="gov-badge mb-2">{t('home.subtitle')}</Badge>
              <h1 className="font-heading text-lg lg:text-xl font-bold text-primary">
                {t('home.title')}
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2 lg:gap-4">
            <Link to="/">
              <Button 
                variant={isActive('/') ? "default" : "ghost"} 
                size="sm"
                className={isActive('/') ? "bg-gradient-primary" : "glass-nav"}
              >
                {t('nav.home')}
              </Button>
            </Link>
            <Link to="/important-dates">
              <Button 
                variant={isActive('/important-dates') ? "default" : "ghost"} 
                size="sm"
                className={isActive('/important-dates') ? "bg-gradient-primary" : "glass-nav"}
              >
                {t('nav.importantDates')}
              </Button>
            </Link>
            <Link to="/how-to-apply">
              <Button 
                variant={isActive('/how-to-apply') ? "default" : "ghost"} 
                size="sm"
                className={isActive('/how-to-apply') ? "bg-gradient-primary" : "glass-nav"}
              >
                {t('nav.howToApply')}
              </Button>
            </Link>
            {!loading && !user && (
              <Link to="/auth">
                <Button variant={isActive('/auth') ? "default" : "ghost"} size="sm" className={isActive('/auth') ? "bg-gradient-primary" : "glass-nav"}>
                  Login
                </Button>
              </Link>
            )}
            {!loading && user && !isAdmin && (
              <>
                <Link to="/dashboard">
                  <Button variant={isActive('/dashboard') ? "default" : "ghost"} size="sm" className={isActive('/dashboard') ? "bg-gradient-primary" : "glass-nav"}>
                    Dashboard
                  </Button>
                </Link>
                <Link to="/verify-phone">
                  <Button variant={isActive('/verify-phone') ? "default" : "ghost"} size="sm" className={isActive('/verify-phone') ? "bg-gradient-primary" : "glass-nav"}>
                    Verify Phone
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant={isActive('/register') ? "default" : "ghost"} size="sm" className={isActive('/register') ? "bg-gradient-primary" : "glass-nav"}>
                    Register
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  Logout
                </Button>
              </>
            )}
            {!loading && user && isAdmin && (
              <>
                <Link to="/admin">
                  <Button variant={isActive('/admin') ? "default" : "ghost"} size="sm" className={isActive('/admin') ? "bg-gradient-primary" : "glass-nav"}>
                    Admin Panel
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  Logout
                </Button>
              </>
            )}
            <LanguageToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}