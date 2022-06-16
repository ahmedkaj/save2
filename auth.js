import bcrypt from 'bcrypt';
import passport from 'passport';
import {Strategy} from 'passport-local';
import {getUser} from './model/user.js';

const config = {
    usernameField: 'email',
    passportField: 'pasword'
};

passport.use(new Strategy(config, async (email, password, done) => {
    try{
    let user = await getUser(email);

    if(!user) {
        return done(null, false, {error: 'wrong_email'});
    }

    const valid = await bcrypt.compare(password, user.password);

    if(!valid){
        return done(null, false, {error: 'wrong_password'});
    }

    return done(null, user);
    }
    catch(error){
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
    try{
        let user = await getUser(email);
        done(null, user);
    }
    catch(error){
        done(error);
    }
});

export function teste_authentification(){
   return passport.authenticate('local', { failureRedirect: '/connexion', failureMessage: true })
}