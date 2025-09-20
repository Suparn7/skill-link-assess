import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.importantDates": "Important Dates",
      "nav.howToApply": "How to Apply",
      "nav.login": "Login",
      "nav.register": "New Registration",
      "nav.language": "Language",

      // Home Page
      "home.title": "Jharkhand Auxiliary Nurse Midwife Competitive Examination (JANMCE) - 2025",
      "home.subtitle": "Government Of Jharkhand",
      "home.lastDate": "LAST DATE FOR SUBMISSION OF APPLICATION",
      "home.loginTitle": "User Login",
      "home.registrationNo": "Registration No",
      "home.password": "Password",
      "home.loginButton": "LOGIN",
      "home.newRegistration": "New Registration",
      "home.paymentNotice": "The payment option is available. Please pay the registration fee to complete your registration.",
      "home.updated": "Updated",
      "home.notices": "Notices",
      "home.support": "Support - Timing 10:00 AM to 6:00 PM",
      "home.helpline": "Helpline No.: 7250310625",
      "home.email": "Email Id: janmce.helpdesk@gmail.com (TIMING 10:00 AM to 6:00 PM, Monday to Saturday)",

      // Important Dates
      "dates.title": "Important Dates & Eligibility",
      "dates.applicationStart": "Application Start Date",
      "dates.applicationDeadline": "Application Deadline",
      "dates.admitCard": "Admit Card Release",
      "dates.examDate": "Examination Date",
      "dates.toBeAnnounced": "To be announced",
      "dates.education": "Educational Qualification",
      "dates.educationDesc": "Must have passed 10th/Matric and completed the 18-month ANM (Auxiliary Nurse Midwife) training from an INC/SNC recognized institution.",
      "dates.additionalReq": "Additional Requirement: Must be registered with the Jharkhand Nurses Registration Council",
      "dates.instructions": "Important Instructions",
      "dates.ageCriteria": "Age Criteria",
      "dates.category": "Category",
      "dates.minAge": "Minimum Age",
      "dates.maxAge": "Maximum Age",
      "dates.general": "General (Unreserved)",
      "dates.ews": "EWS, BC-I, BC-II (Male)",

      // How to Apply
      "apply.title": "How to Apply",
      "apply.step1": "Click on 'New Registration' button",
      "apply.step2": "Fill in all required personal details",
      "apply.step3": "Upload necessary documents",
      "apply.step4": "Make payment",
      "apply.step5": "Download acknowledgment receipt",

      // Registration
      "register.title": "Candidate Registration",
      "register.personalInfo": "Personal Information",
      "register.firstName": "First Name",
      "register.lastName": "Last Name",
      "register.fatherName": "Father's Name",
      "register.motherName": "Mother's Name",
      "register.dob": "Date of Birth",
      "register.gender": "Gender",
      "register.male": "Male",
      "register.female": "Female",
      "register.other": "Other",
      "register.category": "Category",
      "register.mobile": "Mobile Number",
      "register.email": "Email Address",
      "register.aadhar": "Aadhar Number",
      "register.address": "Address",
      "register.state": "State",
      "register.district": "District",
      "register.pincode": "Pincode",
      "register.continue": "Continue",
      "register.back": "Back",
      "register.submit": "Submit",

      // Education
      "education.title": "Educational Qualification",
      "education.tenthBoard": "10th/Matric Board",
      "education.tenthYear": "Year of Passing",
      "education.tenthMarks": "Marks Obtained",
      "education.anmInstitute": "ANM Training Institute",
      "education.anmYear": "ANM Completion Year",
      "education.anmCertificate": "ANM Certificate Number",
      "education.nursingCouncil": "Nursing Council Registration",

      // Experience
      "experience.title": "Experience Information",
      "experience.workExperience": "Work Experience",
      "experience.organization": "Organization",
      "experience.position": "Position",
      "experience.duration": "Duration",
      "experience.addMore": "Add More Experience",

      // Payment
      "payment.title": "Payment Information",
      "payment.amount": "Application Fee",
      "payment.method": "Payment Method",
      "payment.online": "Online Payment",
      "payment.offline": "Offline Payment",
      "payment.proceed": "Proceed to Payment",

      // Upload Documents
      "upload.title": "Upload Documents",
      "upload.photo": "Passport Size Photo",
      "upload.signature": "Signature",
      "upload.aadharCard": "Aadhar Card",
      "upload.tenthCertificate": "10th Certificate",
      "upload.anmCertificate": "ANM Certificate",
      "upload.nursyUnicilReg": "Nursing Council Registration",
      "upload.choose": "Choose File",
      "upload.uploaded": "Uploaded",

      // Admin
      "admin.dashboard": "Dashboard",
      "admin.candidates": "Manage Candidates",
      "admin.payments": "Manage Payments",
      "admin.reports": "Reports",
      "admin.settings": "Settings",
      "admin.help": "Help & Support",

      // Common
      "common.loading": "Loading...",
      "common.error": "Error",
      "common.success": "Success",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.edit": "Edit",
      "common.delete": "Delete",
      "common.view": "View",
      "common.download": "Download",
      "common.upload": "Upload",
      "common.search": "Search",
      "common.filter": "Filter",
      "common.export": "Export",
      "common.print": "Print",
      "common.yes": "Yes",
      "common.no": "No",
      "common.close": "Close",
      "common.next": "Next",
      "common.previous": "Previous",
      "common.finish": "Finish",
    }
  },
  hi: {
    translation: {
      // Navigation
      "nav.home": "मुख्य पृष्ठ",
      "nav.importantDates": "महत्वपूर्ण तिथियां",
      "nav.howToApply": "आवेदन कैसे करें",
      "nav.login": "लॉगिन",
      "nav.register": "नया पंजीकरण",
      "nav.language": "भाषा",

      // Home Page
      "home.title": "झारखंड सहायक नर्स मिडवाइफ प्रतियोगी परीक्षा (JANMCE) - 2025",
      "home.subtitle": "झारखंड सरकार",
      "home.lastDate": "आवेदन जमा करने की अंतिम तिथि",
      "home.loginTitle": "उपयोगकर्ता लॉगिन",
      "home.registrationNo": "पंजीकरण संख्या",
      "home.password": "पासवर्ड",
      "home.loginButton": "लॉगिन",
      "home.newRegistration": "नया पंजीकरण",
      "home.paymentNotice": "भुगतान का विकल्प उपलब्ध है। कृपया अपना पंजीकरण पूरा करने के लिए पंजीकरण शुल्क का भुगतान करें।",
      "home.updated": "अपडेट किया गया",
      "home.notices": "सूचनाएं",
      "home.support": "समर्थन - समय सुबह 10:00 से शाम 6:00 बजे तक",
      "home.helpline": "हेल्पलाइन नंबर: 7250310625",
      "home.email": "ईमेल आईडी: janmce.helpdesk@gmail.com (समय सुबह 10:00 से शाम 6:00 बजे तक, सोमवार से शनिवार)",

      // Important Dates
      "dates.title": "महत्वपूर्ण तिथियां और योग्यता",
      "dates.applicationStart": "आवेदन प्रारंभ तिथि",
      "dates.applicationDeadline": "आवेदन की अंतिम तिथि",
      "dates.admitCard": "प्रवेश पत्र जारी",
      "dates.examDate": "परीक्षा तिथि",
      "dates.toBeAnnounced": "घोषित किया जाना है",
      "dates.education": "शैक्षणिक योग्यता",
      "dates.educationDesc": "10वीं/मैट्रिक पास होना चाहिए और INC/SNC मान्यता प्राप्त संस्थान से 18 महीने का ANM (सहायक नर्स मिडवाइफ) प्रशिक्षण पूरा होना चाहिए।",
      "dates.additionalReq": "अतिरिक्त आवश्यकता: झारखंड नर्स पंजीकरण परिषद के साथ पंजीकृत होना चाहिए",
      "dates.instructions": "महत्वपूर्ण निर्देश",
      "dates.ageCriteria": "आयु मापदंड",
      "dates.category": "श्रेणी",
      "dates.minAge": "न्यूनतम आयु",
      "dates.maxAge": "अधिकतम आयु",
      "dates.general": "सामान्य (अनारक्षित)",
      "dates.ews": "EWS, BC-I, BC-II (पुरुष)",

      // How to Apply
      "apply.title": "आवेदन कैसे करें",
      "apply.step1": "'नया पंजीकरण' बटन पर क्लिक करें",
      "apply.step2": "सभी आवश्यक व्यक्तिगत विवरण भरें",
      "apply.step3": "आवश्यक दस्तावेज अपलोड करें",
      "apply.step4": "भुगतान करें",
      "apply.step5": "पावती रसीद डाउनलोड करें",

      // Registration
      "register.title": "उम्मीदवार पंजीकरण",
      "register.personalInfo": "व्यक्तिगत जानकारी",
      "register.firstName": "पहला नाम",
      "register.lastName": "अंतिम नाम",
      "register.fatherName": "पिता का नाम",
      "register.motherName": "माता का नाम",
      "register.dob": "जन्म तिथि",
      "register.gender": "लिंग",
      "register.male": "पुरुष",
      "register.female": "महिला",
      "register.other": "अन्य",
      "register.category": "श्रेणी",
      "register.mobile": "मोबाइल नंबर",
      "register.email": "ईमेल पता",
      "register.aadhar": "आधार संख्या",
      "register.address": "पता",
      "register.state": "राज्य",
      "register.district": "जिला",
      "register.pincode": "पिन कोड",
      "register.continue": "जारी रखें",
      "register.back": "वापस",
      "register.submit": "सबमिट करें",

      // Education
      "education.title": "शैक्षणिक योग्यता",
      "education.tenthBoard": "10वीं/मैट्रिक बोर्ड",
      "education.tenthYear": "उत्तीर्ण होने का वर्ष",
      "education.tenthMarks": "प्राप्त अंक",
      "education.anmInstitute": "ANM प्रशिक्षण संस्थान",
      "education.anmYear": "ANM पूर्णता वर्ष",
      "education.anmCertificate": "ANM प्रमाणपत्र संख्या",
      "education.nursingCouncil": "नर्सिंग काउंसिल पंजीकरण",

      // Experience
      "experience.title": "अनुभव जानकारी",
      "experience.workExperience": "कार्य अनुभव",
      "experience.organization": "संगठन",
      "experience.position": "पद",
      "experience.duration": "अवधि",
      "experience.addMore": "और अनुभव जोड़ें",

      // Payment
      "payment.title": "भुगतान जानकारी",
      "payment.amount": "आवेदन शुल्क",
      "payment.method": "भुगतान विधि",
      "payment.online": "ऑनलाइन भुगतान",
      "payment.offline": "ऑफलाइन भुगतान",
      "payment.proceed": "भुगतान के लिए आगे बढ़ें",

      // Upload Documents
      "upload.title": "दस्तावेज अपलोड करें",
      "upload.photo": "पासपोर्ट साइज़ फोटो",
      "upload.signature": "हस्ताक्षर",
      "upload.aadharCard": "आधार कार्ड",
      "upload.tenthCertificate": "10वीं प्रमाणपत्र",
      "upload.anmCertificate": "ANM प्रमाणपत्र",
      "upload.nursingCouncilReg": "नर्सिंग काउंसिल पंजीकरण",
      "upload.choose": "फाइल चुनें",
      "upload.uploaded": "अपलोड किया गया",

      // Admin
      "admin.dashboard": "डैशबोर्ड",
      "admin.candidates": "उम्मीदवारों का प्रबंधन",
      "admin.payments": "भुगतान प्रबंधन",
      "admin.reports": "रिपोर्ट",
      "admin.settings": "सेटिंग्स",
      "admin.help": "सहायता और समर्थन",

      // Common
      "common.loading": "लोड हो रहा है...",
      "common.error": "त्रुटि",
      "common.success": "सफलता",
      "common.save": "सहेजें",
      "common.cancel": "रद्द करें",
      "common.edit": "संपादित करें",
      "common.delete": "हटाएं",
      "common.view": "देखें",
      "common.download": "डाउनलोड",
      "common.upload": "अपलोड",
      "common.search": "खोजें",
      "common.filter": "फिल्टर",
      "common.export": "निर्यात",
      "common.print": "प्रिंट",
      "common.yes": "हां",
      "common.no": "नहीं",
      "common.close": "बंद करें",
      "common.next": "अगला",
      "common.previous": "पिछला",
      "common.finish": "समाप्त",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'hi', // Default to Hindi for Indian users
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;