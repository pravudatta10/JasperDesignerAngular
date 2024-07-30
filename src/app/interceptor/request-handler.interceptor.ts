import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RequestHandlerInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    const auth = btoa(`${username}:${password}`);

    if (!req.url.includes('/login')) {
      const clonedReq = req.clone({
        setHeaders: {
          'Authorization': `Basic ${auth}`
        }
      });
      return next.handle(clonedReq);
    }

    return next.handle(req);
  }
}
