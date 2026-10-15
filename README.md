# PawCare mobile

यह Android और iPhone के लिए installable Progressive Web App है। एक ही mobile-first ऐप दोनों प्लेटफ़ॉर्म पर चलता है और ऑफ़लाइन उपयोग के लिए इसकी मुख्य हिंदी सामग्री cache होती है।

## अपने फोन पर चलाएँ

ऐप को किसी HTTPS वेबसाइट पर publish करें, फिर:

- **Android:** Chrome में वेबसाइट खोलें → ब्राउज़र मेन्यू → **Install app** या **Add to Home screen**।
- **iPhone/iPad:** Safari में वेबसाइट खोलें → **Share** → **Add to Home Screen**।

स्थानीय विकास में फ़ाइल को सीधे `file://` से खोलने की जगह local web server इस्तेमाल करें; PWA install और offline mode के लिए HTTPS (या localhost) चाहिए। इस फ़ोल्डर की फ़ाइलें किसी static web host पर publish की जा सकती हैं।

## फ़ाइलें

- `index.html` — responsive mobile UI
- `app.js` — Hindi sections और navigation
- `manifest.webmanifest` — installable app metadata
- `sw.js` — offline cache
- `paw.svg` — app icon

पशु-स्वास्थ्य संबंधी सावधानी और स्रोत desktop guide जैसे ही हैं: दवा, टीका और गर्भावस्था की व्यक्तिगत योजना पशु-चिकित्सक से तय करें।
