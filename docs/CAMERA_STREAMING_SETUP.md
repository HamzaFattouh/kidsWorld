# دليل إعداد وتشغيل بيئة البث المباشر للكاميرات (WebRTC & go2rtc)

تم تجهيز هذا الدليل لضبط سيرفر VPS وبث 7 كاميرات خاصة بالحضانة بتقنية WebRTC بزمن تأخير أقل من ثانية واحدة (< 1s Latency) مع ربطه بمنظومة الأمان والصلاحيات في KidsWorld.

---

## 1. مواصفات وخطة سيرفر الـ VPS (Hetzner / DigitalOcean)

- **نظام التشغيل**: Ubuntu 22.04 LTS.
- **المواصفات الموصى بها**: 
  - 2 vCPU / 4 GB RAM (كافية تماماً لبث WebRTC لأكثر من 50-100 ولي أمر متزامن بدون Transcoding).
  - نقل بيانات (Bandwidth): 20 TB شهرياً (متوفر في Hetzner بـ ~4 يورو فقط).
- **المنافذ المطلوب فتحها في الجدار الناري (Firewall)**:
  - `80/tcp`, `443/tcp`: لحركة المرور المشفرة وشهادة SSL وواجهة WebRTC Signal.
  - `8555/tcp` و `8555/udp`: لتبادل وسائط WebRTC (ضروري جداً).
  - `1984/tcp`: المنفذ الداخلي لـ go2rtc (مغلق ومحمي خلف Nginx على `127.0.0.1`).

---

## 2. إعداد النطاق في Cloudflare DNS (شرط حاسم)

1. توجه إلى لوحة تحكم **Cloudflare DNS**.
2. أضف سجل من نوع **A Record**:
   - **Name**: `stream`
   - **IPv4 address**: عنوان الـ IP العام لسيرفر الـ VPS الخاص بك.
   - **Proxy status**: اضبطه على **DNS Only** (السحابة الرمادية **Gray Cloud**).
> ⚠️ **ملاحظة هامة جداً**: إذا تركت السحابة برتقالية (Proxied)، ستقوم Cloudflare بحظر حركة مرور WebRTC وحزم UDP وستنقطع اتصالات WSS المستمرة.

---

## 3. تثبيت وتشغيل go2rtc على الـ VPS

قم بالدخول إلى السيرفر عبر SSH:
```bash
ssh root@YOUR_VPS_IP
```

ثم انسخ مجلد `deploy/go2rtc` أو قم بتشغيل أوامر الإعداد المباشرة:
```bash
# 1. إنشاء مجلد الخدمة
mkdir -p /opt/go2rtc
cd /opt/go2rtc

# 2. تحميل النسخة الأحدث من go2rtc
wget https://github.com/AlexxIT/go2rtc/releases/download/v1.9.4/go2rtc_linux_amd64 -O go2rtc
chmod +x go2rtc

# 3. وضع ملف الإعدادات
# انسخ ملف go2rtc.yaml المعدل مع روابط الـ RTSP الحقيقية
nano /opt/go2rtc/go2rtc.yaml
```

### ملف الإعدادات `go2rtc.yaml` لكاميرات الحضانة الـ 7:
```yaml
log:
  level: info

api:
  listen: "127.0.0.1:1984"
  origin: "*"

rtsp:
  listen: ":8554"

webrtc:
  listen: ":8555"
  candidates:
    - stream.yourdomain.com:8555
    - stun:stun.l.google.com:19302

streams:
  # 4 غرف نوم الأطفال:
  cam1: "rtsp://admin:Password@YOUR_DDNS_HOST:554/Streaming/Channels/102" # غرفة نوم عمر سنة
  cam2: "rtsp://admin:Password@YOUR_DDNS_HOST:554/Streaming/Channels/202" # غرفة نوم سنتين
  cam3: "rtsp://admin:Password@YOUR_DDNS_HOST:554/Streaming/Channels/302" # غرفة نوم 3 سنوات
  cam4: "rtsp://admin:Password@YOUR_DDNS_HOST:554/Streaming/Channels/402" # غرفة نوم 4 سنوات

  # 3 كاميرات لغرفة الألعاب:
  cam5: "rtsp://admin:Password@YOUR_DDNS_HOST:554/Streaming/Channels/502" # غرفة الألعاب (الأنشطة الحركية)
  cam6: "rtsp://admin:Password@YOUR_DDNS_HOST:554/Streaming/Channels/602" # غرفة الألعاب (الألعاب الإدراكية)
  cam7: "rtsp://admin:Password@YOUR_DDNS_HOST:554/Streaming/Channels/702" # غرفة الألعاب (الساحة المركزية)
```

> **نصيحة تقنية لكاميرات الـ NVR (Hikvision / Dahua)**:
> استخدم رابط القناة الفرعية (**Substream** مثل `102` بدلاً من `101`) لتقليل استهلاك سرعة الرفع في مقر الحضانة، وضمان تشغيل 7 كاميرات بسلاسة دون تقطيع على هواتف أولياء الأمور عبر شبكات 4G/5G.

---

## 4. إعداد خدمة الـ Systemd للعمل التلقائي

أنشئ الملف `/etc/systemd/system/go2rtc.service`:
```ini
[Unit]
Description=go2rtc Streaming Server for KidsWorld
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/go2rtc
ExecStart=/opt/go2rtc/go2rtc -config /opt/go2rtc/go2rtc.yaml
Restart=always
RestartSec=5
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

فعّل الخدمة:
```bash
systemctl daemon-reload
systemctl enable go2rtc
systemctl start go2rtc
systemctl status go2rtc
```

---

## 5. إعداد Nginx وشهادة SSL المجانية (Certbot)

ثبّت Certbot و Nginx:
```bash
apt update && apt install -y nginx certbot python3-certbot-nginx
```

استخرج شهادة SSL:
```bash
certbot --nginx -d stream.yourdomain.com
```

ضع إعدادات Nginx المجهزة في `deploy/go2rtc/nginx.conf` داخل `/etc/nginx/sites-available/stream.yourdomain.com`:
```bash
ln -s /etc/nginx/sites-available/stream.yourdomain.com /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 6. التحقق من عمل البث (Testing)

يمكنك فحص استجابة الـ WebRTC API من خلال التيرمينال:
```bash
curl -i https://stream.yourdomain.com/api/webrtc?src=cam1
```
إذا أعاد السيرفر إشارة WebRTC أو رسالة SDP، فهذا يعني أن السيرفر جاهز تماماً لاستقبال اتصالات المتصفح والتطبيق بأقل من ثانية زمن استجابة!
