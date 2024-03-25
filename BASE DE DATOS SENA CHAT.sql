DROP DATABASE IF EXISTS sena_chat;    
CREATE DATABASE SENA_CHAT;
	USE SENA_CHAT;

CREATE TABLE programa_formacion
(
    id_programa INT NOT NULL AUTO_INCREMENT,
    nombre_programa VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_programa)
);

CREATE TABLE ficha
(
	id_ficha VARCHAR(10) NOT NULL,
	fk_programa INT NOT NULL,
	trimestre INT NOT NULL,
	PRIMARY KEY (id_ficha)
);

CREATE TABLE roles
(
	id_rol INT NOT NULL,
	nombre_rol VARCHAR(20) NOT NULL,
	PRIMARY KEY (id_rol)
);

CREATE TABLE tipo_documento
(
	id_tipodoc INT NOT NULL,
	descripcion_tipodoc VARCHAR (60) NOT NULL,
	PRIMARY KEY (id_tipodoc)
);

CREATE TABLE mensaje 
(
	id_mensaje INT NOT NULL AUTO_INCREMENT,
	fecha_hora DATETIME NOT NULL,
	contenido_mensaje VARCHAR(10000) NOT NULL,
	fk_destino VARCHAR(50) NOT NULL,
	id_tipo INT NOT NULL,
	PRIMARY KEY (id_mensaje)
);

CREATE TABLE tipo_mensaje
(
	id_tipo INT NOT NULL,
	Nom_tipo VARCHAR(20) NOT NULL,
	descripcion_mensaje VARCHAR (200) NULL,
	PRIMARY KEY (id_tipo)
);

CREATE TABLE grupos
(
	id_grupos INT NOT NULL AUTO_INCREMENT,
	nom_grupos VARCHAR(20) NOT NULL,
	descripcion_grupos VARCHAR(110) NOT NULL,
	id_ficha VARCHAR(10) NOT NULL,
	foto_grupo VARCHAR(100) NULL DEFAULT 'Grupo.png',
	fk_tipo_grupo INT NOT NULL,
	PRIMARY KEY (id_grupos)
);

CREATE TABLE usuarios
(
	correo VARCHAR(100) NOT NULL,
	primer_nom VARCHAR(20) NOT NULL,
	segundo_nom VARCHAR(20) NULL,
	primer_apellido VARCHAR(20) NOT NULL,
	segundo_apellido VARCHAR(20) NULL,
	contrasena VARCHAR(100) NOT NULL,
	nombre_usuario VARCHAR(20) NOT NULL,
	descripcion VARCHAR(140) NULL,
	foto VARCHAR(100) NOT NULL DEFAULT 'Usuario.jpg',
	fk_id_rol INT NOT NULL,
	numerodoc VARCHAR(20) NOT NULL,
	fk_id_tipodoc INT NOT NULL,
	PRIMARY KEY (numerodoc, fk_id_rol, fk_id_tipodoc)
);

CREATE TABLE usuarios_grupos 
(
	id_usuarios_grupos VARCHAR(50) NOT NULL,
	id_grupos INT NOT NULL,
	numerodoc VARCHAR(20) NOT NULL,
	sin_leer INT NULL,
	PRIMARY KEY (id_usuarios_grupos)
);

CREATE TABLE tipo_grupo
(
	id_tipo_grupo INT NOT NULL,
	descripcion_tipo_grupos VARCHAR(20) NOT NULL,
	PRIMARY KEY(id_tipo_grupo)
);

CREATE TABLE usuarios_fichas 
(
	id_fichas VARCHAR(10) NOT NULL,
	numerodoc VARCHAR(20) NOT NULL,
	principal BOOLEAN NOT NULL DEFAULT FALSE,
	PRIMARY KEY (id_fichas, numerodoc)
);

ALTER TABLE ficha
ADD CONSTRAINT FK_ficha_programa
FOREIGN KEY (fk_programa)
REFERENCES programa_formacion (id_programa);

ALTER TABLE grupos 
ADD CONSTRAINT PK_FK_id_ficha 
FOREIGN KEY (id_ficha) 
REFERENCES ficha (id_ficha);

ALTER TABLE grupos 
ADD CONSTRAINT tipoGrupo 
FOREIGN KEY (fk_tipo_grupo) 
REFERENCES tipo_grupo(id_tipo_grupo);

