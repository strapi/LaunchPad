// app/api/vtiger-contact/route.ts
/**
 * Route API pour gérer les soumissions de formulaires vers Vtiger
 * Ce fichier doit être créé dans: app/api/vtiger-contact/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { vtigerService } from '@/src/services/api/vtiger-service';

export async function POST(request: NextRequest) {
  try {
    const { formData, moduleType, mapping } = await request.json();

    if (!formData) {
      return NextResponse.json(
        { success: false, error: 'Données du formulaire manquantes' },
        { status: 400 }
      );
    }

    // Mapper les données selon la configuration Strapi
    const vtigerData = mapping 
      ? vtigerService.mapFormDataToVtiger(formData, mapping)
      : formData;

    // Créer le contact dans Vtiger
    const result = await vtigerService.createContact(
      vtigerData,
      moduleType || 'Leads'
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Formulaire envoyé avec succès',
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la soumission',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, formData, mapping } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID manquant' },
        { status: 400 }
      );
    }

    // Mapper les données
    const vtigerData = mapping 
      ? vtigerService.mapFormDataToVtiger(formData, mapping)
      : formData;

    const result = await vtigerService.updateContact(id, vtigerData);

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Formulaire mis à jour avec succès',
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour',
      },
      { status: 500 }
    );
  }
}