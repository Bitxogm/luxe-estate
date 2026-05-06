# Configuración Hexagonal + Mongoose

## 📂 Estructura Hexagonal Sugerida
```text
src/
├── modules/
│   └── users/
│       ├── domain/          # Entidades y reglas de negocio
│       ├── application/     # Casos de uso
│       └── infrastructure/  # Controladores, Repositorios (Mongoose)
├── shared/
│   └── infrastructure/      # Middlewares, DB connection
└── server.ts
```

## 🍃 Conexión Mongoose
```typescript
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
```