ALTER TABLE usuarios_grupos
ADD CONSTRAINT FK_PK_id_grupos
FOREIGN KEY (id_grupos)
REFERENCES grupos (id_grupos);

ALTER TABLE usuarios_grupos
ADD CONSTRAINT FK_PK_id_usuarios 
FOREIGN KEY (numerodoc)
REFERENCES usuarios (numerodoc) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE usuarios
ADD CONSTRAINT FK_PK_id_rol
FOREIGN KEY (fk_id_rol)
REFERENCES roles (id_rol);

ALTER TABLE usuarios
ADD CONSTRAINT FK_PK_id_documento
FOREIGN KEY (fk_id_tipodoc)
REFERENCES tipo_documento (id_tipodoc);

ALTER TABLE mensaje
ADD CONSTRAINT FK_Destino
FOREIGN KEY (fk_destino)
REFERENCES usuarios_grupos(id_usuarios_grupos);

ALTER TABLE mensaje
ADD CONSTRAINT FK_PK_id_tipo
FOREIGN KEY (id_tipo)
REFERENCES tipo_mensaje (id_tipo);

ALTER TABLE usuarios_fichas
ADD CONSTRAINT FK_PK_id_fichas
FOREIGN KEY (id_fichas)
REFERENCES ficha (id_ficha);

ALTER TABLE usuarios_fichas
ADD CONSTRAINT FK_PK_usuarios 
FOREIGN KEY (numerodoc)
REFERENCES usuarios (numerodoc) ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO programa_formacion VALUES
(NULL, 'Analisis Y Desarrollo De Software'),
(NULL, 'Arte, cultura, esparcimiento y deportes'),
(NULL, 'Finanzas');


INSERT INTO ficha VALUES 
('0000000', 1, 0),
('2558101', 1, 1),
('2558102', 2, 4),
('2558103', 3, 2),
('2558104', 1, 2),
('2558105', 2, 4),
('2558106', 2, 3);

INSERT INTO roles VALUES 
('1','INSTRUCTOR'),
('2','APRENDIZ'),
('3', 'ADMINISTRADOR');

INSERT INTO tipo_documento VALUES 
('1','Cédula de Ciudadanía'),
('2','Tarjeta de Identidad'),
('3','Cédula de Extranjería'),
('4','PEP'),
('5','Permiso por Protección Temporal');

INSERT INTO tipo_mensaje VALUES 
('1','Mensaje de Texto','text'),
('2','Imagen', 'img'),
('3','Documento', 'docx');

INSERT INTO tipo_grupo VALUES
(1, 'Privado'),
(2, 'Grupal');

