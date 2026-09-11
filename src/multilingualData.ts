import { LanguageConfig, SupportedLanguageCode } from './types';

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    speechCode: 'en-US',
    flag: '🌐',
    placeholder:
      "Speak or type your messy human situation... (e.g. My mother has an appointment in Whitefield. I am currently in Electronic City. Heavy rain and severe traffic may cause delays. Help me plan a safe and timely journey.)",
    samplePrompt:
      "My mother has an appointment in Whitefield. I am currently in Electronic City. Heavy rain and severe traffic may cause delays. Help me plan a safe and timely journey.",
    sampleSummary:
      "Time-sensitive transit consultation under heavy downpour and peak congestion.",
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    speechCode: 'hi-IN',
    flag: '🇮🇳',
    placeholder:
      "अपनी भाषा में स्थिति बोलें या लिखें... (उदा. मेरी माँ का व्हाइटफील्ड में डॉक्टर का अपॉइंटमेंट है। मैं अभी इलेक्ट्रॉनिक सिटी में हूँ। भारी बारिश और ट्रैफिक की वजह से देरी हो सकती है।)",
    samplePrompt:
      "मेरी माँ का व्हाइटफील्ड में डॉक्टर का अपॉइंटमेंट है। मैं अभी इलेक्ट्रॉनिक सिटी में हूँ। भारी बारिश और ट्रैफिक की वजह से देरी हो सकती है। सुरक्षित और समय पर पहुँचने का रास्ता बताएं।",
    sampleSummary:
      "व्हाइटफील्ड में डॉक्टर की समय-संवेदनशील अपॉइंटमेंट के लिए बारिश और ट्रैफिक के बीच यात्रा योजना।",
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    speechCode: 'mr-IN',
    flag: '🇮🇳',
    placeholder:
      "तुमच्या भाषेत बोला किंवा लिहा... (उदा. माझ्या आईची व्हाईटफील्ड येथे डॉक्टरांची भेट आहे. मी सध्या इलेक्ट्रॉनिक सिटीमध्ये आहे. मुसळधार पाऊस आणि ट्रॅफिकमुळे उशीर होऊ शकतो.)",
    samplePrompt:
      "माझ्या आईची व्हाईटफील्ड येथे डॉक्टरांची भेट आहे. मी सध्या इलेक्ट्रॉनिक सिटीमध्ये आहे. मुसळधार पाऊस आणि वाहतूक कोंडीमुळे उशीर होऊ शकतो. सुरक्षित प्रवासाचे नियोजन करा.",
    sampleSummary:
      "व्हाईटफील्ड येथील डॉक्टरांच्या भेटीसाठी मुसळधार पाऊस व कोंडीत वेळेवर पोहोचण्याचे नियोजन.",
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    speechCode: 'te-IN',
    flag: '🇮🇳',
    placeholder:
      "మీ భాషలో మాట్లాడండి లేదా టైప్ చేయండి... (ఉదా. వైట్‌ఫీల్డ్‌లో మా అమ్మకి డాక్టర్ అపాయింట్‌మెంట్ ఉంది. నేను ఎలక్ట్రానిక్ సిటీలో ఉన్నాను. భారీ వర్షం మరియు ట్రాఫిక్ వల్ల ఆలస్యం కావచ్చు.)",
    samplePrompt:
      "వైట్‌ఫీల్డ్‌లో మా అమ్మకి డాక్టర్ అపాయింట్‌మెంట్ ఉంది. నేను ప్రస్తుతం ఎలక్ట్రానిక్ సిటీలో ఉన్నాను. భారీ వర్షం మరియు తీవ్రమైన ట్రాఫిక్ వల్ల ఆలస్యం కావచ్చు. సురక్షితమైన ప్రయాణ ప్రణాళికను సూచించండి.",
    sampleSummary:
      "వైట్‌ఫీల్డ్‌లో డాక్టర్ అపాయింట్‌మెంట్ కోసం భారీ వర్షం మరియు ట్రాఫిక్‌లో సురక్షిత ప్రయాణ ప్రణాళిక.",
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    speechCode: 'ta-IN',
    flag: '🇮🇳',
    placeholder:
      "உங்கள் மொழியில் பேசுங்கள் அல்லது தட்டச்சு செய்யுங்கள்... (எ.கா. ஒயிட்பீல்டில் என் அம்மாவுக்கு மருத்துவ சந்திப்பு உள்ளது. நான் எலக்ட்ரானிக் சிட்டியில் இருக்கிறேன். பலத்த மழை மற்றும் போக்குவரத்து நெரிசல் உள்ளது.)",
    samplePrompt:
      "வைட்ஃபீல்டில் என் அம்மாவுக்கு மருத்துவ சந்திப்பு உள்ளது. நான் இப்போது எலக்ட்ரானிக் சிட்டியில் இருக்கிறேன். பலத்த மழை மற்றும் போக்குவரத்து நெரிசல் தாமதத்தை ஏற்படுத்தலாம். பாதுகாப்பான பயண திட்டத்தை தாருங்கள்.",
    sampleSummary:
      "ஒயிட்பீல்டு மருத்துவ சந்திப்புக்காக பலத்த மழை மற்றும் நெரிசலில் சரியான நேரத்தில் செல்ல திட்டமிடல்.",
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    speechCode: 'kn-IN',
    flag: '🇮🇳',
    placeholder:
      "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ... (ಉದಾ. ವೈಟ್‌ಫೀಲ್ಡ್‌ನಲ್ಲಿ ನನ್ನ ತಾಯಿಯ ವೈದ್ಯರ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಇದೆ. ನಾನು ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿಯಲ್ಲಿದ್ದೇನೆ. ಭಾರಿ ಮಳೆ ಮತ್ತು ಟ್ರಾಫಿಕ್ ಇದೆ.)",
    samplePrompt:
      "ವೈಟ್‌ಫೀಲ್ಡ್‌ನಲ್ಲಿ ನನ್ನ ತಾಯಿಯ ವೈದ್ಯರ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಇದೆ. ನಾನು ಪ್ರಸ್ತುತ ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿಯಲ್ಲಿದ್ದೇನೆ. ಭಾರಿ ಮಳೆ ಮತ್ತು ಟ್ರಾಫಿಕ್‌ನಿಂದ ತಡವಾಗಬಹುದು. ಸುರಕ್ಷಿತ ಪ್ರಯಾಣದ ಯೋಜನೆ ತಿಳಿಸಿ.",
    sampleSummary:
      "ವೈಟ್‌ಫೀಲ್ಡ್ ವೈದ್ಯರ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಾಗಿ ಭಾರಿ ಮಳೆ ಮತ್ತು ದಟ್ಟಣೆಯ ನಡುವೆ ಸುರಕ್ಷಿತ ಪ್ರಯಾಣ ಯೋಜನೆ.",
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    speechCode: 'bn-IN',
    flag: '🇮🇳',
    placeholder:
      "আপনার ভাষায় কথা বলুন বা লিখুন... (যেমন: হোয়াইটফিল্ডে আমার মায়ের ডাক্তারের অ্যাপয়েন্টমেন্ট আছে। আমি বর্তমানে ইলেকট্রনিক সিটিতে আছি। ভারী বৃষ্টি এবং যানজটের কারণে দেরি হতে পারে।)",
    samplePrompt:
      "হোয়াইটফিল্ডে আমার মায়ের ডাক্তারের অ্যাপয়েন্টমেন্ট আছে। আমি বর্তমানে ইলেকট্রনিক সিটিতে আছি। ভারী বৃষ্টি এবং যানজটের কারণে দেরি হতে পারে। সময়মতো নিরাপদ যাত্রার পরিকল্পনা দিন।",
    sampleSummary:
      "হোয়াইটফিল্ডে ডাক্তারের অ্যাপয়েন্টমেন্টে পৌঁছানোর জন্য ভারী বৃষ্টি ও জ্যামের মধ্যে নিরাপদ ভ্রমণ পরিকল্পনা।",
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    speechCode: 'gu-IN',
    flag: '🇮🇳',
    placeholder:
      "તમારી ભાષામાં બોલો અથવા ટાઇપ કરો... (દા.ત. વ્હાઇટફિલ્ડમાં મારી માતાની ડૉક્ટરની એપોઇન્ટમેન્ટ છે. હું હાલમાં ઇલેક્ટ્રોનિક સિટીમાં છું. ભારે વરસાદ અને ટ્રાફિકને લીધે મોડું થઈ શકે છે.)",
    samplePrompt:
      "વ્હાઇટફિલ્ડમાં મારી માતાની ડૉક્ટરની એપોઇન્ટમેન્ટ છે. હું હાલમાં ઇલેક્ટ્રોનિક સિટીમાં છું. ભારે વરસાદ અને ટ્રાફિકને કારણે વિલંબ થઈ શકે છે. સલામત અને સમયસર મુસાફરીનું આયોજન કરો.",
    sampleSummary:
      "વ્હાઇટફિલ્ડમાં ડૉક્ટરની એપોઇન્ટમેન્ટ માટે ભારે વરસાદ અને ટ્રાફિક વચ્ચે સમયસર પહોંચવાનું આયોજન.",
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    speechCode: 'fr-FR',
    flag: '🇫🇷',
    placeholder:
      "Parlez ou écrivez dans votre langue... (ex. Ma mère a un rendez-vous médical à Whitefield. Je suis à Electronic City. De fortes pluies et des embouteillages risquent de retarder notre trajet.)",
    samplePrompt:
      "Ma mère a un rendez-vous médical à Whitefield. Je suis actuellement à Electronic City. De fortes pluies et des embouteillages risquent de causer des retards. Aidez-moi à planifier un trajet sûr et ponctuel.",
    sampleSummary:
      "Planification d'un trajet médical urgent vers Whitefield sous fortes précipitations et trafic dense.",
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    speechCode: 'es-ES',
    flag: '🇪🇸',
    placeholder:
      "Hable o escriba en su idioma... (ej. Mi madre tiene una cita médica en Whitefield. Actualmente estoy en Electronic City. Fuertes lluvias y mucho tráfico pueden causar retrasos.)",
    samplePrompt:
      "Mi madre tiene una cita médica en Whitefield. Actualmente estoy en Electronic City. Fuertes lluvias y tráfico pesado pueden causar retrasos. Ayúdame a planificar un viaje seguro y puntual.",
    sampleSummary:
      "Planificación de viaje médico urgente a Whitefield bajo fuertes lluvias y congestión vehicular extrema.",
  },
];

export const getLanguageConfig = (code: SupportedLanguageCode): LanguageConfig => {
  return (
    SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0]
  );
};
