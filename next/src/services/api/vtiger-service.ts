// lib/services/vtiger-service.ts

/**
 * Service pour gérer les interactions avec l'API Vtiger
 * Ce fichier doit être dans /lib/services/ et non dans /app/api/
 */

interface VtigerConfig {
  url: string;
  username: string;
  accessKey: string;
}

interface VtigerLoginResponse {
  success: boolean;
  result: {
    sessionName: string;
    userId: string;
    version: string;
  };
}

interface VtigerCreateResponse {
  success: boolean;
  result: any;
}

class VtigerService {
  private config: VtigerConfig;
  private sessionName: string | null = null;

  constructor() {
    this.config = {
      url: process.env.VTIGER_URL || '',
      username: process.env.VTIGER_USERNAME || '',
      accessKey: process.env.VTIGER_ACCESS_KEY || '',
    };
  }

  /**
   * Authentification auprès de Vtiger
   */
  private async login(): Promise<string> {
    try {
      // Étape 1: Obtenir le challenge token
      const challengeResponse = await fetch(
        `${this.config.url}/webservice.php?operation=getchallenge&username=${this.config.username}`
      );
      const challengeData = await challengeResponse.json();

      if (!challengeData.success) {
        throw new Error('Failed to get challenge token');
      }

      const token = challengeData.result.token;

      // Étape 2: Créer le hash MD5
      const crypto = require('crypto');
      const generatedKey = crypto
        .createHash('md5')
        .update(token + this.config.accessKey)
        .digest('hex');

      // Étape 3: Login
      const loginResponse = await fetch(
        `${this.config.url}/webservice.php`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            operation: 'login',
            username: this.config.username,
            accessKey: generatedKey,
          }),
        }
      );

      const loginData: VtigerLoginResponse = await loginResponse.json();

      if (!loginData.success) {
        throw new Error('Failed to login to Vtiger');
      }

      this.sessionName = loginData.result.sessionName;
      return this.sessionName;
    } catch (error) {
      console.error('Vtiger login error:', error);
      throw error;
    }
  }

  /**
   * Créer un contact/lead dans Vtiger
   */
  async createContact(data: any, moduleType: 'Contacts' | 'Leads' = 'Leads') {
    try {
      // S'assurer qu'on est connecté
      if (!this.sessionName) {
        await this.login();
      }

      const response = await fetch(
        `${this.config.url}/webservice.php`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            operation: 'create',
            sessionName: this.sessionName!,
            elementType: moduleType,
            element: JSON.stringify(data),
          }),
        }
      );

      const result: VtigerCreateResponse = await response.json();

      if (!result.success) {
        throw new Error('Failed to create contact in Vtiger');
      }

      return result.result;
    } catch (error) {
      console.error('Vtiger create contact error:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un contact/lead dans Vtiger
   */
  async updateContact(id: string, data: any) {
    try {
      if (!this.sessionName) {
        await this.login();
      }

      const response = await fetch(
        `${this.config.url}/webservice.php`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            operation: 'update',
            sessionName: this.sessionName!,
            element: JSON.stringify({
              id,
              ...data,
            }),
          }),
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error('Failed to update contact in Vtiger');
      }

      return result.result;
    } catch (error) {
      console.error('Vtiger update contact error:', error);
      throw error;
    }
  }

  /**
   * Mapper les données du formulaire vers le format Vtiger
   */
  mapFormDataToVtiger(formData: any, mapping: { [key: string]: string }): any {
    const vtigerData: any = {};
    
    for (const [formField, vtigerField] of Object.entries(mapping)) {
      if (formData[formField] !== undefined && formData[formField] !== null) {
        vtigerData[vtigerField] = formData[formField];
      }
    }
    
    return vtigerData;
  }
}

export const vtigerService = new VtigerService();