export const verifyFirebaseToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  try {
    const token = authorization.split(" ")[1];
    const { email } = await admin.auth().verifyIdToken(token);
    console.log(email);
    req.headers.email = email;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
};
