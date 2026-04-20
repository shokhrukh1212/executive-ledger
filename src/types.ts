export type TransactionStatus = 'Successful' | 'Pending' | 'Failed';

export interface Transaction {
  id: string;
  customer: string;
  customerEmail: string;
  amount: number;
  status: TransactionStatus;
  dateTime: string;
  hash: string;
  isNew?: boolean;
}

export interface RevenueData {
  time: string;
  revenue: number;
}

export interface KPIStats {
  totalBalance: number;
  transactionsToday: number;
  pendingKyc: number;
  revenue: number;
}

export interface AppNotification {
  id: string;
  type: 'success' | 'alert' | 'info';
  text: string;
  time: string;
}

export interface HistoryEvent {
  id: string;
  action: string;
  user: string;
  timestamp: string;
}

export interface RegionalData {
  region: string;
  value: number;
  color: string;
}

export interface SettingsState {
  securityProtocol: boolean;
  alertPreferences: {
    failures: boolean;
    largeSettlements: boolean;
    kycReview: boolean;
    frequency: 'Instant' | 'Daily' | 'Weekly';
  };
  persistence: {
    retentionDays: number;
    backupFrequency: 'Hourly' | 'Daily' | 'Manual';
  };
}
