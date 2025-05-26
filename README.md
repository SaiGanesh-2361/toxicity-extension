# 🧠 Toxicity Detector – Chrome Extension

> A Chrome extension that detects toxic or harmful language in real time using the Perspective API. Provides instant feedback to help users write safer, more respectful content online.

---

## 🚀 Features

- ✅ Detects toxicity while typing in any text field
- ✅ Floating bubble shows real-time toxicity score
- ✅ Uses Google's Perspective API (NLP model)
- ✅ Toggle enable/disable from popup UI
- ✅ Secure and compliant with Chrome Extension Manifest V3

---

## 🛠️ Tech Stack

- HTML5 + CSS3
- JavaScript (ES6)
- Perspective API (Google)
- Chrome Extensions API (Manifest V3)

---

## 📦 How to Use

1. Clone or download this repo:
   ```bash
   git clone https://github.com/yourusername/toxicity-extension.git
   ```
2. Go to `chrome://extensions` in your Chrome browser
3. Enable **Developer Mode** (top right)
4. Click **"Load Unpacked"**
5. Select the folder containing the project files
6. Start typing on any website to see toxicity feedback in action!

---

## 🔑 API Key Notice

> The API key in the current code is a placeholder and will **not work**.
> For security reasons, it is not recommended to commit real API keys to public repositories.

To use the extension:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the **Perspective API**
3. Create an API key
4. Replace the key in `content.js` where it says:
   ```js
   const API_KEY = 'YOUR_API_KEY';
   ```

---

## 📸 Screenshots

> _(Add screenshots of popup and toxicity bubble here)_

---

## 🧠 Powered By

- [Perspective API](https://www.perspectiveapi.com/)
- [Chrome Extensions API](https://developer.chrome.com/docs/extensions/)

---

## 📜 License

MIT License – use it, share it, improve it!
