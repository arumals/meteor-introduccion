# Meteor.js

## Semana 1 : Introduccion a Meteor.js

### Porque Meteor.

Meteor un framework de desarrollo de aplicaciones web. Hemos elegido a meteor por las siguientes razones.

- Las aplicaciones de Meteor son escritas en JS, CSS y HTML, asi que no se necesita aprender otro lenguaje de servidor en especifico.

- Utiliza una version adaptada de la libreria de templates handlebars.

- Provee una instalacion sencilla de un ambiente que incluye un servidor web y una base de datos.

- Incluye un manejador de paquetes sencillos.

- Provee data sources reactivos, con un modelo de datos ordenado, lo que permite brindar a los usuarios una forma rapida de accesar a los datos.

- Meteor provee servidores publicos en los que se puede montar una aplicacion para pruebas y prototipado.

- Incluye la capacidad de generar aplicaciones nativas iOS y Android desde el mismo codigo JS base.

- Implementa un modelo isomorfico, lo que significa que el mismo codigo puede ser utilizado en el cliente y en el servidor.

- Corre sobre la parte superior de Node.js y MongoDB y puede ser montado sobre un servidor que soporte estos sistemas.

### Objetivos.

Al final de esta leccion seras capas de.

1. Instalar meteor.
2. Crear y correr una aplicacion.
3. Editar un template.
4. Definir la cabecera de un template.
5. Definir un event listener.

### De uno a muchos usuarios.

En una pagina web por lo general tenemos.

- HTML
- CSS
- JS
- Templates (Generar html "on the fly")
- Data

#### Porque un servidor?

Multiples personas accesan los datos.
Desde la perspectiva de Meteor, estos usuarios comparten los datos de manera interactiva.

### Instalacion de Meteor.

1. Instalar Meteor.

    ```shell
    $ curl https://install.meteor.com/ | sh
    ```

2. Crear el folder de la aplicacion.

    ```shell
    $ meteor create image_share
    ```

3. Executar la aplicacion

    ```shell
    $ cd image_share
    $ meteor
    ```

El proceso retornara una direccion url con un puerto, en caso de que se esten executando varias instancias de meteor, se executaran en diferentes puertos.

### Editando un template.

Spacebars esta basado en handlebars, and es el motor de templates de Meteor.

Por default Meteor nos crea tres archivos con el prefijo del nombre de nuestro proyecto.

- image_share.css
- image_share.js
- image_share.html

En el archivo image_share.html podemos identificar los componentes de Spacebars.

```
<head>
  <title>image_share</title>
</head>

<body>
  <h1>Welcome to Meteor!</h1>

  {{> hello}}
</body>

<template name="hello">
  <button>Click Me</button>
  <p>You've pressed the button {{counter}} times.</p>
</template>
```
Para incluir un template hacemos uso de la instruccion {{> template_name}} mientras que para imprimir una variable usamos {{variable_name}}.

Si revisamos el codigo html por la aplicacion podremos darnos cuenta que Meteor genera todos los documentos css, js y html de manera automatica.

Si renombramos el nombre del template por uno no existente, rapidamente Meteor va a crear una excepcion en tiempo de ejecucion.

Para almacenar las imagenes y archivos que utilizamos, tenemos que crear un folder llamado public, este por su nombre es de acceso publico.

### Enviando data a los helpers.

Primero vamos a data desde JS al template.

Dentro del proyecto tenemos el image_share.js.

```javascript
if (Meteor.isClient) {
    console.log("Yo soy el cliente");
}

if (Meteor.isServer) {
    // codigo que se ejecuta en el cliente
    console.log("Yo soy el servidor");
}
```

Al guardar los cambios el servidor reiniciara mostrando el mensaje "Yo soy el servidor" sera desplegado por la consola.

Una ves reiniciado el servidor, la aplicacion web refrescara y mostrara en consola el mensaje "Yo soy el cliente".

Para hacer la imagen dinamica utilizamos una variable para almacenar el path a la imagen.

```javascript
if (Meteor.isClient) {
  var img_data = {
    img_src : "laptop.jpg",
    img_alt : "some laptop"
  };

  Template.images.helpers(img_data);
}
```

