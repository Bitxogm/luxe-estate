# Validación de Esquemas con Zod

Zod es una librería de declaración y validación de esquemas con inferencia de tipos de TypeScript.

## 📝 Ejemplo de Esquema de Usuario

```typescript
import { z } from 'zod';

export const UserSchema = z.object({
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  role: z.enum(["admin", "user"]).default("user"),
});

// Extraer el tipo automáticamente
export type User = z.infer<typeof UserSchema>;
```

## 🛡️ Validación en un Endpoint/Caso de Uso

```typescript
export const createUser = (data: unknown) => {
  const result = UserSchema.safeParse(data);

  if (!result.success) {
    // Manejo de errores tipado
    console.error(result.error.format());
    return { error: result.error.errors };
  }

  const newUser = result.data;
  // ... lógica de guardado
};
```

## 🌐 Validación de Variables de Entorno

```typescript
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(10),
  PORT: z.string().default("3000"),
});

export const env = envSchema.parse(process.env);
```
