import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Lock, 
  Mail, 
  ArrowRight,
  UserCog,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const adminSignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInForm = z.infer<typeof signInSchema>;
type SignUpForm = z.infer<typeof signUpSchema>;
type AdminSignInForm = z.infer<typeof adminSignInSchema>;

export function Auth() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const adminForm = useForm<AdminSignInForm>({
    resolver: zodResolver(adminSignInSchema),
  });

  const handleSignIn = async (data: SignInForm) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);

    if (error) {
      // local fallback: check sla_users
      try {
        const usersRaw = localStorage.getItem('sla_users');
        if (usersRaw) {
          const users = JSON.parse(usersRaw);
          const found = users.find((u: any) => u.email === data.email && u.password === data.password);
          if (found) {
            toast({ title: "Success", description: "Signed in (local)" });
            // store simple current user
            localStorage.setItem('sla_current_user', JSON.stringify({ id: found.regNumber, email: found.email }));
            navigate("/dashboard");
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {}

      toast({
        title: "Error",
        description: error.message || 'Sign in failed',
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Signed in successfully",
      });
      navigate("/dashboard");
    }
    setIsLoading(false);
  };

  const handleSignUp = async (data: SignUpForm) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password).catch(e => ({ error: e }));

    if (error) {
      // fallback: create local user entry with generated regNumber/password
      try {
        const regNumber = `REG${Date.now().toString().slice(-6)}`;
        const usersRaw = localStorage.getItem('sla_users') || '[]';
        const users = JSON.parse(usersRaw);
        users.push({ regNumber, email: data.email, password: data.password });
        localStorage.setItem('sla_users', JSON.stringify(users));
        toast({ title: "Success (local)", description: `Account created. Reg: ${regNumber}` });
        setActiveTab("signin");
      } catch (e) {
        toast({ title: "Error", description: 'Sign up failed', variant: 'destructive' });
      }
    } else {
      toast({
        title: "Success",
        description: "Account created successfully! Please check your email for verification.",
      });
      setActiveTab("signin");
    }
    setIsLoading(false);
  };

  const handleAdminSignIn = async (data: AdminSignInForm) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      // Check if user is admin (this would need to be validated against the profile role)
      toast({
        title: "Success",
        description: "Admin signed in successfully",
      });
      navigate("/admin");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="py-20">
        <div className="container mx-auto px-4 max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Badge className="gov-badge mb-4">
              {t('home.subtitle')}
            </Badge>
            <h1 className="text-4xl font-heading font-bold text-gradient-primary mb-4">
              Login / Register
            </h1>
          </motion.div>

          <Card className="glass-card">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 form-glass"
                          {...signInForm.register("email")}
                        />
                      </div>
                      {signInForm.formState.errors.email && (
                        <p className="text-sm text-destructive">{signInForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-password"
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10 form-glass"
                          {...signInForm.register("password")}
                        />
                      </div>
                      {signInForm.formState.errors.password && (
                        <p className="text-sm text-destructive">{signInForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      variant="default"
                      className="w-full"
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      New candidate? {" "}
                      <Link to="/register" className="text-primary hover:underline">
                        Register here
                      </Link>
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="admin">
                  <div className="mb-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <UserCog className="h-5 w-5 text-warning" />
                      <p className="text-sm text-warning-foreground">
                        Admin access only. Please contact administrator for credentials.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={adminForm.handleSubmit(handleAdminSignIn)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Admin Email</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="admin-email"
                          type="email"
                          placeholder="Enter admin email"
                          className="pl-10 form-glass"
                          {...adminForm.register("email")}
                        />
                      </div>
                      {adminForm.formState.errors.email && (
                        <p className="text-sm text-destructive">{adminForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Admin Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="admin-password"
                          type="password"
                          placeholder="Enter admin password"
                          className="pl-10 form-glass"
                          {...adminForm.register("password")}
                        />
                      </div>
                      {adminForm.formState.errors.password && (
                        <p className="text-sm text-destructive">{adminForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      variant="warning"
                      className="w-full"
                    >
                      {isLoading ? "Signing in..." : "Admin Sign In"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}