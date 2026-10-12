import jwt from "jsonwebtoken";

/**
 * Middleware that guards routes by verifying a Bearer JSON Web Token.
 * - Extracts token from `Authorization: Bearer <token>`
 * - Rejects missing token with 401
 * - Verifies token signature and expiration via process.env.JWT_SECRET
 * - Attaches decoded payload to `req.user`
 * - Rejects invalid or expired token with 401
 */
export default function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
