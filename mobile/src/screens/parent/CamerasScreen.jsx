import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  Camera,
  Video,
  ShieldCheck,
  Radio,
  Clock,
  AlertCircle,
  RefreshCw,
  Info,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { api } from '../../services/api';

const { width } = Dimensions.get('window');

// 7 Standard Nursery Cameras: 4 Sleep Rooms + 3 Playroom Cameras
const DEFAULT_CAMERAS = [
  {
    id: 'cam-sleep-1',
    name: 'غرفة نوم الأطفال (عمر سنة)',
    className: 'قسم الرضّع - سنة واحدة',
    classId: 'class-sleep-1',
    streamKey: 'cam1',
    isActive: true,
    isWithinSchedule: true,
    time: '11:30 ص - 02:30 م',
  },
  {
    id: 'cam-sleep-2',
    name: 'غرفة نوم الأطفال (عمر سنتين)',
    className: 'قسم الصغار - سنتين',
    classId: 'class-sleep-2',
    streamKey: 'cam2',
    isActive: true,
    isWithinSchedule: true,
    time: '12:00 م - 02:30 م',
  },
  {
    id: 'cam-sleep-3',
    name: 'غرفة نوم الأطفال (عمر 3 سنوات)',
    className: 'قسم البراعم - 3 سنوات',
    classId: 'class-sleep-3',
    streamKey: 'cam3',
    isActive: true,
    isWithinSchedule: true,
    time: '12:30 م - 02:30 م',
  },
  {
    id: 'cam-sleep-4',
    name: 'غرفة نوم الأطفال (عمر 4 سنوات)',
    className: 'قسم الروضة - 4 سنوات',
    classId: 'class-sleep-4',
    streamKey: 'cam4',
    isActive: true,
    isWithinSchedule: true,
    time: '01:00 م - 02:30 م',
  },
  {
    id: 'cam-play-1',
    name: 'غرفة الألعاب (الأنشطة الحركية)',
    className: 'زاوية التسلق والألعاب الحركية',
    classId: 'class-playroom-1',
    streamKey: 'cam5',
    isActive: true,
    isWithinSchedule: true,
    time: '07:30 ص - 01:30 م',
  },
  {
    id: 'cam-play-2',
    name: 'غرفة الألعاب (الألعاب الهادئة والرسم)',
    className: 'زاوية الرسم وتركيب المكعبات',
    classId: 'class-playroom-2',
    streamKey: 'cam6',
    isActive: true,
    isWithinSchedule: true,
    time: '07:30 ص - 01:30 م',
  },
  {
    id: 'cam-play-3',
    name: 'غرفة الألعاب (الساحة المركزية)',
    className: 'منطقة اللعب الجماعي المشترك',
    classId: 'class-playroom-3',
    streamKey: 'cam7',
    isActive: true,
    isWithinSchedule: true,
    time: '07:30 ص - 02:30 م',
  },
];

