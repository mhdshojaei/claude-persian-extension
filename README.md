# Claude RTL + Vazir

افزونهٔ مرورگر برای [Claude.ai](https://claude.ai) — فونت **وزیرمتن (Vazirmatn)** و پشتیبانی **راست‌چین (RTL)** برای متن‌های فارسی و عربی.

> A lightweight browser extension that adds Vazirmatn font and RTL layout to Claude.ai for Persian and Arabic text.

---

## چرا این افزونه؟

Claude رابط کاربری عالی دارد، اما برای کار با فارسی چند مشکل رایج وجود دارد: فونت پیش‌فرض برای حروف فارسی مناسب نیست، جهت متن گاهی LTR می‌ماند، و placeholder باکس ورودی انگلیسی است. این افزونه فقط روی **محتوای پیام‌ها و باکس ورودی** اثر می‌گذارد و بقیهٔ رابط Claude را دست نمی‌زند.

## ویژگی‌ها

- **فونت وزیرمتن** — بارگذاری از Google Fonts و اعمال روی پیام‌های کاربر، پاسخ Claude و باکس ورودی
- **RTL خودکار** — تشخیص متن فارسی/عربی و راست‌چین کردن همان بلوک
- **RTL اجباری** — راست‌چین کردن همهٔ متن‌ها (مثلاً وقتی Claude پاسخ انگلیسی با اصطلاحات فارسی می‌دهد)
- **Placeholder فارسی** — «در این قسمت بنویسید...» به‌جای متن انگلیسی
- **تنظیمات ساده** — پاپ‌آپ با سه سوئیچ؛ تنظیمات بین دستگاه‌ها sync می‌شوند
- **سبک و بدون مزاحمت** — فقط روی `claude.ai` اجرا می‌شود؛ بدون جمع‌آوری داده

## نصب

### از سورس (Developer Mode)

1. این مخزن را clone کنید یا ZIP آن را دانلود و extract کنید:

   ```bash
   git clone https://github.com/YOUR_USERNAME/claude-rtl-vazir.git
   ```

2. در **Chrome** یا **Edge** به `chrome://extensions` بروید.
3. **Developer mode** را روشن کنید.
4. روی **Load unpacked** کلیک کنید و پوشهٔ پروژه را انتخاب کنید.
5. به [claude.ai](https://claude.ai) بروید — اگر قبلاً باز بود، یک‌بار صفحه را رفرش کنید.

### مرورگرهای مبتنی بر Chromium

Edge، Brave، Arc و سایر مرورگرهای Chromium همان مراحل Chrome را دارند (`edge://extensions`).

> **Firefox:** این افزونه Manifest V3 است و برای Firefox نیاز به بسته‌بندی جداگانه (یا نسخهٔ سازگار) دارد. فعلاً فقط Chromium پشتیبانی می‌شود.

## استفاده

روی آیکون افزونه در نوار ابزار کلیک کنید:

| تنظیم | توضیح |
|--------|--------|
| **فعال** | روشن/خاموش کردن کل افزونه |
| **RTL خودکار** | اگر متن شامل حروف فارسی/عربی باشد، همان بلوک راست‌چین می‌شود |
| **RTL اجباری** | همهٔ پیام‌ها و ورودی همیشه RTL — گزینهٔ خودکار را نادیده می‌گیرد |

تغییرات بلافاصله اعمال می‌شوند؛ در صورت غیرفعال کردن افزونه، یک‌بار صفحه را رفرش کنید.

## نحوهٔ کار (خلاصهٔ فنی)

```
claude.ai
    │
    ▼
content.js (document_start)
    ├── inject Vazirmatn از Google Fonts
    ├── CSS هدفمند روی selectorهای پیام Claude
    ├── MutationObserver → اسکن متن و کلاس .cvr-rtl
    └── گوش دادن به chrome.storage.sync
            ▲
            │ تنظیمات
       popup.html/js
```

- **Selectorها** روی المان‌های واقعی DOM کلود هدف می‌گیرند (`data-testid="user-message"`, `.standard-markdown`, `chat-input` و غیره).
- **تشخیص زبان** با regex محدودهٔ Unicode حروف عربی/فارسی انجام می‌شود.
- **مجوزها:** فقط `storage` و دسترسی به `https://claude.ai/*` — هیچ داده‌ای به سرور خارجی ارسال نمی‌شود (به‌جز بارگذاری فونت از Google Fonts).

## ساختار پروژه

```
claude-rtl-vazir/
├── manifest.json    # Manifest V3
├── content.js       # تزریق فونت، CSS و منطق RTL
├── popup.html       # رابط تنظیمات
├── popup.js         # ذخیرهٔ تنظیمات در chrome.storage.sync
└── icons/           # آیکون‌های ۱۶، ۴۸ و ۱۲۸ پیکسل
```

## حریم خصوصی

- افزونه **هیچ متن چتی را ذخیره یا ارسال نمی‌کند**.
- تنظیمات (سه boolean) فقط در `chrome.storage.sync` حساب Google Chrome شما نگه‌داری می‌شوند.
- تنها درخواست شبکهٔ خارج از Claude، بارگذاری فونت Vazirmatn از `fonts.googleapis.com` است.

## مشارکت

Issue و Pull Request خوش‌آمد است. اگر ساختار DOM کلود عوض شد و selectorها از کار افتادند، لطفاً با نسخهٔ مرورگر و اسکرین‌شات گزارش دهید.

## مجوز

MIT — استفاده، تغییر و توزیع آزاد است. برای جزئیات فایل `LICENSE` را ببینید.

---

**غیررسمی** — این پروژه وابسته به Anthropic یا Claude نیست.
# claude-persian-extension
