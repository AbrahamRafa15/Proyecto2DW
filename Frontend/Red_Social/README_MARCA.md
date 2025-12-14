# Identidad visual y marca

La interfaz busca sentirse como una red social moderna y limpia, donde el contenido del usuario (texto, imágenes y secciones del feed) sea el protagonista. Para lograrlo, definimos una “marca” basada en consistencia: una paleta reducida, componentes tipo tarjeta y un modo claro/oscuro con el mismo lenguaje visual.

## Paleta de colores

La paleta se define mediante variables CSS para mantener consistencia en todo el sitio y facilitar el modo oscuro.

### Tema claro 
- Fondo general: `--fb-bg: #E1E7E5`
- Tarjetas/superficies: `--fb-card: #F7F9F8`
- Bordes/separadores: `--fb-border: #9FD3C7`
- Texto principal: `--fb-text: #2F3E46`
- Texto secundario: `--fb-muted: #3A6F7D`
- Color de marca/acciones: `--fb-accent: #3A6F7D`

### Tema oscuro
- Fondo general: `--fb-bg: #0B2D33`
- Tarjetas/superficies: `--fb-card: #1E3A3F`
- Bordes/separadores: `--fb-border: #112F2B`
- Texto principal: `--fb-text: #EAF3F1`
- Texto secundario: `--fb-muted: #9FD3C7`
- Color de marca/acciones: `--fb-accent: #5ED1C6`

## Por qué esta elección funciona como “marca”

La identidad visual está pensada para que el usuario lea rápido y se ubique sin esfuerzo. El fondo `#E1E7E5` (claro) y `#0B2D33` (oscuro) reducen distracciones y permiten que las tarjetas  enmarquen el contenido como unidades claras dentro del feed. Los bordes separan elementos sin recargar la interfaz, y la jerarquía de texto se mantiene con `--fb-text` para lectura principal y `--fb-muted` para información secundaria como fechas, notas o hints.

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
