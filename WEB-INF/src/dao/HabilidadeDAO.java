package dao;

import models.Habilidade;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletContext;

public class HabilidadeDAO {
    private String dbPath;

    public HabilidadeDAO(ServletContext context) {
        this.dbPath = context.getRealPath("/WEB-INF/database/schema.db");
    }

    private Connection connect() throws SQLException {
        return DriverManager.getConnection("jdbc:sqlite:" + dbPath);
    }

    public List<Habilidade> listarTodas() throws SQLException {
        String sql = "SELECT * FROM habilidades";
        List<Habilidade> habilidades = new ArrayList<>();
        
        try (Connection conn = connect();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                Habilidade habilidade = new Habilidade();
                habilidade.setId(rs.getInt("id"));
                habilidade.setNome(rs.getString("nome"));
                habilidade.setDescricao(rs.getString("descricao"));
                habilidades.add(habilidade);
            }
        }
        return habilidades;
    }

    public boolean adicionarHabilidadeUsuario(int usuarioId, int habilidadeId) throws SQLException {
        String sql = "INSERT OR IGNORE INTO usuario_habilidade (usuario_id, habilidade_id) VALUES (?, ?)";
        
        try (Connection conn = connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, usuarioId);
            stmt.setInt(2, habilidadeId);
            
            return stmt.executeUpdate() > 0;
        }
    }

    public List<Habilidade> listarHabilidadesUsuario(int usuarioId) throws SQLException {
        String sql = "SELECT h.* FROM habilidades h " +
                    "JOIN usuario_habilidade uh ON h.id = uh.habilidade_id " +
                    "WHERE uh.usuario_id = ?";
        List<Habilidade> habilidades = new ArrayList<>();
        
        try (Connection conn = connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, usuarioId);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                Habilidade habilidade = new Habilidade();
                habilidade.setId(rs.getInt("id"));
                habilidade.setNome(rs.getString("nome"));
                habilidade.setDescricao(rs.getString("descricao"));
                habilidades.add(habilidade);
            }
        }
        return habilidades;
    }
}