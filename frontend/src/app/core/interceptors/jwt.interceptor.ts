import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  
  // Vérifier si on est dans le navigateur
  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  // Récupérer le token du localStorage
  const token = localStorage.getItem('auth_token');

  // Si le token existe, l'ajouter au header
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('JWT Interceptor - Adding token to request:', req.url);
    return next(clonedReq);
  }

  return next(req);
};