INSERT INTO usuarios VALUES 
('j', 'j', 'j', 'j', 'j', MD5('321'), 'JHOAN', 'Entusiasta de la tecnología y los videojuegos. Siempre en busca de nuevas aventuras en la web.', 'Usuario.jpg', '3', 1024471018, 1),
('juan.cardenas34@misena.edu.co','Juan','David','Cardenas','Perez',MD5('123'),'juan_cardenas','Apasionado por la programación y el desarrollo web. ¡Listo para aprender y crecer en este mundo digital!', 'Usuario11.jpg', '2', 1131104356, 1),
('camilo@gmail.com','Camilo',NULL,'Perez',NULL,MD5('123'),'carlosperez','Amante de los deportes y la música. Siempre dispuesto a charlar sobre los últimos lanzamientos en la industria musical.', 'Usuario10.jpg','2','1234567911',1),
('sebastian@gmail.com','Sebastian',NULL,'Carrillo',NULL,MD5('123'),'sebastian_123','Fanático de los viajes y la fotografía. Compartamos historias y experiencias de viaje mientras exploramos el mundo juntos.', 'Usuario9.jpg','2','12345678912',1),
('isabella.mitchell@example.com','Isabella',NULL,'Mitchell',NULL,MD5('123'),'isabella','Adicta a los libros y al café. Siempre buscando nuevas lecturas y lugares acogedores para disfrutar de una buena taza.', 'Usuario8.jpg','2','12345678913',1),
('ethan.johnson@example.com','Ethan',NULL,'Johnson',NULL,MD5('123'),'ethan','Entusiasta del cine y la cultura pop. ¡Hablemos de películas, series y todo lo relacionado con el mundo del entretenimiento!', 'Usuario7.jpg','2','12345678914',1),
('sophia.anderson@example.com','Sophia',NULL,'Anderson',NULL,MD5('123'),'sophia','Amante de la naturaleza y los animales. Siempre buscando nuevas aventuras al aire libre y amigos peludos para acompañarme.', 'Usuario6.jpg','2','12345678916',1),
('alexander.turner@example.com','Alexander',NULL,'Turner',NULL,MD5('123'),'alexander','Aventurero y amante de la adrenalina. Siempre listo para nuevas experiencias y desafíos emocionantes.', 'Usuario5.jpg','2','12345678917',1),
('olivia.brooks@example.com','Olivia',NULL,'Brooks',NULL,MD5('123'),'oliva','Apasionada por la cocina y la gastronomía. ¡Hablemos de recetas, restaurantes y todo lo relacionado con el mundo culinario!', 'Usuario4.jpg','2','12345678918',1),
('mia.parker@example.com','Mia',NULL,'Parker',NULL,MD5('123'),'mia','Fanática del fitness y el bienestar. Siempre buscando nuevas formas de mantenerme activa y saludable.', 'Usuario3.jpg','2','12345678919',1),
('Minnick@gmail.com','Nicolas',NULL,'Rincon',NULL,MD5('minnick'),'nicolas_rincon','Emprendedor y amante de la tecnología. Siempre en busca de nuevas oportunidades para innovar y crecer profesionalmente.', 'Usuario2.jpg','2','1021392807',1),
('johndoe@example.com', 'John', 'David', 'Doe', NULL, MD5('password123'), 'johndoe', 'Entusiasta de la música y los conciertos en vivo. Siempre buscando nuevas bandas para escuchar y experiencias musicales para disfrutar.', 'Usuario10.jpg', '2', '12345678001', 1),
('isaura@example.com', 'Isaura', 'Maria', 'Suarez', 'Novoa', MD5('789'), 'Isaura', 'Apasionada por el arte y la creatividad. Siempre buscando inspiración en cada rincón del mundo para mis proyectos artísticos.', 'Usuario1.jpg', '1', '12345678018', 2),
('heivercuesta@misena.edu.co', 'Heiver', NULL, 'Cuesta', 'Davila', MD5('abc'), 'Heiver', 'Estudiante dedicado y amante del aprendizaje. ¡Siempre listo para adquirir nuevos conocimientos y enfrentar desafíos académicos!', 'Usuario8.jpg', '1', '12345678019', 2),
('leonardo@example.com', 'Leonardo', NULL, 'Pineda', NULL, MD5('xyz'), 'Leonardo', 'Amante de los deportes extremos y la naturaleza. Siempre en busca de nuevas aventuras al aire libre y experiencias emocionantes.', 'Usuario6.jpg', '1', '12345678020', 2),
('Manolo@example.com', 'Manolo', 'Esteban', 'Olivo', 'Rodrigez', MD5('789'), 'Manolo', 'Fanático de los videojuegos y la tecnología. Siempre buscando nuevos desafíos en el mundo digital y conectando con otros gamers.', 'Usuario5.jpg', '1', '12345678021', 2),
('wendybohorquez1987@gmail.com', 'Wendy', NULL, 'Bohorquez', NULL, MD5('abc'), 'Wendy', 'Entusiasta de la moda y el estilo. Siempre buscando las últimas tendencias y compartiendo consejos de moda con amigos.', 'Usuario7.jpg', '1', '12345678022', 2),
('javier@example.com', 'Javier', NULL, 'Almanza', 'Vela', MD5('xyz'), 'Javier', 'Amante de la música y la guitarra. Siempre buscando inspiración en cada nota y compartiendo melodías con otros aficionados.', 'Usuario4.jpg', '1', '12345678023', 2),
('Alejandro@example.com', 'Maria', 'Alejandra', 'Garcia', 'Romero', MD5('789'), 'Alejandra', 'Apasionado por los viajes y la fotografía. Siempre en busca de nuevos destinos para explorar y capturar momentos memorables con mi cámara.', 'Usuario9.jpg', '1', '12345678024', 2);


