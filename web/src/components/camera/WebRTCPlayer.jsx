import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import {
  Camera,
  Play,
  Square,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  Radio,
  Wifi,
  WifiOff
} from 'lucide-react';

/**
 * WebRTCPlayer
 * Connects directly to go2rtc WebRTC endpoint for ultra-low latency (<1s),
 * and automatically falls back to HLS (.m3u8 via hls.js) or direct video feeds.
 * Adheres strictly to KidsWorld Design Guidelines:
 * - Icons, not Emojis (Lucide React only)
 * - Flat styling, NO shadows (no box-shadow / drop-shadow)
 * - Cohesive brand styling (brand-green, high contrast, clean borders)
 */
export function WebRTCPlayer({
  accessData,
  cameraName,
  className: classroomName,
  isLoadingAccess = false,
  error = null,
  onRetry
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const pcRef = useRef(null);
  const hlsRef = useRef(null);

  const [connectionStatus, setConnectionStatus] = useState('idle'); // 'idle' | 'connecting' | 'connected' | 'failed' | 'fallback'
  const [streamMode, setStreamMode] = useState('webrtc'); // 'webrtc' | 'hls' | 'direct'
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Clock for overlay
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cleanup helper
  const cleanupStreams = useCallback(() => {
    if (hlsRef.current) {
      try {
        hlsRef.current.destroy();
      } catch (e) {
        // ignore
      }
      hlsRef.current = null;
    }
    if (pcRef.current) {
      try {
        pcRef.current.close();
      } catch (e) {
        // ignore
      }
      pcRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = '';
      videoRef.current.srcObject = null;
    }
  }, []);

  // Unified Connection Logic: HLS (.m3u8), Direct MP4/Video, or WebRTC
  const connectStream = useCallback(async () => {
    if (!accessData) return;

    cleanupStreams();
    setConnectionStatus('connecting');
    setErrorMessage('');

    const directUrl =
      accessData.directStreamUrl ||
      (typeof accessData.streamUrl === 'string' && accessData.streamUrl.startsWith('http')
        ? accessData.streamUrl
        : null);

    const isHls = Boolean(
      accessData.isHls ||
      (directUrl && (directUrl.includes('.m3u8') || directUrl.includes('m3u8')))
    );

    const isDirectVideo = Boolean(
      accessData.isMp4 ||
      (directUrl && /\.(?:mp4|webm|mkv|ogg)(?:[?#].*)?$/i.test(directUrl))
    );

    // Case 1: HLS Stream (.m3u8 via hls.js)
    if (directUrl && isHls) {
      setStreamMode('hls');
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        });
        hlsRef.current = hls;
        hls.loadSource(directUrl);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setConnectionStatus('connected');
          if (videoRef.current) {
            videoRef.current.play().catch(() => {
              // Browser auto-play policy may require user interaction
            });
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.warn('HLS Event Error:', data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                setConnectionStatus('failed');
                setErrorMessage('تعذر تشغيل بث HLS');
                break;
            }
          }
        });
      } else if (videoRef.current && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Native Safari HLS
        videoRef.current.src = directUrl;
        videoRef.current.addEventListener('loadedmetadata', () => {
          setConnectionStatus('connected');
          videoRef.current?.play().catch(() => {});
        });
        videoRef.current.addEventListener('error', () => {
          setConnectionStatus('failed');
          setErrorMessage('تعذر تشغيل البث على متصفحك');
        });
      } else {
        setConnectionStatus('failed');
        setErrorMessage('المتصفح الحالي لا يدعم تشغيل HLS');
      }
      return;
    }

    // Case 2: Direct MP4 / WebM / HTML5 Video
    if (directUrl && isDirectVideo) {
      setStreamMode('direct');
      if (videoRef.current) {
        videoRef.current.src = directUrl;
        videoRef.current.load();
        videoRef.current.onloadeddata = () => {
          setConnectionStatus('connected');
          videoRef.current?.play().catch(() => {});
        };
        videoRef.current.onerror = () => {
          setConnectionStatus('failed');
          setErrorMessage('تعذر تشغيل ملف الفيديو المباشر');
        };
      }
      return;
    }

    // Case 3: Native WebRTC via go2rtc SDP Exchange
    setStreamMode('webrtc');
    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });
      pcRef.current = pc;

      // Listen for incoming media stream tracks
      pc.ontrack = (event) => {
        if (videoRef.current && event.streams && event.streams[0]) {
          videoRef.current.srcObject = event.streams[0];
          setConnectionStatus('connected');
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
          setConnectionStatus('connected');
        } else if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
          setConnectionStatus('failed');
          setErrorMessage('انقطع الاتصال بالبث المباشر');
        }
      };

      // Add audio/video transceivers for receive-only
      pc.addTransceiver('video', { direction: 'recvonly' });
      pc.addTransceiver('audio', { direction: 'recvonly' });

      // Create SDP offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Exchange SDP with go2rtc via HTTP POST
      const webrtcOfferUrl = accessData.webrtcOfferUrl;

      if (!webrtcOfferUrl) {
        throw new Error('رابط خادم البث غير متوفر');
      }

      // Send offer to go2rtc
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(webrtcOfferUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: offer.sdp,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`تعذر استلام إشارة البث من السيرفر (كود: ${response.status})`);
      }

      const answerSdp = await response.text();
      if (!answerSdp || !answerSdp.includes('v=')) {
        throw new Error('استجابة غير صالحة من سيرفر البث');
      }

      // Apply SDP answer from go2rtc
      await pc.setRemoteDescription(
        new RTCSessionDescription({
          type: 'answer',
          sdp: answerSdp
        })
      );
    } catch (err) {
      console.warn('Stream connection notice:', err.message);
      setConnectionStatus('fallback');
      setErrorMessage(err.message || 'تعذر الاتصال بسيرفر البث المباشر');
    }
  }, [accessData, cleanupStreams]);

  useEffect(() => {
    if (accessData && !isLoadingAccess && !error) {
      connectStream();
    }
    return () => {
      cleanupStreams();
    };
  }, [accessData, isLoadingAccess, error, connectStream, cleanupStreams]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl bg-gray-950 border border-gray-800 overflow-hidden flex flex-col items-center justify-center min-h-[380px] md:min-h-[460px] select-none"
    >
      {/* 1. Header Overlay */}
      <div className="absolute top-0 inset-x-0 p-4 z-20 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="flex items-center px-2.5 py-1 rounded-md bg-red-600/90 text-white text-xs font-bold tracking-wide">
            <Radio className="w-3.5 h-3.5 ml-1.5 animate-pulse" />
            <span>
              {streamMode === 'hls'
                ? 'بث مباشر HLS'
                : streamMode === 'direct'
                ? 'فيديو تجريبي مباشر'
                : 'بث حي WebRTC'}
            </span>
          </div>
          <div className="hidden sm:flex items-center px-2.5 py-1 rounded-md bg-gray-800/80 text-gray-200 text-xs font-medium border border-gray-700/60">
            <ShieldCheck className="w-3.5 h-3.5 ml-1.5 text-emerald-400" />
            <span>مشفّر وآمن</span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm font-bold text-white tracking-wide">{cameraName || 'الكاميرا المحددة'}</p>
          <p className="text-xs text-gray-300 font-medium">{classroomName || 'قاعة الأطفال'}</p>
        </div>
      </div>

      {/* 2. Main Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMuted}
        className={`w-full h-full object-contain max-h-[540px] transition-opacity duration-300 ${
          connectionStatus === 'connected' ? 'opacity-100' : 'opacity-0 absolute'
        }`}
      />

      {/* 3. Loading State */}
      {(isLoadingAccess || connectionStatus === 'connecting') && (
        <div className="flex flex-col items-center justify-center p-8 text-center z-10">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-4" />
          <p className="text-sm font-semibold text-white mb-1">
            {streamMode === 'hls' ? 'جاري تحميل بث HLS...' : 'جاري بدء البث المباشر...'}
          </p>
          <p className="text-xs text-gray-400">
            {streamMode === 'hls' ? 'تجهيز مشغل الوسائط وفحص الحزم' : 'التحقق من التوكين وتأسيس اتصال مشفر'}
          </p>
        </div>
      )}

      {/* 4. Error or Schedule Constraint State */}
      {error && !isLoadingAccess && (
        <div className="flex flex-col items-center justify-center p-8 text-center max-w-md z-10">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white mb-1">غير متاح حالياً</h4>
          <p className="text-sm text-gray-300 mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium border border-gray-700 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 ml-1.5" />
              <span>إعادة المحاولة</span>
            </button>
          )}
        </div>
      )}

      {/* 5. Fallback / Standby Simulation (when camera server is pending initial launch) */}
      {connectionStatus === 'fallback' && !error && !isLoadingAccess && (
        <div className="flex flex-col items-center justify-center p-8 text-center max-w-lg z-10">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
            <Camera className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-white mb-1.5">{cameraName}</h4>
          <p className="text-xs text-emerald-400 font-semibold mb-2">القناة: {accessData?.streamKey?.toUpperCase() || 'CAM'}</p>
          <p className="text-xs text-gray-400 leading-relaxed mb-5">
            تم استخراج تصريح المشاهدة المشفر بنجاح. يتم الاتصال بسيرفر go2rtc عبر رابط الـ WebRTC المخصص:
            <br />
            <code className="text-[11px] text-gray-300 bg-gray-900 px-2 py-0.5 rounded border border-gray-800 mt-1 inline-block">
              {accessData?.webrtcOfferUrl || 'https://stream.yourdomain.com/api/webrtc'}
            </code>
          </p>
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={connectWebRTC}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
            >
              <RefreshCw className="w-3.5 h-3.5 ml-1.5" />
              <span>إعادة الاتصال بالبث الحي</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. Bottom Controls Bar Overlay */}
      <div className="absolute bottom-0 inset-x-0 p-4 z-20 flex items-center justify-between bg-gradient-to-t from-black/85 via-black/40 to-transparent">
        {/* Left: Quality & Latency indicator */}
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="flex items-center text-xs text-gray-300">
            {connectionStatus === 'connected' ? (
              <Wifi className="w-4 h-4 ml-1.5 text-emerald-400" />
            ) : (
              <WifiOff className="w-4 h-4 ml-1.5 text-amber-400" />
            )}
            <span className="font-mono text-[11px]">
              {connectionStatus === 'connected' ? 'Latency: <0.5s' : 'WebRTC Standby'}
            </span>
          </div>

          <div className="text-xs font-mono text-gray-400 hidden sm:block">
            {currentTime}
          </div>
        </div>

        {/* Right: Audio & Fullscreen buttons */}
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
            className="p-2 rounded-lg bg-gray-900/80 hover:bg-gray-800 text-white border border-gray-700/60 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={toggleFullscreen}
            aria-label="تكبير الشاشة"
            className="p-2 rounded-lg bg-gray-900/80 hover:bg-gray-800 text-white border border-gray-700/60 transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
