import type { AdminUser, ManagedApi, SystemConfig } from "@/types/admin";
import { AdminDashboardPage, UserManagementPage, ApiManagementPage, SystemConfigPage } from "./components";

// Mock data
export const mockUsers: AdminUser[] = [
  {
    id: "1",
    name: "Nguyen Thi Lan",
    email: "lan.nguyen@hust.edu.vn",
    role: "Student",
    status: "Active",
    joined: "2024-06-12",
    papers: 0,
  },
  {
    id: "2",
    name: "Dr. Tran Van Minh",
    email: "minh.tran@vnu.edu.vn",
    role: "Researcher",
    status: "Active",
    joined: "2024-06-10",
    papers: 84,
  },
  {
    id: "3",
    name: "Le Thu Huong",
    email: "huong.le@usth.edu.vn",
    role: "Student",
    status: "Pending",
    joined: "2024-06-09",
    papers: 0,
  },
  {
    id: "4",
    name: "Prof. Pham Duc Anh",
    email: "anh.pham@ioit.ac.vn",
    role: "Researcher",
    status: "Active",
    joined: "2024-06-08",
    papers: 142,
  },
  {
    id: "5",
    name: "Vo Thanh Long",
    email: "long.vo@fit.hcmus.edu.vn",
    role: "Student",
    status: "Active",
    joined: "2024-06-05",
    papers: 0,
  },
  {
    id: "6",
    name: "Dr. Dinh Thi Mai",
    email: "mai.dinh@phenikaa-uni.edu.vn",
    role: "Researcher",
    status: "Suspended",
    joined: "2024-05-28",
    papers: 56,
  },
  {
    id: "7",
    name: "Bui Quang Hieu",
    email: "hieu.bui@student.tdtu.edu.vn",
    role: "Student",
    status: "Active",
    joined: "2024-05-20",
    papers: 0,
  },
  {
    id: "8",
    name: "Prof. Nguyen Van An",
    email: "an.nguyen@bku.edu.vn",
    role: "Researcher",
    status: "Active",
    joined: "2024-05-15",
    papers: 218,
  },
  {
    id: "9",
    name: "Admin Tester",
    email: "admin@scitrend.io",
    role: "System Administrator",
    status: "Active",
    joined: "2024-01-01",
    papers: 0,
  },
];

export const mockApis: ManagedApi[] = [
  {
    id: "1",
    name: "Semantic Scholar API",
    description: "Access to 200M+ academic papers with full-text search and citation data",
    key: "ss_live_xK2m9...P4qR",
    status: "Connected",
    lastSync: "2 minutes ago",
    callsToday: 84200,
    callsLimit: 100000,
    enabled: true,
    latency: "124ms",
  },
  {
    id: "2",
    name: "CrossRef API",
    description: "DOI metadata, citation linking, and publisher information",
    key: "cr_api_mN8k...Tv2L",
    status: "Connected",
    lastSync: "8 minutes ago",
    callsToday: 62100,
    callsLimit: 80000,
    enabled: true,
    latency: "98ms",
  },
  {
    id: "3",
    name: "OpenAlex API",
    description: "Open-access academic graph with works, authors, venues and concepts",
    key: "oa_prod_qK7p...Wr9N",
    status: "Connected",
    lastSync: "15 minutes ago",
    callsToday: 51400,
    callsLimit: 60000,
    enabled: true,
    latency: "142ms",
  },
  {
    id: "4",
    name: "PubMed API",
    description: "NCBI biomedical literature database — life sciences and medicine",
    key: "pm_key_aB3j...Cx1M",
    status: "Degraded",
    lastSync: "42 minutes ago",
    callsToday: 28400,
    callsLimit: 50000,
    enabled: true,
    latency: "842ms",
  },
];

export const mockSystemConfig: SystemConfig = {
  general: {
    appName: "SciTrend",
    appUrl: "https://scitrend.io",
    maxUsers: 10000,
    defaultLanguage: "English (EN)",
  },
  email: {
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "noreply@scitrend.io",
    emailAlerts: true,
    weeklyDigest: true,
  },
  security: {
    twoFactor: false,
    ipWhitelist: false,
    sessionTimeout: 7,
    passwordPolicy: "Standard",
  },
  notifications: {
    pushNotifs: true,
    paperAlerts: true,
    citationAlerts: true,
  },
};

export { AdminDashboardPage, UserManagementPage, ApiManagementPage, SystemConfigPage };


