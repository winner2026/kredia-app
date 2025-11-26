# Kredia — Landing Page (Next.js 16 + TailwindCSS)

Landing oficial de la fintech Kredia. Es una sola página (ruta `/`) con modo oscuro por defecto, estética premium tipo Revolut/Nubank/Wise y componentes modulares dentro de `components/landing/`.

## Pila técnica
- Next.js 16 (App Router) + TypeScript.
- TailwindCSS con utilidades extendidas para gradientes, glassmorphism y sombras suaves.
- Íconos `lucide-react`.
- Tipografía principal: Inter (via `next/font/google`).

## Arquitectura
- `app/layout.tsx`: define HTML base, aplica fuentes y tema oscuro por defecto.
- `app/globals.css`: reset, fondos globales, colores de gradiente base y ajustes de scroll.
- `app/page.tsx`: compone la landing en secciones, importando los componentes de `components/landing/`.
- `components/landing/`
  - `Hero.tsx`: titular, subtítulo, CTA primaria, fondo glass, mockup con gradiente.
  - `ProblemSection.tsx`: lista de dolores con bullets e íconos.
  - `FeatureCard.tsx`: card reutilizable para beneficios clave.
  - `FeaturesSection.tsx`: agrupación de FeatureCard + CTA secundaria “Ver demo sin registrarme”.
  - `DemoPreview.tsx`: mockup visual del dashboard y CTA “Entrar a Kredia ahora”.
  - `TestimonialCard.tsx`: testimonio con avatar circular.
  - `TestimonialsSection.tsx`: grid con 3 testimonios ficticios.
  - `Steps.tsx`: pasos “Cómo funciona” en 3 bloques.
  - `FinalCTA.tsx`: llamada a la acción final con copy y botón grande.
  - `Footer.tsx`: links mínimos (Sobre, Privacidad, Seguridad, Blog, Contacto).

## Flujo de render
`page.tsx` ensambla en orden: Hero → Problema → Cómo te libera (features) → Demo visual → Testimonios → Pasos → CTA final → Footer. Todas las capas usan contenedor central, mucho espacio en blanco (oscuro limpio), gradientes azul/púrpura y bordes `rounded-2xl/3xl`.

## Decisiones de diseño
- **Modo oscuro por defecto** con contraste alto y glassmorphism ligero (bordes + blur + overlays).
- **Gradientes suaves** azul/púrpura y acentos verde/teal para “éxito/claridad”.
- **Tipografía Inter** para claridad fintech; pesos 400–700 para jerarquía.
- **Sombras suaves** tipo neomorfismo ligero para dar profundidad sin perder minimalismo.
- **Micro-interacciones**: hover con elevación y desaturación suave; transiciones `ease-out`.
- **Layouts responsivos**: columnas apiladas en móvil, gaps amplios en desktop, contenedor `max-w-6xl/7xl`.

## Cómo extender hacia el SaaS completo
- Añadir secciones nuevas siguiendo el patrón de componentes (ej. pricing dinámico, roadmap, FAQs).
- Conectar CTAs a onboarding real (ej. `/signup`) o a un formulario de demo.
- Integrar CMS/MDX si se requiere edición no técnica de contenido.
- Añadir analytics y A/B testing en los CTA (`data-cta` IDs ya listos para tracking).
- Agregar internacionalización (i18n) duplicando las copias en un mapa de strings.
- Para productos futuros (dashboard real), mover patrones de cards/resumen a una `design system` folder compartida.

## Cómo correr el proyecto
1) Instalar dependencias: `npm install`  
2) Desarrollo: `npm run dev`  
3) Build: `npm run build` y luego `npm start`  

## Notas y buenas prácticas
- Mantener componentes en `components/landing/` y props mínimos para claridad.
- Usar los tokens de color/gradiente definidos en `globals.css` y utilidades de Tailwind extendidas.
- Preferir íconos de `lucide-react` ya importados para consistencia visual.
- Validar accesibilidad: contraste, `aria-label` en botones y links, tamaños mínimos táctiles.


