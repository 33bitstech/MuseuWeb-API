import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { v4 } from 'uuid';
import { userRepository } from '../api/User/routes/user.routes';
import { museumRepository } from '../api/Museum/routes/museum.route';
import { ErrorsGlobal } from '../errors/errors-global';
import HttpStatus from '../utils/httpStatus';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.OAUTH_CLIENT_ID!,
            clientSecret: process.env.OAUTH_CLIENT_SECRET!,
            callbackURL: process.env.OAUTH_REDIRECT_URL!,
            scope: ['profile', 'email'],
            
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userRepository.findByGoogleId(profile.id);

                if (user) {
                    delete user.password
                    return done(null, user);
                }

                const museum = await museumRepository.findByEmail(profile.emails![0].value)
                if(museum) throw new ErrorsGlobal('Esse email ja está cadastrado como museu', HttpStatus.CONFLICT.code)

                user = await userRepository.findByEmail(profile.emails![0].value);
                if (user) {
                    await userRepository.updateGoogleId(profile.emails![0].value, profile.id)
                    delete user.password
                    return done(null, user);
                }

                const newUser = await userRepository.create({
                    userId: `uid_${v4()}`,
                    name: profile.displayName,
                    email: profile.emails![0].value,
                    profileImg: profile.photos![0].value,
                    isGoogleAuth: true, 
                    accountStatus: { isBanned: false },
                    googleId: profile.id,
                    favItens: [],
                    favMuseums: [],
                });

                return done(null, newUser);
            } catch (err) {
                return done(err, false);
            }
        }
    )
);

export default passport;