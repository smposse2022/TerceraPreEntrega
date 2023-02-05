import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import { UserModel } from "../models/user.js";
import { logger } from "../logger.js";
import { transporterEmail, mailAdmin } from "../messages/email.js";
import {
  twilioAdminPhone,
  twilioClient,
  twillioWapp,
  AdminTel,
  AdminWapp,
} from "../messages/twilio.js";

//serializar un usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
}); // req.session.passport.user={idUsuario}

//deserializar al usuario
passport.deserializeUser((id, done) => {
  //validar si el usuario existe en db.
  UserModel.findById(id, (err, userFound) => {
    return done(err, userFound);
  });
}); // req.user=userFound

//crear una funcion para encriptar la contrase;
const createHash = (password) => {
  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  return hash;
};

/*productsRouter.post("/envio-mail-gmail", async (req, res) => {
  try {
    const response = await transporter.sendMail(mailOptions);
    res.send(`El mensaje fue enviado ${response}`);
  } catch (error) {
    logger.error(`Hubo un error ${error}`);
  }
});*/

//estrategia de registro utilizando passport local.
passport.use(
  "signupStrategy",
  new LocalStrategy(
    {
      passReqToCallback: true,
      usernameField: "email",
    },
    (req, username, password, done) => {
      //logica para registrar al usuario
      //verificar si el usuario exitse en db
      UserModel.findOne({ email: username }, (error, userFound) => {
        if (error)
          return done(error, null, { message: `Hubo un error ${error}` });
        if (userFound)
          return done(null, null, { message: "El usuario ya existe" });
        //guardamos el usuario en la db
        const newUser = {
          email: req.body.email,
          password: createHash(password),
          nombre: req.body.nombre,
          direccion: req.body.direccion,
          edad: req.body.edad,
          telefono: req.body.telefono,
          fotoUrl: req.body.fotoUrl,
        };
        const emailTemplate = `<div>
        <h1>Nuevo Registro</h1>
        <h2>Datos del nuevo usuario</h2>
        <h3>Email: ${req.body.email}</h3>
        <h3>Password: ${createHash(password)}</h3>
        <h3>Nombre: ${req.body.nombre}</h3>
        <h3>Dirección: ${req.body.direccion}</h3>
        <h3>Edad: ${req.body.edad}</h3>
        <h3>Teléfono: ${req.body.telefono}</h3>
        <h3>Foto/Avatar: ${req.body.fotoUrl}</h3>
    </div>`;

        const mailOptions = {
          from: "Servidor de NodeJs",
          to: mailAdmin,
          subject: "Nuevo Registro",
          html: emailTemplate,
        };
        transporterEmail.sendMail(mailOptions);
        logger.info(`El mail fue enviado correctamente`);
        UserModel.create(newUser, (error, userCreated) => {
          if (error)
            return done(error, null, {
              message: "Hubo un error al registrar el usuario",
            });
          return done(null, userCreated);
        });
      });
    }
  )
);

const isValidPassword = function (user, password) {
  return bcrypt.compareSync(password, user.password);
};

// passport/login.js
passport.use(
  "loginStrategy",
  new LocalStrategy(
    {
      passReqToCallback: true,
      usernameField: "email",
    },
    (req, username, password, done) => {
      // chekea en Mongo si el usuario con el username indicado existe
      UserModel.findOne({ email: username }, (err, user) => {
        if (err) return done(err);
        // Si no se encuentra
        if (!user) {
          logger.error("No se encontró el usuario con el username " + username);
          return done(err, null, {
            message: "Usuario no encontrado",
          });
        }
        // El usuario existe pero la contraseña no coincide
        if (!isValidPassword(user, password)) {
          logger.warn("Password invalido");
          return done(err, null, {
            message: "Password invalido",
          });
        }
        // El usuario y la contraseña coinciden
        return done(null, user);
      });
    }
  )
);

const authRouter = express.Router();

authRouter.get("/registro", (req, res) => {
  if (req.isAuthenticated()) {
    logger.info("Redirigido a home");
    res.redirect("/productos");
  } else {
    const errorMessage = req.session.messages ? req.session.messages[0] : "";
    logger.info("Redirigido a Signup");
    res.render("signup", { error: errorMessage });
    req.session.messages = [];
  }
});

authRouter.get("/inicio-sesion", (req, res) => {
  if (req.isAuthenticated()) {
    logger.info("Redirigido a home");
    res.redirect("/productos");
  } else {
    logger.info("Redirigido a login");
    res.render("login");
  }
});

authRouter.get("/perfil", (req, res) => {
  if (req.isAuthenticated()) {
    logger.info("Acceso a perfil");
    res.render("profile", {
      Nombre: req.user.nombre,
      Email: req.user.email,
      Direccion: req.user.direccion,
      Edad: req.user.edad,
      Telefono: req.user.telefono,
      Foto: req.user.fotoUrl,
    });
  } else {
    res.send(
      "<div>Debes <a href='/auth/inicio-sesion'>inciar sesion</a> o <a href='/auth/registro'>registrarte</a></div>"
    );
  }
});

//rutas de autenticacion registro
authRouter.post(
  "/signup",
  passport.authenticate("signupStrategy", {
    failureRedirect: "/auth/registro",
    failureMessage: true, //req.sessions.messages.
  }),
  (req, res) => {
    logger.info("Redirigido a perfil");
    res.redirect("/auth/perfil");
  }
);

//ruta de autenticacion login
authRouter.post(
  "/login",
  passport.authenticate("loginStrategy", {
    failureRedirect: "/auth/login",
    failureMessage: true, //req.sessions.messages.
  }),
  (req, res) => {
    logger.info("Redirigido a perfil");
    res.redirect("/auth/perfil");
  }
);

//ruta de logout con passport
authRouter.get("/logout", (req, res) => {
  logger.info("Desloguear");
  req.logout((err) => {
    if (err) return res.send("hubo un error al cerrar sesion");
    req.session.destroy();
    logger.info("Desloguear y redirigir a home");
    res.redirect("/productos");
  });
});

authRouter.post("/twilio-sms", async (req, res) => {
  try {
    // utilizamos el cliente para enviar un mensaje
    const response = await twilioClient.messages.create({
      body: "Hola. Envío de Mensaje desde NodeJs utilizando Twilio",
      from: twilioAdminPhone, // número desde donde sale el mensaje
      to: AdminTel, // destinatario - Santiago Posse
    });
    res.send(`El mensaje fue enviado ${response}`);
  } catch (error) {
    logger.error(`Hubo un error ${error}`);
  }
});

// Twilio - Whatsapp
authRouter.post("/twilio-whatsapp", async (req, res) => {
  try {
    // utilizamos el cliente para enviar un mensaje
    const response = await twilioClient.messages.create({
      body: "Hola. Envío de Mensaje desde NodeJs utilizando Twilio",
      from: twillioWapp, // número desde donde sale el mensaje
      to: AdminWapp, // destinatario - Santiago Posse
    });
    res.send(`El mensaje fue enviado ${response}`);
  } catch (error) {
    logger.error(`Hubo un error ${error}`);
  }
});

export { authRouter };
