# Identidad visual y marca

La interfaz busca sentirse como una red social moderna y limpia, donde el contenido del usuario (texto, imágenes y secciones del feed) sea el protagonista. Para lograrlo, definimos una “marca” basada en consistencia: una paleta reducida, componentes tipo tarjeta y un modo claro/oscuro con el mismo lenguaje visual.

## Paleta de colores

La paleta se define mediante variables CSS para mantener consistencia en todo el sitio y facilitar el modo oscuro.

### Tema claro 
- Fondo general: `--fb-bg: #f0f2f5`
- Superficies / tarjetas: `--fb-card: #ffffff`
- Bordes / separadores: `--fb-border: #e5e7eb`
- Texto principal: `--fb-text: #111827`
- Texto secundario (muted): `--fb-muted: #6b7280`

### Tema oscuro
- Fondo general: `--fb-bg: #18191a`
- Superficies / tarjetas: `--fb-card: #242526`
- Bordes / separadores: `--fb-border: #3a3b3c`
- Texto principal: `--fb-text: #e4e6eb`
- Texto secundario (muted): `--fb-muted: #b0b3b8`

## Por qué esta elección funciona como “marca”

La identidad visual está pensada para que el usuario lea rápido y se ubique sin esfuerzo. El fondo `#f0f2f5` (claro) y `#18191a` (oscuro) reducen distracciones y permiten que las tarjetas `#ffffff` / `#242526` enmarquen el contenido como unidades claras dentro del feed. Los bordes `#e5e7eb` / `#3a3b3c` separan elementos sin recargar la interfaz, y la jerarquía de texto se mantiene con `--fb-text` para lectura principal y `--fb-muted` para información secundaria como fechas, notas o hints.

## Componentes visuales y consistencia

La aplicación usa una estructura repetible para reforzar la marca:
- Barra superior fija (sticky) para mantener navegación visible y estable.
- Diseño basado en tarjetas con borde suave, sombra ligera y esquinas redondeadas (12px), lo que genera un estilo uniforme en publicaciones, paneles laterales y módulos.
- Estilo “muted” estandarizado con `--fb-muted` para no competir con el contenido principal.

## Modo claro / oscuro

El modo oscuro no cambia el significado de los elementos: solo ajusta fondo, superficies, bordes y texto para mantener contraste y legibilidad. Se controla mediante `body[data-theme="dark"]`, lo que permite que toda la UI cambie de forma consistente sin redefinir estilos componente por componente. También se ajustan inputs y botones claros en oscuro para que el contraste se mantenga estable.

## Implementación técnica

La marca se implementa con variables CSS:

- Variables en `:root` para el tema claro.
- Overrides en `body[data-theme="dark"]` para el tema oscuro.
- Componentes base como `.fb-card`, `.fb-topbar` y `.fb-muted` consumen esas variables, garantizando coherencia visual en todo el sitio.
