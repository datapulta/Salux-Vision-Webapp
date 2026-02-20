import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Todos los campos son obligatorios" },
                { status: 400 }
            );
        }

        // 1. Validar si el usuario ya existe en postgres
        const userExist = await query("SELECT id FROM users WHERE email = $1", [email]);
        if (userExist.rows.length > 0) {
            return NextResponse.json(
                { message: "El correo electrónico ya está registrado" },
                { status: 409 } // Conflicto
            );
        }

        // 2. Hashear la contraseña antes de guardar (Factor de costo 10)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insertar el nuevo usuario en Postgres
        // (Por defecto el rol es 'user' según la base de datos)
        const result = await query(
            "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role",
            [name, email, hashedPassword]
        );

        const newUser = result.rows[0];

        return NextResponse.json(
            { message: "Usuario creado exitosamente", user: newUser },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error en registro:", error);
        return NextResponse.json(
            { message: "Ocurrió un error al registrar el usuario" },
            { status: 500 }
        );
    }
}
