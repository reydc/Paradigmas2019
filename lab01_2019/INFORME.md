# Dibujo.md #
Documento general sobre el práctico 1.
Grupo 23:

* XXXXXXXXXXXX
* XXXXXXXXXXXX
* XXXXXXXXXXXX

---
### Resumen ###

*(1) Experiencia en general.*

*(2) Sobre Dibujo.hs.*

*(3) Recomendaciones.*

---
### (1) Experiencia en general. ###

La experiencia en general fue buena, aunque muchas dudas nos invadieron a la hora de implementar y abstraer 
las funciones pedidas por el hecho de que lo que se pedía nos parecía muy general y no sabiamos como empezar.
Buscamos la forma de modelar el comportamiento deseado por medio de pruebas incrementales a medida que íbamos 
dando nuevas funciones. Por último modelamos el tipo Escher de la forma que nos pareció más natural, lo que no 
significa que sea la correcta. Nos pareció que había muchas formas de implementar lo pedido y buscamos referencias
que, aunque muchas veces no nos dabamos cuenta como utilizar ciertas ideas, nos sirvieron para evaluar la dificultad
de la tarea.

---
### (2) Sobre Dibujo.hs. ###

Dibujo.hs implementa el lenguaje y varias funciones que se pueden utilizar con el tipo abstracto de datos (Dibujo).
Este tipo fue hecho instancia de las clases Functor y Foldable de Haskell. En el primer caso para poder usar con 
generalidad fmap, y en el segundo porque nos permitia hacer un recorrido de la estructura de tipo Dibujo y acumular
resultados.
Importamos el módulo Data.Monoid para utilizar los acumuladores para los monoides booleanos y aliviar la carga de
implementar una función de acumulación para ese tipo. Además nos permitía utilizar naturalmente la instancia definida
por Foldable.
También importamos Data.Either para utilizarlo en las funciones de chequeo de errores, otra vez, para evitar hacer
más trabajo por pattern matching.
También pensamos instanciar la clase de funtores aplicativos(Applicative), pero tuvimos problemas para definir una
función adecuada para las computaciones secuenciales que sea consistente con las leyes de los mismos. Sin embargo vimos
la intención de algunas abstracciones que los profesores deseaban que implementaramos por medio de los nombres que se 
le dieron a algunas funciones, aunque no siempre las supiéramos usar.
 
---
### (3) Recomendaciones. ###

1. El concepto de mónada apareció varias veces durante el laboratorio y pudimos observar que
   varios grupos lo tuvieron en cuenta. También ocurrió algo parecido con los functores aplicativos
   y los monoides. Estos conceptos resultaron ser muy útiles, y quizas merezcan una introducción en
   otros cursos.

2. Las clases Transversable y Foldable de Haskell son interesantes también.

3. Quizás nos hacían falta más pistas documentales para lograr un resultado más complejo del que obtuvimos.
   Haskell nos pareció un lenguaje elegante aunque complicado.


