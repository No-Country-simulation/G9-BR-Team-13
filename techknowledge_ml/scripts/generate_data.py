import random
import csv
import os

# Estrutura para gerar textos
categorias = {
    "Backend": ["Spring Boot", "Microsserviços", "API REST", "JWT", "OAuth2", "Hibernate", "SQL", "Maven", "Node.js", "Kafka", "CQRS", "Event-Driven"],
    "DataScience": ["Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "Regressão", "Classificação", "Clusterização", "Matplotlib", "NLP", "Deep Learning", "Séries Temporais"],
    "Frontend": ["React", "Angular", "Vue.js", "TypeScript", "CSS", "Tailwind", "Redux", "Next.js", "Web Components", "UX/UI", "PWA", "WebSockets"],
    "DevOps": ["Docker", "Kubernetes", "Jenkins", "Terraform", "Ansible", "AWS", "Azure", "Prometheus", "Grafana", "CI/CD", "Infraestrutura", "Linux"]
}

prefixos = ["Conceitos avançados sobre ", "Guia prático para ", "Como implementar ", "Estratégias eficientes para ", "Introdução ao ", "Domine ", "Desmistificando ", "Boas práticas para "]
sufixos = [" em sistemas corporativos.", " em aplicações web modernas.", " para ambientes cloud.", " com foco em escalabilidade.", " para times ágeis.", " com foco em segurança."]

def gerar_texto(categoria):
    tema = random.choice(categorias[categoria])
    prefixo = random.choice(prefixos)
    sufixo = random.choice(sufixos)
    return f"{prefixo}{tema}{sufixo}"

def gerar_dataset(qtd_por_classe=50):
    linhas = []
    for cat in categorias.keys():
        for _ in range(qtd_por_classe):
            texto = gerar_texto(cat)
            linhas.append({"texto": texto, "categoria": cat})
    random.shuffle(linhas)
    return linhas

# Gera 200 (50 por classe)
dataset_200 = gerar_dataset(50)
os.makedirs("data", exist_ok=True)
with open("data/dataset_200.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["texto", "categoria"])
    writer.writeheader()
    writer.writerows(dataset_200)
print("✅ dataset_200.csv gerado com 200 exemplos!")

# Gera 400 (100 por classe)
dataset_400 = gerar_dataset(100)
with open("data/dataset_400.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["texto", "categoria"])
    writer.writeheader()
    writer.writerows(dataset_400)
print("✅ dataset_400.csv gerado com 400 exemplos!")