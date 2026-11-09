import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Upload,
  Calendar,
  FileCheck,
  ShieldCheck,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export function DocumentsScreen() {
  const [docs] = useState([
    {
      id: '1',
      title: 'سجل اللقاحات والتطعيمات الوطنية',
      type: 'سجل صحي',
      date: '2026-09-01',
      size: '1.4 MB',
      status: 'معتمد',
    },
    {
      id: '2',
      title: 'عقد التسجيل المعتمد للعام 2026-2027',
      type: 'وثيقة رسمية',
      date: '2026-08-25',
      size: '850 KB',
      status: 'معتمد',
    },
    {
      id: '3',
      title: 'صورة مصدقة عن شهادة الميلاد',
      type: 'هوية وثبوتيات',
      date: '2026-08-20',
      size: '2.1 MB',
      status: 'معتمد',
    },
    {
      id: '4',
      title: 'تقرير الفحص الطبي العام وسلامة النظر',
      type: 'تقرير طبي',
      date: '2026-08-15',
      size: '620 KB',
      status: 'معتمد',
    },
    {
      id: '5',
      title: 'إقرار وتفويض استلام الطفل وتصوير الأنشطة',
      type: 'إقرار ولي أمر',
      date: '2026-09-02',
      size: '430 KB',
      status: 'معتمد',
    },
  ]);

  const handleDownload = (doc) => {
    Alert.alert('تحميل المستند', `جارٍ تنزيل ملف (${doc.title}) إلى جهازك.`);
  };

  const handleUpload = () => {
    Alert.alert('رفع وثيقة جديدة', 'يمكنك اختيار تقرير طبي أو شهادة تطعيم حديثة لرفعها إلى ملف الطفل.');
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>الوثائق الرسمية والملف الثبوتي</Text>
            <Text style={styles.subtitle}>ملف الطفل: عمر أحمد الشكعة • جميع الوثائق معتمدة</Text>
          </View>
          <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
            <Upload size={16} color="#ffffff" />
            <Text style={styles.uploadBtnText}>رفع وثيقة</Text>
          </TouchableOpacity>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <ShieldCheck size={20} color="#059669" />
          <Text style={styles.infoBannerText}>
            جميع الوثائق والبيانات الصحية محفوظة وفق أعلى معايير الخصوصية والتشفير.
          </Text>
        </View>

        {/* Documents List */}
        {docs.map((doc) => (
          <View key={doc.id} style={styles.docCard}>
            <View style={styles.docTopRow}>
              <View style={styles.docIconBox}>
                <FileText size={22} color="#059669" />
              </View>
              <View style={styles.docDetails}>
                <Text style={styles.docTitle}>{doc.title}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>{doc.type}</Text>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.metaText}>{doc.size}</Text>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.metaText}>{doc.date}</Text>
                </View>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.statusPill}>
                <CheckCircle2 size={13} color="#059669" />
                <Text style={styles.statusText}>{doc.status}</Text>
              </View>

              <TouchableOpacity
                testID={`download-doc-btn-${doc.id}`}
                style={styles.downloadBtn}
                onPress={() => handleDownload(doc)}
              >
                <Download size={14} color="#059669" />
                <Text style={styles.downloadBtnText}>تحميل الملف</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 30 },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', textAlign: 'right' },
  subtitle: { fontSize: 13, color: '#6b7280', textAlign: 'right', marginTop: 2 },
  uploadBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  uploadBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  infoBanner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#065f46',
    textAlign: 'right',
    lineHeight: 18,
  },

  docCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  docTopRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  docIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  docDetails: {
    flex: 1,
  },
  docTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
  },
  metaRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  metaText: {
    fontSize: 11,
    color: '#6b7280',
  },
  metaDot: {
    fontSize: 10,
    color: '#d1d5db',
  },

  cardFooter: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  statusPill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#059669',
  },
  downloadBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  downloadBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#059669',
  },
});
