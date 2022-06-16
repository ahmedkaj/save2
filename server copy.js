// Aller chercher les configurations de l'application
import 'dotenv/config';

// Importer les fichiers et librairies
import express, { json, request, urlencoded } from 'express';
import expressHandlebars from 'express-handlebars';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import session from 'express-session';
import memorystore from 'memorystore';
import passport from 'passport';
import './auth.js';
import cspOption from './csp-options.js';
import { addPost, getPosts, getPostsFromUser } from './model/posts.js';
import { getUser, searchUser } from './model/users.js';
import { validateEmail, validateIdUser, validatePassword, validatePostText, validateUserSearch } from './validation.js';
import { MemoryStore } from 'express-session';
import { addUser } from './model/user.js';
import { teste_authentification } from './auth.js';

// Création du serveur
const app = express();
app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');
const Memorystore = memorystore(session);

// Ajout de middlewares
app.use(helmet(cspOption));
app.use(compression());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(session({
    cookie: { maxAge: 3600000},
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 3600000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
const teste_auth=teste_authentification()
// Route d'accès à la page d'accueil
app.get('/',teste_auth, async (request, response) => {
    let posts = await getPosts();

    response.render('home', {
        title: 'Simple Twitter',
        posts,
        connected: !!request.user
    });
});

// Route d'accès à la page d'un profile utilisateur
app.get('/profile/:id_user',teste_auth, async (request, response) => {
    // Validation simple du paramètre
    let id_user = Number(request.params.id_user);
    if (!validateIdUser(id_user)) {
        response.status(400).end();
        return;
    }
    
    // Validation que l'utilisateur existe
    let user = await getUser(id_user);
    if (!user) {
        response.status(404).end();
        return;
    }

    // Retour de la page
    let posts = await getPostsFromUser(id_user);
    response.render('profile', {
        title: `Profile - ${user.name}`,
        username: user.name,
        posts,
        connected: !!request.user
    });
});

// Route d'accès à la page de recherche d'utilisateur
app.get('/search',teste_auth, async (request, response) => {
    // Validation simple du paramètre
    if (!validateUserSearch(request.query.name)) {
        response.status(400).end();
        return;
    }

    // Retour de la page
    let users = await searchUser(request.query.name);
    response.render('search', {
        title: `Search result - ${request.query.name}`,
        search: request.query.name,
        users,
        empty: users.length === 0,
        connected: !!request.user
    });
});

// Route d'accès à la page de création d'utilisateur
app.get('/inscription', (request,response)=>{
    if(!request.user){
        response.render('userForm', {
            title: 'inscription',
            scripts: ['/js/inscription.js'],
            connected: !!request.user,
            appear: 1
        });
    }
    else {
        response.status(401).end();
    }
    
});

// Route d'accès à la page de connexion
app.get('/connexion', (request,response)=>{
    if (!request.user){
        response.render('userForm', {
            title: 'connexion',
            scripts: ['/js/connexion.js'],
            connected: !!request.user
        });
    }
    else {
        response.status(401).end();
    };
    
});

// Route pour ajouter un post
app.post('/post',teste_auth, async (request, response) => {
    if(request.user) {
        // Validation simple du paramètre
    if (!validatePostText(request.body.text)) {
        response.status(400).end();
        return;   
    }

    // Retour de la page
    let postId = await addPost(request.body.text);
    response.status(200).json({ postId });
    }
    
});

// Route pour l'inscription
app.post('/inscription', async (request, response, next) =>{
    if(validateEmail(request.body.email) && validatePassword(request.body.password)) {
        try{
            await addUser(request.body.email, request.body.password, request.body.name);
            response.status(201).end();
        }
        catch(error){
            if(error.code === 'SQLITE_CONSTRAINT') {
                response.status(409).end();
            }
            else {
                next(error);
            }
        }
    }
    else {
        response.status(400).end();
    }
});

// Route pour la connection
app.post('/connexion', (request, response, next) =>{
    if(validateEmail(request.body.email) && validatePassword(request.body.password)) {
        passport.authenticate('local',(error, user, info) => {
            if(error){
                next(error);
            }
            else if(!user){
                response.status(401).json(info);
            }
            else {
                request.logIn(user, () => {
                    if(error) {
                        next(error);
                    }

                    response.status(200).end();
                });
            }
        })(request, response, next);
    }
});

// Route pour la déconnexion
app.post('/deconnexion', (request, response) =>{
    request.logout((error) => {
        if (error) {
            next(error);
        }

        response.redirect('/');
    });
    
});

// Renvoyer une erreur 404 pour les routes non définies
app.use(function (request, response) {
    // Renvoyer simplement une chaîne de caractère indiquant que la page n'existe pas
    response.status(404).send(request.originalUrl + ' not found.');
});

// Démarrage du serveur
app.listen(process.env.PORT);
console.info(`Serveurs démarré:`);
console.info(`http://localhost:${ process.env.PORT }`);
