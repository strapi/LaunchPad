// service-actions.ts
"use server";

import {
  ApiResponseData,
  ApiResponseList,
  MessageResponse,
  ErrorResponse,
} from "@/types/ApiResponseType";
// Importez tous vos services


// 1. Types génériques pour les services
type ServiceInstance = any;
  // | UserService
  // | FolderService
  // | PermissionService
  // | WorkflowService
  // | GroupeService
  // | PipelineService
  // | SiteService;
// Ajoutez d'autres services ici

type ServiceConstructor<T extends ServiceInstance> = new () => T;

type BodyData = any; // Vous pouvez être plus spécifique si nécessaire

// 2. Registre des services : Associe le nom du service à sa classe
const serviceRegistry: Record<string, ServiceConstructor<ServiceInstance>> = {
  // [new UserService().getName()]: UserService,

  // Pour ajouter un nouveau service :
  // [new MonNouveauService().getName()]: MonNouveauService,
};

// 3. Fonction utilitaire pour obtenir une instance de service
function getServiceInstance(serviceName: string): ServiceInstance | null {
  const ServiceClass = serviceRegistry[serviceName];
  if (!ServiceClass) {
    console.error(`Service non trouvé pour le nom: ${serviceName}`);
    return null;
  }
  return new ServiceClass();
}

// 4. Actions CRUD mises à jour pour utiliser le registre

// Création
export async function createData<T>({
  serviceName,
  data,
}: {
  serviceName: string;
  data: BodyData;
}): Promise<ApiResponseData<T>> {
  try {
    const serviceInstance = getServiceInstance(serviceName);
    if (!serviceInstance) {
      return {
        code: 404,
        message: `Service '${serviceName}' non trouvé.`,
      } as ApiResponseData<T>;
    }

    const response = await serviceInstance.create({ body: data });
    // Conserve toObject() et le cast comme dans le code original
    return response.toObject() as ApiResponseData<T>;
  } catch (error: any) {
    console.error(`Erreur dans createData pour ${serviceName}:`, error);
    return {
      code: 500,
      message: error.message || "Erreur interne du serveur",
    } as ApiResponseData<T>;
  }
}

// Mise à jour
export async function updateData<T>({
  id,
  serviceName,
  data,
}: {
  id: number | string;
  serviceName: string;
  data: BodyData;
}): Promise<ApiResponseData<T>> {
  try {
    const serviceInstance = getServiceInstance(serviceName);
    if (!serviceInstance) {
      return {
        code: 404,
        message: `Service '${serviceName}' non trouvé.`,
      } as ApiResponseData<T>;
    }

    const response = await serviceInstance.update({ id, body: data });
    // Conserve toObject() et le cast comme dans le code original
    return response.toObject() as ApiResponseData<T>;
  } catch (error: any) {
    console.error(`Erreur dans updateData pour ${serviceName}:`, error);
    return {
      code: 500,
      message: error.message || "Erreur interne du serveur",
    } as ApiResponseData<T>;
  }
}

// Suppression
// La méthode remove de vos services retourne MessageResponse | ErrorResponse directement
export async function removeData<T>({
  id,
  serviceName,
}: {
  id: number | string;
  serviceName: string;
}): Promise<MessageResponse | ErrorResponse> {
  // Type de retour spécifique à remove
  try {
    const serviceInstance = getServiceInstance(serviceName);
    if (!serviceInstance) {
      return {
        code: 404,
        message: `Service '${serviceName}' non trouvé.`,
      } as ErrorResponse;
    }

    // remove retourne MessageResponse | ErrorResponse directement, pas besoin de toObject()
    const response = await serviceInstance.remove({ id });
    return response; // Retourne directement la réponse
  } catch (error: any) {
    console.error(`Erreur dans removeData pour ${serviceName}:`, error);
    // Retourne un ErrorResponse en cas d'exception
    return {
      code: 500,
      message: error.message || "Erreur interne du serveur",
    } as ErrorResponse;
  }
}

// Récupération de la liste
export async function getListData<T>({
  serviceName,
  ...props
}: {
  serviceName: string;
  pageSize?: number;
  page?: number;
  search?: string;
  dateRange?: { from_date: string; to_date: string };
  sortBy?: string;
  sortOrder?: string;
}): Promise<ApiResponseList<T>> {
  try {
    const serviceInstance = getServiceInstance(serviceName);
    if (!serviceInstance) {
      return {
        code: 404,
        message: `Service '${serviceName}' non trouvé.`,
      } as ApiResponseList<T>;
    }

    const response = await serviceInstance.getAll({ ...props });
    // Conserve toObject() et le cast comme dans le code original
    return response.toObject() as ApiResponseList<T>;
  } catch (error: any) {
    console.error(`Erreur dans getListData pour ${serviceName}:`, error);
    return {
      code: 500,
      message: error.message || "Erreur interne du serveur",
    } as ApiResponseList<T>;
  }
}

// 5. Action pour récupérer un élément par ID (en utilisant getOne)
export async function getDataById<T>({
  id,
  serviceName,
}: {
  id: number | string;
  serviceName: string;
}): Promise<ApiResponseData<T>> {
  try {
    const serviceInstance = getServiceInstance(serviceName);
    if (!serviceInstance) {
      return {
        code: 404,
        message: `Service '${serviceName}' non trouvé.`,
      } as ApiResponseData<T>;
    }

    // Vérifier si la méthode getOne existe et la caster pour l'utiliser
    // const serviceWithGetOne = serviceInstance as UserService; // Cast temporaire pour accéder à getOne
    const serviceWithGetOne = serviceInstance as any; // Cast temporaire pour accéder à getOne
    if (typeof serviceWithGetOne.getOne === "function") {
      const response = await serviceWithGetOne.getOne({ id });
      // Conserve toObject() et le cast comme dans le code original
      return response.toObject() as ApiResponseData<T>;
    } else {
      // Si getOne n'existe pas sur ce service spécifique
      return {
        code: 501,
        message: `Méthode 'getOne' non implémentée pour le service '${serviceName}'.`,
      } as ApiResponseData<T>;
    }
  } catch (error: any) {
    console.error(`Erreur dans getDataById pour ${serviceName}:`, error);
    return {
      code: 500,
      message: error.message || "Erreur interne du serveur",
    } as ApiResponseData<T>;
  }
}