INSERT INTO usuarios_fichas VALUES
('0000000', '1024471018', 1),
('2558101', '1131104356', 1),
('2558101', '1021392807', 1),
('2558101', '1234567911', 1),
('2558101', '12345678019', 1),
('2558101', '12345678020', 1),
('2558101', '12345678018', 1),
('2558102', '12345678021', 1),
('2558102', '12345678022', 1),
('2558102', '12345678023', 1),
('2558102', '12345678912', 1),
('2558102', '12345678913', 1),
('2558102', '12345678914', 1),
('2558102', '12345678916', 1),
('2558102', '12345678917', 1),
('2558102', '12345678918', 1),
('2558102', '12345678919', 1),
('2558102', '12345678001', 1),
('2558103', '12345678024', 1),
('2558104', '12345678019', 1),
('2558104', '12345678020', 1);
-- APRENDICES PARA LA FICHA AQUI


INSERT INTO grupos VALUES 
('1','grupo de Heiver','Exploración de técnicas avanzadas de inteligencia artificial aplicadas al desarrollo de sistemas autónomos.','2558101', 'Grupo1.jpg',2),
('2','grupo de Leonardo','Estudio de metodologías de seguridad informática en el desarrollo de aplicaciones web y móviles.','2558101', 'Grupo2.jpg',2),
('3','grupo de Isaura','Análisis comparativo de lenguajes de programación para el desarrollo de aplicaciones en la nube.','2558101', 'Grupo3.jpg',2),
('4','grupo de Manolo','Estudio del impacto del deporte en la cultura juvenil.','2558102', 'Grupo4.jpg', 2),
('5','grupo de Wendy','Análisis de tendencias culturales en la industria del entretenimiento.','2558102', 'Grupo5.png', 2),
('6','grupo de Javier','Exploración de la relación entre arte y tecnología en la era digital.','2558102', 'Grupo6.jpg', 2),
('7','grupo de Alejandra','Gestión financiera en organizaciones sin fines de lucro.','2558103', 'Grupo7.jpg', 2),
('8', 'nicolas_rincon', 'Privado', '2558101', NULL, 1),
('9', 'carlosperez', 'Privado', '2558101', NULL, 1),
('10', 'Isaura-Juan', 'Privado', '2558101', NULL, 1),
('11', 'Isaura-Nicolas', 'Privado', '2558101', NULL, 1),
('12', 'Sebastian', 'Privado', '2558102', NULL, 1),
('13', 'Isabella', 'Privado', '2558102', NULL, 1),
('14', 'Ethan', 'Privado', '2558102', NULL, 1),
('15', 'Sophia', 'Privado', '2558102', NULL, 1),
('16', 'Alexander', 'Privado', '2558102', NULL, 1),
('17', 'Olivia', 'Privado', '2558102', NULL, 1),
('18', 'Mia Parker', 'Privado', '2558102', NULL, 1),
('19', 'Javier', 'Privado', '2558102', NULL, 1),
('20', 'Wendy', 'Privado', '2558102', NULL, 1);

