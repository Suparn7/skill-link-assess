import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  FileText, 
  Upload, 
  CreditCard, 
  Download,
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";

export function HowToApply() {
  const { t } = useTranslation();

  const steps = [
    {
      step: 1,
      title: t('apply.step1'),
      description: "Create your account and get registration credentials via SMS",
      icon: UserPlus,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      step: 2,
      title: t('apply.step2'),
      description: "Complete personal, educational, and experience information",
      icon: FileText,
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      step: 3,
      title: t('apply.step3'),
      description: "Upload all required documents in prescribed format",
      icon: Upload,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      step: 4,
      title: t('apply.step4'),
      description: "Complete payment process using secure payment gateway",
      icon: CreditCard,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      step: 5,
      title: t('apply.step5'),
      description: "Download and save your application acknowledgment",
      icon: Download,
      color: "text-primary",
      bgColor: "bg-primary/10"
    }
  ];

  const requirements = [
    {
      title: "Personal Documents",
      items: [
        "Passport size photograph (recent)",
        "Signature in prescribed format",
        "Aadhar Card (clear copy)",
        "Valid mobile number for SMS verification"
      ],
      icon: FileText,
      color: "text-primary"
    },
    {
      title: "Educational Certificates",
      items: [
        "10th/Matric Certificate",
        "ANM Training Certificate",
        "Nursing Council Registration",
        "Institution Recognition Certificate"
      ],
      icon: Upload,
      color: "text-secondary"
    },
    {
      title: "Additional Requirements",
      items: [
        "Valid email address",
        "Payment method (Debit/Credit Card/Net Banking)",
        "Permanent address proof",
        "Category certificate (if applicable)"
      ],
      icon: Shield,
      color: "text-success"
    }
  ];

  const tips = [
    {
      title: "Before You Start",
      content: "Ensure you have all required documents ready in digital format before beginning the registration process."
    },
    {
      title: "Photo & Signature Guidelines",
      content: "Upload recent passport-size photo and signature in JPG/PNG format, size should be between 10KB to 100KB."
    },
    {
      title: "Payment Process",
      content: "Keep your payment method ready. Transaction failures may cause delays in application processing."
    },
    {
      title: "Technical Support",
      content: "For technical issues, contact helpline: 7250310625 (10:00 AM to 6:00 PM, Monday to Saturday)."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge className="gov-badge mb-4">
              {t('home.subtitle')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gradient-primary mb-4">
              {t('apply.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Step-by-step guide to complete your JANMCE-2025 application process
            </p>
          </motion.div>

          {/* Application Steps */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-heading font-bold text-center text-gradient-primary mb-8">
              Application Process
            </h2>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="glass-card hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <div className={`flex-shrink-0 w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center`}>
                          <step.icon className={`h-8 w-8 ${step.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-gradient-primary text-white">
                              Step {step.step}
                            </Badge>
                            <h3 className="text-xl font-heading font-semibold text-foreground">
                              {step.title}
                            </h3>
                          </div>
                          <p className="text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <ArrowRight className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center mt-8"
            >
              <Link to="/register">
                <Button variant="hero" size="xl">
                  Start Your Application
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Requirements */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-heading font-bold text-center text-gradient-primary mb-8">
              Document Requirements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {requirements.map((req, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <Card className="glass-card hover-lift h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <req.icon className={`h-6 w-6 ${req.color}`} />
                        {req.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {req.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Important Tips */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-heading font-bold text-center text-gradient-primary mb-8">
              Important Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tips.map((tip, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                >
                  <Card className="glass-card hover-lift h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h3 className="font-heading font-semibold text-foreground mb-2">
                            {tip.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {tip.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Support Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16"
          >
            <Card className="glass-card bg-gradient-glass">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
                  Need Help?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Our support team is here to help you throughout the application process. 
                  Don't hesitate to reach out if you face any difficulties.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="default" size="lg">
                    <Clock className="mr-2 h-4 w-4" />
                    {t('home.helpline')}
                  </Button>
                  <Button variant="secondary" size="lg">
                    <Shield className="mr-2 h-4 w-4" />
                    Email Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}