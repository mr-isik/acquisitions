# Acquisitions API

A modern and scalable Node.js API project. This backend application is developed using best practices and cutting-edge technologies.

## 🚀 Features

- **Modern JavaScript** - Built with ES6+ features
- **Powerful ORM** - Type-safe database operations with Drizzle ORM
- **Security** - Advanced rate limiting and security measures with Arcjet
- **Docker Support** - Separate Docker configurations for development and production
- **Logging** - Comprehensive logging system with Winston
- **Database** - Neon Serverless Postgres (Neon Local for development)
- **API Security** - Security headers with Helmet middleware

## 📦 Installation

1. **Clone the Repository**

```bash
git clone https://github.com/mr-isik/acquisitions.git
cd acquisitions
```

2. **Install Dependencies**

```bash
npm install
```

3. **Set up Environment Variables**

```bash
cp .env.example .env
# Edit the .env file
```

4. **Docker Compose for Development**

```bash
docker compose -f docker-compose.dev.yml up --build
```

5. **Database Migration**

```bash
npm run db:migrate
```

## 🛠️ Development

### Run in Development Mode

```bash
npm run dev
```

### Lint Kontrolü

```bash
npm run lint
```

### Lint Fix

```bash
npm run lint:fix
```

## 🚀 Production

### Production Build

```bash
npm run build
```

### Production Deployment

```bash
docker compose -f docker-compose.prod.yml up -d
```

## 📚 API Dokümantasyonu

### Kullanıcı İşlemleri

#### Tüm Kullanıcıları Getir

```http
GET /users
```

#### Tek Kullanıcı Getir

```http
GET /users/:id
```

#### Yeni Kullanıcı Oluştur

```http
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

#### Kullanıcı Güncelle

```http
PUT /users/:id
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "role": "admin"
}
```

#### Kullanıcı Sil

```http
DELETE /users/:id
```

## 🔒 Güvenlik

- Helmet ile güvenlik başlıkları
- Rate limiting (role-based)
- Bot detection
- CORS yapılandırması
- Cookie güvenliği

## 📝 Ortam Değişkenleri

```env
NODE_ENV=development
PORT=3000
DB_URL=postgres://user:password@localhost:5432/dbname
ARCJET_KEY=your-arcjet-key
```

## 🛡️ Rate Limiting

Kullanıcı rollerine göre rate limiting:

- Admin: 20 req/min
- User: 10 req/min
- Guest: 5 req/min
- Unauthorized: 5 req/min

## 🐳 Docker

Development ve production için ayrı Docker yapılandırmaları:

- `Dockerfile` - Ana uygulama container'ı
- `docker-compose.dev.yml` - Development ortamı (Neon Local dahil)
- `docker-compose.prod.yml` - Production ortamı

## 📁 Proje Yapısı

```
acquisitions/
├── src/
│   ├── config/        # Yapılandırma dosyaları
│   ├── controllers/   # Route handler'lar
│   ├── middleware/    # Custom middleware'ler
│   ├── models/        # Veritabanı modelleri
│   ├── routes/        # API route'ları
│   ├── services/      # İş mantığı
│   ├── utils/         # Yardımcı fonksiyonlar
│   ├── validations/   # Input validasyonları
│   └── app.js         # Express app yapılandırması
├── drizzle/           # Veritabanı migrations
├── logs/             # Log dosyaları
└── docker/           # Docker yapılandırmaları
```

## 👥 Katkıda Bulunma

1. Fork'layın
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.