INSERT INTO usuarios_grupos VALUES
('1', '1', '12345678019', NULL),	 	# Heiver - Grupo 1
('2', '1', '1131104356', 2), 		# Juan - Grupo 1
('3', '1', '1021392807', NULL),  		# Nicolas - Grupo 1
('4', '1', '1234567911', NULL),  		# Camilo - Grupo 1
('5', '2', '12345678020', NULL), 		# Leonardo - Grupo 2
('6', '2', '1131104356', NULL),  		# Juan - Grupo 2
('7', '2', '1021392807', NULL),  		# Nicolas - Grupo 2
('8', '2', '1234567911', NULL),  		# Camilo - Grupo 2
('9', '3', '12345678018', NULL), 		# Isaura - Grupo 3
('10', '3', '1131104356', NULL),  	# Juan - Grupo 3
('11', '3', '1021392807', NULL),  	# Nicolas - Grupo 3
('12', '4', '12345678021', NULL), 	# Manolo - Grupo 4
('13', '4', '12345678912', NULL), 	# Sebastian -  Grupo 4
('14', '4', '12345678913', NULL), 	# Isabella - Grupo 4
('15', '4', '12345678914', NULL),		# Ethan - Grupo 4
('16', '4', '12345678916', NULL), 	# Sophia - Grupo 4
('17', '4', '12345678917', NULL),		# Alexander - Grupo 4
('18', '4', '12345678918', NULL),		# Olivia - Grupo 4
('19', '4', '12345678919', NULL), 	# Mia - Grupo 4
('20', '4', '12345678001', NULL),		# John - Grupo 4 
('21', '5', '12345678022', NULL), 	# Wendy - Grupo 5
('22', '5', '12345678912', NULL), 	# Sebastian -  Grupo 5
('23', '5', '12345678913', NULL), 	# Isabella - Grupo 5
('24', '5', '12345678914', NULL),		# Ethan - Grupo 5
('25', '5', '12345678916', NULL), 	# Sophia - Grupo 5
('26', '5', '12345678917', NULL),		# Alexander - Grupo 5
('27', '5', '12345678918', NULL),		# Olivia - Grupo 5
('28', '5', '12345678919', NULL), 	# Mia - Grupo 5
('29', '5', '12345678001', NULL),		# John - Grupo 5
('30', '6', '12345678023', NULL), 	# Javier - Grupo 6
('31', '6', '12345678912', NULL), 	# Sebastian -  Grupo 6
('32', '6', '12345678913', NULL), 	# Isabella - Grupo 6
('33', '6', '12345678914', NULL),		# Ethan - Grupo 6
('34', '6', '12345678916', NULL), 	# Sophia - Grupo 6
('35', '6', '12345678917', NULL),		# Alexander - Grupo 6
('36', '6', '12345678918', NULL),		# Olivia - Grupo 6
('37', '6', '12345678919', NULL), 	# Mia - Grupo 6
('38', '6', '12345678001', NULL),		# John - Grupo 6
('39', '8', '1131104356', NULL),		# Juan - Privado 8
('40', '8', '1021392807', NULL),		# Nicolas - Privado 8
('41', '9', '1131104356', NULL),		# Juan - Privado 9
('42', '9', '1234567911', NULL),		# Camilo - Privado 9
('43', '10', '1131104356', NULL),		# Juan - Privado 10
('44', '10', '12345678018', NULL),	# Isaura - Privado 10
('45', '11', '1021392807', NULL),		# Nicolas - Privado 11
('46', '11', '12345678018', NULL),	# Isaura - Privado 11
('47', '12', '12345678001', NULL),	# John - Privado 12
('48', '12', '12345678912', NULL),	# Sebastian - Privado 12
('49', '13', '12345678001', NULL),	# John - Privado 13
('50', '13', '12345678913', NULL),	# Isabella - Privado 13
('51', '14', '12345678001', NULL),	# John - Privado 14
('52', '14', '12345678914', NULL),	# Ethan - Privado 14
('53', '15', '12345678001', NULL),	# John - Privado 15
('54', '15', '12345678916', NULL),	# Sophia - Privado 15
('55', '16', '12345678001', NULL),	# John - Privado 16
('56', '16', '12345678917', NULL),	# Alexander - Priavdo 16
('57', '17', '12345678001', NULL),	# John - Privado 17
('58', '17', '12345678918', NULL),	# Olivia - Privado 17
('59', '18', '12345678001', NULL),	# John - Privado 18
('60', '18', '12345678919', NULL),	# Mia - Privado 18
('61', '19', '12345678001', NULL),	# John - Privado 19
('62', '19', '12345678023', NULL),	# Javier - Privado 19
('63', '20', '12345678001', NULL),	# John - Privado 20
('64', '20', '12345678022', NULL);	# Wendy - Privado 20