```html
<body>
  <h1>Welcome to Meteor!</h1>

  {{> images}}
</body>

<template name="images">
    <img src="{{img_src}}" alt="{{img_alt}}">
  <button>Click Me</button>
  <p>You've pressed the button {{counter}} times.</p>
</template>
```

Si deseamos mostrar varias imagenes, podemos utilizar un arreglo dentro de JS.

```javascript
if (Meteor.isClient) {
  var img_data = [
    {
      img_src : "laptop.jpg",
      img_alt : "una laptop"
    },
    {
      img_src : "casa.jpg",
      img_alt : "una laptop"
    },
    {
      img_src : "televisor.jpg",
      img_alt : "un televisor"
    }
  ];

  Template.images.helpers({pictures : img_data});
}
```

Y dentro del codigo HTML solo tenemos que utilizar el bucle #each.

```html
<body>
  <h1>Welcome to Meteor!</h1>

  {{> images}}
</body>

<template name="images">
    {{#each pictures}}
        <img src="{{img_src}}" alt="{{img_alt}}">
        <button>Click Me</button>
        <p>You've pressed the button {{counter}} times.</p>
    {{/each}}
</template>
```

### Convert to a Bootstrap grid.

Paquetes https://atmospherejs.com

Los paquetes de Meteor proveen funcionalidad adicional.

Si se es familiar con brew en mac, o aptitude en linux, Meteor tambien tiene un manejador de paquetes.

Listar todos los paquetes que existen en Meteor.

```shell
$ meteor search .
```

Instalamos bootstrap desde Meteor.

```shell
$ meteor add twbs:bootstrap
```

Si volvemos a executar el comando meteor, notaremos que automaticamente Meteor se encargara de cargar las librerias de bootstrap.

Podemos ahora editar el template para hacer el uso del grid.

Meteor verifica que las etiquetas html esten cerradas de manera correcta.

```html
<body>
  <div class="container">
    <h1>Welcome to Meteor!</h1>
    {{> images}}
  </div>
</body>

<template name="images">
    <div class="row">
        {{#each pictures}}
        <div class="col-xs-12 col-md-3">
            <div class="thumbnail">
                <img src="{{img_src}}" alt="{{img_alt}}">
                <div class="caption">
                    <h3>Thumbnail label</h3>
                    <p>description of the image</p>
                </div>
            </div>
        </div>
        {{/each}}
    </div>
</template>
```

### Responding to user actions.

Agregamos algo de actividad a la aplicacion.

Una forma de mantener las clases que tienen eventos asignados es utilizar el prefijo js-. Agregamos la clase js-image a la imagen.

```html
<template name="images">
    <div class="row">
        {{#each pictures}}
        <div class="col-xs-12 col-md-3">
            <div class="thumbnail">
                <img src="{{img_src}}" alt="{{img_alt}}" class="js-image">
                <div class="caption">
                    <h3>Thumbnail label</h3>
                    <p>description of the image</p>
                </div>
            </div>
        </div>
        {{/each}}
    </div>
</template>
```

Y asignamos el evento al archivo JS, primero especificando el evento, despues la clase, y al final la funcion que ejecuta. Esta funcion por default recive un event, que a su ves contiene entre sus propieades el atributo target, que hace referencia al elemento que se hizo click.

```javascript
Template.images.events({
    'click .js-image' : function (event) {
        $(event.target).css("width","50px");
    }
});
```

## Bases de datos y colecciones.

Objetivos.

- Crear colecciones de Mongo.
- Utilizar mongo para realizar operaciones de busqueda e insercion.
- Controlar un overlay desde Meteor.
- Utilizar paquetes de Meteor para agregar funcionalidad.

### Modelo de datos distribuidos en Meteor.

En meteor existe una copia local de los datos que se propaga a los datos de la base de datos central.

![images/02_001.png](images/02_001.png)

### Crear una collection de images.

