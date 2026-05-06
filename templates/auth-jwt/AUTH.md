# Autenticación: JWT & Bcrypt

La lógica de hashing de contraseñas y gestión de tokens es **independiente de la base de datos**. Solo cambia la forma en que guardas o buscas al usuario.

## 🔑 Hashing de Contraseñas (Bcrypt)

Ideal para usar en el servicio de usuarios o directamente en el modelo/infraestructura.

```typescript
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

// Encriptar al registrar o cambiar password
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

// Comparar en el login
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
```

## 🎟️ Gestión de Tokens (JWT)

```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const EXPIRES_IN = '7d';

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
```

## 🛡️ Middleware de Protección (Ejemplo)

```typescript
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ message: 'Invalid token' });

  req.user = decoded;
  next();
};
```
