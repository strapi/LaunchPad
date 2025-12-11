// hooks/useCrud.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiServiceForm, CrudHookResult } from "../types/dialog-form";
import { toast } from "sonner";
import { useCallback } from "react";
import { createData, updateData } from "@/src/actions/service-action";
import { DataResponse } from "@/types/ApiResponseType";

interface UseCrudOptions {
  serviceName: string;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  invalidateQueries?: string[];
}

// Service API utilisant les fonctions de service-action.ts
const apiService: ApiServiceForm = {
  createData: async <T>({
    serviceName,
    data,
  }: {
    serviceName: string;
    data: T;
  }) => {
    // console.log("yesssssssssssssssssssssssssssssssssssssssssssssssssssssssss");

    const response = await createData<T>({ serviceName, data });

    // Vérifier si la réponse indique une erreur
    if (response.code == 200 && DataResponse.isDataResponse(response)) {
      return response.data;
    }

    throw new Error(
      "message" in response ? response.message : "Erreur lors de la création"
    );
  },

  updateData: async <T>({
    serviceName,
    data,
    id,
  }: {
    serviceName: string;
    data: T;
    id: string;
  }) => {
    const response = await updateData<T>({
      serviceName,
      data,
      id: id as string | number,
    });

    // Vérifier si la réponse indique une erreur
    if (response.code == 200 && DataResponse.isDataResponse(response)) {
      return response.data;
    }

    throw new Error(
      "message" in response ? response.message : "Erreur lors de la mise à jour"
    );
  },
};

export function useCrud<T = any>(options: UseCrudOptions): CrudHookResult<T> {
  const queryClient = useQueryClient();

  const invalidateQueries = useCallback(() => {
    if (options.invalidateQueries) {
      options.invalidateQueries.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      });
    }
  }, [options.invalidateQueries, queryClient]);

  const createMutation = useMutation({
    mutationFn: (data: T) =>
      apiService.createData({ serviceName: options.serviceName, data }),
    onSuccess: (data) => {
      toast.success("Succès", {
        description: "Élément créé avec succès",
      });

      invalidateQueries();
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      toast.error("Erreur", {
        description:
          error.message || "Une erreur est survenue lors de la création",
      });

      options.onError?.(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ data, id }: { data: T; id: string }) =>
      apiService.updateData({ serviceName: options.serviceName, data, id }),
    onSuccess: (data) => {
      toast.success("Succès", {
        description: "Élément mis à jour avec succès",
      });

      invalidateQueries();
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      toast.error("Erreur", {
        description:
          error.message || "Une erreur est survenue lors de la mise à jour",
      });

      options.onError?.(error);
    },
  });

  const create = useCallback(
    async (data: T): Promise<void> => {
      return new Promise((resolve, reject) => {
        createMutation.mutate(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    [createMutation]
  );

  const update = useCallback(
    async (data: T, id: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        updateMutation.mutate(
          { data, id },
          {
            onSuccess: () => resolve(),
            onError: (error) => reject(error),
          }
        );
      });
    },
    [updateMutation]
  );

  return {
    create,
    update,
    isLoading: createMutation.isPending || updateMutation.isPending,
    error: createMutation.error || updateMutation.error,
  };
}
