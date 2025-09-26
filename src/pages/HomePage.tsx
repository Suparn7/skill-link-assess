import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import heroBanner from "@/assets/hero-banner.jpg";
import medicalPattern from "@/assets/medical-pattern.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  Calendar, 
  FileText, 
  Users, 
  Shield, 
  Clock, 
  Award,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Lock
} from "lucide-react";
import { Link } from "react-router-dom";

export function HomePage() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    registrationNo: '',
    password: ''
  });

  const features = [
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Government-grade security for your data",
      color: "text-primary"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock assistance",
      color: "text-secondary"
    },
    {
      icon: Award,
      title: "Certified Process",
      description: "Official JSSC examination portal",
      color: "text-success"
    },
    {
      icon: Users,
      title: "Thousands of Candidates",
      description: "Join lakhs of applicants",
      color: "text-warning"
    }
  ];

  const stats = [
    { label: "Total Applications", value: "50,000+", icon: FileText },
    { label: "Success Rate", value: "95%", icon: Award },
    { label: "Active Candidates", value: "25,000+", icon: Users },
    { label: "Processing Time", value: "2 Min", icon: Clock }
  ];

  const notices = [
    {
      title: "JANMCE-2025 Notice (Advt 03/2025-JANMCE)",
      date: "09-08-2025 | 12:34 PM",
      important: true
    },
    {
      title: "Brochure of Jharkhand Auxiliary Nurse Midwife Competitive Examination 2025 - Regular",
      date: "09-08-2025 | 12:13 AM",
      important: false
    },
    {
      title: "Brochure of Jharkhand Auxiliary Nurse Midwife Competitive Examination 2025 - Backlog",
      date: "09-08-2025 | 12:01 AM",
      important: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src={heroBanner} 
            alt="JANMCE-2025 Hero Banner" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-success/15"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge className="gov-badge">
                  {t('home.subtitle')}
                </Badge>
                <h1 className="hero-title leading-tight">
                  JANMCE-2025
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Jharkhand Auxiliary Nurse Midwife Competitive Examination - Your gateway to a prestigious nursing career in government healthcare.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    {t('nav.register')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/important-dates">
                  <Button variant="glass" size="xl" className="w-full sm:w-auto">
                    {t('nav.importantDates')}
                    <Calendar className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="glass-card bg-gradient-glass">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold text-primary">
                      {t('home.lastDate')}
                    </p>
                    <p className="text-2xl font-bold text-destructive">
                      10 September 2025
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Login Info Card */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <Card className="hero-card shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-heading text-gradient-primary">
                    Candidate Login
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                      <h3 className="font-semibold text-primary mb-2">New Candidates</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        First time registering? Create your account and complete exam registration.
                      </p>
                      <Link to="/auth">
                        <Button variant="default" className="w-full">
                          Sign Up / Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>

                    <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                      <h3 className="font-semibold text-secondary mb-2">Existing Candidates</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Already have an account? Login to view your applications and status.
                      </p>
                      <Link to="/auth">
                        <Button variant="secondary" className="w-full">
                          Login with Email & Password
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      After registration, you'll receive an application number to track your progress.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-warning/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-warning rounded-full mt-2 animate-pulse"></div>
                    <div>
                      <p className="text-sm font-medium text-warning">
                        Payment Notice
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('home.paymentNotice')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 bg-gradient-glass overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={medicalPattern} 
            alt="Medical Pattern Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <Card className="glass-card hover-lift">
                  <CardContent className="pt-6">
                    <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <p className="text-2xl font-bold text-gradient-primary mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gradient-primary mb-4">
              Why Choose JANMCE Portal?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the most advanced and secure government examination platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="glass-card hover-lift h-full">
                  <CardContent className="pt-6 text-center">
                    <feature.icon className={`h-12 w-12 mx-auto mb-4 ${feature.color}`} />
                    <h3 className="font-heading font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notices Section */}
      <section className="py-20 bg-gradient-glass">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-heading font-bold text-center text-gradient-primary mb-8">
              Latest Notices & Updates
            </h2>

            <div className="space-y-4">
              {notices.map((notice, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className={`glass-card hover-lift ${notice.important ? 'border-secondary/30' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {notice.important && (
                              <Badge className="bg-secondary text-white">
                                Important
                              </Badge>
                            )}
                            <span className="text-sm text-muted-foreground">
                              {t('home.updated')}: {notice.date}
                            </span>
                          </div>
                          <h3 className="font-medium text-foreground leading-relaxed">
                            {notice.title}
                          </h3>
                        </div>
                        <Button variant="ghost" size="sm" className="flex-shrink-0">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}