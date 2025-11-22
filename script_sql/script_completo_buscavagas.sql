-- Para o usuário João Silva (ID 2)
SELECT v.titulo, v.descricao,
       GROUP_CONCAT(h.nome, ', ') as habilidades_necessarias,
       (SELECT COUNT(*) FROM usuario_habilidade 
        WHERE usuario_id = 2 
        AND habilidade_id IN (
            SELECT CAST(value AS INTEGER) as hab_id 
            FROM json_each('[' || REPLACE(v.habilidades_necessarias, ',', ',') || ']')
        )) as habilidades_compatíveis
FROM vagas v
JOIN (
    SELECT CAST(value AS INTEGER) as hab_id 
    FROM json_each('[' || REPLACE(v.habilidades_necessarias, ',', ',') || ']')
    JOIN habilidades h ON h.id = hab_id
)
WHERE EXISTS (
    SELECT 1 FROM usuario_habilidade uh 
    WHERE uh.usuario_id = 2 
    AND uh.habilidade_id IN (
        SELECT CAST(value AS INTEGER) as hab_id 
        FROM json_each('[' || REPLACE(v.habilidades_necessarias, ',', ',') || ']')
    )
)
GROUP BY v.id, v.titulo, v.descricao;