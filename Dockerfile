# Utiliser une image Node.js comme base
FROM node:16

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Cloner le dépôt GitHub
RUN git clone https://github.com/altane/tunnelmole-service.git . && \

    # Installer gettext 
    apt update && apt install gettext -y && \

    # Installer les dépendances
    npm install && \

    # Copier le fichier de configuration
    cat config-instance.example.toml | envsubst > config-instance.toml && \

    # Construire le projet
    npm run build

# Exposer le port sur lequel le service va écouter
EXPOSE 80 81

# Démarrer le service
CMD ["npm", "start"]