```javascript
// image_share.js
Images = new Mongo.Collection("images");
console.log(Images.find().count());

// startup.js
if(Meteor.isServer){
    Meteor.startup(function () {
        if(Images.find().count() == 0){
            Images.insert({ img_src:"laptops.jpg", img_alt:"some laptops on a table" });
            Images.insert({ img_src:"bass.jpg", img_alt:"a bass player" });
            Images.insert({ img_src:"beard.jpg", img_alt:"some musicians with beards" });
        }
    });
}
```

### Un mejor startup script, removiendo elementos de una coleccion.

```javascript
// image_share.js
Images = new Mongo.Collection("images");

if (Meteor.isClient) {

    Template.images.helpers({images:Images.find()});

    Template.images.events({
        'click .js-image' : function(event){
            $(event.target).css("width", "50px");
        },
        'click .js-del-image' : function (event) {
            var id = this._id;
            $("#" + id).hide('slow',function () {
                Images.remove({"_id" : id});
            });
        }
    });

}

// startup.js
if(Meteor.isServer){
    Meteor.startup(function () {
        if(Images.find().count() == 0){

            for(var i = 1; i < 23; i++){
                Images.insert({
                    img_src : "img_" + i + ".jpg",
                    img_alt : "image number " + i
                });
            }

            console.log(Images.find().count() + " images");

        }
    });
}
```

### Añadir sistema de ranking a las imagenes.

Instalamos el paquete para el manejo de rating.

```
$ meteor add barbatus:stars-rating
```

Ahora es necesario añadir el template de las estrellas al template de la galeria.

```
<p>
    {{>starsRating mutable=true class="js-rate-image" id=_id}}
</p>
```
Ahora implementamos la secuencia de html/js para guardar los cambios del rating.

```html
<!-- image_share.html -->
<div class="col-xs-12 col-md-3" id="{{_id}}">
    <div class="thumbnail">
        <img class="js-image" src="{{img_src}}" alt="{{img_alt}}"/>

        <div class="caption">
            <h3>Rating: {{ rating }}</h3>
            <p>description of the image</p>

            <p>
            {{>starsRating mutable=true class="js-rate-image" id=_id}}
            </p>

            <button class="js-del-image btn btn-warning">delete</button>
        </div>
    </div>
</div> <!-- / col -->
```

```javascript
// image_share.js
'click .js-rate-image' : function (event) {
    var rating = $(event.currentTarget).data('userrating');
    console.log(rating);
    var image_id = this.id;
    console.log(image_id);
    Images.update({ "_id" : image_id},{$set : {rating : rating}});
}
```

### Agregar contenido a la base de datos.

Creamos un nuevo template para el formulario.

```html
<!-- image_share.html -->
{{> image_add_form}}

...

<template name="image_add_form">
  <form class="js-add-image">
    <input type="text" name="img_src"><br>
    <input type="text" name="img_alt">
    <button class="btn btn-success">save</button>
  </form>
</template>
```

Y la parte js.

```javascript
Template.images.helpers({images:Images.find({},{ sort : { created_on : -1, rating : -1 }})});

...

Template.image_add_form.events({
    'submit .js-add-image' : function (event) {
        var img_src, img_alt;
        img_src = event.target.img_src.value;
        img_alt = event.target.img_alt.value;

        console.log("src : " + img_src + " alt: " + img_alt);

        Images.insert({
            img_src : img_src,
            img_alt : img_alt,
            created_on : new Date()
        });

        event.preventDefault();
    }
});
```

- Prevent default previene que el formulario se envie.

Agregamos el formulario dentro de un overlay.

```html
<div class="modal fade" id="image_form_modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title"></div>
            </div>
            <div class="modal-body">
                <form class="js-add-image">
                    <input type="text" name="img_src"><br>
                    <input type="text" name="img_alt">
                    <button class="btn btn-success">save</button>
                </form>
            </div>
            <div class="modal-footer">
                <button data-dismiss="modal" class="btn btn-warning">cancel</button>
            </div>
        </div>
    </div>
</div>
```

```javascript
'click .js-show-image-form' : function  (event) {
    $('#image_form_modal').modal('show');
}
```

*Declaramos la variable Images sin var Images, porque Meteor hace de esta declaracion, local y no puede ser accesada desde otros archivos.*

## Identificacion de usuario.