export function CamerasScreen() {
  const [cameras, setCameras] = useState(DEFAULT_CAMERAS);
  const [activeCamId, setActiveCamId] = useState(DEFAULT_CAMERAS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [accessData, setAccessData] = useState(null);
  const [accessError, setAccessError] = useState(null);
  const [isLoadingAccess, setIsLoadingAccess] = useState(false);

  // 1. Fetch Accessible Cameras from Backend
  const fetchCameras = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/cameras');
      if (res.data?.data && res.data.data.length > 0) {
        setCameras(res.data.data);
        setActiveCamId(res.data.data[0].id);
      }
    } catch (e) {
      console.warn('Using default cameras fallback:', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  const selectedCam = cameras.find((c) => c.id === activeCamId) || cameras[0];

  // 2. Request Streaming Token & WebRTC endpoint
  const requestAccess = async (camId) => {
    setIsLoadingAccess(true);
    setAccessError(null);
    try {
      const res = await api.post(`/cameras/${camId}/access`);
      setAccessData(res.data?.data);
    } catch (err) {
      const msg = err.response?.data?.error || 'تعذر استخراج إذن المشاهدة حالياً';
      setAccessError(msg);
      setAccessData(null);
    } finally {
      setIsLoadingAccess(false);
    }
  };

  useEffect(() => {
    if (selectedCam?.id) {
      requestAccess(selectedCam.id);
    }
  }, [selectedCam?.id]);

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>البث المباشر والكاميرات</Text>
          <Text style={styles.subTitle}>متابعة بصرية آمنة وفورية عبر تقنية WebRTC (7 كاميرات)</Text>
        </View>

        {/* Security Notice */}
        <View style={styles.securityBanner}>
          <ShieldCheck size={18} color="#10b981" style={{ marginLeft: 8 }} />
          <Text style={styles.securityBannerText}>
            البث مشفر ومخصص لأولياء الأمور المعتمدين خلال ساعات دوام الحضانة الرسمية فقط.
          </Text>
        </View>

        {/* Live Stream Player Box */}
        <View style={styles.videoPlayerBox}>
          {/* Top Bar Overlay */}
          <View style={styles.videoOverlayTop}>
            <View style={styles.liveBadge}>
              <Radio size={12} color="#ffffff" style={{ marginLeft: 4 }} />
              <Text style={styles.liveBadgeText}>WebRTC LIVE</Text>
            </View>
            <Text style={styles.camNameOverlay}>{selectedCam?.name}</Text>
          </View>

          {/* Player Center Content */}
          <View style={styles.videoPlaceholderContent}>
            {isLoadingAccess ? (
              <View style={styles.centerLoading}>
                <ActivityIndicator size="large" color="#10b981" />
                <Text style={styles.loadingText}>تأسيس الاتصال الآمن بسيرفر البث...</Text>
              </View>
            ) : accessError ? (
              <View style={styles.centerError}>
                <AlertCircle size={36} color="#ef4444" style={{ marginBottom: 8 }} />
                <Text style={styles.errorTitle}>غير متاح للمشاهدة حالياً</Text>
                <Text style={styles.errorSub}>{accessError}</Text>
                <TouchableOpacity
                  style={styles.retryBtn}
                  onPress={() => requestAccess(selectedCam.id)}
                  activeOpacity={0.7}
                >
                  <RefreshCw size={14} color="#ffffff" style={{ marginLeft: 6 }} />
                  <Text style={styles.retryBtnText}>إعادة المحاولة</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.centerStreamActive}>
                <View style={styles.camIconCircle}>
                  <Camera size={38} color="#10b981" />
                </View>
                <Text style={styles.placeholderTitle}>{selectedCam?.name}</Text>
                <Text style={styles.placeholderSub}>
                  {selectedCam?.className || 'قاعة الأطفال'}
                </Text>
                <View style={styles.streamDetailsBadge}>
                  <Text style={styles.streamDetailsText}>
                    القناة: {accessData?.streamKey?.toUpperCase() || selectedCam?.streamKey?.toUpperCase() || 'CAM'} • زمن التأخير: أقل من 1 ثانية
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Bottom Controls Bar */}
          <View style={styles.videoControls}>
            <View style={styles.footerFlex}>
              <View style={styles.dotLive} />
              <Text style={styles.securityText}>سيرفر go2rtc فائق السرعة مشفر WSS/WebRTC</Text>
            </View>
          </View>
        </View>

        {/* 7 Cameras Grid Selector */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionHeader}>اختر القاعة أو المرفق (7 كاميرات)</Text>
        </View>

        <View style={styles.camGrid}>
          {cameras.map((cam) => {
            const isSelected = cam.id === selectedCam.id;
            return (
              <TouchableOpacity
                key={cam.id}
                style={[styles.camCard, isSelected && styles.activeCamCard]}
                onPress={() => setActiveCamId(cam.id)}
                activeOpacity={0.7}
              >
                <View style={styles.camCardHeader}>
                  <View style={styles.dotLive} />
                  <Text style={styles.camStatusText}>
                    {cam.streamKey?.toUpperCase() || 'CAM'}
                  </Text>
                </View>

                <Video
                  size={24}
                  color={isSelected ? '#10b981' : '#6b7280'}
                  style={{ marginVertical: 6 }}
                />
                <Text style={[styles.camCardName, isSelected && styles.activeCamCardName]}>
                  {cam.name}
                </Text>
                <Text style={styles.camCardClass} numberOfLines={1}>
                  {cam.className}
                </Text>

                <View style={styles.timeTag}>
                  <Clock size={10} color="#9ca3af" style={{ marginLeft: 3 }} />
                  <Text style={styles.camCardTime}>{cam.time || '07:30 ص - 02:00 م'}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Info Box */}
        <View style={styles.infoCard}>
          <View style={styles.infoTitleRow}>
            <Info size={16} color="#10b981" style={{ marginLeft: 6 }} />
            <Text style={styles.infoTitle}>تعليمات البث المباشر</Text>
          </View>
          <Text style={styles.infoDesc}>
            يتم الاتصال مباشرة بسيرفر go2rtc عبر بروتوكول WebRTC لتقليل استهلاك باقة الإنترنت وتوفير بث فوري دون تأخير. تفتح الكاميرات تلقائياً بالتزامن مع جدول دوام الطفل.
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  header: { marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827', textAlign: 'right' },
  subTitle: { fontSize: 13, color: '#6b7280', textAlign: 'right', marginTop: 2 },

  securityBanner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  securityBannerText: {
    flex: 1,
    fontSize: 11,
    color: '#166534',
    fontWeight: '500',
    textAlign: 'right',
    lineHeight: 17,
  },

  // Video Player Box (Strictly Flat - NO SHADOWS)
  videoPlayerBox: {
    backgroundColor: '#090d16',
    borderRadius: 20,
    height: 250,
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    overflow: 'hidden',
  },
  videoOverlayTop: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#dc2626',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  liveBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  camNameOverlay: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold' },

  videoPlaceholderContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  centerLoading: { alignItems: 'center' },
  loadingText: { color: '#cbd5e1', fontSize: 12, marginTop: 8 },

  centerError: { alignItems: 'center', paddingHorizontal: 16 },
  errorTitle: { color: '#f87171', fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  errorSub: { color: '#94a3b8', fontSize: 11, textAlign: 'center', marginBottom: 10 },
  retryBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  retryBtnText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },

  centerStreamActive: { alignItems: 'center' },
  camIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  placeholderTitle: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  placeholderSub: { color: '#94a3b8', fontSize: 12 },
  streamDetailsBadge: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  streamDetailsText: { color: '#cbd5e1', fontSize: 10, fontWeight: '600' },

  videoControls: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  footerFlex: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityText: { color: '#94a3b8', fontSize: 10, fontWeight: '500' },

  sectionTitleRow: { marginBottom: 12 },
  sectionHeader: { fontSize: 15, fontWeight: 'bold', color: '#111827', textAlign: 'right' },

  // Grid cards (Strictly Flat - NO SHADOWS / NO ELEVATION)
  camGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  camCard: {
    width: (width - 48) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  activeCamCard: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  camCardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  dotLive: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10b981',
    marginLeft: 4,
  },
  camStatusText: { fontSize: 10, fontWeight: 'bold', color: '#4b5563' },

  camCardName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 2,
  },
  activeCamCardName: { color: '#047857' },
  camCardClass: { fontSize: 10, color: '#6b7280', textAlign: 'center', marginBottom: 6 },
  timeTag: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  camCardTime: { fontSize: 9, color: '#6b7280' },

  // Info Card
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    marginTop: 6,
  },
  infoTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoTitle: { fontSize: 12, fontWeight: 'bold', color: '#111827' },
  infoDesc: { fontSize: 11, color: '#6b7280', textAlign: 'right', lineHeight: 18 },
});