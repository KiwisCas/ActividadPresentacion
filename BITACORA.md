# Bitácora de Proyecto · Presentación Generativa
## Fórum UPB — Relevo Generacional
**Autor:** Thomas  
**Fecha:** Septiembre 2026  
**Asignatura:** Simulación

---

## Concepto de la propuesta

Mi propuesta parte de una pregunta que me hice desde el principio: ¿cómo se vería una conversación entre generaciones si en lugar de palabras usáramos partículas? El discurso que tenía que interpretar habla del relevo generacional, de cómo la experiencia de una generación mayor y la energía de una generación joven no se reemplazan, sino que convergen y construyen algo nuevo juntas.

Para visualizar eso, construí un sistema de **6.500 partículas en tiempo real** con Three.js que interpreta cada diapositiva del guion como una forma, una relación o un movimiento distinto. La presentación no tiene imágenes estáticas: es una simulación viva que respira, se transforma y reacciona con el tiempo. Cada slide es un estado del sistema, y la transición entre slides es una metamorfosis suave de toda la nube de partículas.

Lo que quería lograr era que cualquier persona que mirara la pantalla, sin leer una sola palabra, pudiera sentir de qué se trata el discurso: dos fuerzas que se encuentran, chocan, aprenden y finalmente se fusionan para construir algo más sólido que cualquiera de las dos por separado.

---

## Gramática visual

El sistema opera con una gramática de cuatro elementos:

1. **Partículas como unidades de sentido:** Cada partícula no representa a una persona, sino a un instante de conexión, de energía o de potencial. La densidad de partículas en un lugar significa relevancia; la dispersión significa apertura o incertidumbre.

2. **Color como identidad y estado:** Utilizo la paleta institucional del Fórum UPB de forma semántica:
   - `Azul (#00A0E9)` → Academia, estructura, experiencia, lo que ya existe.
   - `Rosa (#F078B4)` → Nueva generación, emergencia, lo que está llegando.
   - `Rojo (#E30613)` → Tensión, energía, impacto, lo que irrumpe.
   - `Violeta (#8440BA)` → Co-creación, mezcla, síntesis de ambas generaciones.
   - `Blanco brillante` → Acuerdo, claridad, momento de unión lograda.

3. **Forma como argumento:** Las formas que adoptan las partículas tienen una lógica narrativa directa. Una doble hélice (Slide 1) dice ADN, origen, identidad institucional. Tres clusters orbitantes (Slide 4) dicen Academia + Industria + Ciudad. Un plano horizontal que se despliega desde abajo (Slide 9) dice: aquí fue donde se construyó el fundamento.

4. **Movimiento como tiempo y relación:** La velocidad, la dirección y el tipo de movimiento (flujo continuo, oscilación, explosión radial, convergencia) no son decorativos. Cada comportamiento cinético tiene una intención: la velocidad en Slide 8 representa el flujo de información entre generaciones; la oscilación en Slide 7 representa la confianza que se propaga como una onda.

---

## Relaciones estructurales y movimiento en el discurso

El sistema tiene tres tipos de relaciones que organizan los elementos:

### 1. Relación de bifurcación
*Slides 3, 8, 11* — Partículas que parten desde un centro común y se separan hacia múltiples destinos. Traduce narrativamente la idea de que la institución no se queda encerrada: *"La Universidad decidió salir al mundo"*. El movimiento de apertura desde dentro hacia afuera es la gramática del alcance.

### 2. Relación de convergencia / colisión
*Slides 6, 7, 9* — Dos o más grupos de partículas que viajan desde extremos opuestos y se encuentran en el centro. En Slide 9 esta relación se vuelve la más elaborada: las dos corrientes (azul y rosa) intentan unirse tres veces. Las primeras dos veces fracasan con distintos tipos de rechazo (desvío vertical, repulsión elástica), pero en el tercer intento logran el cruce armónico y de su unión emerge un plano horizontal sólido. Esta secuencia es la metáfora visual del argumento central del discurso: *la alianza intergeneracional no es inmediata ni sencilla, pero cuando se logra, construye cimientos reales*.

### 3. Relación de campo / expansión
*Slides 5, 10, 12* — Las partículas no se desplazan hacia un punto: habitan un espacio y lo llenan de forma gradual, como una marea. Esto traduce visualmente el concepto de *impacto que permanece*: no es un destello puntual, es una transformación que ocupa territorio y se instala.

---

## Autoevaluación del Proyecto

> **Pregunta de cierre:**
> *¿Cómo puede una estructura de elementos relacionados y en movimiento convertirse en un lenguaje visual capaz de construir el significado de un discurso?*
>
> Mi respuesta: cuando cada elemento tiene una identidad reconocible (color, tamaño, comportamiento), cuando las relaciones entre ellos siguen una lógica consistente (convergencia = acuerdo, dispersión = conflicto, densidad = importancia) y cuando el tiempo de las transformaciones respeta el ritmo del argumento que se quiere comunicar, el movimiento deja de ser decoración y se convierte en sintaxis. Las partículas no *ilustran* el discurso: lo *enuncian*.

---

### Tabla de Autoevaluación

| # | Criterio | Descripción de cumplimiento | Puntaje (0–25) |
|---|----------|-----------------------------|:--------------:|
| 1 | **Cumplimiento del encargo** | La presentación interpreta los 13 slides del guion mediante una estructura generativa dinámica con 6.500 partículas en Three.js. Funciona en pantalla completa, tiene navegación por teclado, swipe táctil para móvil y se despliega correctamente en GitHub Pages. | **24** |
| 2 | **Relaciones estructurales** | Puedo explicar y demostrar las tres relaciones del sistema (bifurcación, convergencia/colisión, campo/expansión), su significado semántico en el discurso y cómo organizan espacialmente las partículas en cada slide. El color, la velocidad y la densidad son variables con intención narrativa explícita. | **23** |
| 3 | **Comportamiento y significado** | Cada cambio de movimiento tiene una intención comunicativa documentada. El caso más elaborado es Slide 9: tres fases de encuentro entre generaciones (choque con desvío, choque con repulsión, unión exitosa y formación de base plana) traducen directamente el argumento del discurso. | **24** |
| 4 | **Explicación y demostración** | Puedo presentar la propuesta funcionando en vivo, navegar por las slides explicando las decisiones de diseño de cada estado del sistema, y mostrar cómo el movimiento construye sentido incluso sin texto. La presentación se puede abrir desde GitHub Pages sin instalación. | **22** |

---

### Cálculo de la Nota Final

| Suma de puntajes | Máximo posible | Proporción | Nota (0–5) |
|:----------------:|:--------------:|:----------:|:----------:|
| 24 + 23 + 24 + 22 = **93** | 100 | 93 / 100 = 0.93 | **4.65 / 5** |

> **Nota final: 4.65 / 5**

> La fórmula de conversión es: `nota_5 = (suma_total / 100) × 5`  
> `(93 / 100) × 5 = 4.65`

---

*Bitácora elaborada el 18 de septiembre de 2026.*
