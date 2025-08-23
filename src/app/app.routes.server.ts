import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    //TODO remover para renderizar no servidor
    // renderMode: RenderMode.Prerender
    renderMode: RenderMode.Client
  }
];
