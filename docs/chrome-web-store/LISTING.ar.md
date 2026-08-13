# نص إدراج Chrome Web Store (العربية)

> الصق في [Developer Dashboard](https://chrome.google.com/webstore/devconsole) → Store listing (لغة العربية).  
> الوصف القصير في `_locales/ar/messages.json` (`extensionDescription`).

**مفتوح المصدر:** [https://github.com/webLiang/header-modify-extention](https://github.com/webLiang/header-modify-extention)

---

## الاسم

```
تعديل الترويسات
```

## وصف قصير (≤132 حرفًا)

```
أداة مفتوحة المصدر لتعديل ترويسات طلب HTTP حسب الموقع، بما فيها iframe. الصق من Chrome DevTools.
```

## وصف تفصيلي

```
تعديل الترويسات (Header Modify) إضافة Chrome مفتوحة المصدر تعيد كتابة ترويسات طلب HTTP للمواقع التي تفعّلها.

مفتوح المصدر
مفتوح بالكامل على GitHub — اقرأ الشيفرة، راجع الأذونات، افتح issues وساهم:
https://github.com/webLiang/header-modify-extention
بدون تشويش، بدون شيفرة بعيدة، بدون إعلانات. ما تثبّته يطابق المستودع العام.

غرض واحد
هذه الإضافة تفعل شيئًا واحدًا: على الـ origins التي تفعّلها، تطبّق ترويساتك على طلبات الشبكة من ذلك التبويب (بما فيها iframe) عبر Manifest V3 declarativeNetRequest modifyHeaders بعملية set (إضافة إن لم يوجد، واستبدال إن وُجد).

لمن هي
• مطوّرو الواجهة الذين يصحّحون المصادقة أو CORS أو اللغة أو CDN
• مختبرو الجودة الذين يعيدون ظروف ترويسات العميل
• المستخدمون المتقدمون الذين يحتاجون تجاوزًا مؤقتًا لـ User-Agent أو ترويسات مخصصة

طريقة الاستخدام
1. بعد التثبيت تكون إعادة الكتابة OFF لكل المواقع.
2. افتح صفحة http(s)، انقر أيقونة الشريط، والصق الترويسات من Chrome DevTools (أو أضفها يدويًا).
3. فعّل «تفعيل لهذا الموقع». أعد تحميل الصفحة وافحص Network.
4. طلبات iframe عبر الأصل في نفس التبويب مشمولة (قواعد جلسة مع tabIds).

الأذونات
• storage — حفظ الترويسات والمواقع المفعّلة واللغة محليًا (دون رفع)
• tabs — قراءة عنوان/أصل التبويب النشط لمزامنة القواعد
• declarativeNetRequest — تطبيق تعديلات الترويسات
• declarativeNetRequestFeedback — تشخيص اختياري للقواعد
• صلاحية المضيف (<all_urls>) — مطلوبة لتعديل الترويسات على مواقع اختيارية وطلبات iframe

الخصوصية
لا تُجمع ولا تُرسل بيانات شخصية أو سجل تصفح أو محتوى الصفحة. الإعدادات تبقى في chrome.storage.local. راجع سياسة الخصوصية في الإدراج.

ليس لـ
تجاوز جدران الدفع أو DRM أو بوابات الحساب أو أي استخدام غير قانوني. الأداة تعيد فقط كتابة الترويسات التي تضبطها للتصحيح والاختبار المشروع.

المصدر والدعم
GitHub: https://github.com/webLiang/header-modify-extention
Issues: https://github.com/webLiang/header-modify-extention/issues
```

## الفئة

```
Developer Tools
```

## الروابط الرسمية / الدعم / الخصوصية

```
https://github.com/webLiang/header-modify-extention
https://github.com/webLiang/header-modify-extention/issues
https://github.com/webLiang/header-modify-extention/blob/master/PRIVACY.md
```
