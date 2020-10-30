# Lab 3 - Proyecto MayWeather

Para realizar la búsqueda se debe ingresar la petición de alguna de las siguientes formas:

* CIUDAD - Se realiza la búsqueda solo con el nombre de la ciudad.

* CIUDAD, ABREVIATURA PAÍS - Se ingresa la cuidad separado por una coma la abreviatura del país correspondiente.

* CIUDAD, CÓDIGO DEL PAIS - Se ingresa la cuidad separado por una coma el código del pais correspondiente.

* Lon: NUMERO DE LONGITUD, Lat: NUMERO DE LATITUD - Se ingresa la palabra reservada "Lat:" para luego ingresar el valor numérico de la longitud, luego se separa por una coma y se ingresa la palabra reservada "Lon:" para luego ingresar el valor numérico de la latitud.

* longitude: NUMERO DE LONGITUD, latitude: NUMERO DE LATITUD - Se ingresa la palabra reservada "longitude:" para luego ingresar el valor numérico de la longitud, luego se separa por una coma y se ingresa la palabra reservada "latitude:" para luego ingresar el valor numérico de la latitud.

## Módulos que se utliziaron:
* Bootstrap
* Reactstrap
* Prop-Types
* Webpack
* Modulos de Babel.

## Instalación:
npm install --save bootstrap
npm install --save reactstrap react react-dom
npm install --save prop-types

**Para usar propiedades en las clases**

npm install --save-dev @babel/plugin-proposal-class-properties
**(En este momento "^7.4.4")**

**babelrc modificado, se agrega**

"plugins": ["@babel/plugin-proposal-class-properties"]

**Webpack**

Agregado style-loader

**Otros componentes de babel**

npm i -D @babel/cli @babel/polyfill

## Iniciar el servidor de webpack

npm start

## Aviso importante

En caso de que haya problemas para compilar, por medio de la instrucción "npm start", se debe borrar el archivo "package-lock.json"
y la carpeta "node_modules", luego se debe hacer la instalación.

## Documentación:

### App.jsx
Componente principal que solo se encarga de llamar al MainController pasando parámetros.

### MainController.jsx
Se encarga de crear la parte visual de la página, y guardar los atributos que mas tarde serían usados por los demas componentes.

### MainBar.jsx
Crea la parte superior de la página, en el cual se encuentra el logo y dos modales con los datos de About y Contact.

### Search.jsx
Se encarga de procesar lo ingresado en el buscador para poder realizar la búsqueda correspondiente.
También realiza el manejo de errores en caso de que se haya realizado mal la consulta por parte del usuario.

### Menu.jsx
Se encarga de realizar enviar la solicitud al servidor de OpenWeather y de pasar la respuesta a los siguientes módulos para que procesen y muestren en pantalla.
Realiza las consultas para el Current, Forecast y UVI.

### Cards.jsx
Imprime en pantalla un modal con los valores de Current, Forecast, UVI y Change to Fahrenheit/Celsius con sus respectivos valores.

### CountryCode.js
Son las abreviaciones de los países indexados al nombre completo de cada país.

### GraphUVI.jsx
Se encarga de realizar los gráficos correspondientes en UVI.

### Keys.jsx
Es la KEY que nos proporcionó OpenWeather para realizar las consultas.

### RequestController.js
Contiene funciones auxiliares que se encargan de manejos de errores.

### TemperatureConversion.js
Se encarga de pasar la temperatura de Celsius a Fahrenheit de forma local para no realizar nuevas peticiones al servidor.