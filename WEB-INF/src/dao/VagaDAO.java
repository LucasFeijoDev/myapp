package dao;

import models.Vaga;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletContext;

public class VagaDAO {
    private String dbPath;

    public VagaDAO(ServletContext context) {
        this.dbPath = context.getRealPath("/WEB-INF/database/schema.db");
    }

    private Connection connect() throws SQLException {
        return DriverManager.getConnection("jdbc:sqlite:" + dbPath);
    }

    public List<Vaga> listarTodas() throws SQLException {
        String sql = "SELECT * FROM vagas";
        List<Vaga> vagas = new ArrayList<>();
        
        try (Connection conn = connect();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                Vaga vaga = new Vaga();
                vaga.setId(rs.getInt("id"));
                vaga.setTitulo(rs.getString("titulo"));
                vaga.setDescricao(rs.getString("descricao"));
                vaga.setHabilidadesNecessarias(rs.getString("habilidades_necessarias"));
                vagas.add(vaga);
            }
        }
        return vagas;
    }

    public boolean inserirVaga(Vaga vaga) throws SQLException {
        String sql = "INSERT INTO vagas (titulo, descricao, habilidades_necessarias) VALUES (?, ?, ?)";
        
        try (Connection conn = connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, vaga.getTitulo());
            stmt.setString(2, vaga.getDescricao());
            stmt.setString(3, vaga.getHabilidadesNecessarias());
            
            return stmt.executeUpdate() > 0;
        }
    }
}