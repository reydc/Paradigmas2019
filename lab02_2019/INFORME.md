# **Informe** #
---
Integrantes:

* XXXXXXXXXXXX
* XXXXXXXXXXXX
* XXXXXXXXXXXX

### **Generales del laboratorio 2** ###
---
Las consignas, en general, se entendieron. Si hubo puntos que generaron duda tomamos la interpretación
que nos pareció más abarcativa posible y simple.

Lo que más dificultad trajo fue el desconocimiento del lenguaje de programación y sus herramientas, así como la plataforma de desarrollo (sbt), que para todos los integrantes del grupo eran nuevos.
El framework se mostró fácil de entender aunque fue necesario leer varias veces algunos puntos que no estaban tan bien documentados, por lo menos al parecer del grupo.

### **Decisiones de diseño** ###
---
Según se necesitaron se crearon archivos que dividieron la funcionalidad de los módelos. Las creaciones de las clases y sus companions objects fueron casi directas y no hubo dificultad en la tarea. La implementación de los métodos del companion object para la clase principal de los módelos tuvo que ser refinada varias veces, debido a que casi siempre se encontró alguna forma de acortar el código y reducir el "boilerplate" (aunque siemnpre se puede
refinar más). Ocurrió algo parecido con las funciones en el objeto que representaba la API. Varias veces tuvimos que sacar código que resultaba más fácil de escribir si eramos más cuidadosos.

Como norma general se utilizaron las funciones de models siempre que se pudo. Cuando no se hizo éso es porque se necesitaba separar o diferenciar de alguna forma los datos.

En donde definimos las clases de usuarios se declaró un trait para, de cierta forma, documentar lo que queríamos hacer o cual era nuestra intención, ya que habíamos separado los módelos para los consumidores y los proveedores.
EL trait es visible sólo en ése archivo.

En el archivo donde se declaran los pedidos construimos una clase abstracta y dos objetos que la extienden para
hacer una enumeración de estados. La clase abstracta es sólo visible en ese archivo y los objetos de enumeración
son sólo visibles para el paquete.

En el método de la API que creaba una orden nos tomamos la libertad de crear un chequeo extra para ver si todos
los items pertenecían al mismo proveedor, de forma tal que si no era así devolvíamos un error con código 400,
para indicar un "Bad request" (porque creemos que hay un error en el pedido).

Por último, se agrego la librería upickle (0.6.6) a las dependencias para resolver un problema de parseo de los arrays de objetos en json y se creo un objeto que permitía usar una función para procesar los arrays problemáticos.

#### Encapsulamiento ####
---
La "base de datos" se utilizó siempre de forma encapsulada, a través de los módelos.
Como cada módelo definía una instancia para las "tablas", podíamos acceder a cada uno de los archivos correspondientes de forma separada y estando seguros de que objetos estaban "almacenados" según su tipo.

#### Herencia, clases abstractas y traits ####
---
Se uso sobre todo para los módelos y la utilización de las implementaciones de la clase de módelo principal. Usamos un trait como forma de documentar nuestra intención respecto a los usuarios, cuales serían los campos en común.
Al principio se utilizó una única clase abstracta User que heredaba de Model y que tenía como sublases a Provider y Consumer, pero la forma de diferenciar a los objetos que pertencerían a una u otra subclase se basaba en un campo extra que añadía al menos un control extra para diferenciar los objetos en la API. Por eso se terminó eliminando la clase User y se separaron las clases Provider y Consumer, tal como sugirieron los profesores de la cátedra.

#### Sobrecarga de operadores ####
---
Como ejemplo de sobrecarga que implementamos, pero que eventualmente dejamos de lado, estuvo la clase User mencionada antes. Lo que ocurrió fue que era necesario sobrecargar el operador apply para que nos instanciara como un Provider o un Consumer y los pudieramos diferenciar. Si bien de está forma había herencia y no había problemas con la API, el control extra necesario para diferenciar los objetos de las subclases hizo que se terminara optando por separar la implementación de Provider y Consumer para que heredaran directamente de Model.

#### Polimorfismo ####
---
Se utlizó cada vez que usamos funciones de Model en la API. Permitió realizar un trabajo bastante similar para los métodos de la API cuando se apuntaba a diferentes módelos.
