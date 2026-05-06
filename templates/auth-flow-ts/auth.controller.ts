import { AuthService } from './auth.service';
import { LoginSchema, RegisterSchema } from './auth.schemas';

const authService = new AuthService();

export const loginController = async (req: any, res: any) => {
  try {
    const validatedData = LoginSchema.parse(req.body);
    const result = await authService.login(validatedData);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.errors || error.message });
  }
};

export const registerController = async (req: any, res: any) => {
  try {
    const validatedData = RegisterSchema.parse(req.body);
    const result = await authService.register(validatedData);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.errors || error.message });
  }
};
