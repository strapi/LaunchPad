import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export interface StrapiResponse<T> {
  data: T;
  meta?: any;
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Helper to get Strapi token from session
export async function getStrapiToken() {
  const session = await getSession();
  return (session?.user as any)?.strapiToken;
}

// Generic fetch wrapper with authentication
async function strapiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getStrapiToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API Error");
  }

  return response.json();
}

// CLIENT ENDPOINTS
export async function getClients(
  page = 1,
  pageSize = 10,
  filters?: Record<string, any>
) {
  let query = `/api/clients?pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      query += `&filters[${key}][$eq]=${value}`;
    });
  }

  return strapiRequest<StrapiListResponse<any>>(query);
}

export async function getClientById(id: string) {
  return strapiRequest<StrapiResponse<any>>(
    `/api/clients/${id}?populate=*`
  );
}

export async function createClient(data: Record<string, any>) {
  return strapiRequest<StrapiResponse<any>>("/api/clients", {
    method: "POST",
    body: JSON.stringify({ data }),
  });
}

export async function updateClient(id: string, data: Record<string, any>) {
  return strapiRequest<StrapiResponse<any>>(`/api/clients/${id}`, {
    method: "PUT",
    body: JSON.stringify({ data }),
  });
}

export async function deleteClient(id: string) {
  return strapiRequest<StrapiResponse<any>>(`/api/clients/${id}`, {
    method: "DELETE",
  });
}

// RESOURCE ENDPOINTS
export async function getResources(
  page = 1,
  pageSize = 12,
  locale = "en"
) {
  return strapiRequest<StrapiListResponse<any>>(
    `/api/resources?locale=${locale}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=thumbnail`
  );
}

export async function getResourceById(id: string, locale = "en") {
  return strapiRequest<StrapiResponse<any>>(
    `/api/resources/${id}?locale=${locale}&populate=*`
  );
}

export async function createResource(data: Record<string, any>) {
  return strapiRequest<StrapiResponse<any>>("/api/resources", {
    method: "POST",
    body: JSON.stringify({ data }),
  });
}

export async function updateResource(id: string, data: Record<string, any>) {
  return strapiRequest<StrapiResponse<any>>(`/api/resources/${id}`, {
    method: "PUT",
    body: JSON.stringify({ data }),
  });
}

// SESSION ENDPOINTS
export async function getSessions(
  clientId?: string,
  page = 1,
  pageSize = 10
) {
  let query = `/api/sessions?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=client`;

  if (clientId) {
    query += `&filters[client][id][$eq]=${clientId}`;
  }

  return strapiRequest<StrapiListResponse<any>>(query);
}

export async function getSessionById(id: string) {
  return strapiRequest<StrapiResponse<any>>(
    `/api/sessions/${id}?populate=*`
  );
}

export async function createSession(data: Record<string, any>) {
  return strapiRequest<StrapiResponse<any>>("/api/sessions", {
    method: "POST",
    body: JSON.stringify({ data }),
  });
}

export async function updateSession(id: string, data: Record<string, any>) {
  return strapiRequest<StrapiResponse<any>>(`/api/sessions/${id}`, {
    method: "PUT",
    body: JSON.stringify({ data }),
  });
}

// ASSESSMENT ENDPOINTS
export async function getAssessments(sessionId?: string) {
  let query = "/api/assessments?populate=*";

  if (sessionId) {
    query += `&filters[session][id][$eq]=${sessionId}`;
  }

  return strapiRequest<StrapiListResponse<any>>(query);
}

export async function createAssessment(data: Record<string, any>) {
  return strapiRequest<StrapiResponse<any>>("/api/assessments", {
    method: "POST",
    body: JSON.stringify({ data }),
  });
}

// UPLOAD HELPER
export async function uploadFile(file: File, folder?: string) {
  const formData = new FormData();
  formData.append("files", file);

  if (folder) {
    formData.append("folder", folder);
  }

  const token = await getStrapiToken();
  const headers: HeadersInit = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return response.json();
}
