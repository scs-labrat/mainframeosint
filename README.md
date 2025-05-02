Okay, here is the text reformatted using Markdown for better structure and readability.

---

# 🕵️ IntelFrame - Banking Sector OSINT Tool

IntelFrame is a lightweight OSINT tool designed for analysts working in the banking sector or investigating financial entities. This simple, browser-based app allows users to generate targeted Google dorks, Shodan queries, and other investigation URLs based on input such as bank names, domains, or IP ranges.

Inspired by the IntelFramework methodology and the research work of Kev Milne, IntelFrame streamlines reconnaissance and manual pivoting in a focused workflow.

---

## 📌 Features

*   **🔎 Targeted Search Generation**
    *   **Input:** Bank name, domain, or IP/CIDR block
    *   **Outputs:** Pre-built search URLs for Google, Shodan, GitHub, and more

*   **🧠 Search Type Selection**
    *   Toggle specific dork generators:
        *   Google (Jobs, Configs, Open Directories)
        *   Shodan (by org or IP/CIDR)
        *   GitHub (COBOL/JCL)
        *   SEC Filings, Vendor Studies, Dev Forums, Paste Sites

*   **🔄 Manual Pivoting**
    *   Additional lookups (Shodan, WHOIS, crt.sh) based on findings like IPs or domains

*   **💾 Task Export**
    *   Export all generated URLs as JSON for saving, reporting, or automation

---

## 🚀 Getting Started

### 📁 Clone the repo

```bash
git clone https://github.com/yourusername/intelframe.git
cd intelframe
```

### 🖥️ Run Locally

Simply open `index.html` in your browser. No server or build process is required.

```bash
open index.html
# or
xdg-open index.html
```

---

## 📂 Project Structure

```
intelframe/
│
├── index.html          # Main UI
├── style.css           # Styling
├── script.js           # Core logic for generating tasks and lookups
└── README.md           # This file
```

---

## 🛠️ How It Works

1.  **Input Target:** Enter a bank name, domain, or IP/CIDR range.
2.  **Select Search Types:** Choose from a list of pre-configured search tasks (Google dorks, Shodan queries, etc.).
3.  **Generate:** Click the "Generate Search Tasks" button to see URLs appear.
4.  **Manual Pivoting:** Use discovered IPs or domains for WHOIS, crt.sh, and Shodan lookups.
5.  **Export:** Output all URLs in JSON format for further use.

---

## 🧠 Use Cases

*   Recon on banking/financial sector organisations
*   Mapping open directories or legacy tech exposure
*   Discovering exposed COBOL/JCL source code on GitHub
*   Investigating related IPs/domains found during manual OSINT

---

## 🙏 Acknowledgements

*   Project inspired by the IntelFramework concept
*   Special thanks to Kev Milne for the foundational research and dorking methodology

---

## 📃 License

MIT License – use freely, credit generously.