Al final de esta unidad seras capaz de.

1. Añadir identificacion de usuario a una aplicacion de meteor.
2. Utilizar los filtros de mongo.
3. Utilizar variables de sesion reactivas.
4. Implementar un scroll infinito.

### Leccion 2 : Autenticacion de usuario con Meteor.

Vamos a aprender autenticacion de usuario, esto permite logearse al sistema, detectar quien esta autenticado en el sistema.

Meteor simplifica este proceso utilizando un paquete existente, tambien es posible utilizar paquetes que permiten identificarse con twitter, facebook, etc.

Añadir paquete accounts-ui (templates para formularios de identificacion) y accounts-password (logica de la authenticacion).

```shell
$ meteor add accounts-ui accounts-password
```

Then we can open the home page and add the template there.

```html
<!-- /image_share/image_share.html -->
{{> loginButtons}}
```

### Leccion 3 : Enlazando el diseño con una barra de navegacion.

```html
<nav class="navbar navbar-default navbar-fixed-top">
    {{> loginButtons}}
</nav>
```

### Leccion 4 : Accesando la informacion de usuario.

Cuando se loguea un usuario la informacion mas sencilla de mostrar es el username.

```html
<h1>Welcome to share image {{username}}!</h1>
```

El accessor Meteor.user() nos permite acceder al usuario autentificado.

```javascript
if(Meteor.user()){
    ...
}
```

El template currentUser es un helper accesible en cualquier template.

### Leccion 5 : Configurando la forma de registro.

```javascript
Accounts.ui.config({
    passwordSignupFields : "USERNAME_AND_EMAIL"
});

...

Template.body.helpers({
    username : function () {
        if (Meteor.user()) {
            return Meteor.user().username;
        }

        return "anonymous internet user";
    }
});
```

### Leccion 6 : Adjuntando imagenes.

Podemos actualizar la informacion de la imagen, especificando que usuario la ha adjuntado.

```javascript
if (Meteor.user()) {

    Images.insert({
        img_src : img_src,
        img_alt : img_alt,
        created_on : new Date(),
        created_by : Meteor.user()._id
    });

};

Template.images.helpers({
    images:Images.find({},{
        sort : {
            created_on : -1,
            rating : -1
        }
    }),
    getUser : function (user_id) {
        var user = Meteor.users.findOne({ _id : user_id });
        if (user) {
            return user.username;
        } else {
            return "anonymous";
        }
    }
});
```

### Leccion 7 : Filtrando imagenes por usuario.

Haciendo uso de Session podemos almacenar el valor del id del usuario que esta actualmente realizando el filtrado.

```javascript
Template.images.helpers({
    images : function () {

        if (Session.get('user_filter')) {

            return Images.find({created_by : Session.get('user_filter')},{
                sort : {
                    created_on : -1,
                    rating : -1
                }
            });

        }

        return Images.find({},{
            sort : {
                created_on : -1,
                rating : -1
            }
        });

    }
});


Template.images.events({
    'click .js-set-user-filter' : function (event) {
        Session.set('user_filter', this.created_by);
        event.preventDefault();
    }
});
```

### Leccion 8 : Removiendo el filtro.

Es posible remover el filtro del listado de las imagenes.

```javascript
Template.images.events({
    'click .js-set-user-filter' : function (event) {
        Session.set('user_filter', this.created_by);
        event.preventDefault();
    }
});
```

### Leccion 9 : Scroll infinito.

## Semena 4 : Seguridad y enrutamiento.

Objetivos de esta semana:

1. Realizar tests de seguridad en su aplicacion.
2. Implementar caracteristicas de seguridad sobre los datos.
3. Liberar una aplicacion meteor en el internet.
4. Organizar el codigo de la aplicacion.
5. Implementear multiples rutas utilizando iron:router.

### Leccion 2 : Liberar una aplicacion meteor.

Liberar la aplicacion para testing.

```shell
$ meteor deploy mylittlecourse.meteor.com
```

Por default cuando vamos a realizar el deploy, meteor ejecuta algunas peraciones como.

- minify
- upload

Si queremos eliminar el proyecto de la plataforma meteor, ejecutamos.

