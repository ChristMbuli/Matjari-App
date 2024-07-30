import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  const { fname, email, password } = req.body;

  try {
    const hashePassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        fname,
        email,
        password: hashePassword,
      },
    });

    console.log(newUser);

    res.status(201).json({ message: "Compte crée avec success !" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ce compte existe déjà" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //véri si user existe
    const user = await prisma.users.findUnique({
      where: { email },
    });

    //sinon
    if (!user)
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });

    //vérifier si password est correct
    const isPAsswordValid = await bcrypt.compare(password, user.password);

    //sinon si password ne pas correct
    if (!isPAsswordValid)
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });

    //Generer le token
    const time = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.KEY_JWT,
      { expiresIn: time }
    );

    //enlever le password lors de authentification
    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: time,
      })
      .status(200)
      .json(userInfo);
  } catch (error) {
    //console.log(error);
    res.status(500).json({ message: "Erreur de connexion" });
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "Déconnexion effectuée !" });
};
