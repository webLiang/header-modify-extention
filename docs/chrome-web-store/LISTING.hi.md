# Chrome Web Store लिस्टिंग कॉपी (हिन्दी)

> [Developer Dashboard](https://chrome.google.com/webstore/devconsole) → Store listing में पेस्ट करें (हिन्दी locale)।  
> Manifest की छोटी description `_locales/hi/messages.json` (`extensionDescription`) में है।

**ओपन सोर्स:** [https://github.com/webLiang/header-modify-extention](https://github.com/webLiang/header-modify-extention)

---

## नाम

```
Header Modify
```

## संक्षिप्त विवरण (≤132 अक्षर)

```
ओपन-सोर्स टूल: साइट के अनुसार HTTP अनुरोध हेडर बदलें (iframe सहित)। Chrome DevTools से पेस्ट करें।
```

## विस्तृत विवरण

```
Header Modify एक ओपन-सोर्स Chrome एक्सटेंशन है जो आपके द्वारा सक्षम की गई वेबसाइटों पर HTTP अनुरोध हेडर को फिर से लिखता है।

ओपन सोर्स
GitHub पर पूरी तरह ओपन सोर्स — कोड पढ़ें, अनुमतियाँ जाँचें, issue खोलें और योगदान दें:
https://github.com/webLiang/header-modify-extention
कोई obfuscation नहीं, कोई रिमोट कोड नहीं, कोई विज्ञापन नहीं। इंस्टॉल पैकेज सार्वजनिक रिपॉजिटरी से मेल खाता है।

एकल उद्देश्य
यह एक्सटेंशन एक ही काम करता है: जिन origin को आप सक्षम करते हैं, उस टैब के नेटवर्क अनुरोधों (iframe सहित) पर आपके हेडर लागू करता है — Manifest V3 declarativeNetRequest modifyHeaders, set अर्थ (न हो तो जोड़ें, हो तो बदलें)।

किसके लिए
• Auth, CORS, भाषा या CDN मामलों को डिबग करने वाले फ्रंट-एंड डेवलपर
• क्लाइंट हेडर स्थितियाँ दोहराने वाले QA इंजीनियर
• अस्थायी User-Agent / कस्टम हेडर चाहिए होने वाले पावर यूज़र

उपयोग कैसे करें
1. इंस्टॉल के बाद सभी साइटों पर rewriting बंद रहती है।
2. कोई http(s) पेज खोलें, टूलबार आइकन पर क्लिक करें, Chrome DevTools से हेडर पेस्ट करें (या मैन्युअल जोड़ें)।
3. “इस साइट के लिए सक्षम करें” चालू करें। पेज रीलोड कर Network जाँचें।
4. उसी टैब के क्रॉस-オリजिन iframe अनुरोध भी शामिल हैं (session rules + tabIds)।

अनुमतियाँ
• storage — हेडर, सक्षम origin और भाषा स्थानीय रूप से सहेजना (अपलोड नहीं)
• tabs — सक्रिय टैब URL/origin पढ़ना और नियम सिंक रखना
• declarativeNetRequest — हेडर बदलाव लागू करना
• declarativeNetRequestFeedback — वैकल्पिक नियम निदान
• host access (<all_urls>) — मनचाहे साइटों और iframe अनुरोधों पर हेडर बदलने के लिए आवश्यक

गोपनीयता
कोई व्यक्तिगत डेटा, ब्राउज़िंग इतिहास या पेज सामग्री एकत्र/भेजी नहीं जाती। सेटिंग्स chrome.storage.local में रहती हैं। लिस्टिंग की Privacy Policy देखें।

किसके लिए नहीं
Paywall, DRM, लॉगिन गेट या अवैध उपयोग को बायपास करने के लिए नहीं। केवल आपके द्वारा कॉन्फ़िगर हेडर को वैध डिबग/टेस्ट के लिए बदलता है।

स्रोत और सहायता
GitHub: https://github.com/webLiang/header-modify-extention
Issues: https://github.com/webLiang/header-modify-extention/issues
```

## श्रेणी

```
Developer Tools
```

## आधिकारिक / सहायता / गोपनीयता URL

```
https://github.com/webLiang/header-modify-extention
https://github.com/webLiang/header-modify-extention/issues
https://github.com/webLiang/header-modify-extention/blob/master/PRIVACY.md
```
