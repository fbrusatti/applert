import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, AlertState, Response } from '@/types/alert';
import { useAuthStore } from './auth-store';

// Mock initial alerts for demo
const initialAlerts: Alert[] = [
  {
    id: '1',
    title: 'Traffic accident on Main Street',
    description: 'Two cars collided at the intersection of Main Street and 5th Avenue. No serious injuries reported but traffic is blocked.',
    category: 'police',
    status: 'in_progress',
    createdAt: '2023-06-15T10:30:00Z',
    createdBy: '1',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: 'Main St & 5th Ave',
    },
  },
  {
    id: '2',
    title: 'Fire in apartment building',
    description: 'Small fire reported in an apartment building on Oak Street. Fire department has been dispatched.',
    category: 'fire_department',
    status: 'pending',
    createdAt: '2023-06-15T11:45:00Z',
    createdBy: '1',
    location: {
      latitude: 40.7138,
      longitude: -74.0070,
      address: '123 Oak St',
    },
  },
  {
    id: '3',
    title: 'Fallen tree blocking road',
    description: 'Large tree has fallen across Pine Avenue after the storm. Road is completely blocked.',
    category: 'civil_defense',
    status: 'pending',
    createdAt: '2023-06-15T09:15:00Z',
    createdBy: '1',
    location: {
      latitude: 40.7148,
      longitude: -74.0080,
      address: 'Pine Ave',
    },
  },
  {
    id: '4',
    title: 'Water main break',
    description: 'Water main break on Elm Street causing flooding. Several homes affected.',
    category: 'civil_defense',
    status: 'resolved',
    createdAt: '2023-06-14T14:20:00Z',
    createdBy: '1',
    location: {
      latitude: 40.7158,
      longitude: -74.0090,
      address: '456 Elm St',
    },
  },
  {
    id: '5',
    title: 'Suspicious activity',
    description: 'Suspicious individuals reported near the community center. Police requested.',
    category: 'police',
    status: 'resolved',
    createdAt: '2023-06-14T18:30:00Z',
    createdBy: '1',
  },
];

// Mock initial responses
const initialResponses: Response[] = [
  {
    id: '1',
    alertId: '1',
    text: 'Police units dispatched to the scene.',
    createdAt: '2023-06-15T10:35:00Z',
    createdBy: '3',
    createdByName: 'Officer Smith',
    createdByRole: 'police',
  },
  {
    id: '2',
    alertId: '1',
    text: 'Traffic being diverted. Estimated clearance time: 30 minutes.',
    createdAt: '2023-06-15T10:45:00Z',
    createdBy: '3',
    createdByName: 'Officer Smith',
    createdByRole: 'police',
  },
  {
    id: '3',
    alertId: '2',
    text: 'Fire units en route. ETA 5 minutes.',
    createdAt: '2023-06-15T11:50:00Z',
    createdBy: '4',
    createdByName: 'Firefighter Johnson',
    createdByRole: 'fire_department',
  },
  {
    id: '4',
    alertId: '4',
    text: 'Repair crew has fixed the water main. Service restored to all homes.',
    createdAt: '2023-06-14T16:45:00Z',
    createdBy: '5',
    createdByName: 'Maria Rodriguez',
    createdByRole: 'civil_defense',
  },
  {
    id: '5',
    alertId: '5',
    text: 'Officers investigated the area. No suspicious activity found. Case closed.',
    createdAt: '2023-06-14T19:15:00Z',
    createdBy: '3',
    createdByName: 'Officer Smith',
    createdByRole: 'police',
  },
];

export const useAlertStore = create<AlertState>()(
  persist(
    (set, get) => ({
      alerts: initialAlerts,
      responses: initialResponses,
      isLoading: false,
      error: null,
      
      createAlert: async (alertData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user = useAuthStore.getState().user;
          if (!user) {
            throw new Error("User not authenticated");
          }
          
          const newAlert: Alert = {
            id: Date.now().toString(),
            ...alertData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            createdBy: user.id,
          };
          
          set((state) => ({
            alerts: [newAlert, ...state.alerts],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: "Failed to create alert",
            isLoading: false,
          });
        }
      },
      
      updateAlertStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set((state) => ({
            alerts: state.alerts.map((alert) =>
              alert.id === id ? { ...alert, status } : alert
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: "Failed to update alert status",
            isLoading: false,
          });
        }
      },
      
      addResponse: async (responseData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user = useAuthStore.getState().user;
          if (!user) {
            throw new Error("User not authenticated");
          }
          
          const newResponse: Response = {
            id: Date.now().toString(),
            ...responseData,
            createdAt: new Date().toISOString(),
            createdByName: user.name,
            createdByRole: user.role,
          };
          
          set((state) => ({
            responses: [...state.responses, newResponse],
            isLoading: false,
          }));
          
          // If the alert is pending, update it to in_progress
          const { alerts } = get();
          const alert = alerts.find(a => a.id === responseData.alertId);
          if (alert && alert.status === 'pending') {
            get().updateAlertStatus(alert.id, 'in_progress');
          }
        } catch (error) {
          set({
            error: "Failed to add response",
            isLoading: false,
          });
        }
      },
      
      fetchAlerts: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, this would fetch from an API
          // For now, we're just using the existing state
          set((state) => ({
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: "Failed to fetch alerts",
            isLoading: false,
          });
        }
      },
      
      fetchResponses: async (alertId) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, this would fetch from an API
          // For now, we're just using the existing state
          set((state) => ({
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: "Failed to fetch responses",
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'alert-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
