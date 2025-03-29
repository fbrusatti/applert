export type AlertCategory = 'police' | 'civil_defense' | 'fire_department';

export type AlertStatus = 'pending' | 'in_progress' | 'resolved';

export interface Alert {
  id: string;
  title: string;
  description: string;
  category: AlertCategory;
  status: AlertStatus;
  createdAt: string;
  createdBy: string;
  attachments?: string[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface Response {
  id: string;
  alertId: string;
  text: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  createdByRole: string;
}

export interface AlertState {
  alerts: Alert[];
  responses: Response[];
  isLoading: boolean;
  error: string | null;
  createAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateAlertStatus: (id: string, status: AlertStatus) => Promise<void>;
  addResponse: (response: Omit<Response, 'id' | 'createdAt'>) => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchResponses: (alertId: string) => Promise<void>;
}
