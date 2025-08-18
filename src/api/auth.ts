import { supabase } from "@/lib/supabaseClient";
import { LoginRequest, RegisterRequest } from "@/schemas/user";
import { User } from "@/types";

export async function signUp(userData: RegisterRequest): Promise<User> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name || null,
        },
      },
    });

    if (error) throw error;

    if (!data.user) {
      throw new Error("Failed to create user");
    }

    // Return basic user info - profile will be created via API route
    return {
      id: data.user.id,
      email: data.user.email!,
             name: userData.name || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Failed to sign up:", error);
    throw new Error("Unable to create account");
  }
}

export async function signIn(userData: LoginRequest): Promise<User> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: userData.password,
    });

    if (error) throw error;

    if (!data.user) {
      throw new Error("Invalid credentials");
    }

    // Return basic user info - profile will be fetched via API route
    return {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Failed to sign in:", error);
    throw new Error("Invalid email or password");
  }
}

export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("Failed to sign out:", error);
    throw new Error("Unable to sign out");
  }
}
