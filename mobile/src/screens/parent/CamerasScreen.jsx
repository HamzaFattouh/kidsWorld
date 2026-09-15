import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Camera, Video, ShieldCheck, Play, Radio } from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

const { width } = Dimensions.get('window');

export function CamerasScreen() {
  const [activeCam, setActiveCam] = useState('1');

  const cameras = [
    { id: '1', name: 'قاعة الصغار الأساسية', status: 'LIVE', time: '08:00 ص - 02:00 م' },
    { id: '2', name: 'قاعة الألعاب الداخلية', status: 'LIVE', time: '08:00 ص - 02:00 م' },
    { id: '3', name: 'الساحة والحديقة الخارجية', status: 'LIVE', time: '08:00 ص - 02:00 م' },
    { id: '4', name: 'قاعة الأنشطة والرسم', status: 'OFFLINE', time: 'مغلق حالياً' },
  ];

  const selectedCamObj = cameras.find((c) => c.id === activeCam) || cameras[0];

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>البث المباشر والكاميرات 📹</Text>
          <Text style={styles.subTitle}>متابعة بصرية آمنة لقاعات وأنشطة الأطفال</Text>
        </View>

        {/* Video Stream Simulation Card */}
        <View style={styles.videoPlayerBox}>
          <View style={styles.videoOverlayTop}>
            <View style={styles.liveBadge}>
              <Radio size={14} color="#ffffff" style={{ marginLeft: 4 }} />
              <Text style={styles.liveBadgeText}>بث مباشر LIVE</Text>
            </View>
            <Text style={styles.camNameOverlay}>{selectedCamObj.name}</Text>
          </View>

          <View style={styles.videoPlaceholderContent}>
            <Camera size={48} color="#94a3b8" style={{ marginBottom: 12 }} />
            <Text style={styles.placeholderTitle}>بث مباشر آمن ومشفّر 🔒</Text>
            <Text style={styles.placeholderSub}>القاعة: {selectedCamObj.name}</Text>
          </View>

          <View style={styles.videoControls}>
            <ShieldCheck size={16} color="#10b981" style={{ marginLeft: 6 }} />
            <Text style={styles.securityText}>مشفر ومتاح لأولياء الأمور المعتمدين فقط</Text>
          </View>
        </View>

        {/* Camera Selector Grid */}
        <Text style={styles.sectionHeader}>اختر القاعة 🏢</Text>

        <View style={styles.camGrid}>
          {cameras.map((cam) => {
            const isSelected = cam.id === activeCam;
            return (
              <TouchableOpacity
                key={cam.id}
                style={[styles.camCard, isSelected && styles.activeCamCard]}
                onPress={() => setActiveCam(cam.id)}
                activeOpacity={0.7}
              >
                <View style={styles.camCardHeader}>
                  {cam.status === 'LIVE' ? (
                    <View style={styles.dotLive} />
                  ) : (
                    <View style={styles.dotOffline} />
                  )}
                  <Text style={styles.camStatusText}>{cam.status}</Text>
                </View>

                <Video size={24} color={isSelected ? '#10b981' : '#6b7280'} style={{ marginVertical: 8 }} />
                <Text style={[styles.camCardName, isSelected && styles.activeCamCardName]}>{cam.name}</Text>
                <Text style={styles.camCardTime}>{cam.time}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827', textAlign: 'right' },
  subTitle: { fontSize: 13, color: '#6b7280', textAlign: 'right', marginTop: 2 },

  videoPlayerBox: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    height: 230,
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  videoOverlayTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  liveBadge: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#ef4444', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  liveBadgeText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  camNameOverlay: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold' },

  videoPlaceholderContent: { alignItems: 'center', justifyContent: 'center' },
  placeholderTitle: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  placeholderSub: { color: '#94a3b8', fontSize: 12 },

  videoControls: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.08)', paddingVertical: 6, borderRadius: 10 },
  securityText: { color: '#cbd5e1', fontSize: 11, fontWeight: '600' },

  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#111827', textAlign: 'right', marginBottom: 12 },

  camGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'space-between' },
  camCard: {
    width: (width - 48) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  activeCamCard: { borderColor: '#10b981', backgroundColor: '#f0fdf4' },
  camCardHeader: { flexDirection: 'row-reverse', alignItems: 'center', alignSelf: 'flex-start' },
  dotLive: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981', marginLeft: 4 },
  dotOffline: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#9ca3af', marginLeft: 4 },
  camStatusText: { fontSize: 10, fontWeight: 'bold', color: '#6b7280' },

  camCardName: { fontSize: 13, fontWeight: 'bold', color: '#1f2937', textAlign: 'center', marginBottom: 2 },
  activeCamCardName: { color: '#10b981' },
  camCardTime: { fontSize: 11, color: '#9ca3af', textAlign: 'center' },
});