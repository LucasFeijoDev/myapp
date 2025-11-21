package dao;

import models.Usuario;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;

public class UsuarioDAO {

    private String dbPath;

    public UsuarioDAO(ServletContext context) {
        this.dbPath = context.getRealPath("/WEB-INF/database/schema.db");
    }

    private Connection connect() throws SQLException {
        return DriverManager.getConnection("jdbc:sqlite:" + dbPath);
    }

    public Usuario autenticar(String email, String senhaHash) throws SQLException {
        String sql = "SELECT * FROM usuarios WHERE email=? AND senha=?";
        try (Connection conn = connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email);
            stmt.setString(2, senhaHash);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return new Usuario(
                        rs.getInt("id"),
                        rs.getString("nome"),
                        rs.getString("email"),
                        rs.getString("senha"),
                        rs.getString("perfil")
                );
            }
        }
        return null;
    }
}
