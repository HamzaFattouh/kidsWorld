#!/bin/bash
# ==============================================================================
# KidsWorld Nursery - VPS Streaming Server Setup Script (Ubuntu 22.04 LTS)
# go2rtc Real-Time WebRTC (<1s Latency)
# ==============================================================================

set -e

DOMAIN="stream.yourdomain.com"
EMAIL="admin@kidsworld.com"

echo "================================================================="
echo " Starting KidsWorld go2rtc Streaming Server Setup on Ubuntu 22.04"
echo " Domain: $DOMAIN"
echo "================================================================="

# 1. Update and install packages
echo "📦 Updating system packages..."
apt-get update -y
apt-get upgrade -y
apt-get install -y curl wget git ufw nginx certbot python3-certbot-nginx jq

# 2. Configure UFW Firewall
echo "🛡️ Configuring firewall (UFW)..."
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
ufw allow 8555/tcp    # WebRTC TCP
ufw allow 8555/udp    # WebRTC UDP
ufw allow 8554/tcp    # RTSP Local
ufw --force enable

# 3. Download & Install go2rtc binary
echo "⬇️ Downloading latest go2rtc release..."
mkdir -p /opt/go2rtc
cd /opt/go2rtc

# Fetch latest release binary for linux-amd64
LATEST_URL=$(curl -s https://api.github.com/repos/AlexxIT/go2rtc/releases/latest | jq -r ".assets[] | select(.name | test(\"go2rtc_linux_amd64\")) | .browser_download_url")
if [ -z "$LATEST_URL" ]; then
    LATEST_URL="https://github.com/AlexxIT/go2rtc/releases/download/v1.9.4/go2rtc_linux_amd64"
fi

wget -O go2rtc "$LATEST_URL"
chmod +x go2rtc

# Copy configuration
if [ ! -f /opt/go2rtc/go2rtc.yaml ]; then
    echo "📋 Copying go2rtc.yaml..."
    cp ./go2rtc.yaml /opt/go2rtc/go2rtc.yaml 2>/dev/null || cat << 'EOF' > /opt/go2rtc/go2rtc.yaml
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
  # 4 غرف نوم الأطفال + 3 كاميرات لغرفة الألعاب
  cam1: "rtsp://admin:NurseryPass2026@YOUR_DDNS_HOST:554/Streaming/Channels/102" # نوم - عمر سنة
  cam2: "rtsp://admin:NurseryPass2026@YOUR_DDNS_HOST:554/Streaming/Channels/202" # نوم - سنتين
  cam3: "rtsp://admin:NurseryPass2026@YOUR_DDNS_HOST:554/Streaming/Channels/302" # نوم - 3 سنوات
  cam4: "rtsp://admin:NurseryPass2026@YOUR_DDNS_HOST:554/Streaming/Channels/402" # نوم - 4 سنوات
  cam5: "rtsp://admin:NurseryPass2026@YOUR_DDNS_HOST:554/Streaming/Channels/502" # غرفة الألعاب - زاوية 1
  cam6: "rtsp://admin:NurseryPass2026@YOUR_DDNS_HOST:554/Streaming/Channels/602" # غرفة الألعاب - زاوية 2
  cam7: "rtsp://admin:NurseryPass2026@YOUR_DDNS_HOST:554/Streaming/Channels/702" # غرفة الألعاب - زاوية 3
EOF
fi

# 4. Setup Systemd Service
echo "⚙️ Configuring Systemd service..."
cat << 'EOF' > /etc/systemd/system/go2rtc.service
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
EOF

systemctl daemon-reload
systemctl enable go2rtc
systemctl restart go2rtc

# 5. SSL & Nginx Setup
echo "🔒 Requesting SSL Certificate from Let's Encrypt..."
echo "NOTE: Make sure Cloudflare DNS is set to 'DNS Only' (Gray Cloud) for $DOMAIN pointing to this VPS IP!"

# Stop nginx temporarily if needed for standalone or run with nginx plugin
systemctl stop nginx || true
certbot certonly --standalone -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" || echo "Certbot skipped or manual setup required"

# Copy Nginx config
cp ./nginx.conf /etc/nginx/sites-available/$DOMAIN 2>/dev/null || true
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/ 2>/dev/null || true
rm -f /etc/nginx/sites-enabled/default

systemctl restart nginx

echo "================================================================="
echo "✅ go2rtc server is now installed and running!"
echo "📡 Check status with: systemctl status go2rtc"
echo "📋 Logs: journalctl -u go2rtc -f"
echo "🌐 Public Stream API: https://$DOMAIN/api/webrtc"
echo "================================================================="
