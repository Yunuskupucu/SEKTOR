# Node.js'in resmi LTS sürümünü kullan
FROM node:lts-slim

# Çalışma dizinini oluştur
WORKDIR /app

# Paketleri ve bağımlılıkları kopyala
COPY package*.json ./
RUN npm ci --only=production

# Uygulama dosyalarını kopyala
COPY . .

# Non-root kullanıcı ayarla
USER node

# Kullanılacak portu tanımla
EXPOSE 5001

# Uygulamayı çalıştır
CMD ["npm", "run", "dev"]



## Dockerfile için docker-compose up -d 
## loglamak için   docker-compose logs -f
