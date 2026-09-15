import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  GraduationCap,
  MessageSquare,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  Calendar,
  Activity,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { reportingApi } from '../../api/reporting';

export function DashboardPage() {
  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: () => reportingApi.getAdminDashboardStats(),
    refetchInterval: 30000, // Refresh every 30s
  });

  const stats = response?.data || {
    studentAttendance: { total: 25, present: 22, percentage: 88 },
    teacherAttendance: { total: 10, present: 9, percentage: 90 },
    complaintsFeed: [
      {
        id: 'c1',
        title: 'استفسار عن رحلة الأطفال المقررة',
        parentName: 'أم أحمد',
        childName: 'أحمد محمود',
        status: 'RESOLVED',
        hasTeacherResponded: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'c2',
        title: 'ملاحظة بخصوص وجبة الإفطار الصحي',
        parentName: 'أبو سارة',
        childName: 'سارة خالد',
        status: 'OPEN',
        hasTeacherResponded: false,
        createdAt: new Date().toISOString(),
      },
    ],
    incidentsFeed: [
      {
        id: 'i1',
        childName: 'عبدالله علي',
        severity: 'LOW',
        description: 'سقوط بسيط أثناء اللعب بالكرة وتم وضع كمادة باردة.',
        actionTaken: 'تم التعقيم والاطمئنان عليه بحالة ممتازة.',
        date: '2026-09-15',
        time: '10:15 AM',
      },
    ],
    cmsUpdatesFeed: [
      {
        id: 'u1',
        type: 'EVENT',
        title: 'إضافة نشاط جديد: معرض الألوان والإبداع الصغير 🖌️',
        date: new Date().toISOString(),
      },
      {
        id: 'u2',
        type: 'GALLERY',
        title: 'رفع صور جديدة للمجلة اليومية: أنشطة الرسم والتلوين 📸',
        date: new Date().toISOString(),
      },
    ],
  };

  const studentAtt = stats.studentAttendance || { total: 25, present: 22, percentage: 88 };
  const teacherAtt = stats.teacherAttendance || { total: 10, present: 9, percentage: 90 };

  return (
    <div className="space-y-8 text-start pb-12">
      <PageHeader
        title="لوحة التحكم والمتابعة الشاملة 📊"
        description="متابعة نسبة حضور الطلاب والمعلمين، الشكاوى والردود، الحوادث، وإشعارات تحديثات الموقع"
      />

      {/* Attendance Stats Widgets (1 & 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Student Attendance Widget */}
        <Card className="border-t-4 border-t-emerald-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white">
                    حضور الطلاب اليوم
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">نسبة حضور الأطفال والطلاب</p>
                </div>
              </div>
              <span className="text-2xl font-display font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-xl">
                {studentAtt.percentage}%
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold text-gray-700 dark:text-gray-300">
                <span>الحاضرون: {studentAtt.present} طفل</span>
                <span>العدد الكلي: {studentAtt.total} طفل</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-3.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, Math.max(0, studentAtt.percentage))}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" /> نسبة منتظمة وممتازة
              </span>
              <span>تحديث اليوم تلقائياً</span>
            </div>
          </CardContent>
        </Card>

        {/* 2. Teacher Attendance Widget */}
        <Card className="border-t-4 border-t-indigo-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white">
                    حضور الكادر والمعلمين
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">نسبة التزام الحضور للهيئة التعليمية</p>
                </div>
              </div>
              <span className="text-2xl font-display font-extrabold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-xl">
                {teacherAtt.percentage}%
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold text-gray-700 dark:text-gray-300">
                <span>الحاضرون: {teacherAtt.present} معلم/ة</span>
                <span>العدد الكلي: {teacherAtt.total} معلم/ة</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-3.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, Math.max(0, teacherAtt.percentage))}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
              <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> انتظام تام في القاعات
              </span>
              <span>تحديث اليوم تلقائياً</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications & Feeds Grid (3, 4, 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 3. Parent Messages & Complaints Feed */}
        <Card className="lg:col-span-1 shadow-md">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" />
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-base">
                  الرسائل والشكاوى ومتابعة الرد 💬
                </h3>
              </div>
              <span className="text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-600 px-2 py-0.5 rounded-md font-bold">
                {stats.complaintsFeed?.length || 0}
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {stats.complaintsFeed?.length > 0 ? (
                stats.complaintsFeed.map((comp) => (
                  <div key={comp.id} className="p-3.5 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-gray-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[180px]">
                        {comp.title}
                      </span>
                      {comp.hasTeacherResponded ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> تم الرد من المعلمة
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> في انتظار الرد
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {comp.description}
                    </p>

                    <div className="flex justify-between items-center text-[10px] text-gray-400 pt-1 border-t border-gray-200/50 dark:border-gray-700/50">
                      <span>المرسل: {comp.parentName} ({comp.childName})</span>
                      <span>{new Date(comp.createdAt).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-center text-gray-400 py-6">لا يوجد شكاوى أو رسائل جديدة حالياً.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 4. Incidents & Safety Notifications */}
        <Card className="lg:col-span-1 shadow-md">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-base">
                  إشعارات الحوادث والطوارئ ⚠️
                </h3>
              </div>
              <span className="text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-600 px-2 py-0.5 rounded-md font-bold">
                {stats.incidentsFeed?.length || 0}
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {stats.incidentsFeed?.length > 0 ? (
                stats.incidentsFeed.map((inc) => (
                  <div key={inc.id} className="p-3.5 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-gray-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        الطفل: {inc.childName}
                      </span>
                      <span className="text-[11px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full">
                        {inc.severity === 'LOW' ? 'بسيط 🟢' : inc.severity === 'MEDIUM' ? 'متوسط 🟡' : 'عالي 🔴'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {inc.description}
                    </p>

                    {inc.actionAction || inc.actionTaken ? (
                      <div className="bg-emerald-50/60 dark:bg-emerald-950/20 p-2 rounded-lg text-[11px] text-emerald-700 dark:text-emerald-300">
                        <span className="font-bold">الإجراء: </span>{inc.actionTaken}
                      </div>
                    ) : null}

                    <div className="flex justify-between items-center text-[10px] text-gray-400 pt-1">
                      <span>توقيت الحادثة: {inc.time || '—'}</span>
                      <span>{new Date(inc.date).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-emerald-600 dark:text-emerald-400 space-y-2">
                  <CheckCircle2 className="w-8 h-8 mx-auto" />
                  <p className="text-xs font-bold">الحمد لله، لم يتم تسجيل أي حوادث طارئة اليوم.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 5. CMS, Activities & Gallery Uploads Notifications */}
        <Card className="lg:col-span-1 shadow-md">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-base">
                  تحديثات الموقع والأنشطة والصور ✨
                </h3>
              </div>
              <span className="text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 px-2 py-0.5 rounded-md font-bold">
                نشط
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {stats.cmsUpdatesFeed?.length > 0 ? (
                stats.cmsUpdatesFeed.map((upd, idx) => (
                  <div key={upd.id || idx} className="p-3.5 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-gray-800 space-y-2">
                    <div className="flex items-center gap-2">
                      {upd.type === 'EVENT' ? (
                        <Calendar className="w-4 h-4 text-orange-500 shrink-0" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                      <span className="text-xs font-bold text-gray-900 dark:text-white leading-snug">
                        {upd.title}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-gray-400 pt-1 border-t border-gray-200/50 dark:border-gray-700/50">
                      <span>تحديث مباشر</span>
                      <span>{new Date(upd.date).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-center text-gray-400 py-6">لا توجد تحديثات جديدة مسجلة.</p>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}