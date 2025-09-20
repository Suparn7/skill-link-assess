// SMS API Integration for Assessment Platform
const SMS_API_CONFIG = {
  apiKey: 'FKulmoGm5kqrMrYu9pb4Tg',
  senderId: 'IITSPL',
  channel: 'Trans',
  route: '4',
  peId: '1001681630089893521',
  baseUrl: 'http://cloud.smsindiahub.in/api/mt/SendSMS'
};

// SMS Templates
export const SMS_TEMPLATES = {
  OTP_REGISTRATION: {
    templateId: '1007432424786956069',
    template: 'Dear Applicant, Registration for the post of ##var## at https://jsscapply.in. OTP is ##var##.Please do not share. IITSPL'
  },
  REGISTRATION_SUCCESS: {
    templateId: '1007559315355118223',
    template: 'Dear Applicant, your registration for the post JANMCE-25 is successful. Reg No: ##var##, Password: ##var##. Please keep these credentials confidential. IITSPL'
  },
  FORGOT_PASSWORD: {
    templateId: '1007378810078061977',
    template: 'Dear Applicant, your Registered password for ##var## is ##var##. Do not share this with anyone. IITSPL'
  }
};

interface SMSParams {
  mobile: string;
  message: string;
  templateId: string;
}

export class SMSService {
  private static formatMobile(mobile: string): string {
    // Ensure mobile number has country code
    if (mobile.startsWith('91')) return mobile;
    if (mobile.startsWith('+91')) return mobile.substring(1);
    if (mobile.startsWith('0')) return '91' + mobile.substring(1);
    return '91' + mobile;
  }

  static async sendSMS({ mobile, message, templateId }: SMSParams): Promise<boolean> {
    try {
      const formattedMobile = this.formatMobile(mobile);
      const encodedMessage = encodeURIComponent(message);

      const url = `${SMS_API_CONFIG.baseUrl}?APIKey=${SMS_API_CONFIG.apiKey}&senderid=${SMS_API_CONFIG.senderId}&channel=${SMS_API_CONFIG.channel}&DCS=0&flashsms=0&number=${formattedMobile}&text=${encodedMessage}&route=${SMS_API_CONFIG.route}&PEId=${SMS_API_CONFIG.peId}&TemplateId=${templateId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.text();
      console.log('SMS API Response:', result);

      return response.ok;
    } catch (error) {
      console.error('SMS sending failed:', error);
      return false;
    }
  }

  static async sendOTP(mobile: string, otp: string, postCode: string = 'JANMCE-25'): Promise<boolean> {
    const message = SMS_TEMPLATES.OTP_REGISTRATION.template
      .replace('##var##', postCode)
      .replace('##var##', otp);

    return this.sendSMS({
      mobile,
      message,
      templateId: SMS_TEMPLATES.OTP_REGISTRATION.templateId
    });
  }

  static async sendRegistrationSuccess(mobile: string, regNo: string, password: string): Promise<boolean> {
    const message = SMS_TEMPLATES.REGISTRATION_SUCCESS.template
      .replace('##var##', regNo)
      .replace('##var##', password);

    return this.sendSMS({
      mobile,
      message,
      templateId: SMS_TEMPLATES.REGISTRATION_SUCCESS.templateId
    });
  }

  static async sendForgotPassword(mobile: string, password: string, postCode: string = 'JANMCE-25'): Promise<boolean> {
    const message = SMS_TEMPLATES.FORGOT_PASSWORD.template
      .replace('##var##', postCode)
      .replace('##var##', password);

    return this.sendSMS({
      mobile,
      message,
      templateId: SMS_TEMPLATES.FORGOT_PASSWORD.templateId
    });
  }
}

// OTP Generator
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Registration Number Generator
export const generateRegistrationNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
  return `JANMCE${timestamp}${random}`;
};

// Password Generator
export const generatePassword = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};