INSERT INTO mensaje VALUES
('1', '2023-11-25 10:30:00','HOLA','1','1'),
('2', '2023-11-25 10:34:00','BUEN DIA, INSTRUCTOR','4','1'),
('3', '2023-11-25 11:30:00','Buenos dias','3','1'),
('4', '2023-11-25 11:31:00','Hoy no tenemos formacion, agradezco le informen a sus compañeros','1','1'),
('5', '2023-11-25 13:30:00','Si Señor','2','1'),
('6', '2023-11-25 13:45:00','No olvidar la evidencia pendiente para el dia de hoy','5','1'),
('7', '2023-11-25 14:45:00', 'Ok, Vale', '6', '1'),
('8', '2023-11-25 15:00:00', 'Ok', '7', '1'),
('9', '2023-11-25 15:15:00', 'Entendido', '8', '1'),
('10', '2023-11-26 15:30:00', 'buenos dias profe', '10', '1'),
('11', '2023-11-26 15:45:00', 'tengo una duda', '10', '1'),
('12', '2023-11-26 16:00:00', '¿Cual es su duda?', '9', '1'),
('13', '2023-11-26 16:15:00', 'Usted añadio a camilo al grupo?', '10', '1'),
('14', '2023-11-26 16:30:00', 'Ouh, lo he olvidado', '9', '1'),
('15', '2023-11-26 16:45:00', 'Ahora lo hago', '9', '1'),
('16', '2023-11-26 17:00:00', ':O', '11', '1'),
('17', '2023-11-26 17:15:00', 'No presentar trabajos es desercion, no hay excusa', '12', '1'),
('18', '2023-11-26 17:30:00', 'es problema del indio', '15', '1'),
('19', '2023-11-26 17:45:00', 'Disculpe instructor a quien se refiere?', '17', '1'),
('20', '2023-11-26 18:00:00', 'A usted', '12', '1'),
('21', '2023-11-26 18:15:00', 'JAJAJA', '16', '1'),
('22', '2023-11-26 18:30:00', 'ala, jaja', '15', '1'),
('23', '2023-11-26 18:45:00', 'comooooo', '17', '1'),
('24', '2023-11-26 19:00:00', 'Clase de Ingles para mañana', '21', '1'),
('25', '2023-11-26 19:15:00', 'Puedo hacerle una pregunta al privado?', '29', '1'),
('26', '2023-11-26 19:30:00', 'Bueno, si señora', '22', '1'),
('27', '2023-11-26 19:32:00', 'Bueno', '23', '1'),
('28', '2023-11-26 19:34:00', 'Bueno', '24', '1'),
('29', '2023-11-26 19:37:00', 'Bueno', '25', '1'),
('30', '2023-11-26 19:39:00', 'Ok', '26', '1'),
('31', '2023-11-26 19:40:00', 'Bueno', '27', '1'),
('32', '2023-11-26 19:41:00', 'Bueno', '28', '1'),
('33', '2023-11-26 19:45:00', 'Bueno', '29', '1'),
('34', '2023-11-26 19:47:00', 'Aprendices Mia Parker y John Doe', '30', '1'),
('35', '2023-11-26 19:52:00', 'si', '38', '1'),
('36', '2023-11-26 19:54:00', 'Si?', '37', '1'),
('37', '2023-11-26 19:55:00', 'Cual es su grupo de proyecto?', '30', '1'),
('38', '2023-10-02 09:15:00', 'Nicolassssssss', '39', '1'),
('39', '2023-10-02 22:40:00', 'Ke', '40', '1'),
('40', '2023-10-02 22:41:00', '._.', '39', '1'),
('41', '2023-10-02 22:41:00', 'Se desaparecia', '39', '1'),
('42', '2023-10-02 09:19:00', 'Mano', '41' ,'1'),
('43', '2023-10-02 09:19:00', 'Ayudame', '41', '1'),
('44', '2023-10-02 09:19:00', 'No me sirve el programaaa', '41', '1'),
('45', '2023-10-02 09:19:00', 'Aiuda', '41', '1'),
('46', '2023-10-02 10:25:00', 'Ya te llamo 👌', '42', '1');

# Traemos el nombre de usuario y el rol
SELECT numerodoc, nombre_usuario, id_rol, nombre_rol FROM usuarios a
INNER JOIN roles b ON a.fk_id_rol = b.id_rol;  

# Con esta consulta llenamos los datos de los grupos en el chat 
# (se condiciona mediante una variable con el numero de documento traida previamente)
SELECT * FROM grupos a 
INNER JOIN ficha b ON a.id_ficha = b.id_ficha  
LEFT JOIN usuarios_grupos c ON a.id_grupos = c.id_grupos 
WHERE c.numerodoc = '1131104356' AND fk_tipo_grupo = '2';

# Con esta consulta traeremos los datos de los mensajes
# (segun el grupo al cual pertenezcan y en el que el usuario se ubica)   # SELECT DISTINCT a.numerodoc, primer_nom, primer_apellido, contenido_mensaje, hora, id_tipo, id_usuarios_grupos FROM usuarios a   # RIGHT JOIN usuarios_grupos b ON a.numerodoc = b.numerodoc   # INNER JOIN mensaje c ON b.id_grupos = c.fk_id_grupos   # WHERE b.id_usuarios_grupos = 1;
