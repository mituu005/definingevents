import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  fetchPublishedEvents,
  fetchPublishedTestimonials,
  fetchServices,
  fetchWebsiteSettings,
} from '@/lib/api';
import { DEFAULT_SERVICES, DEFAULT_SETTINGS, DEFAULT_TESTIMONIALS } from '@/lib/defaults';
import type {
  EventRecord,
  ServiceRecord,
  TestimonialRecord,
  WebsiteSettings,
} from '@/types/database';

interface SiteDataContextValue {
  settings: WebsiteSettings;
  services: ServiceRecord[];
  events: EventRecord[];
  testimonials: TestimonialRecord[];
  loading: boolean;
  preselectedEventType: string;
  setPreselectedEventType: (eventType: string) => void;
  refreshSiteData: () => Promise<void>;
}

const SiteDataContext = createContext<SiteDataContextValue | undefined>(undefined);

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS);
  const [services, setServices] = useState<ServiceRecord[]>(DEFAULT_SERVICES);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>(DEFAULT_TESTIMONIALS);
  const [loading, setLoading] = useState<boolean>(true);
  const [preselectedEventType, setPreselectedEventType] = useState<string>('');

  const refreshSiteData = useCallback(async () => {
    try {
      const [settingsData, servicesData, eventsData, testimonialsData] = await Promise.all([
        fetchWebsiteSettings(),
        fetchServices(true),
        fetchPublishedEvents().catch(() => []),
        fetchPublishedTestimonials().catch(() => []),
      ]);
      setSettings(settingsData);
      setServices(servicesData);
      setEvents(eventsData);
      setTestimonials(testimonialsData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSiteData();
  }, [refreshSiteData]);

  return (
    <SiteDataContext.Provider
      value={{
        settings,
        services,
        events,
        testimonials,
        loading,
        preselectedEventType,
        setPreselectedEventType,
        refreshSiteData,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData(): SiteDataContextValue {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error('useSiteData must be used within SiteDataProvider');
  }
  return ctx;
}
