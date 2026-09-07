import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  School,
  BookOpen,
  Mail,
  Lock,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  LogOut,
  LogIn,
  KeyRound,
  FileSignature,
  Building2,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  schoolName: string;
  subject: string;
  gradeLevels: string[];
  signatureEnabled: boolean;
  avatarText: string;
  isLoggedIn: boolean;
}

interface TeacherAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: TeacherProfile;
  onUpdateProfile: (profile: TeacherProfile) => void;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'profile' | 'sso'>('profile');
  const [email, setEmail] = useState(currentProfile.email || 'phandinhdoc@gmail.com');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(currentProfile.name || 'Thầy Phan Đình Đốc');
  const [schoolName, setSchoolName] = useState(currentProfile.schoolName || 'Trường THCS Nguyễn Du');
  const [subject, setSubject] = useState(currentProfile.subject || 'Khoa học tự nhiên');
  const [role, setRole] = useState(currentProfile.role || 'Tổ trưởng Chuyên môn KHTN');
  const [signatureEnabled, setSignatureEnabled] = useState(currentProfile.signatureEnabled ?? true);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = name
      .split(' ')
      .slice(-2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();

    const updated: TeacherProfile = {
      ...currentProfile,
      name,
      email: email || 'giaovien@moet.edu.vn',
      schoolName,
      subject,
      role,
      signatureEnabled,
      avatarText: initials || 'GV',
      isLoggedIn: true,
    };
    onUpdateProfile(updated);
    setFeedbackMsg('Đăng nhập thành công vào Hệ thống Giáo Án AI!');
    setTimeout(() => {
      setFeedbackMsg(null);
      onClose();
    }, 1200);
  };

  const handleGoogleEduSSO = () => {
    const updated: TeacherProfile = {
      id: 'teacher-google-1',
      name: 'Thầy Phan Đình Đốc',
      email: 'phandinhdoc@gmail.com',
      schoolName: 'Trường THCS Nguyễn Du',
      subject: 'Khoa học tự nhiên & Hóa học',
      role: 'Tổ trưởng Chuyên môn KHTN',
      gradeLevels: ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'],
      signatureEnabled: true,
      avatarText: 'PĐ',
      isLoggedIn: true,
    };
    setName(updated.name);
    setEmail(updated.email);
    setSchoolName(updated.schoolName);
    setSubject(updated.subject);
    setRole(updated.role);
    onUpdateProfile(updated);
    setFeedbackMsg('Đã liên kết tài khoản Google Workspace for Education thành công!');
    setTimeout(() => {
      setFeedbackMsg(null);
      onClose();
    }, 1200);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = name
      .split(' ')
      .slice(-2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();

    const updated: TeacherProfile = {
      ...currentProfile,
      name,
      email,
      schoolName,
      subject,
      role,
      signatureEnabled,
      avatarText: initials || 'GV',
    };
    onUpdateProfile(updated);
    setFeedbackMsg('Đã cập nhật thông tin hồ sơ sư phạm thành công!');
    setTimeout(() => {
      setFeedbackMsg(null);
      onClose();
    }, 1200);
  };

  const handleLogout = () => {
    const loggedOutProfile: TeacherProfile = {
      id: 'guest',
      name: 'Giáo viên Khách',
      email: '',
      role: 'Giáo viên bộ môn',
      schoolName: 'Trường THCS / THPT',
      subject: 'Khoa học tự nhiên',
      gradeLevels: ['Lớp 8'],
      signatureEnabled: false,
      avatarText: 'GV',
      isLoggedIn: false,
    };
    onUpdateProfile(loggedOutProfile);
    setFeedbackMsg('Đã đăng xuất phiên làm việc.');
    setTimeout(() => {
      setFeedbackMsg(null);
      onClose();
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cổng Đăng Nhập & Hồ Sơ Giáo Viên (MOET SSO)"
      subtitle="Quản lý danh tính sư phạm, đơn vị công tác và chữ ký số trên Kế hoạch bài dạy CV 5512"
      maxWidth="xl"
    >
      <div className="space-y-6">
        {feedbackMsg && (
          <div className="p-3.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Hồ Sơ Sư Phạm</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng Nhập Tài Khoản</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sso')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'sso'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Google Workspace Edu</span>
          </button>
        </div>

        {/* Tab 1: Profile Management */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-md shadow-indigo-600/20">
                {currentProfile.avatarText || 'GV'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{currentProfile.name}</h4>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    {currentProfile.isLoggedIn ? 'Đã xác thực' : 'Khách'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentProfile.schoolName} • {currentProfile.role}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên Giáo viên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  placeholder="Ví dụ: Thầy Phan Đình Đốc"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Ngành / Google Edu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  placeholder="phandinhdoc@gmail.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trường THCS / THPT <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  placeholder="Trường THCS Nguyễn Du"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chức vụ & Tổ chuyên môn
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  placeholder="Tổ trưởng Chuyên môn KHTN"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Môn học giảng dạy chính
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white cursor-pointer"
              >
                <option value="Khoa học tự nhiên">Khoa học tự nhiên (KHTN 6, 7, 8, 9)</option>
                <option value="Vật lí">Vật lí</option>
                <option value="Hóa học">Hóa học</option>
                <option value="Sinh học">Sinh học</option>
                <option value="Toán học">Toán học</option>
                <option value="Tin học & Công nghệ">Tin học & Công nghệ</option>
                <option value="Lịch sử & Địa lí">Lịch sử & Địa lí</option>
                <option value="Ngữ văn">Ngữ văn</option>
              </select>
            </div>

            {/* Digital signature check */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileSignature className="w-5 h-5 text-indigo-600" />
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Tự động chèn Chữ ký & Thông tin vào Bản in Typst / PDF
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Hiển thị tên giáo viên và tổ chuyên môn dưới chân trang chuẩn CV 5512
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={signatureEnabled}
                onChange={(e) => setSignatureEnabled(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {currentProfile.isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng Xuất</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Lưu Thông Tin Sư Phạm
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Standard Login */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">
                Đăng nhập Cổng Thông Tin Cán Bộ Giáo Viên
              </h4>
              <p className="text-xs text-slate-500">
                Sử dụng tài khoản cơ sở dữ liệu ngành GD&ĐT hoặc email nhà trường để đồng bộ giáo án.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tài khoản Email / Mã số Giáo viên <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="giaovien@moet.edu.vn hoặc phandinhdoc@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mật khẩu đăng nhập <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Họ tên hiển thị</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Thầy Phan Đình Đốc"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Hệ thống hỗ trợ lưu phiên đăng nhập an toàn, tự động điền các thông tin chuẩn Bộ GD&ĐT vào tài liệu xuất bản.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
              >
                Đăng Nhập Ngay
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Google Workspace SSO */}
        {activeTab === 'sso' && (
          <div className="space-y-4 text-center py-2">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <GraduationCap className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">
                Đăng Nhập Nhanh Bằng Google Workspace for Education
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Dành cho giáo viên sử dụng tài khoản Google Email nhà trường. Tự động đồng bộ quyền sở hữu bài dạy và tài liệu tham khảo.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs text-slate-600 space-y-2 max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Tài khoản phát hiện: <strong>phandinhdoc@gmail.com</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Đơn vị: <strong>Tổ Khoa học Tự nhiên</strong></span>
              </div>
            </div>

            <button
              type="button"
              id="btn-google-sso-login"
              onClick={handleGoogleEduSSO}
              className="w-full max-w-md mx-auto py-3 px-4 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-3 cursor-pointer transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Xác Thực Ngay với Google Workspace</span>
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
