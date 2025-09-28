import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-20 bg-gradient-primary text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Organization Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">JH</span>
              </div>
              <div>
                <Badge className="bg-secondary text-white mb-1">
                  {t('home.subtitle')}
                </Badge>
                <p className="text-sm font-medium">
                  Jharkhand Staff Selection Commission
                </p>
              </div>
            </div>
            <p className="text-white/80 text-sm">
              Conducting fair and transparent recruitment processes for government positions in Jharkhand.
            </p>
          </div>

          {/* Support Information */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Support Information</h3>
            <div className="space-y-2 text-sm">
              <p>{t('home.support')}</p>
              <p>{t('home.helpline')}</p>
              <p>{t('home.email')}</p>
            </div>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Important Notice</h3>
            <div className="space-y-2 text-sm text-white/80">
              <p>
                By registering on the JSSC website, you agree to provide accurate information.
              </p>
              <p>
                Your personal data will be kept confidential and used solely for recruitment purposes.
              </p>
              <p>
                Ensure you meet all eligibility criteria before registering.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-center">
          <p className="text-white/80 text-sm">
            Copyright ©2025 : All Right Reserved - Jharkhand Staff Selection Commission
          </p>
        </div>
      </div>
    </footer>
  );
}