import { getArticleBySlug, getArticles, getBlogPageData } from './articles';
import {
  getAuthServerFunction,
  getCurrentUserServerFunction,
  loginUserServerFunction,
  logoutUserServerFunction,
  registerUserServerFunction,
} from './auth';
import { getDraftMode } from './draft';
import { getGlobalData } from './global';
import { getPageBySlug } from './page';
import { getProductBySlug, getProductPageData, getProducts } from './products';

export const strapiApi = {
  global: {
    getGlobalData,
  },
  page: {
    getPageBySlug,
  },
  articles: {
    getArticles,
    getArticleBySlug,
    getBlogPageData,
  },
  products: {
    getProducts,
    getProductBySlug,
    getProductPageData,
  },
  auth: {
    registerUserServerFunction,
    loginUserServerFunction,
    logoutUserServerFunction,
    getCurrentUserServerFunction,
    getAuthServerFunction,
  },
  draft: {
    getDraftMode,
  },
};
