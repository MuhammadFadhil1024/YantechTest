# Dokumentasi project dan endpoint authentication

# Spesifikasi project

- node.js : v18.16.1
- Framework : Express
- Database : mySql

# Instalasi

1. Clone repositori ini ke direktori lokal Anda.
2. Salin berkas .env.example menjadi .env dan atur konfigurasi untuk database, secret key dan refresh token secret key.
3. Jalankan perintah npm install untuk menginstall dependency package.
4. Jalankan perintah npm run db:create:dev untuk membuat database development.
5. Jalankan perintah npm run db:create:test untuk membuat database testing.
6. Jalankan perintah npm run db:migrate:dev untuk membuat tabel pada database development.
7. Jalankan perintah npm run db:migrate:test untuk membuat tabel pada database testing.
8. Jalankan perintah npm run start untuk running project.

# Endpoint 
1. Register
   
- endpoint : localhost:3000/api/register
- method : POST
- request body : 
{
  "name": "Nama Pengguna",
  "email": "email@example.com",
  "password": "admin123"
}
- hasil response : 
{
    "code": 201,
    "status": "CREATED",
    "data": {
        "name": "Muhammad Fadhil Nurhuda",
        "email": "email@example.com",
        "createdAt": "2023-09-26T06:58:47.692Z",
        "updatedAt": "2023-09-26T06:58:47.692Z"
    }
}

2. Login

- endpoint : localhost:3000/api/login
- method : POST
- request body : 
{
  "email": "email@example.com",
  "password": "admin123"
}
- hasil response : 
{
    "code": 200,
    "status": "SUCCESS",
    "data": {
        "id": 11,
        "name": "Nama Pengguna",
        "email": "email@example.com",
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsIm5hbWUiOiJOYW1hIFBlbmdndW5hIiwiZW1haWwiOiJlbWFpbEBleGFtcGxlLmNvbSIsImlhdCI6MTY5NTcxMTcwMSwiZXhwIjoxNjk1NzE1MzAxfQ.7E-0HKXMNdl6PybL_14kQw7VQF_4Pkzba9_2mlKtLhA"
    }
}

3. refresh token

- endpoint : localhost:3000/api/refresh
- method : POST
- hasil response : 
{
"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsIm5hbWUiOiJOYW1hIFBlbmdndW5hIiwiZW1haWwiOiJlbWFpbEBleGFtcGxlLmNvbSIsImlhdCI6MTY5NTcxMjYyMiwiZXhwIjoxNjk1NzE2MjIyfQ.8bRIHZ2WyDPXP2ZefOgkyhfnaffcAfWXVnKnEipz5Xw"
}

4. Logout

- endpoint : localhost:3000/api/logout
- method : POST
- hasil response : 
{
    "code": 200,
    "status": "SUCCESS",
    "data": "Logout success"
}


# Testing untuk endpoint authentication
1. pastikan sudah membuat database testing dan membuat tabel kembali ke tahap instalasi jika belum melakukan pembuatan database testing dan tabel.
2. jalankan printah "npm run test"

![Screenshot 2023-09-26 141413](https://github.com/MuhammadFadhil1024/YantechTest/assets/61375944/c6b76232-4a39-4055-9b62-d880e7b0f288)
