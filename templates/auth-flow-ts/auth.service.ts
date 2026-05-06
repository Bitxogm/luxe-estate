// @ts-ignore - This is a template reference. In a real project, import from your actual auth utils.
import { hashPassword, comparePassword } from '../auth-jwt/AUTH.md';
import { LoginInput, RegisterInput } from './auth.schemas';

export class AuthService {
  async register(input: RegisterInput) {
    // 1. Verificar si el usuario ya existe (DB dependiente)
    // const existingUser = await db.user.findUnique({ where: { email: input.email } });

    // 2. Hashear password
    const hashedPassword = await hashPassword(input.password);

    // 3. Guardar en DB
    // const user = await db.user.create({ data: { ...input, password: hashedPassword } });

    return { message: "Usuario creado con éxito", userId: "..." };
  }

  async login(input: LoginInput) {
    // 1. Buscar usuario
    // const user = await db.user.findUnique({ where: { email: input.email } });
    // if (!user) throw new Error("Credenciales inválidas");

    // 2. Validar password
    // const isValid = await comparePassword(input.password, user.password);
    // if (!isValid) throw new Error("Credenciales inválidas");

    // 3. Generar Token
    // const token = generateToken({ id: user.id, email: user.email });

    return { token: "...", user: { email: input.email } };
  }
}