```shell
$ meteor deploy --delete mylittlecourse.meteor.com
```

### Leccion 3 : Como organizar el codigo.

En una aplicacion tenemos, templates, helpers, etc. Lo que tenemos que hacer entonces es organizar el contenido en folders especificos para tener un codigo mejor organizado.

El folder "public" es un folder para contenido que tiene acceso publico como assets e imagenes. No es deseable que se publique aqui codigo JS, sino solo archivos estaticos.

Si creamos un archivo test.js dentro de los folders client y server con el codigo...

```javascript
// client/test.js
console.log('este es el cliente');
```

```javascript
// server/test.js
console.log('este es el servidor');
```

Nos dariamos cuenta de que uno responde en la consola y otro en el navegador.

En Meteor existe entonces el concepto de codigo compartido entre el cliente y el servidor, y este se guarda en la carpeta **shared**. La mayoria del codigo creado con excepcion de la definicion de la coleccion va en el archivo del folder shared.

```javascript
// shared/image_shared.js
Images = new Mongo.Collection("images");
```

### Leccion 4 : Hackeando tu propio sitio.

Con el nivel de seguridad actual es muy sencillo borrar todo el contenido desde la consola JS del navegador. Inclusive hacer cualquier tipo de operacion a la base de datos, por ello es necesario llevar acabo ciertas medidas para prevenir este tipo de hackeos.

### Leccion 5 : Haciendo el sitio mas seguro.

Lo primero que hay que hacer es remover el paquete insecure.

```shell
$ meteor remove insecure
```

Ahora cuando intentamos eliminar una imagen o agregar una nueva, la consola nos responde con el mensaje "Access Denied".

La coleccion Images es compartida por multiples archivos, para garantizar entonces que esta este accesible antes de ser llamada, la alojamos en el folder **lib**, que es donde estan los archivos se carguen antes que todo lo demas.

```javascript
// bin/collections.js

// This is the image_share.js
Images = new Mongo.Collection("images");

// setup security on Images Collection
Images.allow({
  insert: function(user_id,doc){
    console.log("testing securit on image insert");
    return false;
  }
});
```

Cuando intentamos insertar una imagen, deberiamos obtener como resultado el mensaje de denegacion en la consola.

La idea entonces es que para poder ejecutar estas operaciones necesitamos realizar una validacion que regrese true.

Cuando intentamos realizar un insert, los valores son visibles a nivel de la consola.

Podemos tambien forzar para que al momento de salvar se especifique el user_id desde el objeto Meteor.user().

```javascript
// setup security on Images Collection
Images.allow({
  insert : function(user_id, doc){
    console.log("testing securit on image insert");
    if(!Meteor.user()){ // denied if user not logged in
      return false;
    }
    doc.created_by = Meteor.user()._id;
    return true;
  },
  remove : function (user_id, doc) {
    return false;
  }
});
```

### Enrutando con iron:router.

En formas viejas de hacer web tenemos documentos html para cada url, pero en meteor no se refresca la pantalla.

Instalando iron:router.

```shell
meteor add iron:router
```

El primer lugar a donde se va a accesar es al root de la aplicacion, antes de crear esto tenemos que reorganizar las paginas.

Despues de reorganizar todos los contenidos en templates, si accedemos al root vamos a darnos cuenta que se muestra el mensaje de iron:router por default.

*Los templates definidos se cargan en cierta forma en memoria, podemos invocar diferentes templates desde el routeador.*

Creamos un global layout.

```javascript
Router.configure({
    layoutTemplate : 'ApplicationLayout'
});
```

Podemos tambien definir el contenido que se renderea en multiples areas del template.

```javascript
Router.route('/images', function () {
  this.render('navbar',{
    to : 'navbar'
  });
  this.render('images',{
    to : 'main'
  })
});
```

Y ademas utilizar parametros y enlazar datos a los valores de estos parametros.

```javascript
Router.route('/image/:_id',function () {
    this.render('navbar',{
        to : 'navbar'
    });
    this.render('image',{
        to : 'main',
        data : function () {
            return Images.findOne({ _id : this.params._id });
        }
    });
});
```

