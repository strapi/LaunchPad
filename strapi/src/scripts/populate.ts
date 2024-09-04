import fs from 'fs';
import path from 'path';

/**
 * This custom middleware is scanning exevery fields, components, and relations to populate in a dynamic zone component.
 * In fact, the API will only populate the first level fields of a DZ components which might not be convenient.
 * 
 * You can use this code on your aplication by just modifying the name of your dynamic-zone. Here it is "dynamic-zone".
 * Note that it is only working for a single dynamic-zone component.
 **/ 

interface ComponentAttribute {
  type: string;
  component?: string;
  relation?: string;
  target?: string;
  repeatable?: boolean;
}

interface ComponentJson {
  collectionName: string;
  info: {
    displayName: string;
    icon: string;
    description: string;
    singularName: string;
  };
  options: Record<string, any>;
  attributes: Record<string, ComponentAttribute>;
}

const DYNAMIC_ZONE_NAME = "dynamic-zone";

const API_DIR = path.resolve(__dirname, '../api');
const COMPONENTS_DIR = path.resolve(__dirname, '../components');

const getComponentFilePath = (componentPath: string): string => {
  const [category, name] = componentPath.split('.');
  return path.join(COMPONENTS_DIR, category, `${name}.json`);
};

const getRelationFilePath = (relationPath: string): string => {
  const [, target] = relationPath.split('::');
  const targetName = target.split('.')[1];
  return path.join(API_DIR, targetName, 'content-types', targetName, 'schema.json');
};

const buildPopulateObject = (componentPath: string, isRelation = false): Record<string, any> => {
  const filePath = componentPath.includes("/") ? componentPath : getComponentFilePath(componentPath);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Component file not found: ${filePath}`);
  }

  const componentJson: ComponentJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const populateObj: Record<string, any> = {};

  for (const [attribute, details] of Object.entries(componentJson.attributes)) {
    if (details.type === 'component' && details.component) {
      populateObj[attribute] = {
        populate: buildPopulateObject(details.component),
      };
    } else if (details.type === 'relation' && details.target && !isRelation) {
      const relationFilePath = getRelationFilePath(details.target);
      if (fs.existsSync(relationFilePath)) {
        populateObj[attribute] = {
          populate: buildPopulateObject(relationFilePath, true),
        };
      }
    } else if (details.type === 'media') {
      populateObj[attribute] = '*';
    }
  }

  return populateObj;
};

const getDynamicZoneComponents = (): Record<string, any> => {
  const dynamicZoneDir = path.join(COMPONENTS_DIR, DYNAMIC_ZONE_NAME);
  const dynamicZoneFiles = fs.readdirSync(dynamicZoneDir);

  const dynamicZonePopulate: Record<string, any> = {};
  dynamicZoneFiles.forEach((file) => {
    const componentName = path.basename(file, '.json');
    dynamicZonePopulate[`${DYNAMIC_ZONE_NAME}.${componentName}`] = {
      populate: buildPopulateObject(`${DYNAMIC_ZONE_NAME}.${componentName}`),
    };
  });

  return dynamicZonePopulate;
};

export default getDynamicZoneComponents;
