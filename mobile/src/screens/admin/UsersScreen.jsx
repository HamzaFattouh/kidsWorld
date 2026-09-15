import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {
  Users,
  User,
  ShieldCheck,
  Settings,
  Plus,
  Calendar,
  MessageSquare,
  AlertTriangle,
  Heart,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Check,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export function UsersScreen() {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'parents' | 'teachers'

  // Users List State
  const [usersList, setUsersList] = useState([
    {
      id: 'usr-parent-shakaa',
      name: 'أحمد الشكعة',
      email: 'ahmed.shakaa@gmail.com',
      phone: '0599888777',
      role: 'PARENT',
      isActive: true,
      children: [
        { id: 'child-1', name: 'عمر أحمد الشكعة', class: 'روضة العصافير' },
        { id: 'child-2', name: 'ليان أحمد الشكعة', class: 'روضة الأمل' },
      ],
      messages: [
        { id: 'm1', from: 'أحمد الشكعة', text: 'استفسار عن موعد الرحلة', date: '2026-09-14' },
      ],
      complaints: [
        { id: 'c1', type: 'اقترح', text: 'زيادة ظلال في حديقة الألعاب', status: 'قيد المتابعة' },
      ],
    },
    {
      id: 'usr-parent-masri',
      name: 'مريم المصري',
      email: 'maryam.masri@gmail.com',
      phone: '0599555666',
      role: 'PARENT',
      isActive: true,
      children: [
        { id: 'child-3', name: 'سارة مريم المصري', class: 'روضة الزهور' },
      ],
      messages: [
        { id: 'm2', from: 'مريم المصري', text: 'طلب إذن مغادرة مبكرة', date: '2026-09-12' },
      ],
      complaints: [],
    },
    {
      id: 'usr-teacher-noura',
      name: 'أ. نورة النابلسي',
      email: 'noura.teacher@kidsworld.ps',
      phone: '0599111222',
      role: 'TEACHER',
      isActive: true,
      assignedClass: 'روضة العصافير',
      messages: [
        { id: 'tm1', from: 'أ. نورة النابلسي', text: 'تم إرسال التقرير الأسبوعي', date: '2026-09-14' },
      ],
      complaints: [],
      attendanceStats: {
        totalMonthDays: 30,
        fridaysDeducted: 4,
        netWorkingDays: 26,
        attendedDays: 25,
        rate: '96.2%',
      },
    },
    {
      id: 'usr-teacher-sara',
      name: 'أ. سارة الخالد',
      email: 'sara.teacher@kidsworld.ps',
      phone: '0599333444',
      role: 'TEACHER',
      isActive: true,
      assignedClass: 'روضة الزهور',
      messages: [],
      complaints: [],
      attendanceStats: {
        totalMonthDays: 30,
        fridaysDeducted: 4,
        netWorkingDays: 26,
        attendedDays: 26,
        rate: '100.0%',
      },
    },
  ]);

  // Modal States
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [isTeacherCalendarModalOpen, setIsTeacherCalendarModalOpen] = useState(false);

  // Permission checklist state
  const [permissions, setPermissions] = useState({
    editCms: true,
    manageEvents: true,
    uploadJournal: true,
    recordAttendance: true,
    recordMeals: true,
    writeEvaluations: true,
    sendMessages: true,
    viewCameras: true,
  });

  // New Child Input state
  const [newChildName, setNewChildName] = useState('');
  const [newChildClass, setNewChildClass] = useState('روضة العصافير');

  const TEACHER_PERMISSIONS = [
    { key: 'recordAttendance', label: 'تسجيل وتحديث الحضور والغياب اليومي للطلاب' },
    { key: 'recordMeals', label: 'تسجيل الوجبات الغذائية اليومية للأطفال' },
    { key: 'writeEvaluations', label: 'كتابة وتحديث التقييمات والملاحظات' },
    { key: 'uploadJournal', label: 'رفع صور في المجلة اليومية للأطفال' },
    { key: 'manageEvents', label: 'إدارة وتعديل الفعاليات والأنشطة' },
    { key: 'sendMessages', label: 'إرسال واستقبال الرسائل والشكاوى' },
    { key: 'viewCameras', label: 'معاينة البث المباشر وكاميرات القاعات' },
  ];

  const PARENT_PERMISSIONS = [
    { key: 'viewReports', label: 'متابعة والاطلاع على التقييمات والملاحظات الأسبوعية' },
    { key: 'sendMessages', label: 'إرسال واستقبال الرسائل والشكاوى لإدارة الروضة' },
    { key: 'submitRequests', label: 'تقديم طلبات المغادرة والإذن الاستثنائي' },
    { key: 'viewCameras', label: 'معاينة البث المباشر وكاميرات القاعات' },
    { key: 'downloadDocuments', label: 'تحميل وتنزيل المستندات والملفات المرفقة' },
  ];

  const openUserDetail = (user) => {
    setSelectedUser(user);
    const isTeacher = user.role === 'TEACHER';

    if (user.permissions) {
      setPermissions(user.permissions);
    } else {
      const defaultTeacher = {
        recordAttendance: true,
        recordMeals: true,
        writeEvaluations: true,
        uploadJournal: true,
        manageEvents: true,
        sendMessages: true,
        viewCameras: true,
      };
      const defaultParent = {
        viewReports: true,
        sendMessages: true,
        submitRequests: true,
        viewCameras: true,
        downloadDocuments: true,
      };
      setPermissions(isTeacher ? defaultTeacher : defaultParent);
    }
    setIsPermissionsModalOpen(true);
  };

  const handleTogglePermission = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePermissions = () => {
    if (!selectedUser) return;

    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === selectedUser.id) {
          return { ...u, permissions: { ...permissions } };
        }
        return u;
      })
    );

    setSelectedUser((prev) => ({
      ...prev,
      permissions: { ...permissions },
    }));

    Alert.alert('تم حفظ الصلاحيات 🎉', `تم تحديث وتثبيت صلاحيات (${selectedUser?.name}) بنجاح.`);
    setIsPermissionsModalOpen(false);
  };

  const handleAddChildToParent = () => {
    if (!newChildName.trim() || !selectedUser) return;

    const newChild = {
      id: `child-${Date.now()}`,
      name: newChildName.trim(),
      class: newChildClass,
    };

    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === selectedUser.id) {
          return {
            ...u,
            children: [...(u.children || []), newChild],
          };
        }
        return u;
      })
    );

    setSelectedUser((prev) => ({
      ...prev,
      children: [...(prev?.children || []), newChild],
    }));

    setNewChildName('');
    setIsAddChildModalOpen(false);
    Alert.alert('تمت الإضافة 🎉', `تم ربط الطفل (${newChild.name}) بولي الأمر (${selectedUser.name}) بنجاح!`);
  };

  const filteredUsers = usersList.filter((u) => {
    if (activeTab === 'parents') return u.role === 'PARENT';
    if (activeTab === 'teachers') return u.role === 'TEACHER';
    return true;
  });

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>إدارة المستخدمين والصلاحيات 👥</Text>
          <Text style={styles.subTitle}>التحكم بحسابات وصلاحيات المعلمين وأولياء الأمور</Text>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, activeTab === 'all' && styles.activeFilterChip]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.filterChipText, activeTab === 'all' && styles.activeFilterChipText]}>
              الكل ({usersList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, activeTab === 'parents' && styles.activeFilterChip]}
            onPress={() => setActiveTab('parents')}
          >
            <Text style={[styles.filterChipText, activeTab === 'parents' && styles.activeFilterChipText]}>
              أولياء الأمور 👨‍👩‍👧
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, activeTab === 'teachers' && styles.activeFilterChip]}
            onPress={() => setActiveTab('teachers')}
          >
            <Text style={[styles.filterChipText, activeTab === 'teachers' && styles.activeFilterChipText]}>
              المعلمين 👩‍🏫
            </Text>
          </TouchableOpacity>
        </View>

        {/* Users Cards List */}
        {filteredUsers.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={styles.userCard}
            onPress={() => openUserDetail(user)}
            activeOpacity={0.7}
          >
            <View style={styles.userCardHeader}>
              <View style={styles.userInfoLeft}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userPhone}>📞 {user.phone}</Text>
              </View>

              <View style={styles.userBadgeCol}>
                <View
                  style={[
                    styles.roleBadge,
                    {
                      backgroundColor:
                        user.role === 'TEACHER'
                          ? '#eff6ff'
                          : user.role === 'PARENT'
                          ? '#ecfdf5'
                          : '#f3e8ff',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.roleBadgeText,
                      {
                        color:
                          user.role === 'TEACHER'
                            ? '#2563eb'
                            : user.role === 'PARENT'
                            ? '#166534'
                            : '#7e22ce',
                      },
                    ]}
                  >
                    {user.role === 'TEACHER' ? 'معلم 👩‍🏫' : 'ولي أمر 👨‍👩‍👧'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Sub-info summary */}
            <View style={styles.userSubInfoRow}>
              {user.role === 'PARENT' ? (
                <Text style={styles.userSubText}>
                  👶 الأطفال المربوطين: <Text style={styles.boldText}>{user.children?.length || 0} أطفال</Text>
                </Text>
              ) : (
                <Text style={styles.userSubText}>
                  🏫 الصف المسؤول: <Text style={styles.boldText}>{user.assignedClass || '—'}</Text>
                </Text>
              )}

              <TouchableOpacity style={styles.settingsBtn} onPress={() => openUserDetail(user)}>
                <Settings size={14} color="#3b82f6" style={{ marginLeft: 4 }} />
                <Text style={styles.settingsBtnText}>الصلاحيات</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {/* User Detail & Permissions Modal */}
        {isPermissionsModalOpen && selectedUser && (
          <Modal visible animationType="slide" transparent>
            <View style={styles.modalBg}>
              <ScrollView style={styles.modalContentCard}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>بيانات وصلاحيات: {selectedUser.name}</Text>
                  <TouchableOpacity onPress={() => setIsPermissionsModalOpen(false)}>
                    <XCircle size={22} color="#9ca3af" />
                  </TouchableOpacity>
                </View>

                <View style={styles.userDetailBox}>
                  <Text style={styles.detailLine}>✉️ البريد الإلكتروني: {selectedUser.email}</Text>
                  <Text style={styles.detailLine}>📞 رقم الهاتف: {selectedUser.phone}</Text>
                  <Text style={styles.detailLine}>📍 العنوان المستهدف: نابلس- نابلس الجديدة</Text>
                  <Text style={styles.detailLine}>
                    🎭 الدور القيادي: {selectedUser.role === 'TEACHER' ? 'معلمة قاعة' : 'ولي أمر طفل'}
                  </Text>
                </View>

                {/* PARENT SPECIFIC SECTION */}
                {selectedUser.role === 'PARENT' && (
                  <View style={styles.roleSectionCard}>
                    <View style={styles.sectionTitleRow}>
                      <TouchableOpacity
                        style={styles.addChildBtn}
                        onPress={() => setIsAddChildModalOpen(true)}
                      >
                        <Plus size={14} color="#ffffff" style={{ marginLeft: 4 }} />
                        <Text style={styles.addChildBtnText}>إضافة طفل</Text>
                      </TouchableOpacity>
                      <Text style={styles.sectionHeaderTitle}>أطفال ولي الأمر المربوطين 👶</Text>
                    </View>

                    {selectedUser.children?.map((ch, idx) => (
                      <View key={idx} style={styles.childItemRow}>
                        <Text style={styles.childClassBadge}>{ch.class}</Text>
                        <Text style={styles.childItemName}>{ch.name}</Text>
                      </View>
                    ))}

                    <Text style={styles.subSectionTitle}>الرسائل والشكاوى 💬</Text>
                    <Text style={styles.logText}>
                      • الرسائل المرسلة: {selectedUser.messages?.length || 0} رسالة
                    </Text>
                    <Text style={styles.logText}>
                      • الشكاوى والمقترحات: {selectedUser.complaints?.length || 0} طلب
                    </Text>
                  </View>
                )}

                {/* TEACHER SPECIFIC SECTION */}
                {selectedUser.role === 'TEACHER' && (
                  <View style={styles.roleSectionCard}>
                    <Text style={styles.sectionHeaderTitle}>بيانات وتغطية المعلمة 👩‍🏫</Text>
                    <Text style={styles.detailLine}>🏫 الصف المسؤول: {selectedUser.assignedClass}</Text>

                    <TouchableOpacity
                      style={styles.calendarBtn}
                      onPress={() => setIsTeacherCalendarModalOpen(true)}
                    >
                      <Calendar size={16} color="#ffffff" style={{ marginLeft: 6 }} />
                      <Text style={styles.calendarBtnText}>عرض تقويم أيام حضور المعلمة والتقرير</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* PERMISSIONS CONTROL */}
                <Text style={styles.sectionHeaderTitle}>
                  التحكم بصلاحيات ({selectedUser.role === 'TEACHER' ? 'المعلم/ة' : 'ولي الأمر'}) 🔐
                </Text>
                <View style={styles.permissionsGrid}>
                  {(selectedUser.role === 'PARENT' ? PARENT_PERMISSIONS : TEACHER_PERMISSIONS).map((perm) => {
                    const isEnabled = permissions[perm.key] !== undefined ? Boolean(permissions[perm.key]) : true;
                    return (
                      <TouchableOpacity
                        key={perm.key}
                        style={[styles.permRow, isEnabled && styles.activePermRow]}
                        onPress={() => handleTogglePermission(perm.key)}
                      >
                        <Text style={[styles.permStatusText, isEnabled && styles.activePermStatusText]}>
                          {isEnabled ? 'مفعل ✅' : 'معطل ❌'}
                        </Text>
                        <Text style={styles.permLabel}>{perm.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity style={styles.savePermsBtn} onPress={handleSavePermissions}>
                  <Text style={styles.savePermsBtnText}>حفظ إعدادات الصلاحيات</Text>
                </TouchableOpacity>

                <View style={{ height: 24 }} />
              </ScrollView>
            </View>
          </Modal>
        )}

        {/* Modal: Add Child to Parent */}
        {isAddChildModalOpen && (
          <Modal visible animationType="fade" transparent>
            <View style={styles.modalBg}>
              <View style={styles.modalCardSmall}>
                <Text style={styles.modalTitle}>إضافة طفل جديد لـ ({selectedUser?.name})</Text>

                <Text style={styles.inputLabel}>اسم الطفل الثلاثي:</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="أدخل اسم الطفل..."
                  value={newChildName}
                  onChangeText={setNewChildName}
                />

                <Text style={styles.inputLabel}>اختر الصف المسجل فيه:</Text>
                <View style={styles.classChipsSelector}>
                  {['روضة العصافير', 'روضة الزهور', 'روضة الأمل'].map((cls) => (
                    <TouchableOpacity
                      key={cls}
                      style={[styles.chipChoice, newChildClass === cls && styles.activeChipChoice]}
                      onPress={() => setNewChildClass(cls)}
                    >
                      <Text style={[styles.chipChoiceText, newChildClass === cls && styles.activeChipChoiceText]}>
                        {cls}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsAddChildModalOpen(false)}>
                    <Text style={styles.cancelBtnText}>إلغاء</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.confirmAddBtn} onPress={handleAddChildToParent}>
                    <Text style={styles.confirmAddBtnText}>ربط وتأكيد إضافة الطفل</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

        {/* Modal: Teacher Attendance Calendar & Friday Deduction Report */}
        {isTeacherCalendarModalOpen && selectedUser && (
          <Modal visible animationType="slide" transparent>
            <View style={styles.modalBg}>
              <View style={styles.modalCardSmall}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>تقويم حضور: {selectedUser.name}</Text>
                  <TouchableOpacity onPress={() => setIsTeacherCalendarModalOpen(false)}>
                    <XCircle size={22} color="#9ca3af" />
                  </TouchableOpacity>
                </View>

                <View style={styles.teacherStatsBox}>
                  <Text style={styles.statsNotice}>
                    🛡️ تم تطبيق خصم أيام الجمعة (4 أيام) من نسبة الحضور الرسمية.
                  </Text>

                  <View style={styles.statsSummaryGrid}>
                    <View style={styles.statSummaryItem}>
                      <Text style={styles.statValNum}>30 يوم</Text>
                      <Text style={styles.statValLbl}>أيام الشهر</Text>
                    </View>
                    <View style={styles.statSummaryItem}>
                      <Text style={[styles.statValNum, { color: '#ef4444' }]}>-4 جمعة</Text>
                      <Text style={styles.statValLbl}>خصم الجمعة</Text>
                    </View>
                    <View style={styles.statSummaryItem}>
                      <Text style={[styles.statValNum, { color: '#2563eb' }]}>26 يوم</Text>
                      <Text style={styles.statValLbl}>دوام صافي</Text>
                    </View>
                    <View style={styles.statSummaryItem}>
                      <Text style={[styles.statValNum, { color: '#10b981' }]}>
                        {selectedUser.attendanceStats?.attendedDays || 25} يوم
                      </Text>
                      <Text style={styles.statValLbl}>الأيام المدوّمة</Text>
                    </View>
                  </View>

                  <View style={styles.rateDisplay}>
                    <Text style={styles.rateDisplayLabel}>نسبة الحضور الرسمية الدقيقة:</Text>
                    <Text style={styles.rateDisplayNum}>
                      {selectedUser.attendanceStats?.rate || '96.2%'}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.closeBtn} onPress={() => setIsTeacherCalendarModalOpen(false)}>
                  <Text style={styles.closeBtnText}>إغلاق النافذة</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

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

  filterRow: { flexDirection: 'row-reverse', marginBottom: 20 },
  filterChip: { backgroundColor: '#f3f4f6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 8 },
  activeFilterChip: { backgroundColor: '#3b82f6' },
  filterChipText: { fontSize: 13, fontWeight: 'bold', color: '#4b5563' },
  activeFilterChipText: { color: '#ffffff' },

  userCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  userCardHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-start' },
  userInfoLeft: { flex: 1 },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#1f2937', textAlign: 'right' },
  userEmail: { fontSize: 12, color: '#6b7280', textAlign: 'right', marginTop: 2 },
  userPhone: { fontSize: 12, color: '#9ca3af', textAlign: 'right', marginTop: 2 },

  userBadgeCol: { alignItems: 'flex-end' },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  roleBadgeText: { fontSize: 12, fontWeight: 'bold' },

  userSubInfoRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 10 },
  userSubText: { fontSize: 12, color: '#4b5563' },
  boldText: { fontWeight: 'bold', color: '#111827' },
  settingsBtn: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  settingsBtnText: { fontSize: 12, fontWeight: 'bold', color: '#2563eb' },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContentCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, maxHeight: '85%' },
  modalCardSmall: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 17, fontWeight: 'bold', color: '#111827' },

  userDetailBox: { backgroundColor: '#f9fafb', padding: 12, borderRadius: 12, marginBottom: 16 },
  detailLine: { fontSize: 13, color: '#374151', textAlign: 'right', marginBottom: 4 },

  roleSectionCard: { backgroundColor: '#f0fdf4', padding: 14, borderRadius: 14, marginBottom: 16, borderWidth: 1, borderColor: '#dcfce7' },
  sectionTitleRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionHeaderTitle: { fontSize: 14, fontWeight: 'bold', color: '#166534', textAlign: 'right' },
  addChildBtn: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#16a34a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  addChildBtnText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },

  childItemRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#dcfce7' },
  childItemName: { fontSize: 13, fontWeight: 'bold', color: '#1f2937' },
  childClassBadge: { fontSize: 11, backgroundColor: '#ffffff', color: '#15803d', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, fontWeight: 'bold' },

  subSectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#166534', textAlign: 'right', marginTop: 12, marginBottom: 4 },
  logText: { fontSize: 12, color: '#374151', textAlign: 'right', marginBottom: 2 },

  calendarBtn: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563eb', paddingVertical: 10, borderRadius: 12, marginTop: 10 },
  calendarBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },

  permissionsGrid: { marginTop: 10, marginBottom: 16 },
  permRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#f9fafb', borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  activePermRow: { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' },
  permLabel: { flex: 1, fontSize: 12, fontWeight: '600', color: '#1f2937', textAlign: 'right', marginRight: 8 },
  permStatusText: { fontSize: 11, fontWeight: 'bold', color: '#6b7280' },
  activePermStatusText: { color: '#15803d' },

  savePermsBtn: { backgroundColor: '#10b981', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  savePermsBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },

  inputLabel: { fontSize: 13, fontWeight: 'bold', color: '#374151', textAlign: 'right', marginBottom: 6, marginTop: 10 },
  textInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, padding: 10, textAlign: 'right', fontSize: 13 },

  classChipsSelector: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  chipChoice: { backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  activeChipChoice: { backgroundColor: '#16a34a' },
  chipChoiceText: { fontSize: 12, fontWeight: 'bold', color: '#4b5563' },
  activeChipChoiceText: { color: '#ffffff' },

  modalActions: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginTop: 10 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#f3f4f6', borderRadius: 10 },
  cancelBtnText: { color: '#4b5563', fontWeight: 'bold' },
  confirmAddBtn: { paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#16a34a', borderRadius: 10 },
  confirmAddBtnText: { color: '#ffffff', fontWeight: 'bold' },

  teacherStatsBox: { backgroundColor: '#eff6ff', padding: 16, borderRadius: 16, marginBottom: 16 },
  statsNotice: { fontSize: 12, fontWeight: 'bold', color: '#1e40af', textAlign: 'right', marginBottom: 12 },
  statsSummaryGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', marginBottom: 12 },
  statSummaryItem: { width: '50%', alignItems: 'center', marginBottom: 10 },
  statValNum: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  statValLbl: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  rateDisplay: { backgroundColor: '#ffffff', padding: 12, borderRadius: 12, alignItems: 'center' },
  rateDisplayLabel: { fontSize: 12, color: '#3b82f6', fontWeight: 'bold' },
  rateDisplayNum: { fontSize: 24, fontWeight: 'bold', color: '#1d4ed8', marginTop: 2 },

  closeBtn: { backgroundColor: '#64748b', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  closeBtnText: { color: '#ffffff', fontWeight: 'bold' },
});
