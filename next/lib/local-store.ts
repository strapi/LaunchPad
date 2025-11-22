'use client';

// Local Storage-based data store to replace Strapi dependency
// This provides a simple CRUD interface that persists to browser localStorage

const STORAGE_KEYS = {
  CLIENTS: 'securebase_clients',
  RESOURCES: 'securebase_resources',
  SESSIONS: 'securebase_sessions',
  SETTINGS: 'securebase_settings',
  CHAT_HISTORY: 'securebase_chat_history',
};

// Type definitions
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'pending';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'worksheet';
  url?: string;
  category: string;
  createdAt: string;
}

export interface CoachingSession {
  id: string;
  clientId: string;
  date: string;
  duration: number; // minutes
  type: 'individual' | 'group' | 'workshop';
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface UserSettings {
  profile: {
    fullName: string;
    email: string;
    bio: string;
    avatarUrl?: string;
  };
  notifications: {
    emailNotifications: boolean;
    sessionReminders: boolean;
    clientMessages: boolean;
    weeklyDigest: boolean;
  };
  appearance: {
    theme: 'dark' | 'light' | 'system';
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// Helper to safely access localStorage (SSR-safe)
function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============ CLIENTS ============

export function getClients(): Client[] {
  return getStorage<Client[]>(STORAGE_KEYS.CLIENTS, getDemoClients());
}

export function getClientById(id: string): Client | undefined {
  const clients = getClients();
  return clients.find(c => c.id === id);
}

export function createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client {
  const clients = getClients();
  const newClient: Client = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  clients.push(newClient);
  setStorage(STORAGE_KEYS.CLIENTS, clients);
  return newClient;
}

export function updateClient(id: string, data: Partial<Client>): Client | undefined {
  const clients = getClients();
  const index = clients.findIndex(c => c.id === id);
  if (index === -1) return undefined;

  clients[index] = {
    ...clients[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  setStorage(STORAGE_KEYS.CLIENTS, clients);
  return clients[index];
}

export function deleteClient(id: string): boolean {
  const clients = getClients();
  const filtered = clients.filter(c => c.id !== id);
  if (filtered.length === clients.length) return false;
  setStorage(STORAGE_KEYS.CLIENTS, filtered);
  return true;
}

// ============ RESOURCES ============

export function getResources(): Resource[] {
  return getStorage<Resource[]>(STORAGE_KEYS.RESOURCES, getDemoResources());
}

export function getResourceById(id: string): Resource | undefined {
  const resources = getResources();
  return resources.find(r => r.id === id);
}

export function createResource(data: Omit<Resource, 'id' | 'createdAt'>): Resource {
  const resources = getResources();
  const newResource: Resource = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  resources.push(newResource);
  setStorage(STORAGE_KEYS.RESOURCES, resources);
  return newResource;
}

// ============ SESSIONS ============

export function getSessions(clientId?: string): CoachingSession[] {
  const sessions = getStorage<CoachingSession[]>(STORAGE_KEYS.SESSIONS, getDemoSessions());
  if (clientId) {
    return sessions.filter(s => s.clientId === clientId);
  }
  return sessions;
}

export function createSession(data: Omit<CoachingSession, 'id'>): CoachingSession {
  const sessions = getSessions();
  const newSession: CoachingSession = {
    ...data,
    id: generateId(),
  };
  sessions.push(newSession);
  setStorage(STORAGE_KEYS.SESSIONS, sessions);
  return newSession;
}

// ============ SETTINGS ============

export function getSettings(): UserSettings {
  return getStorage<UserSettings>(STORAGE_KEYS.SETTINGS, getDefaultSettings());
}

export function updateSettings(data: Partial<UserSettings>): UserSettings {
  const current = getSettings();
  const updated: UserSettings = {
    profile: { ...current.profile, ...data.profile },
    notifications: { ...current.notifications, ...data.notifications },
    appearance: { ...current.appearance, ...data.appearance },
  };
  setStorage(STORAGE_KEYS.SETTINGS, updated);
  return updated;
}

// ============ CHAT HISTORY ============

export function getChatSessions(): ChatSession[] {
  return getStorage<ChatSession[]>(STORAGE_KEYS.CHAT_HISTORY, []);
}

export function getChatSessionById(id: string): ChatSession | undefined {
  const sessions = getChatSessions();
  return sessions.find(s => s.id === id);
}

export function createChatSession(title?: string): ChatSession {
  const sessions = getChatSessions();
  const newSession: ChatSession = {
    id: generateId(),
    title: title || `Chat ${sessions.length + 1}`,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  sessions.unshift(newSession); // Add to beginning
  setStorage(STORAGE_KEYS.CHAT_HISTORY, sessions);
  return newSession;
}

export function addMessageToChat(sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
  const sessions = getChatSessions();
  const index = sessions.findIndex(s => s.id === sessionId);

  const newMessage: ChatMessage = {
    ...message,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };

  if (index !== -1) {
    sessions[index].messages.push(newMessage);
    sessions[index].updatedAt = new Date().toISOString();

    // Update title from first user message if still default
    if (sessions[index].messages.length === 1 && message.role === 'user') {
      sessions[index].title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
    }

    setStorage(STORAGE_KEYS.CHAT_HISTORY, sessions);
  }

  return newMessage;
}

export function deleteChatSession(id: string): boolean {
  const sessions = getChatSessions();
  const filtered = sessions.filter(s => s.id !== id);
  if (filtered.length === sessions.length) return false;
  setStorage(STORAGE_KEYS.CHAT_HISTORY, filtered);
  return true;
}

// ============ DEMO DATA ============

function getDemoClients(): Client[] {
  return [
    {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      phone: '(555) 123-4567',
      status: 'active',
      notes: 'Executive coaching for leadership development',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-11-20T14:30:00Z',
    },
    {
      id: '2',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@example.com',
      phone: '(555) 234-5678',
      status: 'active',
      notes: 'Career transition coaching',
      createdAt: '2024-02-20T09:00:00Z',
      updatedAt: '2024-11-18T11:00:00Z',
    },
    {
      id: '3',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily.r@example.com',
      status: 'pending',
      notes: 'Interested in team leadership program',
      createdAt: '2024-11-01T15:00:00Z',
      updatedAt: '2024-11-01T15:00:00Z',
    },
  ];
}

function getDemoResources(): Resource[] {
  return [
    {
      id: '1',
      title: 'Leadership Assessment Guide',
      description: 'Comprehensive self-assessment tool for leadership skills',
      type: 'document',
      category: 'Assessment',
      createdAt: '2024-01-10T10:00:00Z',
    },
    {
      id: '2',
      title: 'Effective Communication Workshop',
      description: 'Video series on improving workplace communication',
      type: 'video',
      category: 'Communication',
      createdAt: '2024-02-15T10:00:00Z',
    },
    {
      id: '3',
      title: 'Goal Setting Worksheet',
      description: 'Interactive worksheet for setting SMART goals',
      type: 'worksheet',
      category: 'Planning',
      createdAt: '2024-03-01T10:00:00Z',
    },
  ];
}

function getDemoSessions(): CoachingSession[] {
  return [
    {
      id: '1',
      clientId: '1',
      date: '2024-11-25T10:00:00Z',
      duration: 60,
      type: 'individual',
      status: 'scheduled',
      notes: 'Q4 goals review',
    },
    {
      id: '2',
      clientId: '2',
      date: '2024-11-22T14:00:00Z',
      duration: 45,
      type: 'individual',
      status: 'completed',
      notes: 'Resume review and interview prep',
    },
  ];
}

function getDefaultSettings(): UserSettings {
  return {
    profile: {
      fullName: 'Dr. Peter Sung',
      email: 'peter@securebase.cc',
      bio: 'Leadership coach and organizational psychologist with 30+ years of experience.',
    },
    notifications: {
      emailNotifications: true,
      sessionReminders: true,
      clientMessages: false,
      weeklyDigest: false,
    },
    appearance: {
      theme: 'dark',
    },
  };
}
