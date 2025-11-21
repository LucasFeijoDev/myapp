package models;

public class Vaga {
    private int id;
    private String titulo;
    private String descricao;
    private String habilidadesNecessarias;
    private String empresa;
    private double salario;
    
    public Vaga() {}
    
    public Vaga(String titulo, String descricao, String habilidadesNecessarias) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.habilidadesNecessarias = habilidadesNecessarias;
    }
    
    // Getters e Setters
    public int getId() { 
        return id; 
    }
    
    public void setId(int id) { 
        this.id = id; 
    }
    
    public String getTitulo() { 
        return titulo; 
    }
    
    public void setTitulo(String titulo) { 
        this.titulo = titulo; 
    }
    
    public String getDescricao() { 
        return descricao; 
    }
    
    public void setDescricao(String descricao) { 
        this.descricao = descricao; 
    }
    
    public String getHabilidadesNecessarias() { 
        return habilidadesNecessarias; 
    }
    
    public void setHabilidadesNecessarias(String habilidadesNecessarias) { 
        this.habilidadesNecessarias = habilidadesNecessarias; 
    }
    
    public String getEmpresa() { 
        return empresa; 
    }
    
    public void setEmpresa(String empresa) { 
        this.empresa = empresa; 
    }
    
    public double getSalario() { 
        return salario; 
    }
    
    public void setSalario(double salario) { 
        this.salario = salario; 
    }
}