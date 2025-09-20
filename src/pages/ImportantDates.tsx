import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Award, BookOpen, Users, AlertCircle } from "lucide-react";

export function ImportantDates() {
  const { t } = useTranslation();

  const dates = [
    {
      label: t('dates.applicationStart'),
      value: "11 August 2025",
      icon: Calendar,
      color: "text-success"
    },
    {
      label: t('dates.applicationDeadline'),
      value: "10 September 2025 (till 23:59:59)",
      icon: Clock,
      color: "text-destructive"
    },
    {
      label: t('dates.admitCard'),
      value: t('dates.toBeAnnounced'),
      icon: Award,
      color: "text-warning"
    },
    {
      label: t('dates.examDate'),
      value: t('dates.toBeAnnounced'),
      icon: BookOpen,
      color: "text-primary"
    }
  ];

  const ageCategories = [
    {
      category: t('dates.general'),
      minAge: "18 years",
      maxAge: "40 years"
    },
    {
      category: t('dates.ews'),
      minAge: "18 years",
      maxAge: "42 years"
    }
  ];

  const instructions = [
    "Double-check all details before submission",
    "Keep all required documents ready in prescribed format",
    "Submit before the last date to avoid issues",
    "Both Regular & Backlog vacancies available",
    "Follow official JANMCE-2025 notification for full details"
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
              {t('dates.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Important information about application timeline and eligibility criteria
            </p>
          </motion.div>

          {/* Important Dates */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-heading font-bold text-center text-gradient-primary mb-8">
              Important Dates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dates.map((date, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="glass-card hover-lift h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full bg-background/50 ${date.color}`}>
                          <date.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground mb-1">
                            {date.label}
                          </p>
                          <p className={`text-lg font-bold ${date.color}`}>
                            {date.value}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Educational Qualification */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="glass-card h-full">
                <CardHeader>
                  <CardTitle className="text-2xl font-heading text-gradient-primary flex items-center gap-3">
                    <BookOpen className="h-6 w-6" />
                    {t('dates.education')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground leading-relaxed">
                    {t('dates.educationDesc')}
                  </p>
                  <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <p className="text-warning-foreground font-medium">
                      {t('dates.additionalReq')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Age Criteria */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="glass-card h-full">
                <CardHeader>
                  <CardTitle className="text-2xl font-heading text-gradient-primary flex items-center gap-3">
                    <Users className="h-6 w-6" />
                    {t('dates.ageCriteria')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 font-medium text-foreground">
                            {t('dates.category')}
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-foreground">
                            {t('dates.minAge')}
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-foreground">
                            {t('dates.maxAge')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {ageCategories.map((category, index) => (
                          <tr key={index} className="border-b border-border/50">
                            <td className="py-3 px-2 text-foreground">
                              {category.category}
                            </td>
                            <td className="py-3 px-2 text-success font-medium">
                              {category.minAge}
                            </td>
                            <td className="py-3 px-2 text-primary font-medium">
                              {category.maxAge}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Important Instructions */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-2xl font-heading text-gradient-primary flex items-center gap-3">
                  <AlertCircle className="h-6 w-6" />
                  {t('dates.instructions')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {instructions.map((instruction, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-foreground">
                        {instruction}
                      </p>
                    </motion.div>
                  ))}
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